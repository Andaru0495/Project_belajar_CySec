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
  const result = shell.run(command);
  return result.output || '';
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

// Navigation & identity
assert.equal(run('pwd'), '/home/student');
assertions++;
expectIncludes('ls', 'README.md');
expectIncludes('cat README.md', 'Selamat datang di LabSiber');
expectIncludes('whoami', 'student');
expectIncludes('id', 'uid=1000(student)');

// Permissions & sudo
expectIncludes('cat /etc/shadow', 'Permission denied');
expectIncludes('sudo cat /etc/shadow', 'root:$6$lab$');
expectIncludes('sudo ls -l /etc/shadow', '-rw-r-----');
expectIncludes('chmod 600 /home/student/labs/web/backup.zip', '');
expectMatch('ls -l /home/student/labs/web/backup.zip', /^-rw-------/);
expectIncludes('chmod 777 /etc/passwd', 'Operation not permitted');

// Pipes, grep, wc, awk, cut
expectIncludes('sudo tail -n 20 /var/log/auth.log', 'sshd');
expectIncludes('sudo grep "Failed password" /var/log/auth.log | wc -l', '');
const failed = Number(run('sudo grep "Failed password" /var/log/auth.log | wc -l'));
assertions++;
assert.ok(Number.isFinite(failed) && failed > 0, 'hitungan Failed password harus > 0');
expectIncludes('grep -c "4625" /home/student/labs/windows/security.log', '');
expectIncludes('grep "4672" /home/student/labs/windows/security.log', '4672');
expectIncludes('echo hello > /home/student/tmp.txt', '');
expectIncludes('cat /home/student/tmp.txt', 'hello');

// Network simulation
expectIncludes('ip a', 'inet 10.0.2.15/24');
expectIncludes('ip route', 'default via 10.0.2.2');
expectIncludes('ping -c 4 8.8.8.8', '0% packet loss');
expectIncludes('traceroute example.com', 'example.com');
expectIncludes('dig example.com', '93.184.216.34');
expectIncludes('nslookup example.com', '93.184.216.34');
expectIncludes('nmap -sV 10.10.10.5', '22/tcp');
expectIncludes('nmap -sV 10.10.10.5', '80/tcp');
expectIncludes('curl http://10.10.10.5', 'DVWA');
expectIncludes('whois example.com', 'EXAMPLE.COM');

// Local enumeration
expectIncludes('find /usr -perm -4000', '/usr/bin/passwd');
expectIncludes('sha256sum /home/student/labs/crypto/evidence.txt', '8f434346648f6b96');
expectIncludes('md5sum /home/student/labs/crypto/evidence.txt', '');
expectIncludes('sudo iptables -L', 'policy DROP');
expectIncludes('ufw status', 'Status: active');
expectIncludes('aws sts get-caller-identity', 'arn:aws:iam::123456789012:user/student');
expectIncludes('aws s3 ls', 'lab-public-assets');
expectIncludes('python3 --version', 'Python 3.');
expectIncludes('bash --version', 'GNU bash');
expectIncludes('history', 'pwd');

// Challenge patterns (if content exists)
const moduleDir = path.join(ROOT, 'content/modules');
let challengeCount = 0;

if (fs.existsSync(moduleDir)) {
  context.window.CYBER_MODULES = context.window.CYBER_MODULES || {};
  const files = fs.readdirSync(moduleDir).filter((f) => f.endsWith('.js')).sort();
  for (const file of files) {
    vm.runInContext(
      fs.readFileSync(path.join(moduleDir, file), 'utf8'),
      context,
      { filename: `content/modules/${file}` }
    );
  }

  for (const [moduleId, module] of Object.entries(context.window.CYBER_MODULES)) {
    const challenges = module?.terminal?.challenges || [];
    for (const challenge of challenges) {
      challengeCount++;
      assert.equal(typeof challenge.pattern, 'string', `${moduleId}/${challenge.id}: pattern harus string`);
      assert.equal(typeof challenge.solution, 'string', `${moduleId}/${challenge.id}: solution harus string`);
      const regex = new RegExp(challenge.pattern);
      assert.ok(
        regex.test(challenge.solution),
        `${moduleId}/${challenge.id}: pattern tidak cocok dengan solution "${challenge.solution}"`
      );
    }
  }
}

console.log(`Terminal: ${assertions} assertion lulus, ${challengeCount} pola misi diperiksa.`);
