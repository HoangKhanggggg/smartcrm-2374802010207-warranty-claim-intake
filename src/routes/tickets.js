
const router = require('express').Router();
const svc = require('../services/ticketService');
const { toTicketView } = require('../utils/ticketMapper');

const wrap = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    if (!error.status) console.error(error);

    res.status(error.status || 500).json({
      error: error.code || 'LOI_HE_THONG'
    });
  }
};

router.post('/', wrap(async (req, res) => {
  const row = await svc.createTicket(req.body || {});
  res.status(201).json({ data: toTicketView(row) });
}));

router.get('/', wrap(async (req, res) => {
  const rows = await svc.listTickets(req.query);
  res.json({ data: rows.map((row) => toTicketView(row)) });
}));

router.get('/:id', wrap(async (req, res) => {
  const row = await svc.getTicket(Number(req.params.id));
  res.json({ data: toTicketView(row) });
}));

router.patch('/:id', wrap(async (req, res) => {
  const row = await svc.updateTicket(Number(req.params.id), req.body || {});
  res.json({ data: toTicketView(row) });
}));

router.delete('/:id', wrap(async (req, res) => {
  const row = await svc.closeTicket(Number(req.params.id));
  res.json({ data: toTicketView(row) });
}));

module.exports = router;
