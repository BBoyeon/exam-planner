import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from './Modal';
import { dateKey } from '../utils/dates';
export function TodoForm({ subjects, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { text: '', date: dateKey(), subjectId: '' });
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  return <form onSubmit={e => { e.preventDefault(); if (form.text.trim()) onSave({ ...form, text: form.text.trim() }); }}>
    <label>할 일<input name="text" placeholder="무엇을 공부할까요?" value={form.text} onChange={change} required maxLength={1000} autoFocus /></label>
    <div className="form-grid"><label>날짜<input type="date" name="date" value={form.date} onChange={change} min="1900-01-01" max="9999-12-31" required /></label><label>관련 과목<select name="subjectId" value={form.subjectId} onChange={change}><option value="">과목 없음</option>{subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label></div>
    <div className="form-actions"><button type="button" className="btn" onClick={onClose}>취소</button><button className="btn primary" type="submit">{initial?.id ? '수정 저장' : 'Todo 추가'}</button></div>
  </form>;
}
export default function QuickAdd({ periods, period, onAdd }) {
  const [open, setOpen] = useState(false);
  const [periodId, setPeriodId] = useState('');
  const target = periods.find(p => p.id === periodId);
  return <><button className="floating-add" aria-label="빠른 Todo 추가" title="빠른 Todo 추가" onClick={() => { setPeriodId(period?.id || periods[0]?.id || ''); setOpen(true); }}><Plus size={25} /><span>빠른 추가</span></button>
    {open && <Modal title="빠른 Todo 추가" onClose={() => setOpen(false)}>{!periods.length ? <div className="empty small">먼저 시험기간을 만들어 주세요.</div> : <><label>시험기간<select value={periodId} onChange={e => setPeriodId(e.target.value)}>{periods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>{target && <TodoForm key={target.id} subjects={target.subjects} onClose={() => setOpen(false)} onSave={value => { onAdd(target.id, value); setOpen(false); }} />}</>}</Modal>}
  </>;
}
