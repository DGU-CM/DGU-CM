#!/usr/bin/env node
/**
 * 초기 데이터 입력용 변환기 — 엑셀에서 'CSV UTF-8'로 저장한 파일을 YAML 로 바꿉니다.
 *
 *   npm run import:csv -- 과제목록.csv projects     → src/data/projects.import.yaml 생성
 *   npm run import:csv -- 논문목록.csv publications → src/data/publications.import.yaml 생성
 *
 * CSV 첫 줄은 열 이름(id,title,title_en,client,start,end,area ...)이어야 합니다.
 * 생성된 파일 내용을 확인한 뒤 원래 파일(projects.yaml 등)에 붙여 넣으세요.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { stringify } from 'yaml';

const [file, kind = 'projects'] = process.argv.slice(2);
if (!file) {
  console.error('사용법: npm run import:csv -- <파일.csv> <projects|publications|people|courses>');
  process.exit(1);
}

function parseCSV(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((v) => v.trim()));
}

const [header, ...lines] = parseCSV(readFileSync(file, 'utf8'));
const keys = header.map((h) => h.trim());
const NUM = new Set(['start', 'end', 'year']);
const BOOL = new Set(['featured', 'show_name']);
const items = lines.map((cells, n) => {
  const o = {};
  keys.forEach((k, i) => {
    const v = (cells[i] ?? '').trim();
    if (!v) return;
    if (NUM.has(k)) o[k] = Number(v);
    else if (BOOL.has(k)) o[k] = /^(true|y|yes|1|o)$/i.test(v);
    else if (k === 'interests') o[k] = v.split(/[;|]/).map((s) => s.trim()).filter(Boolean);
    else o[k] = v;
  });
  if (!o.id) o.id = `${kind}-${String(n + 1).padStart(3, '0')}`;
  return o;
});

const out = `src/data/${kind}.import.yaml`;
writeFileSync(out, `# ${file} 에서 변환 (${items.length}건) — 확인 후 ${kind}.yaml 에 붙여 넣으세요\n` + stringify(items));
console.log(`✔ ${items.length}건 → ${out}`);
