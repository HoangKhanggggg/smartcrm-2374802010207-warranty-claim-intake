import { useState } from 'react';
import {
  createCustomer, createDevice, searchCustomer, searchDevice,
} from '../api/ticket.api';
import { WARRANTY_LABEL } from '../labels';

// Màn hình 1 – Tra cứu khách hàng và thiết bị
export default function LookupPage({ customer, setCustomer, device, setDevice, onContinue }) {
  const [phone, setPhone] = useState('');
  const [customerMsg, setCustomerMsg] = useState('');
  const [notFoundPhone, setNotFoundPhone] = useState(false);
  const [newName, setNewName] = useState('');

  const [serial, setSerial] = useState('');
  const [deviceMsg, setDeviceMsg] = useState('');
  const [notFoundSerial, setNotFoundSerial] = useState(false);
  const [warrantyDate, setWarrantyDate] = useState('');
  const [busy, setBusy] = useState(false);

  async function guard(fn, setMsg) {
    setBusy(true);
    setMsg('');
    try { await fn(); } catch (err) { setMsg(err); } finally { setBusy(false); }
  }

  const lookupCustomer = () => guard(async () => {
    setNotFoundPhone(false);
    setCustomer(null);
    setDevice(null);
    try {
      setCustomer(await searchCustomer(phone));
    } catch (err) {
      if (err.code === 'KHONG_TIM_THAY_KHACH_HANG') setNotFoundPhone(true);
      throw err;
    }
  }, (e) => setCustomerMsg(e ? e.message : ''));

  const makeCustomer = () => guard(async () => {
    const { customer: c } = await createCustomer(newName, phone);
    setCustomer(c);
    setNotFoundPhone(false);
    setCustomerMsg('');
  }, (e) => setCustomerMsg(e ? e.message : ''));

  const lookupDevice = () => guard(async () => {
    setNotFoundSerial(false);
    setDevice(null);
    try {
      const d = await searchDevice(serial);
      if (d.customerId !== customer.customerId) {
        setDeviceMsg(`Thiết bị này thuộc khách hàng khác (${d.customerName}).`);
        return;
      }
      setDevice(d);
    } catch (err) {
      if (err.code === 'KHONG_TIM_THAY_THIET_BI') setNotFoundSerial(true);
      throw err;
    }
  }, (e) => setDeviceMsg(e ? e.message : ''));

  const makeDevice = () => guard(async () => {
    setDevice(await createDevice(customer.customerId, serial, warrantyDate));
    setNotFoundSerial(false);
    setDeviceMsg('');
  }, (e) => setDeviceMsg(e ? e.message : ''));

  return (
    <section className="panel">
      <h2>Tra cứu khách hàng và thiết bị</h2>

      <label>Số điện thoại khách hàng
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ví dụ 0912 345 678 hoặc +84912345678" />
      </label>
      <button onClick={lookupCustomer} disabled={busy}>Tra cứu khách</button>
      {customerMsg && <p className="field-error" role="alert">{customerMsg}</p>}

      {notFoundPhone && (
        <div className="subpanel">
          <p>Chưa có hồ sơ. Nhập họ tên để tạo khách hàng mới:</p>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Họ và tên" />
          <button onClick={makeCustomer} disabled={busy}>Tạo khách hàng</button>
        </div>
      )}

      {customer && (
        <p className="result"><strong>Kết quả khách hàng:</strong> {customer.fullName} — {customer.phoneMasked}</p>
      )}

      {customer && (
        <>
          <label>Serial / IMEI thiết bị
            <input value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="Ví dụ SN-A001-2026" />
          </label>
          <button onClick={lookupDevice} disabled={busy}>Tra cứu thiết bị</button>
          {deviceMsg && <p className="field-error" role="alert">{deviceMsg}</p>}

          {notFoundSerial && (
            <div className="subpanel">
              <p>Thiết bị chưa có trong hệ thống. Có thể đăng ký cho khách này:</p>
              <label>Ngày hết bảo hành (nếu biết)
                <input type="date" value={warrantyDate} onChange={(e) => setWarrantyDate(e.target.value)} />
              </label>
              <button onClick={makeDevice} disabled={busy}>Đăng ký thiết bị</button>
            </div>
          )}
        </>
      )}

      {device && (
        <p className="result">
          <strong>Tình trạng bảo hành:</strong>{' '}
          <span className={`badge ${device.warrantyStatus}`}>{WARRANTY_LABEL[device.warrantyStatus]}</span>
          {device.warrantyEndDate && ` (đến ${device.warrantyEndDate})`}
        </p>
      )}

      <button className="primary" onClick={onContinue} disabled={!customer || !device}>
        Tiếp tục tạo phiếu
      </button>
    </section>
  );
}
