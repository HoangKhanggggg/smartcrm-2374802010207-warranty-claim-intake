const HOURS = {
  'Cao': 24,
  'Trung bình': 72,
  'Thấp': 120
};

function computeDeadline(priority, from = new Date()) {
  const h = HOURS[priority];

  if (!h) {
    throw new Error('PRIORITY_INVALID');
  }

  const d = new Date(from.getTime() + h * 3600 * 1000);

  // Nếu hạn rơi vào Chủ nhật thì chuyển sang thứ Hai
  if (d.getDay() === 0) {
    d.setDate(d.getDate() + 1);
  }

  return d;
}

module.exports = { computeDeadline, HOURS };