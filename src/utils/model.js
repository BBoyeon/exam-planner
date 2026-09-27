import { addDays } from './dates.js';
// 배열 순서가 화면 순서입니다. 이동한 Todo는 목적지 목록의 뒤에 붙습니다.
export function moveTodos(todos, ids) {
  const selected = new Set(ids);
  return [...todos.filter(t => !selected.has(t.id)), ...todos.filter(t => selected.has(t.id)).map(t => ({ ...t, date: addDays(t.date, 1) }))];
}
export function reorderTodos(todos, activeId, overId) {
  const from = todos.findIndex(t => t.id === activeId);
  const to = todos.findIndex(t => t.id === overId);
  if (from < 0 || to < 0 || from === to) return todos;
  const next = [...todos];
  const [item] = next.splice(from, 1); next.splice(to, 0, item);
  return next;
}
export function calendarEvents(period) {
  return [
    ...period.subjects.map(s => ({ id: `subject-${s.id}`, subjectId: s.id, title: `${s.name} 시험`, date: s.examDate, type: 'exam', fromSubject: true })),
    ...period.events,
  ].sort((a, b) => a.date.localeCompare(b.date));
}
