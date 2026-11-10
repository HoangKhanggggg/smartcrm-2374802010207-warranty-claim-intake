const router = require('express').Router();
const svc = require('../services/lookupService');

const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

const STAFF = 'NHAN_VIEN_TIEP_NHAN';

// Tra cứu khách hàng.
router.get(
  '/customers',
  requireAuth,
  authorizeRoles(STAFF),
  async (req, res) => {
    res.json({ data: await svc.findCustomer(req.query.phone) });
  }
);

// Tạo khách hàng.
router.post(
  '/customers',
  requireAuth,
  authorizeRoles(STAFF),
  async (req, res) => {
    const { customer, created } = await svc.createCustomer(req.body || {});
    res.status(created ? 201 : 200).json({ data: customer, created });
  }
);

// Tra cứu thiết bị.
router.get(
  '/devices',
  requireAuth,
  authorizeRoles(STAFF),
  async (req, res) => {
    res.json({ data: await svc.findDevice(req.query.serial) });
  }
);

// Ghi nhận thiết bị.
router.post(
  '/devices',
  requireAuth,
  authorizeRoles(STAFF),
  async (req, res) => {
    res.status(201).json({
      data: await svc.createDevice(req.body || {})
    });
  }
);

// Tra cứu nhóm sự cố.
router.get(
  '/categories',
  requireAuth,
  authorizeRoles(STAFF),
  async (req, res) => {
    res.json({ data: await svc.listCategories() });
  }
);

module.exports = router;
