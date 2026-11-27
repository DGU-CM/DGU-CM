# DGU CM Lab 홈페이지

동국대학교 건설환경공학과 **건설관리 및 경영 연구실** 홈페이지입니다.
Astro 정적 사이트 + GitHub Pages로 **서버 없이, 운영비 0원**으로 돌아갑니다.

- 콘텐츠 갱신(비개발자): [`docs/UPDATE_GUIDE.md`](docs/UPDATE_GUIDE.md)
- 데이터: `src/data/*.yaml` (과제·발주기관·논문·구성원·교과목·분기 하이라이트)
- 기본 정보(연락처, 전체 과제 수 `projectsTotal` 등): `src/site.config.ts`

## 언어

- **영어가 기본**입니다: `/`, `/about`, `/research`, `/publications`, `/people`, `/join`
- 한국어: `/ko/`, `/ko/about` … — 헤더의 `EN | KO` 스위치로 전환
- 방문자가 한국어를 한 번 고르면 브라우저에 기억해 두었다가 다음 방문 때 한국어 페이지로 안내합니다.
- 두 언어는 `src/views/*.astro` 한 파일에서 함께 관리합니다 (`t('한국어', 'English')`).

## 개발

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # dist/ 생성 (데이터 스키마 검사 포함)
npm run preview
```

Node 20 이상.

## 구조

```
src/
├─ data/              # ← 분기마다 고치는 곳 (YAML 6개)
├─ content.config.ts  # 데이터 스키마 (형식 오류 시 빌드 실패)
├─ site.config.ts     # 연구실 기본 정보·연락처
├─ assets/
│  └─ photos/         # 메인·연구 분야·주요 사례 사진, 연구실 사진
├─ components/        # Header, Footer, PageHero, ClientNetwork(발주기관), CareerMap(진로 지도) …
├─ views/             # 페이지 본문 (영어·한국어 공용)
├─ lib/               # 데이터 집계, i18n, 진로 분야(careers.ts), 이미지 헬퍼
├─ scripts/reveal.ts  # 스크롤 등장 효과
└─ pages/             # 영어(/) 페이지와 ko/ 한국어 페이지 — views 를 불러오기만 함
.github/workflows/
├─ deploy.yml         # push + 매월 1일 자동 빌드·배포
└─ quarterly.yml      # 3·6·9·12월 체크리스트 이슈 자동 생성
scripts/csv2yaml.mjs  # 초기 입력용 CSV → YAML 변환기
scripts/build-single-html.py  # 사이트 전체를 HTML 파일 1개로 묶기 (회의·공유용)
```

## HTML 파일 1개로 보기 (회의·공유용)

서버 없이 더블클릭으로 열리는 단일 HTML 파일을 만듭니다. 전 페이지(영문·국문), 사진, 글꼴이 파일 하나에 들어갑니다.

```bash
npm run build
python scripts/build-single-html.py . ../CM_Lab_홈페이지.html   # Python 3 + fonttools 필요 (pip install fonttools brotli)
```

## 배포 (GitHub Pages, 무료)

1. 연구실 GitHub **Organization**에 공개 저장소를 만들고 이 폴더를 올립니다.
2. 저장소 **Settings → Pages → Source: GitHub Actions** 선택.
3. `main` 에 push 하면 자동 배포됩니다.
4. 커스텀 도메인을 쓰면 `.github/workflows/deploy.yml` 의 `SITE_URL`·`BASE_PATH`(→ `/`)를 바꾸고, Settings → Pages 에서 도메인을 연결합니다.

## 이미지

- 교수 캐릭터와 가이드 기능(말풍선·손그림 펜 주석·헤더 토글)은 2026-11-27 결정으로 사이트에서 뺐습니다. 이전 컴포넌트와 포즈 이미지는 `../_source/removed-from-site/`에 보관되어 있습니다.
- 메인·연구 분야·주요 사례 사진: Codex로 생성한 실사풍 이미지(실제 현장 사진 아님). 실제 과제 사진이 생기면 같은 파일명으로 교체하세요.
- 빌드 시 Astro가 WebP 반응형 이미지로 자동 변환합니다.

## 오픈 전 확인 사항 (TODO)

- [ ] `src/site.config.ts` — 연구실 공용 메일(`email`), Google Forms 문의 주소(`inquiryFormUrl`), 교수 Google Scholar(`scholarUrl`) 입력 (비어 있으면 해당 버튼이 자동으로 숨겨짐)
- [ ] `src/site.config.ts` — `projectsTotal`(현재 50 → '50+' 표시)이 실제 수행 과제 수와 맞는지 확인
- [ ] `src/data/projects.yaml` — 주요 사례 6건의 `summary`·`summary_en` 문구 교수 감수 (초안), 필요하면 나머지 과제 추가 (현재 27건)
- [ ] `src/data/clients.yaml` — 발주기관 영문명·유형 분류 확인 (새 기관은 여기에 먼저 추가)
- [ ] `src/data/publications.yaml` — 학술논문·학위논문 입력 (현재 비어 있어 '정리 중' 안내가 표시됨)
- [ ] `src/data/people.yaml` — 영문 이름(`name_en`) 철자 본인 확인 (특히 유학생 진흔·소니아·퉤이), 관심 분야(`interests`/`interests_en`)
- [ ] `src/lib/careers.ts` — 진로 분야 문구 확인
- [ ] 교수 사진 사용에 대한 교수 본인 최종 확인
- [ ] GitHub Organization 생성 → 저장소 업로드 → Settings › Pages › Source: GitHub Actions
- [ ] (선택) 학과 서브도메인 신청 후 `deploy.yml` 의 `SITE_URL`·`BASE_PATH` 변경
