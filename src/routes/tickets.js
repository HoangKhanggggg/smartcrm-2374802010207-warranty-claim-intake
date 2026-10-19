const router = require('express').Router();
const svc = require('../services/ticketService');

const wrap = fn => (req, res) => {
  try { fn(req, res); }
  catch (e) { res.status(e.status || 500).json({ error: e.code || 'LOI_HE_THONG' }); }
};

router.post('/',      wrap((req, res) => res.status(201).json({ data: svc.createTicket(req.body) })));
router.get('/',       wrap((req, res) => res.json({ data: svc.listTickets(req.query) })));
router.get('/:id',    wrap((req, res) => res.json({ data: svc.getTicket(+req.params.id) })));
router.patch('/:id',  wrap((req, res) => res.json({ data: svc.updateTicket(+req.params.id, req.body) })));
router.delete('/:id', wrap((req, res) => res.json({ data: svc.closeTicket(+req.params.id) })));

module.exports = router;