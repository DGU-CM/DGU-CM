/**
 * 다국어 라우팅
 * - 영어(기본): /, /about, /research …
 * - 한국어:     /ko/, /ko/about, /ko/research …
 */
export type Lang = 'en' | 'ko';
export const LANGS: Lang[] = ['en', 'ko'];

/** 언어별 논리 경로 → 실제 경로 (base 미포함) */
export const localePath = (lang: Lang, path = '/') => {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (lang === 'en') return p;
  return p === '/' ? '/ko/' : `/ko${p}`;
};

/** 두 언어 중 하나를 고르는 짧은 헬퍼 */
export const pick = (lang: Lang) => (ko: string, en: string) => (lang === 'ko' ? ko : en);
