// 과제는 실제 과목을 만들지 않는 고정 선택 항목입니다.
// 기존 subjectId 필드를 사용하므로 저장된 과목/Todo 형식은 그대로 유지됩니다.
export const ASSIGNMENT_ID = '__exam_planner_assignment__';
export const ASSIGNMENT = { id: ASSIGNMENT_ID, name: '과제', color: '#64748b' };
export function findCategory(subjects, id) {
  return id === ASSIGNMENT_ID ? ASSIGNMENT : subjects.find(s => s.id === id);
}
