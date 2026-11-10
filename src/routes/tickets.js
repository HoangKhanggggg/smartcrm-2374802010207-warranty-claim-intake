const router = require('express').Router();
const svc = require('../services/ticketService');
const { toTicketView } = require('../utils/ticketMapper');

const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

const STAFF = 'NHAN_VIEN_TIEP_NHAN';
const MANAGER = 'QUAN_LY_TRUNG_TAM';

// Nhân viên tiếp nhận được tạo phiếu.
router.post(
  '/',
  requireAuth,
  authorizeRoles(STAFF),
  async (req, res) => {
    const row = await svc.createTicket(req.body || {});
    res.status(201).json({ data: toTicketView(row) });
  }
);

// Quản lý trung tâm được xem danh sách phiếu.
router.get(
  '/',
  requireAuth,
  authorizeRoles(MANAGER),
  async (req, res) => {
    const rows = await svc.listTickets(req.query);
    res.json({ data: rows.map((row) => toTicketView(row)) });
  }
);

// Quản lý trung tâm được xem chi tiết phiếu.
router.get(
  '/:id',
  requireAuth,
  authorizeRoles(MANAGER),
  async (req, res) => {
    const row = await svc.getTicket(Number(req.params.id));
    res.json({ data: toTicketView(row) });
  }
);

// Chưa cấp quyền cập nhật phiếu trong ma trận L02 hiện tại.
router.patch(
  '/:id',
  requireAuth,
  authorizeRoles(),
  async (req, res) => {
    const row = await svc.updateTicket(Number(req.params.id), req.body || {});
    res.json({ data: toTicketView(row) });
  }
);

// Không xóa vật lý và chưa cấp quyền đóng phiếu qua API này.
router.delete(
  '/:id',
  requireAuth,
  authorizeRoles(),
  async (req, res) => {
    const row = await svc.closeTicket(Number(req.params.id));
    res.json({ data: toTicketView(row) });
  }
);

module.exports = router;
