/**
 * 사이트 기본 정보 — 연 1회 점검
 * 비어 있는 값('')은 화면에서 자동으로 숨겨집니다.
 */
export const SITE = {
  name: 'DGU CM Lab',
  nameKo: '건설관리 및 경영 연구실',
  nameEn: 'Construction Management Lab',
  university: '동국대학교',
  universityEn: 'Dongguk University',
  department: '건설환경공학과',
  departmentEn: 'Department of Civil & Environmental Engineering',
  slogan: ['건설산업의 규칙을 설계하고,', '현장의 미래를 관리합니다.'],
  sloganEn: 'Designing the Rules, Managing the Future of Construction',
  description:
    '동국대학교 건설환경공학과 건설관리 및 경영 연구실(CM Lab). 2006년부터 정부·공공기관·협회·학회와 50여 건의 연구를 수행하며 건설산업 정책·제도, 공사비·사업관리, 스마트건설을 연구합니다.',
  descriptionEn:
    'Construction Management Lab (DGU CM Lab), Dongguk University — 50+ research projects since 2006 with government ministries, public agencies, industry associations and academic societies, on construction policy, cost & project management and smart construction.',
  foundedYear: 2006,

  /** 전체 수행 과제 수 (홈·연구 페이지에 '50+'로 표시). projects.yaml 에는 주요 과제만 넣어도 됩니다. */
  projectsTotal: 50,

  location: '서울특별시 중구 필동로1길 30, 동국대학교 원흥관 F612호',
  locationShort: '원흥관 F612호',
  locationEn: 'Room F612, Wonheung-gwan, Dongguk University, 30 Pildong-ro 1-gil, Jung-gu, Seoul',

  // ─── TODO: 실제 값으로 채워 주세요 ──────────────────────────
  email: '', // 연구실 공용 메일 (예: cmlab@dongguk.edu)
  inquiryFormUrl: '', // Google Forms 문의 양식 주소
  scholarUrl: '', // 지도교수 Google Scholar 주소
  // ──────────────────────────────────────────────────────────
} as const;
