// QT-13: nhận diện phiếu sắp đến hạn / quá hạn.
// Sắp đến hạn: còn <= 8 giờ so với hạn cam kết, trạng thái chưa Hoàn tất/Đã đóng.
// Quá hạn: hiện tại > hạn cam kết, trạng thái chưa Hoàn tất/Đã đóng.
const FINISHED = ['Hoàn tất', 'Đã đóng'];
const WARNING_HOURS = 8; // giá trị cấu hình

function getDueState(ticket, now = new Date(), warningHours = WARNING_HOURS) {
  if (!ticket || !ticket.commitmentDeadline || FINISHED.includes(ticket.status)) {
    return null;
  }

  const deadline = new Date(ticket.commitmentDeadline).getTime();
  if (Number.isNaN(deadline)) return null;

  const diff = deadline - now.getTime();
  if (diff < 0) return 'QUA_HAN';
  if (diff <= warningHours * 3600 * 1000) return 'SAP_DEN_HAN';
  return null;
}

module.exports = { getDueState, WARNING_HOURS };
