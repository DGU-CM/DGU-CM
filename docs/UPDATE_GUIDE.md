# 분기 업데이트 가이드 (비개발자용)

> 3·6·9·12월 1일, GitHub에 **[분기 업데이트] 체크리스트 이슈**가 자동으로 생깁니다.
> 아래 순서대로 하면 약 1~2시간이면 끝납니다. 코드를 몰라도 됩니다.

---

## 0. 시작 전에 알아 둘 것

- 고치는 파일은 **`src/data/` 폴더 안의 YAML 파일 6개뿐**입니다.
- 사이트는 **영어가 기본, 한국어는 `/ko/`** 입니다. YAML 한 곳만 고치면 두 언어에 함께 반영됩니다. 영문 항목(`title_en`, `summary_en`, `text_en`, `name_en`)을 같이 채워 주세요. 비어 있으면 영어 페이지에 한국어가 그대로 보입니다.
- 저장(Commit)하면 **약 2분 뒤** 사이트에 자동 반영됩니다.
- 입력 형식이 틀리면 **배포가 멈추고 사이트는 이전 상태 그대로** 유지됩니다. 사이트가 깨질 걱정은 없습니다.
- 이 저장소는 **공개 저장소**입니다. 연락처·동의서·주민번호 같은 개인정보는 절대 넣지 마세요.

## 1. GitHub 웹에서 파일 고치는 법

1. 저장소 페이지에서 `src/data/` 폴더를 엽니다.
2. 고칠 파일(예: `projects.yaml`)을 누르고, 오른쪽 위 **연필 아이콘(Edit this file)**을 누릅니다.
3. 내용을 고칩니다. **들여쓰기(맨 앞 공백 2칸)**를 기존 항목과 똑같이 맞추는 것이 가장 중요합니다.
4. 오른쪽 위 **Commit changes…** → 메시지에 `2027 Q1 과제 추가` 처럼 적고 **Commit changes**.
5. 저장소 위쪽 **Actions** 탭에서 진행 상황을 봅니다.
   - 초록색 체크 = 반영 완료
   - 빨간색 X = 형식 오류 → 눌러서 빨간 줄의 메시지를 확인하고 해당 부분을 고칩니다. (예: `end 연도는 start 연도보다 같거나 커야 합니다`)

## 2. 파일별로 할 일

### ① `projects.yaml` — 연구 과제 (매 분기)

새 과제는 맨 아래에 이렇게 추가합니다.

```yaml
- id: 2027-smart-safety          # 영문 소문자·숫자·하이픈. 다른 과제와 겹치면 안 됨
  title: 과제 제목
  title_en: English title         # (선택) 영문 페이지용
  client: 발주기관
  start: 2027
  area: smart                     # policy | cost-pm | smart | global
```

- 진행 중인 과제는 `end` 줄을 넣지 않습니다. 끝나면 `end: 2027` 을 추가합니다.
- `client` 는 `clients.yaml` 에 있는 기관명과 **똑같이** 적습니다. 처음 보는 기관이면 `clients.yaml` 에 먼저 한 줄 추가하세요 (없으면 빌드가 멈추고 어떤 기관이 빠졌는지 알려 줍니다).
- 홈페이지에는 전체 목록이 아니라 **주요 사례(6건 내외)**만 보입니다. 주요 사례로 올리려면 `featured: true`, `order`(순서), `summary`·`summary_en`(problem·approach·outcome), `image`, `related`(연계 과제 id)를 함께 넣습니다. 사진은 `src/assets/photos/`에 올린 뒤 `image: 파일명.jpg`.
- 홈 화면의 '50+' 숫자는 `src/site.config.ts` 의 `projectsTotal` 입니다. 과제가 많이 늘면 이 숫자를 올리세요.

### ①-2 `clients.yaml` — 발주·협력 기관 (새 기관이 생길 때)

```yaml
- { id: 한국도로공사, name_en: Korea Expressway Corporation, short_en: KEC, type: public }
```

- `type`: gov(정부부처) | public(공공기관) | research(연구기관·재단) | association(협회·단체) | society(학회) | industry(기업)
- 영문명에 쉼표(,)가 있으면 따옴표로 감쌉니다: `name_en: "Ministry of Land, Infrastructure and Transport"`

### ② `publications.yaml` — 논문 (매 분기)

```yaml
- id: 2027-kjcem-01
  type: journal                   # journal | thesis-phd | thesis-ms
  year: 2027
  title: 논문 제목
  authors: 홍길동, 김상범
  venue: 한국건설관리학회논문집
  doi: 10.0000/abcd               # (선택)
```

- 파일 맨 아래의 `[]` 는 "목록이 비어 있음"이라는 뜻입니다. **첫 논문을 넣을 때 `[]` 줄은 지우세요.**
- 연구보고서는 projects.yaml 에서 자동으로 만들어지므로 여기에 넣지 않습니다.

### ③ `people.yaml` — 구성원 (3월·9월)

- 신입생: `- { id: hong-gildong, name: 홍길동, name_en: Gildong Hong, role: ms }`
- 졸업생: 해당 줄을 지웁니다. 홈페이지에는 졸업생·취업 정보를 싣지 않습니다.

### ④ `updates.yaml` — 분기 하이라이트 (매 분기, 생략 가능)

```yaml
- id: 2027-q1-new-project
  quarter: 2027-Q1
  text: 한 줄 소식
```

- 홈 화면에는 **최근 두 분기 안의 항목만** 보이고 오래된 항목은 자동으로 숨겨집니다. 지우지 않아도 됩니다.
- 업데이트를 한 분기 놓쳐도 사이트는 정상입니다. 하이라이트 블록만 자동으로 사라집니다.

### ⑤ `courses.yaml` — 교과목 (교과 개편 시)

## 3. 연 1회 (12월) 점검

- `src/site.config.ts` — 공용 메일, Google Forms 주소, Google Scholar 주소
- `src/views/About.astro` — 주요 연혁 (`milestones` 목록, 국문·영문)
- `src/views/Join.astro` — FAQ, 인재상 (국문·영문)
- `src/lib/careers.ts` — CM 전공자 진로 분야 문구
- 저장소 소유자(Owner)가 2명 이상인지 (교수 + 담당 연구원)

## 4. 담당자 인수인계

담당 연구원이 졸업하기 전, 후임과 **분기 업데이트를 한 번 같이** 해 보세요. 이 문서와 자동 생성 이슈만 있으면 충분합니다.
