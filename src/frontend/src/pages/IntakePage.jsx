import { useState } from 'react';
import { createTicket, getCategories } from '../api/ticket.api';
import { useAsync } from '../hooks/useAsync';
import DataState from '../components/DataState';
import { PRIORITIES, WARRANTY_LABEL, formatDateTime } from '../labels';

// Màn hình 2 – Tiếp nhận và phân loại yêu cầu
export default function IntakePage({ customer, device, onGoLookup, onGoList }) {
  const categories = useAsync(getCategories, []);

  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState('Trung bình');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState(null);

  if (!customer || !device) {
    return (
      <section className="panel">
        <p>Hãy tra cứu khách hàng và thiết bị trước khi tạo phiếu.</p>
        <button onClick={onGoLookup}>Về màn hình tra cứu</button>
      </section>
    );
  }

  async function submit() {
    if (!description.trim()) {
      setError('Mô tả lỗi là bắt buộc.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const ticket = await createTicket({
        deviceId: device.deviceId,
        categoryId: categoryId ? Number(categoryId) : null,
        description,
        priority,
      });
      setCreated(ticket);
    } catch (err) {
      setError(err.message); // giữ nguyên dữ liệu form (US03-AC3)
    } finally {
      setBusy(false);
    }
  }

  if (created) {
    return (
      <section className="panel">
        <h2>Đã tạo phiếu bảo hành</h2>
        <p className="result"><strong>Mã phiếu:</strong> {created.ticketCode}</p>
        <p><strong>Trạng thái:</strong> {created.status} · <strong>Ưu tiên:</strong> {created.priority}</p>
        <p><strong>Hạn cam kết:</strong> {formatDateTime(created.commitmentDeadline)}</p>
        <button className="primary" onClick={onGoList}>Xem danh sách phiếu</button>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>Tiếp nhận và phân loại yêu cầu</h2>
      <p><strong>Khách hàng:</strong> {customer.fullName} — {customer.phoneMasked}</p>
      <p>
        <strong>Thiết bị:</strong> {device.serialImei} ·{' '}
        <span className={`badge ${device.warrantyStatus}`}>{WARRANTY_LABEL[device.warrantyStatus]}</span>
      </p>

      <label>Mô tả lỗi (bắt buộc)
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>

      <label>Nhóm sự cố
        <DataState
          loading={categories.loading}
          error={categories.error}
          onRetry={categories.reload}
        >
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">(Chưa chọn)</option>
            {(categories.data || []).map((c) => (
              <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
            ))}
          </select>
        </DataState>
      </label>

      <label>Mức ưu tiên
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>
      </label>

      <label>Hạn cam kết
        <input readOnly value="Hệ thống tự tính khi tạo phiếu" />
      </label>

      {error && <p className="field-error" role="alert">{error}</p>}
      <button className="primary" onClick={submit} disabled={busy}>
        {busy ? 'Đang lưu...' : 'Tạo phiếu bảo hành'}
      </button>
    </section>
  );
}
