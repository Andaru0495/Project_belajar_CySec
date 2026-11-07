#!/usr/bin/env node
/**
 * Lightweight secret / credential scanner for a public repository.
 * This is not a replacement for GitHub secret scanning, but it catches
 * accidental commits early. Exit code 1 blocks auto-merge.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const SIGNATURES = [
  { name: 'AWS access key', re: /\bAKIA[0-9A-Z]{16}\b/g },
  { name: 'AWS secret access key', re: /\baws_secret_access_key\s*=\s*["'][A-Za-z0-9/+=]{40}["']/gi },
  { name: 'GitHub token', re: /\bgh[pousr]_[A-Za-z0-9_]{36,}\b/g },
  { name: 'GitHub fine-grained token', re: /\bgithub_pat_[A-Za-z0-9_]{22,}\b/g },
  { name: 'Private key block', re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g },
  { name: 'Slack token', re: /\bxox[baprs]-[0-9A-Za-z-]{10,}\b/g },
  { name: 'Google API key', re: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  { name: 'Stripe live secret', re: /\bsk_live_[0-9A-Za-z]{20,}\b/g },
  { name: 'npm token', re: /\bnpm_[A-Za-z0-9]{36}\b/g }
];

const FORBIDDEN_FILES = [
  /(^|\/)\.env(\.|$)/,
  /(^|\/)id_(rsa|dsa|ecdsa|ed25519)$/,
  /\.(pem|key|p12|pfx)$/i
];

const SKIP_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.pdf', '.zip', '.gz',
  '.woff', '.woff2', '.ttf', '.otf', '.mp4', '.webm', '.mp3', '.wav'
]);

function trackedFiles() {
  try {
    const raw = execSync('git ls-files -z', { cwd: ROOT, encoding: 'buffer' });
    return raw.toString('utf8').split('\0').filter(Boolean);
  } catch {
    return [];
  }
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    if (['.git', 'node_modules', '.commandcode'].includes(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else out.push(p.split(path.sep).join('/'));
  }
  return out;
}

const files = trackedFiles().length ? trackedFiles() : walk('.');
const findings = [];
let scanned = 0;

for (const file of files) {
  // The scanner contains detection patterns that would otherwise match itself.
  if (file === 'scripts/check-secrets.mjs') continue;

  for (const pattern of FORBIDDEN_FILES) {
    if (pattern.test(file)) findings.push({ file, line: 0, name: 'File kredensial tidak boleh di-commit' });
  }

  const ext = path.extname(file).toLowerCase();
  if (SKIP_EXTENSIONS.has(ext)) continue;

  const absolute = path.join(ROOT, file);
  if (!fs.existsSync(absolute)) continue;
  const stat = fs.statSync(absolute);
  if (!stat.isFile() || stat.size > 1024 * 1024) continue;

  let text;
  try { text = fs.readFileSync(absolute, 'utf8'); } catch { continue; }
  if (text.includes('\0')) continue;
  scanned++;

  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    for (const signature of SIGNATURES) {
      signature.re.lastIndex = 0;
      if (signature.re.test(lines[i])) {
        findings.push({ file, line: i + 1, name: signature.name });
      }
    }
  }
}

if (findings.length) {
  console.log('Secret scan: FAILED');
  for (const finding of findings) {
    console.log(`  ${finding.file}${finding.line ? ':' + finding.line : ''} — ${finding.name}`);
  }
  console.log('\nHapus kredensial, rotasi jika sudah ter-commit, lalu bersihkan history jika perlu.');
  process.exitCode = 1;
} else {
  console.log(`Secret scan: OK (${scanned} file teks diperiksa, 0 temuan).`);
}
