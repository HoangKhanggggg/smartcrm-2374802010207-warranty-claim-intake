
const request = require('supertest');

jest.mock('../src/db', () => ({
  migrate: jest.fn().mockResolvedValue(undefined)
}));

const app = require('../src/app');

describe('CORS configuration', () => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5175'
  ];

  test.each(allowedOrigins)(
    'cho phép Origin %s',
    async (origin) => {
      const response = await request(app)
        .get('/health')
        .set('Origin', origin);

      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin'])
        .toBe(origin);
    }
  );

  test('không cấp quyền CORS cho Origin không hợp lệ', async () => {
    const response = await request(app)
      .get('/health')
      .set('Origin', 'http://example.com');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin'])
      .toBeUndefined();
  });
});
