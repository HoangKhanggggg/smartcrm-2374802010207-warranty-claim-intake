
const repo = require('../repositories/ticketRepository');
const AppError = require('../utils/AppError');
const { computeDeadline, HOURS } = require('../utils/sla');

const STATUSES = [
  'Mới',
  'Đã phân công',
  'Đang xử lý',
  'Chờ linh kiện',
  'Hoàn tất',
  'Đã đóng'
];

// Tạo phiếu bảo hành
async function createTicket({
  deviceId,
  categoryId,
  description,
  priority = 'Trung bình'
}) {
  // Kiểm tra dữ liệu bắt buộc
  if (
    !description ||
    !String(description).trim() ||
    !Number.isInteger(Number(deviceId)) ||
    Number(deviceId) < 1
  ) {
    throw new AppError('DU_LIEU_KHONG_HOP_LE');
  }

  // Chuẩn hóa ID
  deviceId = Number(deviceId);

  if (categoryId !== undefined && categoryId !== null && categoryId !== '') {
    categoryId = Number(categoryId);

    if (!Number.isInteger(categoryId) || categoryId < 1) {
      throw new AppError('DU_LIEU_KHONG_HOP_LE');
    }
  } else {
    categoryId = null;
  }

  // Kiểm tra mức ưu tiên
  if (!HOURS[priority]) {
    throw new AppError('DU_LIEU_KHONG_HOP_LE');
  }

  // Kiểm tra thiết bị tồn tại
  const device = await repo.findDevice(deviceId);

  if (!device) {
    throw new AppError('KHONG_TIM_THAY_THIET_BI', 404);
  }

  // Kiểm tra nhóm lỗi tồn tại
  if (categoryId !== null) {
    const category = await repo.findCategory(categoryId);

    if (!category) {
      throw new AppError('DU_LIEU_KHONG_HOP_LE');
    }
  }

  // Tính thời hạn cam kết SLA
  const now = new Date();
  const deadline = computeDeadline(priority, now);

  // Tạo phiếu trong database
  const created = await repo.create({
    ticketCode: `BH-${Date.now()}${Math.floor(Math.random() * 90 + 10)}`,
    deviceId,
    categoryId,
    description: String(description).trim(),
    priority,
    status: 'Mới',
    commitmentDeadline: deadline.toISOString()
  });

  // Kiểm tra dữ liệu trả về sau khi INSERT
  if (!created || !created.ticket_id) {
    console.error('Lỗi: Repository không trả về ticket_id:', created);
    throw new AppError('KHONG_THE_TAO_PHIEU', 500);
  }

  // Đọc lại phiếu vừa tạo
  return getTicket(Number(created.ticket_id));
}

// Lấy danh sách phiếu bảo hành
async function listTickets(query) {
  if (
    query.categoryId &&
    !/^\d+$/.test(String(query.categoryId))
  ) {
    throw new AppError('DU_LIEU_KHONG_HOP_LE');
  }

  const page = Math.max(parseInt(query.page, 10) || 1, 1);

  return repo.list({
    status: query.status,
    categoryId: query.categoryId,
    priority: query.priority,
    limit: 20,
    offset: (page - 1) * 20
  });
}

// Lấy chi tiết phiếu bảo hành
async function getTicket(id) {
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError('KHONG_TIM_THAY_PHIEU', 404);
  }

  const ticket = await repo.findDetailById(id);

  if (!ticket) {
    throw new AppError('KHONG_TIM_THAY_PHIEU', 404);
  }

  return ticket;
}

// Cập nhật phiếu bảo hành
async function updateTicket(id, body) {
  const ticket = await getTicket(id);

  const priority = body.priority ?? ticket.priority;
  const status = body.status ?? ticket.status;

  const categoryId = body.categoryId === undefined
    ? ticket.category_id
    : body.categoryId;

  if (!HOURS[priority] || !STATUSES.includes(status)) {
    throw new AppError('DU_LIEU_KHONG_HOP_LE');
  }

  if (
    categoryId !== null &&
    categoryId !== undefined &&
    categoryId !== ''
  ) {
    if (!Number.isInteger(Number(categoryId)) || Number(categoryId) < 1) {
      throw new AppError('DU_LIEU_KHONG_HOP_LE');
    }

    const category = await repo.findCategory(Number(categoryId));

    if (!category) {
      throw new AppError('DU_LIEU_KHONG_HOP_LE');
    }
  }

  const deadline = priority !== ticket.priority
    ? computeDeadline(priority, new Date(ticket.created_at)).toISOString()
    : ticket.commitment_deadline;

  await repo.update(id, {
    categoryId,
    priority,
    deadline,
    status,
    statusChanged: status !== ticket.status
  });

  return getTicket(id);
}

// Đóng phiếu bảo hành
async function closeTicket(id) {
  return updateTicket(id, {
    status: 'Đã đóng'
  });
}

module.exports = {
  createTicket,
  listTickets,
  getTicket,
  updateTicket,
  closeTicket
};
