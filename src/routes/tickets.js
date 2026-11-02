const router = require('express').Router();
const svc = require('../services/ticketService');
const { toTicketView } = require('../utils/ticketMapper');

// Express 5 tự chuyển lỗi từ async handler đến error middleware.
router.post('/', async (req, res) => {
  const row = await svc.createTicket(req.body || {});
  res.status(201).json({ data: toTicketView(row) });
});

router.get('/', async (req, res) => {
  const rows = await svc.listTickets(req.query);
  res.json({ data: rows.map((row) => toTicketView(row)) });
});

router.get('/:id', async (req, res) => {
  const row = await svc.getTicket(Number(req.params.id));
  res.json({ data: toTicketView(row) });
});

router.patch('/:id', async (req, res) => {
  const row = await svc.updateTicket(Number(req.params.id), req.body || {});
  res.json({ data: toTicketView(row) });
});

// Endpoint DELETE hiện thực chất đóng phiếu, không xóa vật lý.
router.delete('/:id', async (req, res) => {
  const row = await svc.closeTicket(Number(req.params.id));
  res.json({ data: toTicketView(row) });
});

module.exports = router;
