import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import TodoList from '../components/TodoList';
import { dateKey, addDays, prettyDate } from '../utils/dates';
import { moveTodos } from '../utils/model';
export default function TodoPage({ period, updatePeriod, notify, today = dateKey() }) {
  const [date, setDate] = useState(today);
  const [subject, setSubject] = useState('all');
  const incompleteToday = period.todos.filter(t => t.date === today && !t.done);
  const overdue = period.todos.filter(t => t.date < today && !t.done);
  return <><div className="page-heading"><div><div className="eyebrow">ONE TASK AT A TIME</div><h1>Daily Todo</h1><p>날짜별로 계획하고, 완료한 공부를 체크하세요.</p></div><button className="btn" disabled={!incompleteToday.length} onClick={() => { updatePeriod(p => ({ ...p, todos: moveTodos(p.todos, incompleteToday.map(t => t.id)) })); notify(`${incompleteToday.length}개의 Todo를 내일로 옮겼어요.`); }}>오늘 미완료 Todo 모두 내일로 이동 <ArrowRight size={16}/></button></div>
    <section className="panel"><div className="panel-heading todo-filters"><div className="date-controls"><button className="icon-btn" aria-label="이전 날" onClick={() => setDate(addDays(date, -1))}><ChevronLeft size={19}/></button><input type="date" aria-label="Todo 날짜" min="1900-01-01" max="9999-12-31" value={date} onChange={e => e.target.value && setDate(e.target.value)}/><button className="icon-btn" aria-label="다음 날" onClick={() => setDate(addDays(date, 1))}><ChevronRight size={19}/></button><button className="btn small" onClick={() => setDate(today)}>오늘</button></div><select aria-label="과목 필터" value={subject} onChange={e => setSubject(e.target.value)}><option value="all">전체 과목</option><option value="">과목 없음</option>{period.subjects.map(s => <option value={s.id} key={s.id}>{s.name}</option>)}</select></div><div className="daily-title"><h2>{prettyDate(date)} <span className="muted">{date === today ? '· 오늘' : ''}</span></h2></div><TodoList key={`${date}-${subject}`} period={period} updatePeriod={updatePeriod} date={date} subjectId={subject === 'all' ? undefined : subject} notify={notify}/></section>
    {overdue.length > 0 && <div className="overdue-note">이전 날짜에 미완료 Todo가 {overdue.length}개 있어요.<button className="text-btn" onClick={() => { setDate([...overdue].sort((a,b) => a.date.localeCompare(b.date))[0].date); setSubject('all'); }}>가장 오래된 날짜 보기 <ArrowRight size={15}/></button></div>}
  </>;
}
