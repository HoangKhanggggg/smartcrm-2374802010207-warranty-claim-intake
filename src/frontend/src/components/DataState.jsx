// Bọc một khu vực dữ liệu với 3 trạng thái: đang tải · rỗng · lỗi (kèm nút thử lại).
export default function DataState({
  loading,
  error,
  isEmpty,
  emptyMessage = 'Không có dữ liệu.',
  onRetry,
  children,
}) {
  if (loading) {
    return <p role="status" className="state state-loading">Đang tải dữ liệu...</p>;
  }

  if (error) {
    return (
      <section role="alert" className="state state-error">
        <p>{error.message || 'Đã xảy ra lỗi.'}</p>
        {onRetry && <button onClick={onRetry}>Thử lại</button>}
      </section>
    );
  }

  if (isEmpty) {
    return <p className="state state-empty">{emptyMessage}</p>;
  }

  return children;
}
