const router = require('express').Router();
const svc = require('../services/lookupService');

// Express 5 tự chuyển lỗi từ async handler đến error middleware.
router.get('/customers', async (req, res) => {
  res.json({ data: await svc.findCustomer(req.query.phone) });
});

router.post('/customers', async (req, res) => {
  const { customer, created } = await svc.createCustomer(req.body || {});
  res.status(created ? 201 : 200).json({ data: customer, created });
});

router.get('/devices', async (req, res) => {
  res.json({ data: await svc.findDevice(req.query.serial) });
});

router.post('/devices', async (req, res) => {
  res.status(201).json({ data: await svc.createDevice(req.body || {}) });
});

router.get('/categories', async (req, res) => {
  res.json({ data: await svc.listCategories() });
});

module.exports = router;
