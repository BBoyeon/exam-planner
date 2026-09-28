import { findCategory } from '../utils/categories';
import { dateKey } from '../utils/dates';
export default function Calendar({ month, events, subjects, selected, onSelect, onEvent, today }) {
  const year = month.getFullYear(), m = month.getMonth();
  const offset = new Date(year, m, 1).getDay();
  const days = new Date(year, m + 1, 0).getDate();
  const count = Math.ceil((offset + days) / 7) * 7;
  return <div className="calendar"><div className="weekdays">{['일', '월', '화', '수', '목', '금', '토'].map(d => <div key={d}>{d}</div>)}</div><div className="calendar-grid">{Array.from({ length: count }, (_, i) => {
    const date = new Date(year, m, i - offset + 1, 12); const key = dateKey(date); const items = events.filter(e => e.date === key);
    return <div key={key} className={`calendar-cell ${date.getMonth() !== m ? 'outside' : ''} ${key === selected ? 'selected-day' : ''} ${key === today ? 'is-today' : ''}`}><button className="day-button" aria-label={`${key} 일정 보기`} aria-pressed={key === selected} onClick={() => onSelect(key)}><span>{date.getDate()}</span>{key === today && <small>오늘</small>}</button><div className="cell-events">{items.slice(0, 3).map(e => { const color = findCategory(subjects, e.subjectId)?.color || (e.type === 'general' ? '#6b7280' : '#4057dc'); return <button key={e.id} title={e.title} className={`calendar-event ${e.type}`} style={{ '--subject': color }} onClick={() => { onSelect(key); onEvent(e); }}><span className="event-dot"/>{e.title}</button>; })}{items.length > 3 && <button className="more-events" onClick={() => onSelect(key)}>+{items.length - 3}개 더 보기</button>}</div><button className="cell-select" aria-label={`${key} 선택`} onClick={() => onSelect(key)}/></div>;
  })}</div></div>;
}
