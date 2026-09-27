import { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';
// 기본 dialog는 포커스 이동 제한과 Escape 닫기를 브라우저가 처리합니다.
export default function Modal({ title, onClose, children }) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => { const dialog = ref.current; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={ref} aria-labelledby={titleId} onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose(); }}>
    <div className="modal-head"><h2 id={titleId}>{title}</h2><button className="icon-btn" aria-label="닫기" onClick={onClose}><X size={20} /></button></div>
    {children}
  </dialog>;
}
