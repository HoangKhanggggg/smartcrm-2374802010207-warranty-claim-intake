const router = require('express').Router();
const svc = require('../services/ticketService');

const wrap = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    console.error(error);

    res.status(error.status || 500).json({
      error: error.code || 'LOI_HE_THONG'
    });
  }
};

router.post('/', wrap(async (req, res) => {
  const data = await svc.createTicket(req.body);
  res.status(201).json({ data });
}));

router.get('/', wrap(async (req, res) => {
  const data = await svc.listTickets(req.query);
  res.json({ data });
}));

router.get('/:id', wrap(async (req, res) => {
  const data = await svc.getTicket(Number(req.params.id));
  res.json({ data });
}));

router.patch('/:id', wrap(async (req, res) => {
  const data = await svc.updateTicket(Number(req.params.id), req.body);
  res.json({ data });
}));

router.delete('/:id', wrap(async (req, res) => {
  const data = await svc.closeTicket(Number(req.params.id));
  res.json({ data });
}));

module.exports = router;