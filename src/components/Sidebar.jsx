import { BookOpen, LayoutDashboard, CalendarDays, Library, ListTodo, Settings, ChevronLeft, Check, AlertCircle } from 'lucide-react';
const links = [['dashboard', 'Dashboard', LayoutDashboard], ['calendar', 'Calendar', CalendarDays], ['subjects', 'Subjects', Library], ['todo', 'Todo', ListTodo], ['settings', 'Settings', Settings]];
export default function Sidebar({ page, navigate, period, periods, onSelect, saved }) {
  return <aside className="sidebar">
    <button className="brand" onClick={() => navigate('home')}><span className="brand-mark"><BookOpen size={23} /></span><span>exam<span className="brand-light">planner</span><small>MY STUDY SPACE</small></span></button>
    <button className="back-link" onClick={() => navigate('home')}><ChevronLeft size={16} /> 시험기간 목록</button>
    <div className="period-switch"><label htmlFor="period-switch">EXAM PERIOD</label><select id="period-switch" value={period?.id || ''} onChange={e => onSelect(e.target.value)}><option value="" disabled>시험기간 선택</option>{periods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>{period && <small>{period.startDate.replaceAll('-', '.')} — {period.endDate.slice(5).replace('-', '.')}</small>}</div>
    <nav aria-label="주 메뉴">{links.map(([id, label, Icon]) => <button key={id} disabled={!period && id !== 'settings'} className={page === id ? 'nav-item active' : 'nav-item'} aria-current={page === id ? 'page' : undefined} onClick={() => navigate(id)}><Icon size={19} />{label}{id === 'todo' && period && <span className="nav-count">{period.todos.filter(t => !t.done).length}</span>}</button>)}</nav>
    <div className="sidebar-bottom"><div className={saved ? 'save-status' : 'save-status error'}>{saved ? <Check size={16} /> : <AlertCircle size={16} />}{saved ? '이 브라우저에 자동 저장됨' : '자동 저장 확인 필요'}</div><small>하나씩, 오늘의 공부를 채워가요.</small></div>
  </aside>;
}
