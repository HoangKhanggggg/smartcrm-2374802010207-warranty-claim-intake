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

async function createTicket({
  deviceId,
  categoryId,
  description,
  priority = 'Trung bình'
}) {
  if (!description || !String(description).trim() || !deviceId) {
    throw new AppError('DU_LIEU_KHONG_HOP_LE');
  }

  if (!HOURS[priority]) {
    throw new AppError('DU_LIEU_KHONG_HOP_LE');
  }

  if (!await repo.findDevice(deviceId)) {
    throw new AppError('KHONG_TIM_THAY_THIET_BI', 404);
  }

  if (categoryId && !await repo.findCategory(categoryId)) {
    throw new AppError('DU_LIEU_KHONG_HOP_LE');
  }

  const now = new Date();
  const deadline = computeDeadline(priority, now);

  const created = await repo.create({
    ticketCode: `BH-${Date.now()}${Math.floor(Math.random() * 90 + 10)}`,
    deviceId,
    categoryId,
    description: String(description).trim(),
    priority,
    status: 'Mới',
    commitmentDeadline: deadline.toISOString()
  });

  return getTicket(created.ticket_id);
}

async function listTickets(query) {
  if (query.categoryId && !/^\d+$/.test(String(query.categoryId))) {
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

  if (categoryId && !await repo.findCategory(categoryId)) {
    throw new AppError('DU_LIEU_KHONG_HOP_LE');
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

async function closeTicket(id) {
  return updateTicket(id, { status: 'Đã đóng' });
}

module.exports = {
  createTicket,
  listTickets,
  getTicket,
  updateTicket,
  closeTicket
};