/**
 * Career paths for construction management (CM) graduates — shown on Home and People.
 */
export type CareerPath = {
  key: string;
  icon: string;
  ko: string;
  en: string;
  roleKo: string;
  roleEn: string;
  whereKo: string;
  whereEn: string;
};

export const CAREER_PATHS: CareerPath[] = [
  {
    key: 'cm',
    icon: 'compass',
    ko: 'CM·엔지니어링사',
    en: 'CM & Engineering Firms',
    roleKo: '건설사업관리(CM)·감리, 사업비·공정 관리, 발주자 대행으로 프로젝트 전체를 이끕니다.',
    roleEn: 'Lead whole projects as construction managers — cost, schedule and owner representation.',
    whereKo: '종합 CM사 · 설계·엔지니어링사 · 감리전문회사',
    whereEn: 'CM firms · Design & engineering firms · Supervision firms',
  },
  {
    key: 'contractor',
    icon: 'crane',
    ko: '건설사·디벨로퍼',
    en: 'Contractors & Developers',
    roleKo: '공무·원가·공정관리, 사업개발과 해외 EPC 프로젝트 관리를 맡습니다.',
    roleEn: 'Run project controls, cost and scheduling, business development and overseas EPC projects.',
    whereKo: '종합건설사 · 디벨로퍼·시행사 · 건설 관련 산업체',
    whereEn: 'General contractors · Developers · Construction industry companies',
  },
  {
    key: 'public',
    icon: 'building',
    ko: '공공기관·공기업·공무원',
    en: 'Public Sector',
    roleKo: '발주자로서 국가 인프라 사업을 기획·발주·관리하고 제도를 운영합니다.',
    roleEn: 'Plan, procure and manage national infrastructure as the owner — and run the rules.',
    whereKo: '인프라·주택 공기업 · 조달 기관 · 기술직 공무원 · 군 시설 조직',
    whereEn: 'Infrastructure & housing corporations · Procurement agencies · Civil service · Military facilities',
  },
  {
    key: 'research',
    icon: 'scholar',
    ko: '국책연구기관·학계',
    en: 'Research & Academia',
    roleKo: '건설정책과 산업을 연구하는 연구원, 박사 후 교수로 진출합니다.',
    roleEn: 'Become a policy researcher at a national institute, or a professor after the Ph.D.',
    whereKo: '건설·국토 분야 국책연구기관 · 산업 연구원 · 대학',
    whereEn: 'National research institutes · Industry think tanks · Universities',
  },
  {
    key: 'finance',
    icon: 'chart',
    ko: '금융·부동산·투자',
    en: 'Finance & Real Estate',
    roleKo: '프로젝트 파이낸싱(PF), 인프라 투자, 개발사업 타당성·리스크 분석을 담당합니다.',
    roleEn: 'Work on project finance, infrastructure investment and feasibility & risk analysis.',
    whereKo: '은행·증권 PF 부서 · 인프라 펀드 · 자산운용사 · 부동산 컨설팅',
    whereEn: 'Bank & securities PF teams · Infrastructure funds · Asset managers · Real estate advisory',
  },
  {
    key: 'claims',
    icon: 'scale',
    ko: '컨설팅·클레임·분쟁',
    en: 'Consulting, Claims & Disputes',
    roleKo: '공사비 검증, 클레임·분쟁 해결, 경영 컨설팅으로 전문성을 발휘합니다.',
    roleEn: 'Apply expertise in cost verification, claims and dispute resolution, and management consulting.',
    whereKo: '건설 컨설팅사 · 클레임·감정 전문사 · 회계·법무 법인 건설 자문팀',
    whereEn: 'Construction consultancies · Claims & expert-witness firms · Advisory teams at accounting/law firms',
  },
  {
    key: 'tech',
    icon: 'spark',
    ko: '스마트건설·창업·교육',
    en: 'ConTech, Startups & Education',
    roleKo: 'BIM·데이터·로봇 기반 건설기술 기업에서 일하거나 직접 창업하고, 교육 분야로도 진출합니다.',
    roleEn: 'Join construction-tech companies (BIM, data, robotics), start your own venture, or teach.',
    whereKo: '콘테크·프롭테크 기업 · 창업 · 교육기관',
    whereEn: 'ConTech & PropTech companies · Own startups · Education',
  },
  {
    key: 'global',
    icon: 'globe',
    ko: '해외건설·국제기구',
    en: 'Global & International',
    roleKo: '해외 인프라 프로젝트 관리와 국제개발 사업의 조달·사업관리에 참여합니다.',
    roleEn: 'Manage overseas infrastructure projects and procurement for international development programs.',
    whereKo: '해외건설 기업 · 국제개발 협력기관 · 다자개발은행(MDB) 관련 사업',
    whereEn: 'Overseas contractors · Development cooperation agencies · Multilateral development bank programs',
  },
];
