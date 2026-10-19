const HOURS = { 'Cao': 24, 'Trung bình': 72, 'Thấp': 120 };

function computeDeadline(priority, from = new Date()) {
  const h = HOURS[priority];
  if (!h) throw new Error('PRIORITY_INVALID');
  const d = new Date(from.getTime() + h * 3600 * 1000);
  if (d.getDay() === 0) d.setDate(d.getDate() + 1); // Chủ nhật -> Thứ Hai, cùng giờ
  return d;
}
module.exports = { computeDeadline, HOURS };