import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import Sidebar from './components/Sidebar';
import QuickAdd from './components/QuickAdd';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import CalendarPage from './pages/CalendarPage';
import TodoPage from './pages/TodoPage';
import Settings from './pages/Settings';
import { loadData, saveData, uid, STORAGE_KEY } from './utils/storage';
import { dateKey } from './utils/dates';

export default function App() {
  const [initial] = useState(loadData);
  const [data, setData] = useState(initial.data);
  const dataRef = useRef(initial.data);
  const [storageError, setStorageError] = useState(initial.error);
  const blocked = useRef(Boolean(initial.error));
  const [page, setPage] = useState('home');
  const [periodId, setPeriodId] = useState('');
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);
  const [today, setToday] = useState(dateKey());
  const period = data.periods.find(p => p.id === periodId);
  const notify = useCallback(message => { clearTimeout(toastTimer.current); setToast(message); toastTimer.current = setTimeout(() => setToast(''), 4000); }, []);

  // useEffect를 기다리지 않고 사용자 조작 직후 동기적으로 저장합니다.
  // 저장 실패 시에도 화면 데이터를 유지해서 JSON으로 백업할 수 있게 합니다.
  const update = useCallback(recipe => {
    if (blocked.current) { setStorageError(initial.error || '자동 저장이 중단되어 있습니다. 설정에서 백업을 복원해 주세요.'); return; }
    const next = recipe(dataRef.current);
    dataRef.current = next; setData(next);
    try { saveData(next); setStorageError(''); } catch { setStorageError('자동 저장에 실패했습니다. 브라우저 저장 공간과 권한을 확인하고 설정에서 JSON 백업을 내려받아 주세요.'); }
  }, [initial.error]);
  function replaceData(next) {
    try { saveData(next); } catch { setStorageError('데이터를 저장할 수 없어 교체하지 않았습니다. 브라우저 저장 공간과 권한을 확인해 주세요.'); return false; }
    blocked.current = false; dataRef.current = next; setData(next); setStorageError(''); setPeriodId(''); return true;
  }
  const navigate = next => { setPage(next); window.scrollTo({ top: 0 }); };
  const selectPeriod = id => { setPeriodId(id); navigate('dashboard'); };
  const updatePeriod = recipe => update(d => ({ ...d, periods: d.periods.map(p => p.id === periodId ? recipe(p) : p) }));
  function addTodo(id, value) {
    update(d => ({ ...d, periods: d.periods.map(p => p.id === id ? { ...p, todos: [...p.todos, { ...value, id: uid(), done: false }] } : p) }));
    if (!blocked.current) notify('Todo를 추가했어요.');
  }
  useEffect(() => {
    // 자정을 지나거나 다른 탭에서 수정해도 최신 날짜와 저장 내용을 반영합니다.
    const tick = () => setToday(dateKey());
    const timer = setInterval(tick, 30000);
    const sync = event => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      const loaded = loadData();
      if (loaded.error) { blocked.current = true; setStorageError(loaded.error); return; }
      blocked.current = false; dataRef.current = loaded.data; setData(loaded.data); setStorageError('');
    };
    window.addEventListener('focus', tick); window.addEventListener('storage', sync);
    return () => { clearInterval(timer); clearTimeout(toastTimer.current); window.removeEventListener('focus', tick); window.removeEventListener('storage', sync); };
  }, []);
  const shared = { period, updatePeriod, navigate, notify, today };
  const onHome = page === 'home' || (!period && page !== 'settings');
  return <>{storageError && <div className="error-banner" role="alert"><AlertCircle size={20}/><span>{storageError}</span><button onClick={() => navigate('settings')}>설정 열기</button></div>}
    {onHome ? <Home data={data} update={update} selectPeriod={selectPeriod} navigate={navigate}/> : <div className="app-shell"><Sidebar page={page} navigate={navigate} period={period} periods={data.periods} onSelect={selectPeriod} saved={!storageError}/><main className="main-content" id="main-content">{page === 'dashboard' && <Dashboard {...shared}/>} {page === 'subjects' && <Subjects key={periodId} {...shared}/>} {page === 'calendar' && <CalendarPage key={periodId} {...shared}/>} {page === 'todo' && <TodoPage key={periodId} {...shared}/>} {page === 'settings' && <Settings data={data} replaceData={replaceData} notify={notify} storageError={storageError}/>}<footer className="page-footer">MY EXAM PLANNER <span>오늘의 계획을, 나의 속도로.</span></footer></main></div>}
    <QuickAdd periods={data.periods} period={period} onAdd={addTodo}/>{toast && <div className="toast" role="status"><Check size={18}/>{toast}</div>}
  </>;
}
