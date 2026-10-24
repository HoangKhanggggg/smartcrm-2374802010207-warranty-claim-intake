import { request } from './client';

// Hợp đồng dữ liệu: backend trả camelCase, bọc trong { data }.
export const login = (username, password) =>
  request('/auth/login', { method: 'POST', body: { username, password } }).then((r) => r.data);

export const searchCustomer = (phone) =>
  request('/customers', { params: { phone } }).then((r) => r.data);

export const createCustomer = (fullName, phone) =>
  request('/customers', { method: 'POST', body: { fullName, phone } }).then((r) => r.data);

export const searchDevice = (serial) =>
  request('/devices', { params: { serial } }).then((r) => r.data);

export const createDevice = (customerId, serialImei, warrantyEndDate) =>
  request('/devices', {
    method: 'POST',
    body: { customerId, serialImei, warrantyEndDate: warrantyEndDate || null },
  }).then((r) => r.data);

export const getCategories = () => request('/categories').then((r) => r.data);

export const createTicket = (payload) =>
  request('/tickets', { method: 'POST', body: payload }).then((r) => r.data);

export const listTickets = (filters) =>
  request('/tickets', { params: filters }).then((r) => r.data);
