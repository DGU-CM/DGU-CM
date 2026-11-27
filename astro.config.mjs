// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages 배포 주소 설정
//  · 학과 서브도메인 등 커스텀 도메인 사용 시: SITE_URL=https://cmlab.dongguk.edu , BASE_PATH=/
//  · github.io 프로젝트 주소 사용 시:        SITE_URL=https://<org>.github.io , BASE_PATH=/<저장소이름>
// 값은 .github/workflows/deploy.yml 의 env 에서 바꿉니다.
const site = process.env.SITE_URL || 'https://dgu-cm.github.io';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: { format: 'directory' },
  image: { responsiveStyles: false },
});
