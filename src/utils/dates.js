// UTC 변환으로 날짜가 하루 어긋나지 않도록, 화면 날짜는 현지 시간으로 생성합니다.
export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function addDays(value, days) {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + days);
  return dateKey(date);
}
export function dayDiff(value, from = dateKey()) {
  return Math.round((Date.parse(`${value}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000);
}
export function dDay(value, from) {
  const days = dayDiff(value, from);
  return days === 0 ? 'D-Day' : days > 0 ? `D-${days}` : `D+${-days}`;
}
export function prettyDate(value, options = { month: 'long', day: 'numeric', weekday: 'short' }) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('ko-KR', options);
}
export function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00`);
  return !isNaN(date) && dateKey(date) === value && value >= '1900-01-01' && value <= '9999-12-31';
}
