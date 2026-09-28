import { ASSIGNMENT_ID } from './categories.js';
import { validDate } from './dates.js';
export const STORAGE_KEY = 'exam-planner:v1';
export const emptyData = () => ({ version: 1, periods: [] });
export const uid = () => crypto.randomUUID();
const isText = (value, max = 10000) => typeof value === 'string' && value.length <= max;
const required = (value, max = 200) => isText(value, max) && value.trim().length > 0;

// 가져온 JSON을 그대로 믿지 않고 날짜, 중복 ID, 과목 연결까지 확인합니다.
// 검증에 실패하면 기존 데이터는 전혀 변경하지 않습니다.
export function validateData(data) {
  const fail = () => { throw new Error('올바른 Exam Planner v1 백업 파일이 아닙니다. 파일 내용과 날짜를 확인해 주세요.'); };
  if (!data || data.version !== 1 || !Array.isArray(data.periods) || data.periods.length > 500) fail();
  const ids = new Set();
  const checkId = id => { if (!required(id, 100) || ids.has(id)) fail(); ids.add(id); };
  for (const p of data.periods) {
    if (!p || !required(p.name) || !required(p.semester, 50) || !['midterm', 'final'].includes(p.kind) || !validDate(p.startDate) || !validDate(p.endDate) || p.startDate > p.endDate) fail();
    checkId(p.id);
    if (!Array.isArray(p.subjects) || !Array.isArray(p.todos) || !Array.isArray(p.events)) fail();
    const subjectIds = new Set(p.subjects.map(s => s?.id));
    const related = id => id === '' || id === ASSIGNMENT_ID || subjectIds.has(id);
    for (const s of p.subjects) {
      if (!s || !required(s.name) || !validDate(s.examDate) || !/^#[0-9a-fA-F]{6}$/.test(s.color) || !isText(s.scope)) fail();
      checkId(s.id);
    }
    for (const t of p.todos) {
      if (!t || !required(t.text, 1000) || !validDate(t.date) || !related(t.subjectId) || typeof t.done !== 'boolean') fail();
      checkId(t.id);
    }
    for (const e of p.events) {
      if (!e || !required(e.title) || !validDate(e.date) || !['exam', 'general', 'study'].includes(e.type) || !related(e.subjectId)) fail();
      checkId(e.id);
    }
  }
  // 재구성해서 불필요한 외부 필드를 제거합니다.
  return { version: 1, periods: data.periods.map(p => ({
    id: p.id, name: p.name, semester: p.semester, kind: p.kind, startDate: p.startDate, endDate: p.endDate,
    subjects: p.subjects.map(({ id, name, examDate, color, scope }) => ({ id, name, examDate, color, scope })),
    todos: p.todos.map(({ id, text, date, subjectId, done }) => ({ id, text, date, subjectId, done })),
    events: p.events.map(({ id, title, date, type, subjectId }) => ({ id, title, date, type, subjectId })),
  })) };
}
export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return { data: raw ? validateData(JSON.parse(raw)) : emptyData(), error: '' };
  } catch {
    return { data: emptyData(), error: '저장된 데이터를 읽지 못했습니다. 원본을 보호하기 위해 자동 저장을 중단했습니다. 설정에서 원본을 내려받거나 백업을 복원해 주세요.' };
  }
}
export function saveData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
export function downloadJSON(data, name) {
  const blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
