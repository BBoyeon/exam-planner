import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
export default function TodoItem({ todo, subject, selected, onSelect, onToggle, onEdit, onDelete, onNudge, first, last }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id });
  return <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? .5 : 1 }} className={`todo-row ${todo.done ? 'completed' : ''} ${selected ? 'selected' : ''}`}>
    <input className="select-check" type="checkbox" aria-label={`${todo.text} 이동 선택`} checked={selected} onChange={onSelect} />
    <button className="drag-handle" aria-label={`${todo.text} 순서 변경`} {...attributes} {...listeners}><GripVertical size={18} /></button>
    <input className="done-check" type="checkbox" aria-label={`${todo.text} 완료`} checked={todo.done} onChange={onToggle} />
    <div className="todo-content"><span className="todo-text">{todo.text}</span>{subject && <span className="subject-tag" style={{ '--subject': subject.color }}>{subject.name}</span>}</div>
    <div className="row-actions"><button className="icon-btn nudge" disabled={first} onClick={() => onNudge(-1)} aria-label={`${todo.text} 위로`}><ArrowUp size={15}/></button><button className="icon-btn nudge" disabled={last} onClick={() => onNudge(1)} aria-label={`${todo.text} 아래로`}><ArrowDown size={15}/></button><button className="icon-btn" onClick={onEdit} aria-label={`${todo.text} 수정`}><Pencil size={16} /></button><button className="icon-btn danger-text" onClick={onDelete} aria-label={`${todo.text} 삭제`}><Trash2 size={16} /></button></div>
  </div>;
}
