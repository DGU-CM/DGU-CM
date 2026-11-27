/**
 * 데이터 스키마 — YAML 입력값을 빌드 시 검사합니다.
 * 형식이 틀리면 빌드가 실패하고, 사이트는 직전 버전 그대로 유지됩니다.
 */
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const year = z.number().int().min(1990).max(2100);
const summary = z.object({ problem: z.string(), approach: z.string(), outcome: z.string() });

const projects = defineCollection({
  loader: file('src/data/projects.yaml'),
  schema: z
    .object({
      id: z.string().regex(/^[a-z0-9-]+$/, 'id는 영문 소문자·숫자·하이픈만 사용할 수 있습니다'),
      title: z.string().min(2),
      title_en: z.string().optional(),
      client: z.string().min(1),
      start: year,
      end: year.nullable().optional(),
      area: z.enum(['policy', 'cost-pm', 'smart', 'global']),
      featured: z.boolean().optional().default(false),
      order: z.number().optional(),
      image: z.string().optional(),
      related: z.array(z.string()).optional(),
      summary: summary.optional(),
      summary_en: summary.optional(),
    })
    .refine((p) => p.end == null || p.end >= p.start, { message: 'end 연도는 start 연도보다 같거나 커야 합니다' })
    .refine((p) => !p.featured || p.summary, { message: 'featured: true 인 과제는 summary(problem·approach·outcome)가 필요합니다' }),
});

const people = defineCollection({
  loader: file('src/data/people.yaml'),
  schema: z
    .object({
      id: z.string(),
      name: z.string().optional(),
      name_en: z.string().optional(),
      role: z.enum(['prof', 'researcher', 'phd', 'ms', 'ug', 'alumni']),
      title: z.string().optional(),
      title_en: z.string().optional(),
      interests: z.array(z.string()).optional(),
      interests_en: z.array(z.string()).optional(),
      field: z.string().optional(),
      field_en: z.string().optional(),
      office: z.string().optional(),
      office_en: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      education: z.array(z.object({ ko: z.string(), en: z.string() })).optional(),
      teaching: z.array(z.object({ ko: z.string(), en: z.string() })).optional(),
      papers: z.array(z.string()).optional(),
      affiliation: z.string().optional(),
      sector: z.enum(['CM·엔지니어링', '건설사·산업체', '공공·군', '창업·교육', '연구·학계']).optional(),
      show_name: z.boolean().optional().default(false),
    })
    .refine((p) => p.role === 'alumni' || p.name, { message: '소속 연구원·교수는 name 이 필요합니다' })
    .refine((p) => p.role !== 'alumni' || p.sector, { message: '졸업생(alumni)은 sector 가 필요합니다' }),
});

const clients = defineCollection({
  loader: file('src/data/clients.yaml'),
  schema: z.object({
    id: z.string(),
    name_en: z.string(),
    short_en: z.string().optional(),
    type: z.enum(['gov', 'public', 'research', 'association', 'society', 'industry']),
  }),
});

const courses = defineCollection({
  loader: file('src/data/courses.yaml'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    name_en: z.string().optional(),
    track: z.enum(['control', 'business', 'digital']),
  }),
});

const updates = defineCollection({
  loader: file('src/data/updates.yaml'),
  schema: z.object({
    id: z.string(),
    quarter: z.string().regex(/^\d{4}-Q[1-4]$/, 'quarter 는 "2027-Q1" 형식이어야 합니다'),
    text: z.string(),
    text_en: z.string().optional(),
  }),
});

export const collections = { projects, people, clients, courses, updates };
