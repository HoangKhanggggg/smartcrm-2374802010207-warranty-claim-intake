
const router = require('express').Router();
const svc = require('../services/lookupService');

const requireAuth = require('../middleware/requireAuth');
const authorizeRoles = require('../middleware/authorizeRoles');

const STAFF = 'NHAN_VIEN_TIEP_NHAN';
const MANAGER = 'QUAN_LY_TRUNG_TAM';

// Tra cứu khách hàng: chỉ nhân viên tiếp nhận.
router.get(
  '/customers',
  requireAuth,
  authorizeRoles(STAFF),
  async (req, res) => {
    res.json({ data: await svc.findCustomer(req.query.phone) });
  }
);

// Tạo khách hàng: chỉ nhân viên tiếp nhận.
router.post(
  '/customers',
  requireAuth,
  authorizeRoles(STAFF),
  async (req, res) => {
    const { customer, created } = await svc.createCustomer(req.body || {});
    res.status(created ? 201 : 200).json({ data: customer, created });
  }
);

// Tra cứu thiết bị: chỉ nhân viên tiếp nhận.
router.get(
  '/devices',
  requireAuth,
  authorizeRoles(STAFF),
  async (req, res) => {
    res.json({ data: await svc.findDevice(req.query.serial) });
  }
);

// Ghi nhận thiết bị: chỉ nhân viên tiếp nhận.
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

// Tra cứu nhóm sự cố: nhân viên và quản lý đều được đọc.
router.get(
  '/categories',
  requireAuth,
  authorizeRoles(STAFF, MANAGER),
  async (req, res) => {
    res.json({ data: await svc.listCategories() });
  }
);

module.exports = router;
