import { findCategory } from '../utils/categories';
import { ASSIGNMENT_ID } from '../utils/categories';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2, CalendarDays } from 'lucide-react';
import Calendar from '../components/Calendar';
import Modal from '../components/Modal';
import { dateKey, prettyDate } from '../utils/dates';
import { calendarEvents } from '../utils/model';
import { uid } from '../utils/storage';
const types = { exam: '시험', general: '일반 일정', study: '공부 일정' };
export default function CalendarPage({ period, updatePeriod, today = dateKey(), navigate }) {
  const [month, setMonth] = useState(() => new Date(`${today}T12:00:00`));
  const [selected, setSelected] = useState(today);
  const [form, setForm] = useState(null);
  const [subjectEvent, setSubjectEvent] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const events = calendarEvents(period);
  const items = events.filter(e => e.date === selected);
  const newEvent = () => setForm({ title: '', date: selected, type: 'study', subjectId: '' });
  const openEvent = e => e.fromSubject ? setSubjectEvent(e) : setForm(e);
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  return <><div className="page-heading"><div><div className="eyebrow">THE BIG PICTURE</div><h1>Calendar</h1><p>시험과 공부 일정을 한눈에 확인하세요.</p></div><button className="btn primary" onClick={newEvent}><Plus size={18}/>일정 추가</button></div>
    <section className="panel calendar-panel"><div className="panel-heading"><div className="month-controls"><h2>{month.getFullYear()}년 {month.getMonth() + 1}월</h2><button className="icon-btn" aria-label="이전 달" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={19}/></button><button className="icon-btn" aria-label="다음 달" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={19}/></button><button className="btn small" onClick={() => { setMonth(new Date(`${today}T12:00:00`)); setSelected(today); }}>오늘</button></div><div className="calendar-legend"><span>● 시험</span><span>◦ 공부</span><span className="muted">· 일반</span></div></div><Calendar month={month} events={events} subjects={period.subjects} selected={selected} onSelect={setSelected} onEvent={openEvent} today={today}/></section>
    <section className="panel day-agenda"><div className="panel-heading"><h2>{prettyDate(selected)} <span className="count-pill">{items.length}</span></h2><button className="text-btn" onClick={newEvent}><Plus size={16}/>이 날짜에 추가</button></div>{items.length ? items.map(e => <div className="agenda-row" key={e.id}><span className="subject-tag" style={{ '--subject': findCategory(period.subjects, e.subjectId)?.color || '#64748b' }}>{types[e.type]}</span><strong>{e.title}</strong>{e.fromSubject && <span className="muted auto-label">과목에서 자동 등록</span>}<div className="row-actions"><button className="icon-btn" aria-label={`${e.title} 수정`} onClick={() => openEvent(e)}><Pencil size={16}/></button>{!e.fromSubject && <button className="icon-btn danger-text" aria-label={`${e.title} 삭제`} onClick={() => setDeleting(e)}><Trash2 size={16}/></button>}</div></div>) : <div className="empty small"><CalendarDays size={24}/><span>등록된 일정이 없어요.</span></div>}</section>
    {form && <Modal title={form.id ? '일정 수정' : '일정 추가'} onClose={() => setForm(null)}><form onSubmit={e => { e.preventDefault(); if (!form.title.trim()) return; const value = { ...form, title: form.title.trim(), id: form.id || uid() }; updatePeriod(p => ({ ...p, events: form.id ? p.events.map(item => item.id === form.id ? value : item) : [...p.events, value] })); setSelected(form.date); setMonth(new Date(`${form.date}T12:00:00`)); setForm(null); }}><label>제목<input name="title" value={form.title} onChange={change} required maxLength={200} autoFocus/></label><div className="form-grid"><label>날짜<input name="date" type="date" value={form.date} onChange={change} min="1900-01-01" max="9999-12-31" required/></label><label>일정 종류<select name="type" value={form.type} onChange={change}>{Object.entries(types).map(([id, title]) => <option key={id} value={id}>{title}</option>)}</select></label></div><label>관련 과목<select name="subjectId" value={form.subjectId} onChange={change}><option value="">과목 없음</option><option value={ASSIGNMENT_ID}>과제</option>{period.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label><div className="form-actions"><button type="button" className="btn" onClick={() => setForm(null)}>취소</button><button className="btn primary">{form.id ? '수정 저장' : '일정 추가'}</button></div></form></Modal>}
    {subjectEvent && <Modal title={subjectEvent.title} onClose={() => setSubjectEvent(null)}><p>{prettyDate(subjectEvent.date)} · 과목의 시험 날짜가 자동으로 표시된 일정입니다.</p><p>시험 날짜 변경과 삭제는 Subjects에서 할 수 있어요.</p><div className="form-actions"><button className="btn" onClick={() => setSubjectEvent(null)}>닫기</button><button className="btn primary" onClick={() => navigate('subjects')}>과목 관리로 이동</button></div></Modal>}
    {deleting && <Modal title="일정을 삭제할까요?" onClose={() => setDeleting(null)}><p>{deleting.title}</p><div className="form-actions"><button className="btn" onClick={() => setDeleting(null)}>취소</button><button className="btn danger" onClick={() => { updatePeriod(p => ({ ...p, events: p.events.filter(e => e.id !== deleting.id) })); setDeleting(null); }}>삭제</button></div></Modal>}
  </>;
}
