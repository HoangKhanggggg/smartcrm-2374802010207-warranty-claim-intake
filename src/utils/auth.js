
// Token đăng nhập: base64url(payload).chữ ký HMAC-SHA256.
const crypto = require('crypto');

function getSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET_NOT_CONFIGURED');
  }

  return secret;
}

const b64 = (s) => Buffer.from(s).toString('base64url');

const sign = (data) =>
  crypto.createHmac('sha256', getSecret())
    .update(data)
    .digest('base64url');

// Tạo token có username, role và thời hạn.
function createToken(
  username,
  role = 'NHAN_VIEN_TIEP_NHAN',
  ttlSeconds = 8 * 3600,
  now = Date.now()
) {
  const payload = b64(JSON.stringify({
    u: username,
    role,
    exp: now + ttlSeconds * 1000
  }));

  return `${payload}.${sign(payload)}`;
}

// Kiểm tra chữ ký, thời hạn và dữ liệu token.
function verifyToken(token, now = Date.now()) {
  if (typeof token !== 'string' || !token.includes('.')) {
    return null;
  }

  try {
    const [payload, signature, extra] = token.split('.');

    if (!payload || !signature || extra !== undefined) {
      return null;
    }

    const expected = sign(payload);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);

    if (
      a.length !== b.length ||
      !crypto.timingSafeEqual(a, b)
    ) {
      return null;
    }

    const data = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8')
    );

    if (
      typeof data.u !== 'string' ||
      !data.u ||
      !['NHAN_VIEN_TIEP_NHAN', 'QUAN_LY_TRUNG_TAM'].includes(data.role) ||
      typeof data.exp !== 'number' ||
      data.exp <= now
    ) {
      return null;
    }

    return {
      username: data.u,
      role: data.role
    };
  } catch {
    return null;
  }
}

module.exports = { createToken, verifyToken };
