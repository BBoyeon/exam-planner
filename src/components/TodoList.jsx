import { useState } from 'react';
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Plus, ArrowRight, ListChecks } from 'lucide-react';
import TodoItem from './TodoItem';
import Modal from './Modal';
import { TodoForm } from './QuickAdd';
import { moveTodos, reorderTodos } from '../utils/model';
import { uid } from '../utils/storage';
export default function TodoList({ period, updatePeriod, date, subjectId, notify }) {
  const [selected, setSelected] = useState([]);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const todos = period.todos.filter(t => t.date === date && (subjectId === undefined || t.subjectId === subjectId));
  const selectedIds = selected.filter(id => todos.some(t => t.id === id));
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 7 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  function move(ids) {
    updatePeriod(p => ({ ...p, todos: moveTodos(p.todos, ids) })); setSelected([]); notify(`${ids.length}개의 Todo를 다음날로 옮겼어요.`);
  }
  function reorder(active, over) { if (over && active !== over) updatePeriod(p => ({ ...p, todos: reorderTodos(p.todos, active, over) })); }
  return <>
    <div className="todo-toolbar"><label className="inline-label"><input type="checkbox" checked={todos.length > 0 && selectedIds.length === todos.length} disabled={!todos.length} onChange={e => setSelected(e.target.checked ? todos.map(t => t.id) : [])} />전체 선택</label><div className="toolbar-right"><button className="text-btn" disabled={!selectedIds.length} onClick={() => move(selectedIds)}>선택 {selectedIds.length || ''}개 다음날로 <ArrowRight size={15} /></button><button className="btn small" onClick={() => setEditing({ text: '', date, subjectId: subjectId || '' })}><Plus size={16} />Todo 추가</button></div></div>
    {!todos.length ? <div className="empty"><ListChecks size={29} /><strong>아직 등록한 Todo가 없어요</strong><span>작은 공부 하나부터 시작해 보세요.</span><button className="text-btn" onClick={() => setEditing({ text: '', date, subjectId: subjectId || '' })}>첫 Todo 추가하기 <Plus size={15}/></button></div> : <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={({ active, over }) => reorder(active.id, over?.id)}><SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>{todos.map((t, index) => <TodoItem key={t.id} todo={t} subject={period.subjects.find(s => s.id === t.subjectId)} selected={selectedIds.includes(t.id)} onSelect={() => setSelected(ids => ids.includes(t.id) ? ids.filter(id => id !== t.id) : [...ids, t.id])} onToggle={() => updatePeriod(p => ({ ...p, todos: p.todos.map(item => item.id === t.id ? { ...item, done: !item.done } : item) }))} onEdit={() => setEditing(t)} onDelete={() => setDeleting(t)} first={index === 0} last={index === todos.length - 1} onNudge={direction => reorder(t.id, todos[index + direction]?.id)} />)}</SortableContext></DndContext>}
    {todos.length > 0 && <div className="list-footer"><span>손잡이를 드래그해 순서를 바꿀 수 있어요</span><span>{todos.filter(t => t.done).length} / {todos.length} 완료</span></div>}
    {editing && <Modal title={editing.id ? 'Todo 수정' : 'Todo 추가'} onClose={() => setEditing(null)}><TodoForm subjects={period.subjects} initial={editing} onClose={() => setEditing(null)} onSave={value => { updatePeriod(p => ({ ...p, todos: value.id ? p.todos.map(t => t.id === value.id ? { ...t, ...value } : t) : [...p.todos, { ...value, id: uid(), done: false }] })); setEditing(null); }} /></Modal>}
    {deleting && <Modal title="Todo를 삭제할까요?" onClose={() => setDeleting(null)}><p className="wrap">{deleting.text}</p><div className="form-actions"><button className="btn" onClick={() => setDeleting(null)}>취소</button><button className="btn danger" onClick={() => { updatePeriod(p => ({ ...p, todos: p.todos.filter(t => t.id !== deleting.id) })); setDeleting(null); }}>삭제</button></div></Modal>}
  </>;
}
