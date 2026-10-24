import { useState } from 'react';
import { getCategories, listTickets } from '../api/ticket.api';
import { useAsync } from '../hooks/useAsync';
import DataState from '../components/DataState';
import { DUE_LABEL, PRIORITIES, STATUSES, formatDateTime } from '../labels';

const PAGE_SIZE = 20;

// Màn hình 3 – Danh sách phiếu bảo hành
export default function TicketListPage() {
  const [status, setStatus] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);

  const categories = useAsync(getCategories, []);
  const tickets = useAsync(
    () => listTickets({ status, categoryId, priority, page }),
    [status, categoryId, priority, page]
  );

  const change = (setter) => (e) => { setter(e.target.value); setPage(1); };
  const rows = tickets.data || [];

  return (
    <section className="panel">
      <h2>Danh sách phiếu bảo hành</h2>

      <div className="filters">
        <label>Trạng thái
          <select value={status} onChange={change(setStatus)}>
            <option value="">Tất cả</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label>Nhóm sự cố
          <select value={categoryId} onChange={change(setCategoryId)}>
            <option value="">Tất cả</option>
            {(categories.data || []).map((c) => (
              <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
            ))}
          </select>
        </label>
        <label>Mức ưu tiên
          <select value={priority} onChange={change(setPriority)}>
            <option value="">Tất cả</option>
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
        <button onClick={tickets.reload}>Lọc danh sách</button>
      </div>

      <DataState
        loading={tickets.loading}
        error={tickets.error}
        isEmpty={rows.length === 0}
        emptyMessage="Không có phiếu phù hợp"
        onRetry={tickets.reload}
      >
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mã phiếu</th><th>Khách hàng</th><th>Thiết bị</th><th>Trạng thái</th>
                <th>Nhóm sự cố</th><th>Ưu tiên</th><th>Hạn cam kết</th><th>Ngày tiếp nhận</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.ticketId} className={t.dueState ? `due-${t.dueState}` : ''}>
                  <td>{t.ticketCode}</td>
                  <td>{t.customerName} <small>{t.customerPhoneMasked}</small></td>
                  <td>{t.serialImei}</td>
                  <td>{t.status}</td>
                  <td>{t.categoryName ?? '—'}</td>
                  <td>{t.priority}</td>
                  <td>
                    {formatDateTime(t.commitmentDeadline)}{' '}
                    {t.dueState && <span className={`badge ${t.dueState}`}>{DUE_LABEL[t.dueState]}</span>}
                  </td>
                  <td>{formatDateTime(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataState>

      <div className="pager">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>Trước</button>
        <span>Trang {page}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={rows.length < PAGE_SIZE}>Sau</button>
      </div>
    </section>
  );
}
