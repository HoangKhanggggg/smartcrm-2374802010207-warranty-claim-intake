const HOURS = {
  'Cao': 24,
  'Trung bình': 72,
  'Thấp': 120
};

const VN_OFFSET_MS = 7 * 3600 * 1000; // UTC+7
const DAY_MS = 24 * 3600 * 1000;

function computeDeadline(priority, from = new Date()) {
  const h = HOURS[priority];

  if (!h) {
    throw new Error('PRIORITY_INVALID');
  }

  let d = new Date(from.getTime() + h * 3600 * 1000);

  // QT-04: nếu hạn rơi vào Chủ nhật (theo giờ Việt Nam) thì chuyển sang cùng giờ Thứ Hai.
  // Dịch sang UTC+7 để lấy đúng thứ trong tuần, không phụ thuộc múi giờ của máy chủ.
  const vnDay = new Date(d.getTime() + VN_OFFSET_MS).getUTCDay();
  if (vnDay === 0) {
    d = new Date(d.getTime() + DAY_MS);
  }

  return d;
}

module.exports = { computeDeadline, HOURS };
