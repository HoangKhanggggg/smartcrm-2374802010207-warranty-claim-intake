const router = require('express').Router();
const svc = require('../services/lookupService');

const wrap = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    if (!error.status) console.error(error);
    res.status(error.status || 500).json({ error: error.code || 'LOI_HE_THONG' });
  }
};

router.get('/customers', wrap(async (req, res) => {
  res.json({ data: await svc.findCustomer(req.query.phone) });
}));

router.post('/customers', wrap(async (req, res) => {
  const { customer, created } = await svc.createCustomer(req.body || {});
  res.status(created ? 201 : 200).json({ data: customer, created });
}));

router.get('/devices', wrap(async (req, res) => {
  res.json({ data: await svc.findDevice(req.query.serial) });
}));

router.post('/devices', wrap(async (req, res) => {
  res.status(201).json({ data: await svc.createDevice(req.body || {}) });
}));

router.get('/categories', wrap(async (req, res) => {
  res.json({ data: await svc.listCategories() });
}));

module.exports = router;
