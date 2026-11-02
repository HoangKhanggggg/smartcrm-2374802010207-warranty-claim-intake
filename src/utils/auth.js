// Token đăng nhập tối giản: base64url(payload).chữ ký HMAC-SHA256.
const crypto = require('crypto');

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET_NOT_CONFIGURED');
  }
  return secret;
}

const b64 = (s) => Buffer.from(s).toString('base64url');
const sign = (data) => crypto.createHmac('sha256', getSecret()).update(data).digest('base64url');

function createToken(username, ttlSeconds = 8 * 3600, now = Date.now()) {
  const payload = b64(JSON.stringify({ u: username, exp: now + ttlSeconds * 1000 }));
  return `${payload}.${sign(payload)}`;
}

// Trả về { username } nếu hợp lệ; mọi lỗi cấu hình/chữ ký đều từ chối xác thực.
function verifyToken(token, now = Date.now()) {
  if (typeof token !== 'string' || !token.includes('.')) return null;

  try {
    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra !== undefined) return null;
    const expected = sign(payload);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.u || typeof data.exp !== 'number' || data.exp <= now) return null;
    return { username: data.u };
  } catch {
    return null;
  }
}

module.exports = { createToken, verifyToken };
