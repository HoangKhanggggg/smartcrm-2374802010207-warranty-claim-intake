const repo = require('../repositories/ticketRepository');
const AppError = require('../utils/AppError');
const { normalizePhone, maskPhone } = require('../utils/phone');
const { checkWarranty, toWarrantyStatus } = require('../utils/warranty');

const toCustomerView = (row) => ({
  customerId: Number(row.customer_id),
  fullName: row.full_name,
  phoneMasked: maskPhone(row.phone)
});

const toDeviceView = (row, today = new Date()) => {
  const warranty = checkWarranty(row.warranty_end_date, today);
  return {
    deviceId: Number(row.device_id),
    customerId: Number(row.customer_id),
    serialImei: row.serial_imei,
    warrantyEndDate: row.warranty_end_date
      ? new Date(row.warranty_end_date).toISOString().slice(0, 10)
      : null,
    warrantyStatus: toWarrantyStatus(warranty),
    customerName: row.customer_name ?? null
  };
};

// US01-AC1/AC3: tra khách theo SĐT đã chuẩn hoá
async function findCustomer(rawPhone) {
  const phone = normalizePhone(rawPhone);
  if (!phone) throw new AppError('SO_DIEN_THOAI_KHONG_HOP_LE');

  const row = await repo.findCustomerByPhone(phone);
  if (!row) throw new AppError('KHONG_TIM_THAY_KHACH_HANG', 404);
  return toCustomerView(row);
}

// US01-AC2 + QT-01: SĐT đã có thì trả hồ sơ cũ, không tạo mới
async function createCustomer({ fullName, phone: rawPhone }) {
  const phone = normalizePhone(rawPhone);
  if (!phone || !fullName || !String(fullName).trim()) {
    throw new AppError('DU_LIEU_KHONG_HOP_LE');
  }

  const existing = await repo.findCustomerByPhone(phone);
  if (existing) return { customer: toCustomerView(existing), created: false };

  const row = await repo.createCustomer({ fullName: String(fullName).trim(), phone });
  return { customer: toCustomerView(row), created: true };
}

// US02-AC1/AC2: tra thiết bị + tình trạng bảo hành
async function findDevice(serial) {
  const s = String(serial ?? '').trim();
  if (!s) throw new AppError('DU_LIEU_KHONG_HOP_LE');

  const row = await repo.findDeviceBySerial(s);
  if (!row) throw new AppError('KHONG_TIM_THAY_THIET_BI', 404);
  return toDeviceView(row);
}

// US02-AC3 + QT-03: serial đã thuộc thiết bị khác thì từ chối
async function createDevice({ customerId, serialImei, warrantyEndDate }) {
  const s = String(serialImei ?? '').trim();
  if (!s || !customerId) throw new AppError('DU_LIEU_KHONG_HOP_LE');

  if (!await repo.findCustomerById(customerId)) {
    throw new AppError('KHONG_TIM_THAY_KHACH_HANG', 404);
  }
  if (await repo.findDeviceBySerial(s)) {
    throw new AppError('SERIAL_DA_TON_TAI', 409);
  }

  const row = await repo.createDevice({ customerId, serialImei: s, warrantyEndDate });
  return toDeviceView(row);
}

async function listCategories() {
  const rows = await repo.listCategories();
  return rows.map((r) => ({
    categoryId: Number(r.category_id),
    categoryName: r.category_name
  }));
}

module.exports = { findCustomer, createCustomer, findDevice, createDevice, listCategories };
