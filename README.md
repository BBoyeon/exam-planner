# Exam Planner

대학 시험기간에 사용하는 개인용 공부 플래너입니다. React + Vite + JavaScript로 만들었으며 서버와 로그인 없이 브라우저 localStorage에 저장합니다.

## VS Code에서 실행하기

1. Node.js 22.12 이상(또는 Node.js 24)을 설치합니다. https://nodejs.org/
2. ZIP 파일을 압축 해제합니다.
3. VS Code에서 **파일 → 폴더 열기 → exam-planner**를 선택합니다. `package.json`이 있는 폴더입니다.
4. VS Code의 **터미널 → 새 터미널**에서 실행합니다.

```bash
npm install
npm run dev
```

5. 터미널에 표시되는 `http://localhost:5173`을 브라우저에서 엽니다. 다른 프로그램이 해당 포트를 쓰고 있다면 터미널에 다른 포트가 표시됩니다.
6. `src` 안의 파일을 수정하고 저장하면 브라우저에 반영됩니다. 종료할 때는 터미널에서 `Ctrl + C`를 누릅니다.

설치한 Node.js 버전은 `node -v`로 확인합니다. Windows PowerShell에서 `npm.ps1` 실행 정책 오류가 나오면 VS Code 터미널을 **Command Prompt(명령 프롬프트)**로 바꾸거나 `npm.cmd install`, `npm.cmd run dev`를 사용하세요.

## 처음 사용하기

1. 첫 화면에서 **새 시험기간**을 만듭니다. 시작일/종료일은 공부 준비기간을 포함해 정해도 됩니다.
2. 시험기간의 **플래너 열기**를 누릅니다.
3. **Subjects → 과목 추가**에서 과목, 시험 날짜, 색상, 범위를 입력합니다. 과목 시험은 Calendar와 다가오는 시험 목록에 자동 반영됩니다.
4. **빠른 추가(+)**로 Todo를 작성합니다. 과목이 없어도 Todo를 추가할 수 있습니다.
5. **Dashboard**에서 오늘 날짜의 Todo와 완료 비율을 확인합니다.
6. **Todo**에서 날짜와 과목을 선택해 할 일을 관리합니다.
7. **Calendar**에서 날짜를 클릭하고 시험/공부/일반 일정을 추가합니다. 직접 등록한 시험 일정도 Dashboard에 나타납니다.

빈 첫 화면의 **예시 데이터로 먼저 둘러보기**를 누르면 3개 과목과 할 일이 들어간 별도 시험기간이 생성됩니다. 예시의 시험 날짜는 실행일을 기준으로 생성한 가상 날짜입니다. 실제 시간표가 아닙니다. 예시 기간은 목록에서 삭제할 수 있습니다.

## Todo 사용법

- 맨 왼쪽 작은 체크박스: 여러 Todo를 이동 대상으로 선택합니다.
- 완료 체크박스: 완료/미완료를 전환합니다.
- 점 모양 손잡이: 위아래로 드래그하여 정렬합니다. 터치 드래그도 지원합니다.
- 키보드 정렬: 손잡이에 Tab으로 이동 → Space → 방향키 → Space로 확정, Escape로 취소합니다. PC에서는 위/아래 버튼도 사용할 수 있습니다.
- **선택 n개 다음날로**: 선택한 Todo를 각 Todo의 날짜 기준 다음날로 이동합니다. 완료 상태는 유지합니다. 이동한 항목은 목적지 날짜 목록의 뒤에 추가됩니다.
- **오늘 미완료 Todo 모두 내일로 이동**: 현재 브라우저 날짜의 미완료 Todo 전체를 내일로 옮깁니다. Todo 페이지에서 다른 날짜나 과목을 보고 있어도 이 버튼은 **오늘 전체**를 대상으로 합니다.
- Subjects에서 과목 카드를 열면 범위 메모와 과목별 Todo를 볼 수 있습니다. 아래 날짜 버튼으로 할 일이 있는 날로 이동할 수 있습니다.

Dashboard의 '오늘 완료'는 **오늘 날짜에 배정된 Todo 중 현재 완료로 체크된 수**입니다. 완료 버튼을 누른 시각의 기록을 집계하는 기능은 아닙니다.

## 자동 저장 및 백업

모든 추가/수정/삭제/이동/정렬은 즉시 localStorage에 저장됩니다. 저장 키는 `exam-planner:v1`입니다. 새로고침하면 첫 화면으로 돌아오지만 모든 데이터는 유지됩니다.

- Settings → **백업 내보내기**: 모든 시험기간을 JSON 파일로 저장합니다.
- Settings → **백업 가져오기**: JSON의 형식, 날짜, ID, 과목 연결을 확인한 후 교체 확인창을 표시합니다. 기존 데이터와 합치는 방식이 아니라 **전체 교체**입니다. 확인창에서 기존 데이터를 먼저 백업할 수도 있습니다.
- Settings → **전체 초기화**: '초기화'를 입력하고 확인해야 삭제됩니다.
- 과목 삭제: 자동 생성 시험이 사라지고, 연결된 Todo와 직접 작성한 일정은 '과목 없음'으로 남습니다.
- 시험기간 삭제: 해당 기간의 과목/Todo/일정 전체가 삭제됩니다.
- 읽을 수 없는 저장 데이터는 자동으로 덮어쓰지 않습니다. Settings에서 저장 원본을 내려받거나 정상 백업을 복원할 수 있습니다.
- 저장 공간이나 권한 문제로 쓰기에 실패하면 상단에 오류를 표시합니다. 화면의 최신 내용을 JSON 백업으로 보관하세요.

localStorage는 **브라우저와 주소별 저장소**입니다. PC/모바일 간 자동 동기화는 없으며, localhost와 Vercel에서도 각각 따로 저장됩니다. 배포 주소로 옮길 때는 JSON 내보내기/가져오기를 이용하세요. 브라우저 기록/사이트 데이터를 지우거나 시크릿 모드를 종료하면 데이터가 없어질 수 있습니다. 정기적으로 백업하세요. 다른 탭의 저장은 반영하지만 여러 탭에서 동시에 편집하면 마지막 저장이 우선하므로 한 탭에서 사용하는 것을 권장합니다.

## Vercel 배포

이 프로젝트는 소스 전달용으로 준비되어 있으며 실제 Vercel 배포는 수행하지 않았습니다.

### GitHub 연결 방식

1. 프로젝트를 본인의 GitHub 저장소에 올립니다. `node_modules`와 `dist`는 `.gitignore`로 제외됩니다.
2. https://vercel.com/ 에 로그인하고 **Add New → Project**에서 저장소를 선택합니다.
3. 저장소 바로 아래에 `package.json`이 있으면 Root Directory는 기본값을 사용합니다. 상위 폴더 아래 `exam-planner`를 통째로 올렸다면 Root Directory를 `exam-planner`로 선택합니다.
4. Framework Preset: **Vite**, Build Command: `npm run build`, Output Directory: `dist`.
5. Node.js 버전은 프로젝트 요구 사항에 맞는 **22.12 이상 또는 24**를 사용하고 Deploy를 누릅니다.

`vercel.json`에 빌드 설정이 포함되어 있습니다. 별도의 서버, DB, 환경변수는 필요 없습니다. 화면 이동은 React state를 사용하므로 별도 SPA rewrite 설정도 필요 없습니다.

### CLI 방식

```bash
npm run build
npx vercel
# 미리보기 배포 확인 후 운영 배포
npx vercel --prod
```

화면에 표시되는 Vercel 로그인/프로젝트 안내에 따라 진행합니다.

공식 안내: https://vercel.com/docs/frameworks/frontend/vite
Vite 배포 안내: https://vite.dev/guide/static-deploy

로그인 기능이 없으므로 배포 URL 접근 제어를 앱 자체에서 하지는 않습니다. 다만 공부 데이터는 서버로 전송하지 않으며, 다른 방문자에게 내 브라우저의 데이터가 표시되지 않습니다.

## 구조와 수정 위치

```text
exam-planner/
├─ src/
│  ├─ components/
│  │  ├─ Sidebar.jsx       # 사이드 메뉴와 시험기간 전환
│  │  ├─ TodoItem.jsx      # Todo 한 줄, 정렬 손잡이
│  │  ├─ TodoList.jsx      # 선택, 이동, 정렬, 수정/삭제
│  │  ├─ Calendar.jsx      # 월간 달력 그리드
│  │  ├─ QuickAdd.jsx      # 모든 화면의 빠른 Todo 추가
│  │  └─ Modal.jsx         # 접근성 있는 공통 팝업
│  ├─ pages/
│  │  ├─ Home.jsx          # 시험기간 생성/수정/삭제
│  │  ├─ Dashboard.jsx     # 오늘 Todo와 다가오는 일정
│  │  ├─ Subjects.jsx      # 과목/범위/과목별 Todo
│  │  ├─ CalendarPage.jsx  # 일정 생성/수정/삭제
│  │  ├─ TodoPage.jsx      # 날짜별 Todo 화면
│  │  └─ Settings.jsx      # 백업, 복원, 초기화
│  ├─ utils/
│  │  ├─ storage.js        # 저장, 검증, 다운로드
│  │  ├─ dates.js          # 현지 날짜 및 D-Day 계산
│  │  ├─ model.js          # 정렬, 날짜 이동, 시험 일정 생성
│  │  └─ demo.js           # 선택적으로 불러오는 예시
│  ├─ App.jsx             # 전체 데이터 및 화면 연결
│  ├─ main.jsx            # React 시작점
│  └─ styles.css          # 색상, 레이아웃, 반응형 스타일
├─ tests/data.test.js     # 데이터 손상 및 날짜 경계 테스트
├─ index.html
├─ package.json
├─ package-lock.json
├─ vite.config.js
├─ vercel.json
└─ README.md
```

테마 색상은 `styles.css`의 `:root` 내 `--primary`를 바꾸세요. 과목 기본 색상은 `Subjects.jsx`의 `colors` 배열입니다. UI 구성은 각 페이지 컴포넌트에서 수정할 수 있습니다.

## 검증 명령

```bash
npm test        # 날짜 계산, 이동, 정렬, 백업 검증
npm run build   # 배포 파일 생성
npm run preview # 빌드 결과를 로컬에서 확인
```

백업 형식은 `{ version: 1, periods: [...] }`이고 각 period는 독립된 `subjects`, `events`, `todos` 배열을 가집니다. Todo 순서는 배열 순서로 저장합니다. 과목 시험은 일정 배열에 복제하지 않고 과목에서 계산하므로 날짜 수정 시 중복/불일치가 생기지 않습니다.
