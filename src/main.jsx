import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// 한글 폰트도 앱에 포함하여 외부 폰트 서버 없이 표시합니다.
import '@fontsource/noto-sans-kr/400.css';
import '@fontsource/noto-sans-kr/600.css';
import '@fontsource/noto-sans-kr/700.css';
import './styles.css';
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
