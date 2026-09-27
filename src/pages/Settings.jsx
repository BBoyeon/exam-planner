import { useRef, useState } from 'react';
import { Download, Upload, Trash2, Database, ShieldCheck } from 'lucide-react';
import Modal from '../components/Modal';
import { downloadJSON, emptyData, validateData, STORAGE_KEY } from '../utils/storage';
import { dateKey } from '../utils/dates';
export default function Settings({ data, replaceData, notify, storageError }) {
  const input = useRef(null);
  const [pending, setPending] = useState(null);
  const [reset, setReset] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const count = data.periods.reduce((n, p) => n + p.todos.length, 0);
  async function importFile(e) {
    const file = e.target.files[0]; e.target.value = ''; if (!file) return;
    setError('');
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error('10MB 이하의 JSON 파일을 선택해 주세요.');
      const value = validateData(JSON.parse(await file.text()));
      setPending(value);
    } catch (err) { setError(err instanceof SyntaxError ? 'JSON 형식이 올바르지 않습니다. 백업 파일을 다시 확인해 주세요.' : err.message); }
  }
  return <><div className="page-heading"><div><div className="eyebrow">KEEP YOUR PLANS SAFE</div><h1>Settings</h1><p>공부 기록을 백업하고 안전하게 보관하세요.</p></div></div>
    <div className="settings-stack"><section className="panel storage-summary"><span className="settings-icon"><Database size={24}/></span><div><h2>나의 공부 데이터</h2><p>시험기간 {data.periods.length}개 · 과목 {data.periods.reduce((n,p) => n + p.subjects.length, 0)}개 · Todo {count}개</p></div><span className="badge neutral">{(new Blob([JSON.stringify(data)]).size / 1024).toFixed(1)} KB</span></section>
    <section className="panel"><div className="panel-heading"><h2>Backup & Restore</h2><ShieldCheck size={20} className="muted"/></div><div className="settings-row"><div><h3>JSON 백업 내보내기</h3><p>모든 시험기간, 과목, 일정, Todo를 파일 하나로 저장합니다.</p></div><button className="btn primary" onClick={() => { downloadJSON(data, `exam-planner-backup-${dateKey()}.json`); notify('백업 파일 다운로드를 시작했어요.'); }}><Download size={17}/>백업 내보내기</button></div><div className="settings-row"><div><h3>JSON 백업 가져오기</h3><p>파일을 확인한 후 현재 데이터를 백업 내용으로 교체합니다.</p></div><input ref={input} type="file" accept=".json,application/json" className="sr-only" aria-label="백업 JSON 파일" onChange={importFile}/><button className="btn" onClick={() => input.current.click()}><Upload size={17}/>백업 가져오기</button></div>{error && <p role="alert" className="form-error">{error}</p>}{storageError && <div className="settings-row"><div><h3>브라우저 저장 원본 다운로드</h3><p>읽기 오류가 있는 원본도 변경하지 않고 내려받습니다.</p></div><button className="btn" onClick={() => { try { const raw = localStorage.getItem(STORAGE_KEY); if (raw === null) { setError('브라우저에 저장된 원본이 없습니다.'); return; } downloadJSON(raw, 'exam-planner-recovery.json'); } catch { setError('브라우저 저장소에 접근할 수 없습니다.'); } }}>원본 내려받기</button></div>}</section>
    <div className="info-note"><strong>이 브라우저에 자동 저장됩니다.</strong><p>브라우저 데이터를 삭제하면 기록도 삭제됩니다. PC와 모바일, 다른 브라우저, 개발 주소와 배포 주소는 서로 자동 동기화되지 않으니 JSON 백업으로 옮겨 주세요. 시크릿 모드에서는 브라우저를 닫으면 데이터가 사라질 수 있습니다.</p></div>
    <section className="panel danger-zone"><div className="settings-row"><div><h3>전체 데이터 초기화</h3><p>모든 시험기간과 공부 기록을 삭제합니다. 되돌릴 수 없습니다.</p></div><button className="btn danger-outline" onClick={() => { setConfirmation(''); setReset(true); }}><Trash2 size={17}/>전체 초기화</button></div></section></div>
    {pending && <Modal title="백업을 복원할까요?" onClose={() => setPending(null)}><p>백업에 시험기간 {pending.periods.length}개, Todo {pending.periods.reduce((n,p) => n + p.todos.length, 0)}개가 있습니다. 현재 데이터 전체가 교체됩니다.</p><button className="text-btn" onClick={() => downloadJSON(data, `exam-planner-before-restore-${dateKey()}.json`)}><Download size={16}/>교체 전에 현재 데이터 백업</button><div className="form-actions"><button className="btn" onClick={() => setPending(null)}>취소</button><button className="btn primary" onClick={() => { if (replaceData(pending)) { setPending(null); notify('백업을 복원했어요. 시험기간 목록에서 확인하세요.'); } }}>전체 데이터 교체</button></div></Modal>}
    {reset && <Modal title="모든 데이터를 삭제할까요?" onClose={() => setReset(false)}><p>삭제하려면 아래에 ‘초기화’를 입력하세요. 먼저 백업 파일을 보관하는 것을 권장합니다.</p><input aria-label="초기화 확인" value={confirmation} onChange={e => setConfirmation(e.target.value)} placeholder="초기화"/><div className="form-actions"><button className="btn" onClick={() => setReset(false)}>취소</button><button className="btn danger" disabled={confirmation !== '초기화'} onClick={() => { if (replaceData(emptyData())) { setReset(false); notify('모든 데이터를 초기화했어요.'); } }}>영구 삭제</button></div></Modal>}
  </>;
}
