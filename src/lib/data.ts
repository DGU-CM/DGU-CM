import { getCollection, type CollectionEntry } from 'astro:content';
import { execSync } from 'node:child_process';
import { SITE } from '../site.config';

export type Project = CollectionEntry<'projects'>['data'];
export type Person = CollectionEntry<'people'>['data'];
export type Course = CollectionEntry<'courses'>['data'];
export type Publication = CollectionEntry<'publications'>['data'];
export type Update = CollectionEntry<'updates'>['data'];
export type Client = CollectionEntry<'clients'>['data'];
export type Lang = 'en' | 'ko';
export type AreaKey = Project['area'];

export const NOW = new Date();
export const THIS_YEAR = NOW.getFullYear();

export const AREAS: Record<
  AreaKey,
  { ko: string; en: string; short: string; shortEn: string; color: string; blurb: string; blurbEn: string; illust: string; tags: string[]; tagsEn: string[] }
> = {
  policy: {
    ko: '건설산업 정책·제도',
    en: 'Construction Policy & Procurement',
    short: '정책·제도',
    shortEn: 'Policy',
    tags: ['입낙찰·발주제도', '업역 체계', '기술인력', '품질관리'],
    tagsEn: ['Procurement', 'Industry structure', 'Workforce', 'Quality'],
    color: '#1769AA',
    blurb: '입낙찰·발주제도, 업역 체계, 건설기술인력, 품질관리 등 건설산업이 움직이는 규칙을 연구하고 개선안을 설계합니다.',
    blurbEn: 'Procurement and bidding systems, industry structure, workforce and quality frameworks — the rules that run the industry.',
    illust: 'area-policy.jpg',
  },
  'cost-pm': {
    ko: '공사비·사업관리',
    en: 'Cost & Project Management',
    short: '공사비·사업관리',
    shortEn: 'Cost & PM',
    tags: ['공사비 산정', '적정 공사비', '메가프로젝트 CM', '국방사업'],
    tagsEn: ['Cost estimation', 'Adequate cost', 'Mega-project CM', 'Defense programs'],
    color: '#E0601A',
    blurb: '공사비 산정 모델과 적정 공사비 확보, 메가프로젝트·국방사업의 건설사업관리(CM) 체계를 연구합니다.',
    blurbEn: 'Cost estimation models, adequate construction costs, and CM systems for mega and defense projects.',
    illust: 'area-cost.jpg',
  },
  smart: {
    ko: '스마트건설·디지털',
    en: 'Smart & Digital Construction',
    short: '스마트건설',
    shortEn: 'Smart',
    tags: ['건설로봇', '드론·IoT', '블록체인', '재난 대응'],
    tagsEn: ['Robotics', 'Drones & IoT', 'Blockchain', 'Resilience'],
    color: '#11977A',
    blurb: '드론·IoT 안전관리, 블록체인 건설거래, 건설작업로봇 통합관리 등 기술로 현장을 바꾸는 방법을 찾습니다.',
    blurbEn: 'Drone/IoT safety management, blockchain marketplaces and integrated management of construction robots.',
    illust: 'area-smart.jpg',
  },
  global: {
    ko: '글로벌 건설시장',
    en: 'Global Construction Market',
    short: '글로벌 시장',
    shortEn: 'Global',
    tags: ['해외시장 진출', '핵심역량', '해외 발주제도', '그린에너지'],
    tagsEn: ['Market entry', 'Core competency', 'Global procurement', 'Green energy'],
    color: '#8A5CC9',
    blurb: '해외 건설·엔지니어링 시장 진출 전략과 핵심역량, 해외 발주제도를 분석합니다.',
    blurbEn: 'Market-entry strategies, core competencies and overseas procurement systems.',
    illust: 'area-global.jpg',
  },
};
export const AREA_ORDER: AreaKey[] = ['policy', 'cost-pm', 'smart', 'global'];

export const personName = (p: Person, lang: Lang) => (lang === 'ko' ? p.name : p.name_en ?? p.name) ?? '';

export const ROLE_LABEL: Record<Person['role'], { ko: string; en: string; order: number }> = {
  prof: { ko: '지도교수', en: 'Professor', order: 0 },
  researcher: { ko: '전문연구원', en: 'Research Fellow', order: 1 },
  phd: { ko: '박사과정', en: 'Ph.D. Student', order: 2 },
  ms: { ko: '석사과정', en: 'M.S. Student', order: 3 },
  ug: { ko: '학부연구생', en: 'Undergraduate Researcher', order: 4 },
  alumni: { ko: '졸업생', en: 'Alumni', order: 5 },
};

export const TRACKS: Record<Course['track'], { ko: string; en: string }> = {
  control: { ko: '관리기술', en: 'Project Control' },
  business: { ko: '경영·전략', en: 'Business & Strategy' },
  digital: { ko: '데이터·디지털', en: 'Data & Digital' },
};

const data = <T>(arr: { data: T }[]) => arr.map((e) => e.data);

export async function getProjects() {
  const list = data(await getCollection('projects'));
  return list.sort((a, b) => b.start - a.start || (b.end ?? 9999) - (a.end ?? 9999) || a.title.localeCompare(b.title, 'ko'));
}
export async function getPeople() {
  return data(await getCollection('people'));
}
export async function getCourses() {
  return data(await getCollection('courses'));
}
export async function getClients() {
  return data(await getCollection('clients'));
}

/** 주요 사례 (order 순) */
export async function getFeatured() {
  return (await getProjects()).filter((p) => p.featured).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export const CLIENT_TYPES: Record<Client['type'], { ko: string; en: string; order: number }> = {
  gov: { ko: '정부부처', en: 'Government Ministries', order: 0 },
  public: { ko: '공공기관', en: 'Public Agencies', order: 1 },
  research: { ko: '연구기관·재단', en: 'Research Institutes & Foundations', order: 2 },
  association: { ko: '협회·단체', en: 'Industry Associations', order: 3 },
  society: { ko: '학회', en: 'Academic Societies', order: 4 },
  industry: { ko: '기업', en: 'Industry', order: 5 },
};

/** 발주기관을 유형별로 묶고, projects.yaml 의 client 가 clients.yaml 에 모두 있는지 검사 */
export async function getClientGroups() {
  const [projects, clients] = await Promise.all([getProjects(), getClients()]);
  const known = new Set(clients.map((c) => c.id));
  const missing = [...new Set(projects.map((p) => p.client))].filter((c) => !known.has(c));
  if (missing.length) {
    throw new Error(`clients.yaml 에 없는 발주기관이 있습니다: ${missing.join(', ')} — src/data/clients.yaml 에 추가하세요.`);
  }
  const count = (id: string) => projects.filter((p) => p.client === id).length;
  return (Object.keys(CLIENT_TYPES) as Client['type'][])
    .sort((a, b) => CLIENT_TYPES[a].order - CLIENT_TYPES[b].order)
    .map((type) => ({
      type,
      ...CLIENT_TYPES[type],
      list: clients.filter((c) => c.type === type).map((c) => ({ ...c, n: count(c.id) })),
    }))
    .filter((g) => g.list.length > 0);
}

export async function clientNamer() {
  const clients = await getClients();
  const map = new Map(clients.map((c) => [c.id, c]));
  return (name: string, lang: Lang) => (lang === 'ko' ? name : map.get(name)?.name_en ?? name);
}

export async function getPublications() {
  return data(await getCollection('publications')).sort((a, b) => b.year - a.year);
}

export const isOngoing = (p: Project) => p.end == null;
export const endYear = (p: Project) => p.end ?? THIS_YEAR;
export const period = (p: Project, lang: Lang = 'ko') =>
  p.end == null
    ? `${p.start} – ${lang === 'ko' ? '진행 중' : 'present'}`
    : p.end === p.start
      ? `${p.start}`
      : `${p.start} – ${p.end}`;
export const periodEn = (p: Project) =>
  p.end == null ? `${p.start} – present` : p.end === p.start ? `${p.start}` : `${p.start} – ${p.end}`;

/* ── 분기 계산 ─────────────────────────────── */
export const quarterOf = (d: Date) => ({ y: d.getFullYear(), q: Math.floor(d.getMonth() / 3) + 1 });
const qIndex = (y: number, q: number) => y * 4 + (q - 1);
export const parseQuarter = (s: string) => {
  const [y, q] = s.split('-Q').map(Number);
  return { y, q };
};
export const quarterLabel = (s: string) => {
  const { y, q } = parseQuarter(s);
  return `${y} Q${q}`;
};

/** 최근 두 분기(이번 분기 포함) 안의 하이라이트만 반환 — 오래되면 자동으로 숨김 */
export async function getActiveUpdates() {
  const all = data(await getCollection('updates'));
  const now = quarterOf(NOW);
  const nowIdx = qIndex(now.y, now.q);
  return all
    .filter((u) => {
      const { y, q } = parseQuarter(u.quarter);
      const diff = nowIdx - qIndex(y, q);
      return diff >= 0 && diff <= 1;
    })
    .sort((a, b) => b.quarter.localeCompare(a.quarter));
}

/** 데이터 폴더의 마지막 수정 시점(git) → "2027 Q1". git 정보가 없으면 빌드 시점 */
export const LAST_UPDATED = (() => {
  let d = NOW;
  try {
    const iso = execSync('git log -1 --format=%cI -- src/data', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    if (iso) d = new Date(iso);
  } catch {
    /* git 없음 */
  }
  const { y, q } = quarterOf(d);
  return `${y} Q${q}`;
})();

/* ── 자동 집계 ─────────────────────────────── */
export async function getStats() {
  const [projects, people] = await Promise.all([getProjects(), getPeople()]);
  const first = Math.min(SITE.foundedYear, ...projects.map((p) => p.start));
  const clients = await getClients();
  return {
    years: THIS_YEAR - first,
    firstYear: first,
    /** 홈페이지에 표시하는 전체 과제 수 (예: 50) */
    projectsTotal: Math.max(SITE.projectsTotal, projects.length),
    projects: projects.length,
    ongoing: projects.filter(isOngoing).length,
    clients: Math.max(clients.length, new Set(projects.map((p) => p.client)).size),
    alumni: people.filter((p) => p.role === 'alumni').length,
    members: people.filter((p) => !['prof', 'alumni'].includes(p.role)).length,
    areas: AREA_ORDER.length,
  };
}

export function countBy<T>(list: T[], key: (t: T) => string) {
  const m = new Map<string, number>();
  for (const t of list) m.set(key(t), (m.get(key(t)) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ko'));
}

/** base 경로를 붙인 내부 링크 */
export const url = (path = '') => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}` || '/';
};
