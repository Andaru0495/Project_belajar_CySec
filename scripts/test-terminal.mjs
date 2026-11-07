#!/usr/bin/env node
/**
 * Terminal simulator smoke tests + challenge-pattern checks.
 * Skips cleanly when the terminal or content is not present yet.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const terminalPath = path.join(ROOT, 'assets/js/terminal.js');

if (!fs.existsSync(terminalPath)) {
  console.log('Terminal: assets/js/terminal.js belum ada — test dilewati.');
  process.exit(0);
}

const context = { window: {}, console };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(terminalPath, 'utf8'), context, { filename: 'assets/js/terminal.js' });

const CyberTerminal = context.window.CyberTerminal;
assert.ok(CyberTerminal, 'CyberTerminal tidak terdefinisi');
assert.equal(typeof CyberTerminal.VirtualShell, 'function', 'VirtualShell tidak tersedia');

const shell = new CyberTerminal.VirtualShell(CyberTerminal.createFS());
let assertions = 0;

function run(command) {
  return shell.run(command).output || '';
}

function expectIncludes(command, needle) {
  const output = run(command);
  assertions++;
  assert.ok(output.includes(needle), `"${command}" harus mengandung "${needle}". Output: ${output.slice(0, 200)}`);
}

function expectMatch(command, regex) {
  const output = run(command);
  assertions++;
  assert.match(output, regex, `"${command}" tidak cocok dengan ${regex}`);
}

assert.equal(run('pwd'), '/home/student');
assertions++;

expectIncludes('ls', 'README.md');
expectIncludes('ls -la', 'README.md');
expectIncludes('cat README.md', 'Selamat datang di LabSiber');
expectIncludes('whoami', 'student');
expectIncludes('id', 'uid=1000(student)');
expectIncludes('cd /etc', '');
expectIncludes('pwd', '/etc');
expectIncludes('cd /home/student', '');
expectIncludes('pwd', '/home/student');

expectIncludes('cat /etc/shadow', 'Permission denied');
expectIncludes('sudo cat /etc/shadow', 'root:$6$lab$');
expectIncludes('sudo ls -l /etc/shadow', '-rw-r-----');
expectMatch('ls -l /home/student/labs/web/backup.zip', /^-rw-------/);

expectIncludes('find /home/student -name "*.md"', '/home/student/README.md');
expectIncludes('find /home/student -name "*.md"', '/home/student/labs/notes.md');
expectIncludes('find /home/student -name "*.txt"', '/home/student/notes.txt');

expectIncludes('uname -a', 'Linux labsiber');
expectIncludes('lscpu', 'Virtualization:        VT-x');
expectIncludes('free -h', 'Mem:');
expectIncludes('df -h', '/dev/sda3');
expectIncludes('ip a', 'inet 10.0.2.15/24');
expectIncludes('history', 'pwd');
expectIncludes('tidak-ada-perintah-ini', 'command not found');

// Challenge patterns + solutions for ready modules (if content exists).
const moduleDir = path.join(ROOT, 'content/modules');
const indexPath = path.join(ROOT, 'content/module-index.js');
let challengeCount = 0;

if (fs.existsSync(moduleDir) && fs.existsSync(indexPath)) {
  vm.runInContext(fs.readFileSync(indexPath, 'utf8'), context, { filename: 'content/module-index.js' });
  const files = fs.readdirSync(moduleDir).filter((file) => file.endsWith('.js')).sort();
  for (const file of files) {
    vm.runInContext(
      fs.readFileSync(path.join(moduleDir, file), 'utf8'),
      context,
      { filename: `content/modules/${file}` }
    );
  }

  const index = context.window.CYBER_MODULE_INDEX?.modules || [];
  const modules = context.window.CYBER_MODULES || {};

  for (const meta of index) {
    if (meta.status !== 'ready') continue;
    const module = modules[meta.id];
    if (!module?.terminal?.challenges) continue;

    for (const challenge of module.terminal.challenges) {
      challengeCount++;
      assert.equal(typeof challenge.pattern, 'string', `${meta.id}/${challenge.id}: pattern harus string`);
      assert.equal(typeof challenge.solution, 'string', `${meta.id}/${challenge.id}: solution harus string`);
      const regex = new RegExp(challenge.pattern);
      assert.ok(
        regex.test(challenge.solution),
        `${meta.id}/${challenge.id}: pattern tidak cocok dengan solution "${challenge.solution}"`
      );

      const output = run(challenge.solution);
      assert.ok(
        !output.includes('command not found'),
        `${meta.id}/${challenge.id}: solusi memakai perintah yang belum didukung → ${challenge.solution}`
      );
    }
  }
}

console.log(`Terminal: ${assertions} assertion lulus, ${challengeCount} misi modul ready diperiksa.`);
