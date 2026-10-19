const repo = require('../repositories/ticketRepository');
const AppError = require('../utils/AppError');
const { computeDeadline, HOURS } = require('../utils/sla');
const STATUSES = ['Mới','Đã phân công','Đang xử lý','Chờ linh kiện','Hoàn tất','Đã đóng'];

function createTicket({ deviceId, categoryId, description, priority = 'Trung bình' }) {
  if (!description || !String(description).trim()) throw new AppError('DU_LIEU_KHONG_HOP_LE');
  if (!deviceId) throw new AppError('DU_LIEU_KHONG_HOP_LE');
  if (!HOURS[priority]) throw new AppError('DU_LIEU_KHONG_HOP_LE');
  if (!repo.findDevice(deviceId)) throw new AppError('KHONG_TIM_THAY_THIET_BI', 404);
  if (categoryId && !repo.findCategory(categoryId)) throw new AppError('DU_LIEU_KHONG_HOP_LE');

  const now = new Date();
  const id = repo.create({
    deviceId, categoryId, description: String(description).trim(), priority,
    deadline: computeDeadline(priority, now).toISOString(), createdAt: now.toISOString()
  });
  return repo.findById(id);
}

function listTickets(q) {
  const page = Math.max(parseInt(q.page) || 1, 1);
  return repo.list({ status: q.status, categoryId: q.categoryId, priority: q.priority,
                     limit: 20, offset: (page - 1) * 20 });
}

function getTicket(id) {
  const t = repo.findById(id);
  if (!t) throw new AppError('KHONG_TIM_THAY_PHIEU', 404);
  return t;
}

function updateTicket(id, body) {
  const t = getTicket(id);
  const priority = body.priority ?? t.priority;
  const status = body.status ?? t.status;
  const categoryId = body.categoryId === undefined ? t.category_id : body.categoryId;
  if (!HOURS[priority] || !STATUSES.includes(status)) throw new AppError('DU_LIEU_KHONG_HOP_LE');
  if (categoryId && !repo.findCategory(categoryId)) throw new AppError('DU_LIEU_KHONG_HOP_LE');
  // Đổi ưu tiên thì tính lại hạn từ lúc tạo phiếu (US06-AC1)
  const deadline = priority !== t.priority
    ? computeDeadline(priority, new Date(t.created_at)).toISOString() : t.commitment_deadline;
  repo.update(id, { categoryId, priority, deadline, status, statusChanged: status !== t.status });
  return repo.findById(id);
}

// QT-10: không xóa vật lý -> "xóa" = chuyển sang Đã đóng
const closeTicket = id => updateTicket(id, { status: 'Đã đóng' });

module.exports = { createTicket, listTickets, getTicket, updateTicket, closeTicket };