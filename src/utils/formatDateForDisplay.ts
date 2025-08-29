// utils/formatDateForDisplay.ts
// Hàm format ngày tháng cho hiển thị: yyyy-mm-ddTHH:MM:SS -> dd/mm/yyyy hoặc mm/yyyy

export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  // Chỉ lấy phần ngày/tháng/năm, bỏ giờ phút giây nếu có
  // Nếu là dạng yyyy-mm-ddTHH:MM:SS thì chỉ lấy yyyy-mm-dd
  const dateOnly = dateString.split('T')[0];
  // Nếu là format yyyy-mm-dd thì convert sang dd/mm/yyyy
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
    const [year, month, day] = dateOnly.split('-');
    return `${day}/${month}/${year}`;
  }
  // Nếu là format yyyy-mm-01 thì convert sang mm/yyyy
  if (/^\d{4}-\d{2}-01$/.test(dateOnly)) {
    const [year, month] = dateOnly.split('-');
    return `${month}/${year}`;
  }
  return dateOnly; // Trả về ngày nếu không match
};
