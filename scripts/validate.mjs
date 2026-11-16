#!/usr/bin/env node
/**
 * LabSiber content & repository validator.
 * Runs locally and in CI. Exit code 1 means the PR must not merge.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const notes = [];

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const exists = (p) => fs.existsSync(path.join(ROOT, p));
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

function fail(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }
function note(msg) { notes.push(msg); }

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    if (['.git', 'node_modules', '.commandcode'].includes(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else out.push(p.split(path.sep).join('/'));
  }
  return out;
}

function trackedFiles() {
  try {
    const raw = execSync('git ls-files -z', { cwd: ROOT, encoding: 'buffer' });
    return raw.toString('utf8').split('\0').filter(Boolean);
  } catch {
    return walk('.');
  }
}

/* --------------------------------------------------------------------------
   Markdown links
   -------------------------------------------------------------------------- */

function checkMarkdownLinks() {
  const files = trackedFiles().filter((f) => f.endsWith('.md'));
  let checked = 0;

  for (const file of files) {
    if (!exists(file)) continue;
    let text = read(file);
    text = text.replace(/```[\s\S]*?```/g, '');
    text = text.replace(/`[^`]*`/g, '');

    for (const match of text.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      let target = match[1];
      if (!target || /^(https?:|mailto:|#)/.test(target)) {
        if (target.startsWith('http://')) warn(`${file}: link memakai http:// — ${target}`);
        continue;
      }
      try { target = decodeURIComponent(target); } catch { /* keep raw */ }
      target = target.split('#')[0].split('?')[0];
      if (!target) continue;

      const abs = target.startsWith('/')
        ? path.join(ROOT, target)
        : path.resolve(path.dirname(path.join(ROOT, file)), target);
      checked++;
      if (!fs.existsSync(abs)) fail(`${file}: link lokal tidak ditemukan → ${match[1]}`);
    }
  }
  note(`Markdown: ${files.length} file, ${checked} link lokal diperiksa.`);
}

/* --------------------------------------------------------------------------
   Content loading
   -------------------------------------------------------------------------- */

const sandbox = { window: {}, console, URL, RegExp };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

function loadContentScript(relativePath) {
  const code = read(relativePath);
  vm.runInContext(code, sandbox, { filename: relativePath });
}

const contentPresent =
  exists('content/roadmap.js') ||
  exists('content/module-index.js') ||
  exists('content/modules');

if (exists('content/roadmap.js')) loadContentScript('content/roadmap.js');
if (exists('content/module-index.js')) loadContentScript('content/module-index.js');

const moduleDir = path.join(ROOT, 'content/modules');
const moduleFiles = fs.existsSync(moduleDir)
  ? fs.readdirSync(moduleDir).filter((f) => f.endsWith('.js')).sort()
  : [];
for (const file of moduleFiles) loadContentScript(`content/modules/${file}`);

/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */

const KNOWN_BLOCKS = new Set(['sub', 'list', 'olist', 'code', 'table', 'note', 'tip', 'warn', 'danger', 'quote', 'hr']);
const CJK = /[\u3000-\u9fff]/;
const PLACEHOLDER = /\b(TODO|FIXME|lorem ipsum)\b/i;

function validateText(value, where, { allowEmpty = false } = {}) {
  if (typeof value !== 'string') {
    fail(`${where}: harus berupa string`);
    return false;
  }
  if (!allowEmpty && !value.trim()) {
    fail(`${where}: tidak boleh kosong`);
    return false;
  }
  if (PLACEHOLDER.test(value)) fail(`${where}: mengandung placeholder (TODO/FIXME/lorem)`);
  if (CJK.test(value)) fail(`${where}: mengandung karakter CJK tak sengaja`);
  for (const match of value.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const url = match[1];
    if (url.startsWith('http://')) fail(`${where}: link non-HTTPS (${url})`);
  }
  return true;
}

function validateBlocks(blocks, where) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    fail(`${where}: blocks harus array dan tidak kosong`);
    return;
  }
  blocks.forEach((block, index) => {
    const at = `${where} block[${index}]`;
    if (typeof block === 'string') {
      validateText(block, at);
      return;
    }
    if (!block || typeof block !== 'object') {
      fail(`${at}: tipe blok tidak dikenal`);
      return;
    }
    const keys = Object.keys(block).filter((key) => KNOWN_BLOCKS.has(key));
    if (keys.length === 0) {
      fail(`${at}: tidak punya tipe blok yang dikenal (${Object.keys(block).join(', ')})`);
      return;
    }
    if (keys.length > 1) warn(`${at}: punya beberapa tipe blok (${keys.join(', ')})`);
    const type = keys[0];
    const value = block[type];

    if (type === 'sub') validateText(value, at);
    if (['note', 'tip', 'warn', 'danger', 'quote'].includes(type)) validateText(value, at);
    if (type === 'list' || type === 'olist') {
      if (!Array.isArray(value) || value.length === 0) fail(`${at}: list harus array tidak kosong`);
      else value.forEach((item, i) => validateText(item, `${at}.item[${i}]`));
    }
    if (type === 'code') {
      if (!value || typeof value !== 'object' || typeof value.code !== 'string') fail(`${at}: code.code wajib string`);
      else if (!value.code.trim()) fail(`${at}: code.code kosong`);
    }
    if (type === 'table') {
      if (!value || !Array.isArray(value.head) || !Array.isArray(value.rows)) {
        fail(`${at}: table butuh head[] dan rows[]`);
      } else {
        value.head.forEach((h, i) => validateText(h, `${at}.head[${i}]`));
        value.rows.forEach((row, r) => {
          if (!Array.isArray(row) || row.length !== value.head.length) {
            fail(`${at}.row[${r}]: jumlah kolom tidak sama dengan head (${value.head.length})`);
          } else {
            row.forEach((cell, c) => validateText(cell, `${at}.row[${r}].col[${c}]`, { allowEmpty: true }));
          }
        });
      }
    }
    if (type === 'hr' && value !== true) warn(`${at}: hr sebaiknya true`);
  });
}

function validateQuiz(quiz, where) {
  if (!Array.isArray(quiz) || quiz.length === 0) {
    fail(`${where}: quiz harus array tidak kosong`);
    return;
  }
  if (quiz.length < 5) warn(`${where}: hanya ${quiz.length} soal kuis (target 6+)`);
  quiz.forEach((item, i) => {
    const at = `${where}.quiz[${i}]`;
    if (!item || typeof item !== 'object') return fail(`${at}: bukan object`);
    validateText(item.q, `${at}.q`);
    validateText(item.explain, `${at}.explain`);
    if (!Array.isArray(item.options) || item.options.length !== 4) {
      fail(`${at}: options harus tepat 4`);
    } else {
      item.options.forEach((opt, oi) => validateText(opt, `${at}.options[${oi}]`));
    }
    if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer > 3) {
      fail(`${at}: answer harus integer 0–3`);
    }
  });
}

function validateTerms(terms, where) {
  if (!Array.isArray(terms) || terms.length === 0) {
    fail(`${where}: terms harus array tidak kosong`);
    return;
  }
  terms.forEach((item, i) => {
    validateText(item?.term, `${where}.terms[${i}].term`);
    validateText(item?.def, `${where}.terms[${i}].def`);
  });
}

const terminalIds = new Set();

function validateTerminal(terminal, where) {
  if (terminal == null) return;
  if (typeof terminal !== 'object') return fail(`${where}.terminal: harus object`);
  validateText(terminal.intro, `${where}.terminal.intro`, { allowEmpty: true });
  if (!Array.isArray(terminal.challenges)) return fail(`${where}.terminal.challenges: harus array`);
  terminal.challenges.forEach((challenge, i) => {
    const at = `${where}.terminal.challenges[${i}]`;
    for (const field of ['id', 'task', 'hint', 'solution', 'explain', 'pattern']) {
      if (typeof challenge?.[field] !== 'string' || !challenge[field].trim()) {
        fail(`${at}.${field}: wajib string tidak kosong`);
      }
    }
    if (!challenge?.id) return;
    if (terminalIds.has(challenge.id)) fail(`${at}: id misi duplikat (${challenge.id})`);
    else terminalIds.add(challenge.id);

    if (challenge.pattern && challenge.solution) {
      try {
        const re = new RegExp(challenge.pattern);
        if (!re.test(challenge.solution)) fail(`${at}: pattern tidak cocok dengan solution`);
      } catch {
        fail(`${at}: pattern bukan regex valid`);
      }
    }
  });
}

function validateModule(module, key) {
  const where = `module(${key})`;
  if (!module || typeof module !== 'object') return fail(`${where}: bukan object`);
  if (module.id !== key) fail(`${where}: id (${module.id}) tidak sama dengan key`);
  for (const field of ['title', 'track', 'level', 'summary']) validateText(module[field], `${where}.${field}`);
  if (!Number.isInteger(module.order)) fail(`${where}.order: harus integer`);
  if (!Number.isInteger(module.duration) || module.duration <= 0) fail(`${where}.duration: harus integer > 0`);

  if (!Array.isArray(module.objectives) || module.objectives.length === 0) {
    fail(`${where}.objectives: harus array tidak kosong`);
  } else {
    module.objectives.forEach((objective, i) => validateText(objective, `${where}.objectives[${i}]`));
  }

  if (!Array.isArray(module.sections) || module.sections.length === 0) {
    fail(`${where}.sections: harus array tidak kosong`);
  } else {
    module.sections.forEach((section, i) => {
      validateText(section?.title, `${where}.sections[${i}].title`);
      validateBlocks(section?.blocks, `${where}.sections[${i}]`);
    });
  }

  validateTerms(module.terms, where);
  validateQuiz(module.quiz, where);
  validateTerminal(module.terminal, where);

  if (!module.lab || typeof module.lab !== 'object') {
    fail(`${where}.lab: wajib object`);
  } else {
    for (const field of ['title', 'goal', 'safety']) validateText(module.lab[field], `${where}.lab.${field}`);
    if (!Array.isArray(module.lab.steps) || module.lab.steps.length === 0) {
      fail(`${where}.lab.steps: wajib array tidak kosong`);
    } else {
      module.lab.steps.forEach((step, i) => {
        if (typeof step === 'string') validateText(step, `${where}.lab.steps[${i}]`);
        else validateText(step?.text, `${where}.lab.steps[${i}].text`);
      });
    }
    if (module.lab.challenge) validateText(module.lab.challenge, `${where}.lab.challenge`);
  }

  if (!Array.isArray(module.resources) || module.resources.length === 0) {
    fail(`${where}.resources: wajib array tidak kosong`);
  } else {
    module.resources.forEach((resource, i) => {
      validateText(resource?.label, `${where}.resources[${i}].label`);
      if (typeof resource?.url !== 'string' || !/^https:\/\//.test(resource.url)) {
        fail(`${where}.resources[${i}].url: wajib https://`);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   Content cross-checks
   -------------------------------------------------------------------------- */

function checkContent() {
  if (!contentPresent) {
    note('Content: belum ada file konten (branch dokumentasi) — validasi konten dilewati.');
    return;
  }

  const roadmap = sandbox.window.CYBER_ROADMAP;
  const index = sandbox.window.CYBER_MODULE_INDEX;
  const modules = sandbox.window.CYBER_MODULES || {};

  const indexIds = new Set();
  const readyIds = new Set();

  if (index) {
    if (!Array.isArray(index.modules) || index.modules.length === 0) {
      fail('module-index: modules harus array tidak kosong');
    } else {
      index.modules.forEach((entry, i) => {
        const at = `module-index.modules[${i}]`;
        for (const field of ['id', 'file', 'title', 'track', 'level', 'summary']) {
          validateText(entry?.[field], `${at}.${field}`);
        }
        if (!Number.isInteger(entry?.order)) fail(`${at}.order: harus integer`);
        if (!Number.isInteger(entry?.duration) || entry.duration <= 0) fail(`${at}.duration: harus integer > 0`);
        if (!['ready', 'planned'].includes(entry?.status)) fail(`${at}.status: harus "ready" atau "planned"`);

        if (entry?.id) {
          if (indexIds.has(entry.id)) fail(`${at}: id duplikat (${entry.id})`);
          indexIds.add(entry.id);
        }
        if (entry?.file && !entry.file.startsWith('content/modules/')) {
          fail(`${at}.file: harus di dalam content/modules/`);
        }
        if (entry?.status === 'ready') {
          readyIds.add(entry.id);
          if (!exists(entry.file)) fail(`${at}: status ready tetapi file ${entry.file} tidak ada`);
          if (!modules[entry.id]) fail(`${at}: status ready tetapi modul belum dimuat (${entry.id})`);
        }
      });
    }
  } else if (moduleFiles.length > 0) {
    warn('module-index.js tidak ada; metadata katalog tidak dapat divalidasi.');
  }

  for (const [key, module] of Object.entries(modules)) {
    validateModule(module, key);
    if (index && !indexIds.has(key)) warn(`module(${key}): tidak terdaftar di module-index`);
  }

  if (index && indexIds.size > 0) {
    if (readyIds.size < indexIds.size) {
      note(`Content: ${readyIds.size}/${indexIds.size} modul berstatus ready; sisanya planned.`);
    } else {
      note(`Content: ${readyIds.size}/${indexIds.size} modul ready.`);
    }
  }

  if (!roadmap) {
    warn('roadmap.js tidak ditemukan; peta roadmap tidak dapat divalidasi.');
    return;
  }

  if (!Array.isArray(roadmap.sections) || roadmap.sections.length === 0) {
    fail('roadmap: sections harus array tidak kosong');
    return;
  }

  const sectionIds = new Set();
  const nodeIds = new Set();
  let nodeCount = 0;

  roadmap.sections.forEach((section, si) => {
    const at = `roadmap.sections[${si}]`;
    validateText(section?.id, `${at}.id`);
    validateText(section?.title, `${at}.title`);
    if (section?.id) {
      if (sectionIds.has(section.id)) fail(`${at}: id bagian duplikat (${section.id})`);
      sectionIds.add(section.id);
    }
    if (!Array.isArray(section?.nodes) || section.nodes.length === 0) {
      fail(`${at}.nodes: harus array tidak kosong`);
      return;
    }
    section.nodes.forEach((node, ni) => {
      const nat = `${at}.nodes[${ni}]`;
      validateText(node?.id, `${nat}.id`);
      validateText(node?.title, `${nat}.title`);
      validateText(node?.desc, `${nat}.desc`);
      if (node?.id) {
        if (nodeIds.has(node.id)) fail(`${nat}: id node duplikat (${node.id})`);
        nodeIds.add(node.id);
      }
      nodeCount++;
      if (node?.module && !indexIds.has(node.module) && !modules[node.module]) {
        fail(`${nat}: module "${node.module}" tidak ada di index/modul`);
      }
    });
  });

  note(`Content: ${Object.keys(modules).length} modul dimuat, ${nodeCount} node roadmap, ${terminalIds.size} misi terminal.`);
}

function checkPWA() {
  const manifestPath = path.join(ROOT, 'manifest.webmanifest');
  if (!fs.existsSync(manifestPath)) return;

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch {
    fail('manifest.webmanifest: bukan JSON valid');
    return;
  }

  for (const field of ['name', 'short_name', 'start_url', 'scope', 'display']) {
    if (typeof manifest[field] !== 'string' || !manifest[field].trim()) {
      fail(`manifest.${field}: wajib string tidak kosong`);
    }
  }

  if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
    fail('manifest.icons: wajib array tidak kosong');
  } else {
    manifest.icons.forEach((icon, index) => {
      if (typeof icon?.src !== 'string' || !icon.src) {
        fail(`manifest.icons[${index}].src: wajib string`);
      } else if (!exists(icon.src)) {
        fail(`manifest.icons[${index}].src: file tidak ditemukan (${icon.src})`);
      }
      if (typeof icon?.sizes !== 'string' || !icon.sizes) fail(`manifest.icons[${index}].sizes: wajib`);
      if (typeof icon?.type !== 'string' || !icon.type) fail(`manifest.icons[${index}].type: wajib`);
    });
  }

  if (exists('sw.js')) {
    const sw = read('sw.js');
    if (!sw.includes('self.addEventListener')) fail('sw.js: tidak mendaftarkan event listener');
    if (!sw.includes('CACHE')) warn('sw.js: tidak tampak memakai cache');
  }

  note('PWA: manifest dan ikon valid.');
}

/* --------------------------------------------------------------------------
   Main
   -------------------------------------------------------------------------- */

checkMarkdownLinks();
checkPWA();
checkContent();

console.log('LabSiber validation');
console.log('===================');
for (const msg of notes) console.log('INFO  ' + msg);
for (const msg of warnings) console.log('WARN  ' + msg);
for (const msg of errors) console.log('ERROR ' + msg);

if (errors.length) {
  console.log(`\nFAILED: ${errors.length} error, ${warnings.length} warning.`);
  process.exitCode = 1;
} else {
  console.log(`\nOK: 0 error, ${warnings.length} warning.`);
}
