import test from 'node:test';
import assert from 'node:assert/strict';
import { validateData } from '../src/utils/storage.js';
import { addDays, dDay, validDate } from '../src/utils/dates.js';
import { moveTodos, reorderTodos, calendarEvents } from '../src/utils/model.js';
const fixture = () => ({ version: 1, periods: [{ id: 'p1', name: '중간고사', semester: '2026-2', kind: 'midterm', startDate: '2026-10-01', endDate: '2026-10-30', subjects: [{ id: 's1', name: '확률', color: '#4057dc', scope: '', examDate: '2026-10-20' }], todos: [{ id: 't1', text: '복습', subjectId: 's1', date: '2026-10-10', done: false }], events: [] }] });
test('백업 왕복 및 연결 검증', () => {
  const source = fixture(); assert.deepEqual(validateData(JSON.parse(JSON.stringify(source))), source);
  source.periods[0].todos[0].subjectId = 'unknown'; assert.throws(() => validateData(source));
});
test('손상된 파일, 중복 ID, 잘못된 날짜 거부', () => {
  for (const value of [null, {}, {version: 2, periods: []}, {version:1, periods:[null]}]) assert.throws(() => validateData(value));
  const duplicate = fixture(); duplicate.periods[0].todos[0].id = 's1'; assert.throws(() => validateData(duplicate));
  const invalid = fixture(); invalid.periods[0].startDate = '2026-02-30'; assert.throws(() => validateData(invalid));
  const reversed = fixture(); reversed.periods[0].endDate = '2025-01-01'; assert.throws(() => validateData(reversed));
});
test('월말, 윤년, 연말 날짜 계산', () => {
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addDays('2028-02-28', 1), '2028-02-29');
  assert.equal(addDays('2026-02-28', 1), '2026-03-01');
  assert.equal(validDate('2026-02-29'), false);
  assert.equal(dDay('2026-10-10', '2026-10-10'), 'D-Day');
  assert.equal(dDay('2026-10-09', '2026-10-10'), 'D+1');
});
test('선택한 Todo만 다음날 마지막으로 이동하며 완료 상태 유지', () => {
  const todos = [{id:'a', date:'2026-12-31', done:true},{id:'b', date:'2027-01-01', done:false},{id:'c', date:'2026-12-30',done:false}];
  const moved = moveTodos(todos, ['a', 'c']);
  assert.deepEqual(moved.map(t => t.id), ['b','a','c']);
  assert.equal(moved[1].date, '2027-01-01'); assert.equal(moved[1].done,true);
  assert.equal(moved[2].date, '2026-12-31'); assert.equal(todos[0].date,'2026-12-31');
});
test('정렬은 전체 데이터와 날짜를 유지', () => {
  const todos = [{id:'a',date:'2026-10-10'}, {id:'b',date:'2026-10-11'}, {id:'c',date:'2026-10-10'}];
  assert.deepEqual(reorderTodos(todos,'c','a').map(t=>t.id), ['c','a','b']);
  assert.equal(reorderTodos(todos,'missing','a'),todos);
});
test('과목 시험은 자동 생성되어 변경 날짜를 즉시 반영', () => {
  const p = fixture().periods[0];
  assert.equal(calendarEvents(p)[0].date,'2026-10-20');
  p.subjects[0].examDate='2026-10-25'; assert.equal(calendarEvents(p)[0].date,'2026-10-25');
});
