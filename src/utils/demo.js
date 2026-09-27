import { dateKey, addDays } from './dates.js';
import { uid } from './storage.js';
export function createDemo() {
  const today = dateKey();
  const subjects = [
    { id: uid(), name: '확률과 통계', examDate: addDays(today, 8), color: '#6654c8', scope: '1. Probability\n2. Random Variables\n3. Expectation' },
    { id: uid(), name: '반도체 소자', examDate: addDays(today, 10), color: '#2a8293', scope: 'PN Junction · MOS · MOSFET\n강의 예제와 주요 식 복습' },
    { id: uid(), name: '디지털 신호처리', examDate: addDays(today, 12), color: '#d28a2d', scope: 'Discrete-Time Signals and Systems\nZ-transform' },
  ];
  return { id: uid(), name: '예시 · 중간고사', semester: `${new Date().getFullYear()}-2`, kind: 'midterm', startDate: today, endDate: addDays(today, 14), subjects,
    todos: ['확률변수 강의노트 정리하기', 'MOSFET 동작 영역 복습', 'Z-transform 연습문제 풀기', '기댓값 예제 다시 풀어보기', '시험 범위 확인하고 계획 세우기'].map((text, i) => ({ id: uid(), text, date: today, subjectId: subjects[i % 3].id, done: i === 4 })),
    events: [{ id: uid(), title: '반도체 소자 문제 풀이', date: addDays(today, 1), type: 'study', subjectId: subjects[1].id }, { id: uid(), title: '과제 제출', date: addDays(today, 3), type: 'general', subjectId: '' }],
  };
}
