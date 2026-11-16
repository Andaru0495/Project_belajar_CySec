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

function expectNotIncludes(command, needle) {
  const output = run(command);
  assertions++;
  assert.ok(!output.includes(needle), `"${command}" tidak boleh mengandung "${needle}". Output: ${output.slice(0, 200)}`);
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

/* --------------------------------------------------------------------------
   Network commands (T-026). Simulation only: no sockets, no real targets.
   -------------------------------------------------------------------------- */

expectIncludes('help', 'ip route');
expectIncludes('help', 'ping -c 4 <host>');
expectIncludes('help', 'traceroute <host>');
expectIncludes('help', 'ss -tulpn');
expectIncludes('help', 'netstat -tulpn');
expectIncludes('help', 'dig <domain>');
expectIncludes('help', 'nslookup <domain>');
expectIncludes('help', 'curl [-i] <url>');
expectIncludes('help', 'nmap [-sV] <host>');
expectIncludes('help', 'ufw status');
expectIncludes('help', 'sudo iptables -L');

// ip route / ip r
expectIncludes('ip route', 'default via 10.0.2.2 dev eth0');
expectIncludes('ip route', '10.0.2.0/24 dev eth0');
expectIncludes('ip r', 'default via 10.0.2.2 dev eth0');
expectIncludes('ip route show table local', 'local 127.0.0.1 dev lo');

// ping
expectIncludes('ping -c 4 8.8.8.8', 'PING 8.8.8.8 (8.8.8.8)');
expectIncludes('ping -c 4 8.8.8.8', '4 packets transmitted, 4 received, 0% packet loss');
expectIncludes('ping -c 4 8.8.8.8', 'ttl=117');
expectIncludes('ping -c 4 10.10.10.5', '4 packets transmitted, 4 received, 0% packet loss');
expectIncludes('ping -c 4 10.10.10.5', 'ttl=64');
expectIncludes('ping -c 4 127.0.0.1', '0% packet loss');
expectIncludes('ping -c 2 8.8.8.8', '2 packets transmitted, 2 received');
expectIncludes('ping -c 4 10.0.2.99', '100% packet loss');
expectIncludes('ping nope.example', 'Name or service not known');
expectIncludes('ping', 'Destination address required');

// traceroute
expectIncludes('traceroute example.com', 'traceroute to example.com (93.184.216.34), 30 hops max');
expectMatch('traceroute example.com', /7\s+example\.com \(93\.184\.216\.34\)/);
expectIncludes('traceroute 8.8.8.8', 'dns.google (8.8.8.8)');
expectIncludes('traceroute 10.10.10.5', 'target.lab (10.10.10.5)');
expectIncludes('traceroute nope.example', 'Name or service not known');
expectIncludes('traceroute', 'missing host');

// ss / netstat: listening ports in the lab VM
expectIncludes('ss -tulpn', 'LISTEN');
for (const port of ['22', '631', '3306', '8080', '68']) {
  expectIncludes('ss -tulpn', `:${port}`);
}
expectIncludes('ss -tulpn', 'users:(("sshd"');
expectIncludes('ss -tuln', 'LISTEN');
expectNotIncludes('ss -tuln', 'users:((');

expectIncludes('netstat -tulpn', 'Active Internet connections (only servers)');
for (const port of ['22', '631', '3306', '8080', '68']) {
  expectIncludes('netstat -tulpn', `:${port}`);
}
expectIncludes('netstat -tulpn', '901/sshd');

// dig / nslookup: A record for example.com
expectIncludes('dig example.com', ';; QUESTION SECTION:');
expectIncludes('dig example.com', ';; ANSWER SECTION:');
expectIncludes('dig example.com', 'status: NOERROR');
expectIncludes('dig example.com', '93.184.216.34');
expectIncludes('dig +short example.com', '93.184.216.34');
expectIncludes('dig nope.example', 'NXDOMAIN');
expectMatch('dig', /usage: dig/);

expectIncludes('nslookup example.com', 'Server:');
expectIncludes('nslookup example.com', 'Non-authoritative answer:');
expectIncludes('nslookup example.com', '93.184.216.34');
expectIncludes('nslookup nope.example', 'NXDOMAIN');
expectMatch('nslookup', /usage: nslookup/);

// curl: body by default, headers with -i (like the real tool)
expectIncludes('curl http://10.10.10.5', 'Damn Vulnerable Web Application');
expectIncludes('curl http://10.10.10.5/', 'Damn Vulnerable Web Application');
expectNotIncludes('curl http://10.10.10.5', 'HTTP/1.1 200 OK');
expectIncludes('curl -i http://10.10.10.5', 'HTTP/1.1 200 OK');
expectIncludes('curl -i http://10.10.10.5', 'Server: Apache/2.4.41 (Ubuntu)');
expectIncludes('curl http://example.com', 'Example Domain');
expectIncludes('curl http://localhost:8080', 'LabSiber local service');
expectIncludes('curl http://127.0.0.1', 'Connection refused');
expectIncludes('curl http://nope.example', 'Could not resolve host');

// nmap
expectIncludes('nmap -sV 10.10.10.5', 'Nmap scan report for 10.10.10.5');
for (const port of ['22/tcp', '80/tcp', '3306/tcp', '8080/tcp']) {
  expectIncludes('nmap -sV 10.10.10.5', port);
}
expectIncludes('nmap -sV 10.10.10.5', 'OpenSSH');
expectIncludes('nmap -sV 10.10.10.5', 'Apache httpd');
expectIncludes('nmap -sV 10.10.10.5', 'MySQL');
expectIncludes('nmap -sV 10.10.10.5', 'http-proxy');
expectIncludes('nmap 192.168.1.1', '53/tcp');
expectIncludes('nmap 192.168.1.1', '80/tcp');
expectIncludes('nmap 192.168.1.1', '443/tcp');
expectNotIncludes('nmap 192.168.1.1', 'VERSION');
expectIncludes('nmap 127.0.0.1', '631/tcp');
expectIncludes('nmap 127.0.0.1', '8080/tcp');
expectIncludes('nmap nope.example', 'Failed to resolve');
expectIncludes('nmap 10.10.10.99', 'Host is down');

// ufw / iptables
expectIncludes('ufw status', 'Status: active');
expectIncludes('ufw status', 'ALLOW       192.168.56.0/24');
expectIncludes('ufw status', '80/tcp');
expectIncludes('ufw status', '443/tcp');
expectIncludes('ufw status', '8080/tcp');
expectIncludes('ufw status', '3306/tcp');
expectMatch('ufw status', /8080\/tcp\s+DENY\s+Anywhere/);
expectMatch('ufw status', /3306\/tcp\s+DENY\s+Anywhere/);
expectIncludes('ufw status verbose', 'Default: deny (incoming)');

expectIncludes('sudo iptables -L', 'Chain INPUT (policy DROP)');
expectIncludes('sudo iptables -L', 'tcp dpt:ssh');
expectIncludes('sudo iptables -L', 'tcp dpt:http');
expectIncludes('sudo iptables -L', 'tcp dpt:https');
expectIncludes('sudo iptables -L', 'tcp dpt:8080');
expectIncludes('iptables -L', 'Permission denied');

// The shell stays offline: no network or dynamic-code APIs in the source.
const terminalSource = fs.readFileSync(terminalPath, 'utf8');
for (const [label, regex] of [
  ['fetch()', /\bfetch\s*\(/],
  ['XMLHttpRequest', /\bXMLHttpRequest\b/],
  ['WebSocket', /\bWebSocket\b/],
  ['eval()', /\beval\s*\(/],
  ['new Function()', /\bnew\s+Function\s*\(/],
  ['localStorage', /\blocalStorage\b/],
  ['document.cookie', /\bdocument\.cookie\b/]
]) {
  assertions++;
  assert.ok(!regex.test(terminalSource), `terminal.js tidak boleh memakai ${label}: shell harus offline`);
}

// Challenge patterns + solutions for ready modules (if content exists).
const moduleDir = path.join(ROOT, 'content/modules');
const indexPath = path.join(ROOT, 'content/module-index.js');
const NETWORK_MODULES = ['jaringan', 'protokol', 'netsec'];
let challengeCount = 0;
let networkSolutions = 0;

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

  // Network modules stay 'planned' until T-012, but their mission solutions must
  // already run on this shell so enabling them cannot break learners.
  for (const id of NETWORK_MODULES) {
    const module = modules[id];
    if (!module?.terminal?.challenges) continue;

    for (const challenge of module.terminal.challenges) {
      networkSolutions++;
      const regex = new RegExp(challenge.pattern);
      assert.ok(
        regex.test(challenge.solution),
        `${id}/${challenge.id}: pattern tidak cocok dengan solution "${challenge.solution}"`
      );

      const output = run(challenge.solution);
      assert.ok(
        !output.includes('command not found'),
        `${id}/${challenge.id}: solusi memakai perintah yang belum didukung → ${challenge.solution}`
      );
    }
  }
}

console.log(
  `Terminal: ${assertions} assertion lulus, ${challengeCount} misi modul ready diperiksa, ` +
  `${networkSolutions} solusi misi jaringan dicek.`
);
