/* LabSiber — lean virtual terminal (safe, offline, no real execution) */

(function (global) {
  'use strict';

  const HOME = '/home/student';

  const file = (content, mode, owner) => ({
    type: 'file',
    content,
    mode: mode || '644',
    owner: owner || 'student'
  });
  const dir = (mode, owner) => ({ type: 'dir', mode: mode || '755', owner: owner || 'root' });

  function baseFS() {
    return {
      '/': dir(),
      '/etc': dir(),
      '/etc/passwd': file([
        'root:x:0:0:root:/root:/bin/bash',
        'daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin',
        'student:x:1000:1000:Student Lab:/home/student:/bin/bash'
      ].join('\n'), '644', 'root'),
      '/etc/shadow': file([
        'root:$6$lab$wQ9m2pXr8sK4vN1cY7uH3jL5aB6dF0gE2iM9oP4qR8tU:19600:0:99999:7:::',
        'student:$6$lab$H3jL5aB6dF0gE2iM9oP4qR8tUwQ9m2pXr8sK4vN1cY7u:19600:0:99999:7:::'
      ].join('\n'), '640', 'root'),
      '/etc/hosts': file([
        '127.0.0.1   localhost',
        '127.0.1.1   labsiber',
        '10.10.10.5  target.lab'
      ].join('\n'), '644', 'root'),

      '/home': dir(),
      '/home/student': dir('755', 'student'),
      '/home/student/README.md': file([
        '# Selamat datang di LabSiber',
        '',
        'Kamu berada di mesin latihan virtual. Semua perintah di sini aman:',
        'tidak ada koneksi nyata dan tidak ada sistem asli yang tersentuh.',
        '',
        'Coba:',
        '  ls -la',
        '  cat notes.txt',
        '  ip a',
        '  sudo cat /etc/shadow',
        '  find /home/student -name "*.md"',
        '',
        'Ketik "help" untuk daftar perintah.'
      ].join('\n'), '644', 'student'),
      '/home/student/notes.txt': file([
        'CATATAN LAB',
        '1. Hanya uji sistem milik sendiri atau yang punya izin.',
        '2. Target latihan: 10.10.10.5 (simulasi).',
        '3. /etc/shadow hanya bisa dibaca root.',
        '4. Cek permission file sebelum mengubahnya.'
      ].join('\n'), '644', 'student'),
      '/home/student/labs': dir('755', 'student'),
      '/home/student/labs/notes.md': file([
        '# Catatan lab',
        '',
        'Gunakan `ls -la`, `cat`, `find`, dan `id` untuk mengenal sistem.',
        'Tidak ada perintah yang menyentuh filesystem asli.'
      ].join('\n'), '644', 'student'),
      '/home/student/labs/web': dir('755', 'student'),
      '/home/student/labs/web/backup.zip': file('[binary zip archive — simulasi]\n', '600', 'student'),

      '/var': dir(),
      '/var/log': dir(),
      '/var/log/auth.log': file([
        'Nov  7 09:04:11 labsiber sshd[1021]: Failed password for invalid user admin from 192.168.56.101 port 49812 ssh2',
        'Nov  7 09:09:12 labsiber sshd[1042]: Accepted password for student from 192.168.56.1 port 51234 ssh2'
      ].join('\n'), '640', 'root')
    };
  }

  const LSCPU = [
    'Architecture:            x86_64',
    'CPU(s):                  4',
    'Vendor ID:               GenuineIntel',
    '  Model name:            Intel(R) Core(TM) i5-8250U CPU @ 1.60GHz',
    'Virtualization features:',
    '  Virtualization:        VT-x',
    'Caches (sum of all):',
    '  L3:                    6 MiB'
  ].join('\n');

  const FREE = [
    '               total        used        free      shared  buff/cache   available',
    'Mem:           7.7Gi       2.1Gi       3.9Gi       112Mi       1.7Gi       5.2Gi',
    'Swap:          2.0Gi          0B       2.0Gi'
  ].join('\n');

  const DF = [
    'Filesystem      Size  Used Avail Use% Mounted on',
    'tmpfs           782M  1.6M  780M   1% /run',
    '/dev/sda3        78G   34G   40G  47% /',
    '/dev/sda1       511M  6.1M  505M   2% /boot/efi'
  ].join('\n');

  const IP = [
    '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000',
    '    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00',
    '    inet 127.0.0.1/8 scope host lo',
    '2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000',
    '    link/ether 08:00:27:12:34:56 brd ff:ff:ff:ff:ff:ff',
    '    inet 10.0.2.15/24 brd 10.0.2.255 scope global dynamic eth0',
    '3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default',
    '    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff',
    '    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0'
  ].join('\n');

  /* --------------------------------------------------------------------------
     Network simulation data.
     Every response below is static text: the shell never opens a socket,
     resolves DNS, or runs a real command. Targets are lab-only addresses.
     -------------------------------------------------------------------------- */

  const IP_ROUTE_MAIN = [
    'default via 10.0.2.2 dev eth0 proto dhcp src 10.0.2.15 metric 100',
    '10.0.2.0/24 dev eth0 proto kernel scope link src 10.0.2.15 metric 100',
    '169.254.0.0/16 dev eth0 scope link metric 1000',
    '172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1 linkdown'
  ].join('\n');

  const IP_ROUTE_LOCAL = [
    'local 10.0.2.15 dev eth0 proto kernel scope host src 10.0.2.15',
    'broadcast 10.0.2.255 dev eth0 proto kernel scope link src 10.0.2.15',
    'local 127.0.0.0/8 dev lo proto kernel scope host src 127.0.0.1',
    'local 127.0.0.1 dev lo proto kernel scope host src 127.0.0.1',
    'broadcast 127.255.255.255 dev lo proto kernel scope link src 127.0.0.1',
    'local 172.17.0.1 dev docker0 proto kernel scope host src 172.17.0.1'
  ].join('\n');

  const PING_TARGETS = {
    '127.0.0.1': { address: '127.0.0.1', ttl: 64, times: ['0.041', '0.038', '0.044', '0.039'], rtt: '0.038/0.040/0.044/0.002' },
    'localhost': { address: '127.0.0.1', ttl: 64, times: ['0.041', '0.038', '0.044', '0.039'], rtt: '0.038/0.040/0.044/0.002' },
    '10.0.2.2': { address: '10.0.2.2', ttl: 64, times: ['0.298', '0.312', '0.287', '0.301'], rtt: '0.287/0.299/0.312/0.009' },
    '10.10.10.5': { address: '10.10.10.5', ttl: 64, times: ['0.412', '0.397', '0.425', '0.401'], rtt: '0.397/0.408/0.425/0.011' },
    '8.8.8.8': { address: '8.8.8.8', ttl: 117, times: ['24.182', '23.874', '24.512', '24.033'], rtt: '23.874/24.150/24.512/0.243' },
    'example.com': { address: '93.184.216.34', ttl: 53, times: ['88.412', '86.921', '87.336', '87.004'], rtt: '86.921/87.418/88.412/0.610' }
  };

  const TRACE_TARGETS = {
    'example.com': {
      address: '93.184.216.34',
      hops: [
        { name: '_gateway (10.0.2.2)', times: ['0.312', '0.298', '0.287'] },
        { name: '10.20.0.1 (10.20.0.1)', times: ['4.112', '4.052', '3.998'] },
        { name: '103.10.64.5 (103.10.64.5)', times: ['9.884', '9.712', '9.640'] },
        { name: '202.93.40.13 (202.93.40.13)', times: ['12.451', '12.388', '12.301'] },
        { name: '180.131.0.9 (180.131.0.9)', times: ['14.002', '13.912', '13.845'] },
        { name: null, times: [] },
        { name: 'example.com (93.184.216.34)', times: ['18.771', '18.690', '18.612'] }
      ]
    },
    '8.8.8.8': {
      address: '8.8.8.8',
      hops: [
        { name: '_gateway (10.0.2.2)', times: ['0.305', '0.291', '0.284'] },
        { name: '10.20.0.1 (10.20.0.1)', times: ['4.088', '4.041', '3.982'] },
        { name: '103.10.64.5 (103.10.64.5)', times: ['9.902', '9.744', '9.688'] },
        { name: '202.93.40.13 (202.93.40.13)', times: ['12.402', '12.351', '12.288'] },
        { name: '180.131.0.9 (180.131.0.9)', times: ['13.998', '13.887', '13.812'] },
        { name: null, times: [] },
        { name: 'dns.google (8.8.8.8)', times: ['19.812', '19.640', '19.588'] }
      ]
    },
    '10.10.10.5': {
      address: '10.10.10.5',
      hops: [
        { name: '_gateway (10.0.2.2)', times: ['0.402', '0.388', '0.371'] },
        { name: 'target.lab (10.10.10.5)', times: ['1.204', '1.188', '1.162'] }
      ]
    },
    '127.0.0.1': {
      address: '127.0.0.1',
      hops: [{ name: 'localhost (127.0.0.1)', times: ['0.031', '0.026', '0.023'] }]
    },
    'localhost': {
      address: '127.0.0.1',
      hops: [{ name: 'localhost (127.0.0.1)', times: ['0.031', '0.026', '0.023'] }]
    }
  };

  const LISTENERS = [
    { proto: 'tcp', state: 'LISTEN', recv: '0', send: '128', local: '0.0.0.0:22', peer: '0.0.0.0:*', pid: 901, process: 'sshd' },
    { proto: 'tcp', state: 'LISTEN', recv: '0', send: '128', local: '127.0.0.1:631', peer: '0.0.0.0:*', pid: 1022, process: 'cupsd' },
    { proto: 'tcp', state: 'LISTEN', recv: '0', send: '80', local: '127.0.0.1:3306', peer: '0.0.0.0:*', pid: 1180, process: 'mysqld' },
    { proto: 'tcp', state: 'LISTEN', recv: '0', send: '128', local: '0.0.0.0:8080', peer: '0.0.0.0:*', pid: 1337, process: 'python3' },
    { proto: 'udp', state: 'UNCONN', recv: '0', send: '0', local: '0.0.0.0:68', peer: '0.0.0.0:*', pid: 812, process: 'dhclient' }
  ];

  const DNS_SERVER = '10.0.2.3';
  const DNS_WHEN = 'Fri Nov 07 09:20:11 UTC 2025';
  const DNS_RECORDS = {
    'example.com': { ttl: '3600', type: 'A', value: '93.184.216.34' },
    'www.example.com': { ttl: '3600', type: 'A', value: '93.184.216.34' },
    'target.lab': { ttl: '0', type: 'A', value: '10.10.10.5' },
    'labsiber': { ttl: '0', type: 'A', value: '127.0.1.1' },
    'localhost': { ttl: '0', type: 'A', value: '127.0.0.1' }
  };

  const DVWA_PAGE = [
    '<!DOCTYPE html>',
    '<html lang="en-GB">',
    '<head>',
    '    <meta charset="UTF-8">',
    '    <title>Damn Vulnerable Web Application (DVWA) v1.10 :: Login</title>',
    '    <link rel="stylesheet" href="dvwa/css/login.css">',
    '</head>',
    '<body>',
    '    <div id="container">',
    '        <h1>Damn Vulnerable Web Application</h1>',
    '        <p>Login</p>',
    '        <form action="login.php" method="post">',
    '            <label for="user">Username</label>',
    '            <input type="text" name="username" id="user" autocomplete="off">',
    '            <label for="pass">Password</label>',
    '            <input type="password" name="password" id="pass" autocomplete="off">',
    '            <input type="submit" value="Login" name="Login">',
    '        </form>',
    '    </div>',
    '</body>',
    '</html>'
  ].join('\n');

  const EXAMPLE_PAGE = [
    '<!doctype html>',
    '<html>',
    '<head>',
    '    <title>Example Domain</title>',
    '    <meta charset="utf-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
    '</head>',
    '<body>',
    '<div>',
    '    <h1>Example Domain</h1>',
    '    <p>This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.</p>',
    '    <p><a href="https://www.iana.org/domains/example">More information...</a></p>',
    '</div>',
    '</body>',
    '</html>'
  ].join('\n');

  const LOCAL_PAGE = [
    '<!DOCTYPE html>',
    '<html lang="id">',
    '<head>',
    '    <meta charset="utf-8">',
    '    <title>LabSiber local service</title>',
    '</head>',
    '<body>',
    '    <h1>LabSiber local service</h1>',
    '    <p>Python 3.8 http.server di port 8080.</p>',
    '</body>',
    '</html>'
  ].join('\n');

  const CURL_SITES = {
    '10.10.10.5': {
      status: 'HTTP/1.1 200 OK',
      server: 'Apache/2.4.41 (Ubuntu)',
      extra: ['X-Powered-By: PHP/7.4.33'],
      body: DVWA_PAGE
    },
    'example.com': {
      status: 'HTTP/1.1 200 OK',
      server: 'ECS (dcb/7F83)',
      extra: [
        'Accept-Ranges: bytes',
        'Cache-Control: max-age=604800',
        'Etag: "3147526947+ident"',
        'Last-Modified: Thu, 17 Oct 2019 07:18:26 GMT',
        'Vary: Accept-Encoding'
      ],
      body: EXAMPLE_PAGE
    },
    'www.example.com': {
      status: 'HTTP/1.1 200 OK',
      server: 'ECS (dcb/7F83)',
      extra: ['Cache-Control: max-age=604800'],
      body: EXAMPLE_PAGE
    },
    '127.0.0.1:8080': {
      status: 'HTTP/1.0 200 OK',
      server: 'SimpleHTTP/0.6 Python/3.8.10',
      extra: [],
      body: LOCAL_PAGE
    },
    'localhost:8080': {
      status: 'HTTP/1.0 200 OK',
      server: 'SimpleHTTP/0.6 Python/3.8.10',
      extra: [],
      body: LOCAL_PAGE
    }
  };

  const NMAP_HEADER = 'Starting Nmap 7.94 ( https://nmap.org ) at 2025-11-07 09:20 UTC';

  const NMAP_TARGETS = {
    '10.10.10.5': {
      report: 'Nmap scan report for 10.10.10.5',
      latency: '0.00042s',
      ports: [
        { port: '22/tcp', service: 'ssh', version: 'OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)' },
        { port: '80/tcp', service: 'http', version: 'Apache httpd 2.4.41 ((Ubuntu))' },
        { port: '3306/tcp', service: 'mysql', version: 'MySQL 5.7.40' },
        { port: '8080/tcp', service: 'http-proxy', version: 'Python 3.8.10 http.server' }
      ]
    },
    '192.168.1.1': {
      report: 'Nmap scan report for 192.168.1.1',
      latency: '0.0011s',
      ports: [
        { port: '53/tcp', service: 'domain', version: 'dnsmasq 2.80' },
        { port: '80/tcp', service: 'http', version: 'lighttpd 1.4.55' },
        { port: '443/tcp', service: 'ssl/https', version: 'nginx 1.18.0 (Ubuntu)' }
      ]
    },
    '127.0.0.1': {
      report: 'Nmap scan report for localhost (127.0.0.1)',
      latency: '0.000087s',
      ports: [
        { port: '22/tcp', service: 'ssh', version: 'OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)' },
        { port: '631/tcp', service: 'ipp', version: 'CUPS 2.4' },
        { port: '3306/tcp', service: 'mysql', version: 'MySQL 5.7.40' },
        { port: '8080/tcp', service: 'http-proxy', version: 'Python 3.8.10 http.server' }
      ]
    }
  };

  const UFW_RULES = [
    ['22/tcp', 'ALLOW', '192.168.56.0/24'],
    ['80/tcp', 'ALLOW', 'Anywhere'],
    ['443/tcp', 'ALLOW', 'Anywhere'],
    ['8080/tcp', 'DENY', 'Anywhere'],
    ['3306/tcp', 'DENY', 'Anywhere'],
    ['80/tcp (v6)', 'ALLOW', 'Anywhere (v6)'],
    ['443/tcp (v6)', 'ALLOW', 'Anywhere (v6)'],
    ['8080/tcp (v6)', 'DENY', 'Anywhere (v6)'],
    ['3306/tcp (v6)', 'DENY', 'Anywhere (v6)']
  ];

  const IPTABLES_RULES = [
    'Chain INPUT (policy DROP)',
    'target     prot opt source               destination',
    'ACCEPT     tcp  --  anywhere             anywhere             tcp dpt:ssh',
    'ACCEPT     tcp  --  anywhere             anywhere             tcp dpt:http',
    'ACCEPT     tcp  --  anywhere             anywhere             tcp dpt:https',
    'DROP       tcp  --  anywhere             anywhere             tcp dpt:8080',
    'ACCEPT     all  --  anywhere             anywhere             state RELATED,ESTABLISHED',
    '',
    'Chain FORWARD (policy DROP)',
    'target     prot opt source               destination',
    '',
    'Chain OUTPUT (policy ACCEPT)',
    'target     prot opt source               destination'
  ].join('\n');

  const UNAME = 'Linux labsiber 6.5.0-27-generic #28~22.04.1-Ubuntu SMP PREEMPT_DYNAMIC x86_64 x86_64 x86_64 GNU/Linux';

  const HELP = [
    'Perintah yang didukung:',
    '',
    '  Navigasi   pwd, ls [-la], cd <dir>, find <path> -name <pola>',
    '  File       cat <file>',
    '  Sistem     whoami, id, uname -a, lscpu, free -h, df -h',
    '  Jaringan   ip a, ip route, ping -c 4 <host>, traceroute <host>',
    '             ss -tulpn, netstat -tulpn, dig <domain>, nslookup <domain>',
    '             curl [-i] <url>, nmap [-sV] <host>',
    '  Firewall   ufw status, sudo iptables -L',
    '  Lainnya    sudo, history, help, clear',
    '',
    'Semua keluaran simulasi: shell tidak menyentuh jaringan atau sistem asli.'
  ].join('\n');

  function parentOf(path) {
    if (path === '/') return '/';
    const index = path.lastIndexOf('/');
    return index <= 0 ? '/' : path.slice(0, index);
  }

  function baseOf(path) {
    return path === '/' ? '/' : path.slice(path.lastIndexOf('/') + 1);
  }

  function normalize(path, cwd) {
    let value = String(path || '').trim();
    if (!value) value = cwd;
    if (value === '~') value = HOME;
    if (value.startsWith('~/')) value = HOME + value.slice(1);
    if (!value.startsWith('/')) value = (cwd === '/' ? '' : cwd) + '/' + value;
    const parts = [];
    value.split('/').forEach((part) => {
      if (!part || part === '.') return;
      if (part === '..') parts.pop();
      else parts.push(part);
    });
    return '/' + parts.join('/');
  }

  function tokenize(line) {
    const tokens = [];
    const regex = /"([^"]*)"|'([^']*)'|(\S+)/g;
    let match;
    while ((match = regex.exec(line))) {
      tokens.push(match[1] !== undefined ? match[1] : match[2] !== undefined ? match[2] : match[3]);
    }
    return tokens;
  }

  function permString(entry) {
    const map = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];
    const mode = entry.mode || '644';
    const bits = mode.length === 4 ? mode.slice(1) : mode;
    return (entry.type === 'dir' ? 'd' : '-') +
      (map[parseInt(bits[0], 10)] || '---') +
      (map[parseInt(bits[1], 10)] || '---') +
      (map[parseInt(bits[2], 10)] || '---');
  }

  function sizeOf(entry) {
    return entry.type === 'dir' ? 4096 : (entry.content || '').length;
  }

  function globToRegex(pattern) {
    const safe = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    return new RegExp('^' + safe + '$');
  }

  /* --------------------------------------------------------------------------
     Network command formatters. Pure functions: input string in, text out.
     -------------------------------------------------------------------------- */

  function isIPv4(value) {
    return /^\d{1,3}(\.\d{1,3}){3}$/.test(value);
  }

  function ipOutput(plain) {
    const object = plain[0] || 'a';
    if (object === 'route' || object === 'r') {
      return plain.includes('local') ? IP_ROUTE_LOCAL : IP_ROUTE_MAIN;
    }
    if (['a', 'addr', 'address', 'l', 'link'].includes(object)) return IP;
    if (object === 'help') {
      return 'Usage: ip [ OPTIONS ] OBJECT { COMMAND | help }\nOBJECT := { link | address | route }';
    }
    return `Object "${object}" is unknown, try "ip help".`;
  }

  function pingOutput(args) {
    let count = 4;
    let host = '';
    for (let i = 0; i < args.length; i += 1) {
      const arg = args[i];
      if (arg === '-c' || arg === '-i' || arg === '-W') {
        if (arg === '-c') {
          const value = parseInt(args[i + 1], 10);
          if (Number.isInteger(value) && value > 0) count = Math.min(value, 20);
        }
        i += 1;
        continue;
      }
      if (arg.startsWith('-')) continue;
      if (!host) host = arg;
    }
    if (!host) return 'ping: usage error: Destination address required';

    const target = PING_TARGETS[host.toLowerCase()];
    if (!target) {
      if (!isIPv4(host)) return `ping: ${host}: Name or service not known`;
      const lines = [`PING ${host} (${host}) 56(84) bytes of data.`];
      for (let i = 0; i < count; i += 1) {
        lines.push(`From 10.0.2.15 icmp_seq=${i + 1} Destination Host Unreachable`);
      }
      lines.push(
        '',
        `--- ${host} ping statistics ---`,
        `${count} packets transmitted, 0 received, +${count} errors, 100% packet loss, time ${(count - 1) * 1000 + 62}ms`
      );
      return lines.join('\n');
    }

    const lines = [`PING ${host} (${target.address}) 56(84) bytes of data.`];
    for (let i = 0; i < count; i += 1) {
      lines.push(
        `64 bytes from ${target.address}: icmp_seq=${i + 1} ttl=${target.ttl} time=${target.times[i % target.times.length]} ms`
      );
    }
    lines.push(
      '',
      `--- ${host} ping statistics ---`,
      `${count} packets transmitted, ${count} received, 0% packet loss, time ${(count - 1) * 1000 + 5}ms`,
      `rtt min/avg/max/mdev = ${target.rtt} ms`
    );
    return lines.join('\n');
  }

  function tracerouteOutput(args) {
    const plain = args.filter((arg) => !arg.startsWith('-'));
    const host = plain[plain.length - 1];
    if (!host) return 'traceroute: usage error: missing host';

    const target = TRACE_TARGETS[host.toLowerCase()];
    if (!target) return `traceroute: ${host}: Name or service not known`;

    const lines = [`traceroute to ${host} (${target.address}), 30 hops max, 60 byte packets`];
    target.hops.forEach((hop, index) => {
      const number = String(index + 1).padStart(2, ' ');
      if (!hop.name) {
        lines.push(` ${number}  * * *`);
        return;
      }
      lines.push(` ${number}  ${hop.name}  ${hop.times.map((time) => `${time} ms`).join('  ')}`);
    });
    return lines.join('\n');
  }

  function ssOutput(flags) {
    const withProcess = flags.some((flag) => flag.includes('p'));
    const row = (netid, state, recv, send, local, peer, process) => [
      netid.padEnd(5),
      state.padEnd(6),
      recv.padStart(6),
      send.padStart(6),
      local.padEnd(21),
      peer.padEnd(18),
      process
    ].join(' ').trimEnd();

    const lines = [row('Netid', 'State', 'Recv-Q', 'Send-Q', 'Local Address:Port', 'Peer Address:Port', 'Process')];
    LISTENERS.forEach((item) => {
      lines.push(row(
        item.proto,
        item.state,
        item.recv,
        item.send,
        item.local,
        item.peer,
        withProcess ? `users:(("${item.process}",pid=${item.pid},fd=3))` : ''
      ));
    });
    return lines.join('\n');
  }

  function netstatOutput() {
    const row = (proto, recv, send, local, peer, state, proc) => [
      proto.padEnd(5),
      recv.padStart(6),
      send.padStart(6),
      local.padEnd(23),
      peer.padEnd(23),
      state.padEnd(12),
      proc
    ].join(' ').trimEnd();

    const lines = [
      'Active Internet connections (only servers)',
      row('Proto', 'Recv-Q', 'Send-Q', 'Local Address', 'Foreign Address', 'State', 'PID/Program name')
    ];
    LISTENERS.forEach((item) => {
      lines.push(row(
        item.proto,
        item.recv,
        item.send,
        item.local,
        item.peer,
        item.proto === 'udp' ? '' : item.state,
        `${item.pid}/${item.process}`
      ));
    });
    return lines.join('\n');
  }

  function dnsLookup(name) {
    const key = String(name || '').toLowerCase().replace(/\.$/, '');
    return { key, record: DNS_RECORDS[key] || null };
  }

  function digOutput(args) {
    const name = args.find((arg) => !arg.startsWith('-') && !arg.startsWith('+') && !arg.startsWith('@'));
    if (!name) return 'dig: usage: dig [@server] <name> [type] [+short]';

    const { key, record } = dnsLookup(name);
    if (args.includes('+short')) return record ? record.value : '';

    const lines = [
      `; <<>> DiG 9.18.24-1-Ubuntu <<>> ${key}`,
      ';; global options: +cmd',
      ';; Got answer:',
      `;; ->>HEADER<<- opcode: QUERY, status: ${record ? 'NOERROR' : 'NXDOMAIN'}, id: 43121`,
      `;; flags: qr rd ra; QUERY: 1, ANSWER: ${record ? 1 : 0}, AUTHORITY: 0, ADDITIONAL: 1`,
      '',
      ';; OPT PSEUDOSECTION:',
      '; EDNS: version: 0, flags:; udp: 65494',
      ';; QUESTION SECTION:',
      `;${key}.`.padEnd(24) + 'IN  A',
      ''
    ];
    if (record) {
      lines.push(
        ';; ANSWER SECTION:',
        `${key}.`.padEnd(24) + `${record.ttl}  IN  A  ${record.value}`,
        ''
      );
    }
    lines.push(
      ';; Query time: 18 msec',
      `;; SERVER: ${DNS_SERVER}#53(${DNS_SERVER}) (UDP)`,
      `;; WHEN: ${DNS_WHEN}`,
      `;; MSG SIZE  rcvd: ${record ? 56 : 98}`
    );
    return lines.join('\n');
  }

  function nslookupOutput(args) {
    const name = args.find((arg) => !arg.startsWith('-'));
    if (!name) return 'nslookup: usage: nslookup <name>';

    const { key, record } = dnsLookup(name);
    const lines = [`Server:\t\t${DNS_SERVER}`, `Address:\t${DNS_SERVER}#53`, ''];
    if (!record) {
      lines.push(`** server can't find ${key}: NXDOMAIN`);
      return lines.join('\n');
    }
    lines.push('Non-authoritative answer:', `Name:\t${key}`, `Address: ${record.value}`);
    return lines.join('\n');
  }

  function curlOutput(args) {
    const showHeaders = args.includes('--include') ||
      args.some((arg) => arg.startsWith('-') && !arg.startsWith('--') && arg.includes('i'));
    const headOnly = args.includes('--head') ||
      args.some((arg) => arg.startsWith('-') && !arg.startsWith('--') && arg.includes('I'));

    let url = '';
    const withValue = ['-A', '-e', '-H', '-X', '-d', '-u', '-o', '-w', '--data', '--header', '--request', '--user-agent'];
    for (let i = 0; i < args.length; i += 1) {
      const arg = args[i];
      if (withValue.includes(arg)) { i += 1; continue; }
      if (arg.startsWith('-')) continue;
      url = arg;
      break;
    }
    if (!url) return "curl: try 'curl --help' or 'curl --manual' for more information";

    const normalized = /^[a-z][a-z0-9+.-]*:\/\//i.test(url) ? url : `http://${url}`;
    const match = /^(https?):\/\/([^/?#]+)([^#]*)$/i.exec(normalized);
    if (!match) {
      return `curl: (1) Protocol "${normalized.slice(0, normalized.indexOf(':'))}" not supported`;
    }

    const host = match[2].toLowerCase();
    const portMatch = /^([^:]+):(\d+)$/.exec(host);
    const bareHost = portMatch ? portMatch[1] : host;
    const port = portMatch ? portMatch[2] : '';
    const key = port && port !== '80' && port !== '443' ? `${bareHost}:${port}` : bareHost;
    const site = CURL_SITES[key];

    if (!site) {
      if (bareHost === '127.0.0.1' || bareHost === 'localhost') {
        return `curl: (7) Failed to connect to ${bareHost} port ${port || '80'} after 0 ms: Connection refused`;
      }
      return `curl: (6) Could not resolve host: ${bareHost}`;
    }

    const headers = [
      site.status,
      'Date: Fri, 07 Nov 2025 09:20:11 GMT',
      `Server: ${site.server}`,
      ...site.extra,
      `Content-Length: ${site.body.length}`,
      'Content-Type: text/html; charset=UTF-8'
    ].join('\n');

    if (headOnly) return headers;
    if (showHeaders) return `${headers}\n\n${site.body}`;
    return site.body;
  }

  function nmapOutput(args) {
    const versionScan = args.some((arg) => arg === '-A' || /^-[a-zA-Z]*V/.test(arg));

    let target = '';
    for (let i = 0; i < args.length; i += 1) {
      const arg = args[i];
      if (['-p', '--top-ports', '-e', '-oN', '-oX'].includes(arg)) { i += 1; continue; }
      if (arg.startsWith('-')) continue;
      target = arg;
    }

    if (!target) {
      return [
        NMAP_HEADER,
        'WARNING: No targets were specified, so 0 hosts scanned.',
        'Nmap done: 0 IP addresses (0 hosts up) scanned in 0.05 seconds'
      ].join('\n');
    }

    const known = NMAP_TARGETS[target.toLowerCase()];
    if (!known) {
      if (!isIPv4(target)) {
        return [
          NMAP_HEADER,
          `Failed to resolve "${target}".`,
          'WARNING: No targets were valid.',
          'Nmap done: 0 IP addresses (0 hosts up) scanned in 0.05 seconds'
        ].join('\n');
      }
      return [
        NMAP_HEADER,
        `Nmap scan report for ${target}`,
        'Host is down',
        'Nmap done: 1 IP address (0 hosts up) scanned in 3.04 seconds'
      ].join('\n');
    }

    const lines = [
      NMAP_HEADER,
      known.report,
      `Host is up (${known.latency} latency).`,
      `Not shown: ${1000 - known.ports.length} closed ports`
    ];
    if (versionScan) {
      lines.push(`${'PORT'.padEnd(9)}${'STATE'.padEnd(6)}${'SERVICE'.padEnd(12)}VERSION`);
      known.ports.forEach((item) => {
        lines.push(`${item.port.padEnd(9)}${'open'.padEnd(6)}${item.service.padEnd(12)}${item.version}`);
      });
      lines.push('', 'Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .');
    } else {
      lines.push(`${'PORT'.padEnd(9)}${'STATE'.padEnd(6)}SERVICE`);
      known.ports.forEach((item) => {
        lines.push(`${item.port.padEnd(9)}${'open'.padEnd(6)}${item.service}`);
      });
    }
    lines.push(`Nmap done: 1 IP address (1 host up) scanned in ${versionScan ? '8.42' : '3.12'} seconds`);
    return lines.join('\n');
  }

  function ufwOutput(args) {
    if (args.find((arg) => !arg.startsWith('-')) !== 'status') return 'ERROR: Unsupported command';

    const lines = ['Status: active'];
    if (args.includes('verbose')) {
      lines.push('Logging: on (low)', 'Default: deny (incoming), allow (outgoing), disabled (routed)', 'New profiles: skip');
    }
    const row = (to, action, from) => `${to.padEnd(27)}${action.padEnd(12)}${from}`;
    lines.push('', row('To', 'Action', 'From'), row('--', '------', '----'));
    UFW_RULES.forEach((rule) => lines.push(row(rule[0], rule[1], rule[2])));
    return lines.join('\n');
  }

  function iptablesOutput(args, elevated) {
    if (!elevated) {
      return 'iptables v1.8.7 (legacy): can\'t initialize iptables table "filter": ' +
        'Permission denied (you must be root)\nPerhaps iptables or your kernel needs to be upgraded.';
    }
    const lists = args.some((arg) => ['-L', '--list', '-S', '--list-rules'].includes(arg));
    if (!lists) {
      return 'iptables v1.8.7 (legacy): no command specified\nTry \'iptables -h\' or \'iptables --help\' for more information.';
    }
    return IPTABLES_RULES;
  }

  class VirtualShell {
    constructor(fs) {
      this.fs = fs || baseFS();
      this.cwd = HOME;
      this.user = 'student';
      this.history = [];
    }

    prompt() {
      return `${this.user}@labsiber:${this.cwd === HOME ? '~' : this.cwd}$`;
    }

    canRead(entry, elevated) {
      if (!entry) return false;
      if (elevated) return true;
      if (entry.owner === this.user) return parseInt(entry.mode[0], 10) >= 4;
      return parseInt(entry.mode[2], 10) >= 4;
    }

    children(path) {
      const prefix = path === '/' ? '/' : path + '/';
      return Object.keys(this.fs)
        .filter((item) => item !== path && item.startsWith(prefix) && item.indexOf('/', prefix.length) === -1)
        .sort();
    }

    run(rawInput) {
      const raw = String(rawInput || '').trim();
      if (!raw) return { output: '' };
      this.history.push(raw);

      let tokens = tokenize(raw);
      let elevated = false;
      if (tokens[0] === 'sudo') {
        elevated = true;
        tokens = tokens.slice(1);
        if (!tokens.length) return { output: 'usage: sudo <perintah>' };
      }

      const command = tokens[0];
      const args = tokens.slice(1);
      const flags = args.filter((arg) => arg.startsWith('-'));
      const plain = args.filter((arg) => !arg.startsWith('-'));

      switch (command) {
        case 'help':
          return { output: HELP };

        case 'pwd':
          return { output: this.cwd };

        case 'whoami':
          return { output: elevated ? 'root' : this.user };

        case 'id':
          return {
            output: elevated
              ? 'uid=0(root) gid=0(root) groups=0(root)'
              : 'uid=1000(student) gid=1000(student) groups=1000(student),27(sudo)'
          };

        case 'history':
          return {
            output: this.history.map((item, index) => `${String(index + 1).padStart(4, ' ')}  ${item}`).join('\n')
          };

        case 'clear':
          return { output: '', clear: true };

        case 'cd': {
          const target = normalize(plain[0] || HOME, this.cwd);
          const entry = this.fs[target];
          if (!entry) return { output: `cd: ${plain[0] || ''}: No such file or directory` };
          if (entry.type !== 'dir') return { output: `cd: ${plain[0] || ''}: Not a directory` };
          this.cwd = target;
          return { output: '' };
        }

        case 'ls': {
          const target = normalize(plain[0] || '.', this.cwd);
          const entry = this.fs[target];
          if (!entry) return { output: `ls: cannot access '${plain[0] || ''}': No such file or directory` };
          const long = flags.includes('-l') || flags.some((flag) => /^-[a-z]*l/.test(flag));

          if (entry.type === 'file') {
            if (!long) return { output: baseOf(target) };
            return { output: this.longLine(target, entry) };
          }

          const children = this.children(target);
          if (!children.length) return { output: '' };
          if (!long) return { output: children.map(baseOf).join('  ') };
          return {
            output: [`total ${children.length}`]
              .concat(children.map((item) => this.longLine(item, this.fs[item])))
              .join('\n')
          };
        }

        case 'cat': {
          if (!plain.length) return { output: 'usage: cat <file>' };
          const output = [];
          for (const item of plain) {
            const path = normalize(item, this.cwd);
            const entry = this.fs[path];
            if (!entry) { output.push(`cat: ${item}: No such file or directory`); continue; }
            if (entry.type === 'dir') { output.push(`cat: ${item}: Is a directory`); continue; }
            if (!this.canRead(entry, elevated)) { output.push(`cat: ${item}: Permission denied`); continue; }
            output.push(entry.content || '');
          }
          return { output: output.join('\n') };
        }

        case 'find': {
          const pathArg = args[0] && !args[0].startsWith('-') ? args[0] : '.';
          const start = normalize(pathArg, this.cwd);
          const nameIndex = args.indexOf('-name');
          const pattern = nameIndex !== -1 ? args[nameIndex + 1] : null;
          if (!pattern) return { output: 'find: missing -name pattern' };
          let matcher;
          try { matcher = globToRegex(pattern); } catch { return { output: 'find: invalid pattern' }; }

          const results = Object.keys(this.fs)
            .filter((path) => path === start || path.startsWith(start === '/' ? '/' : start + '/'))
            .filter((path) => matcher.test(baseOf(path)))
            .sort();
          return { output: results.join('\n') };
        }

        case 'uname':
          return { output: flags.includes('-a') ? UNAME : 'Linux' };

        case 'lscpu':
          return { output: LSCPU };

        case 'free':
          return { output: FREE };

        case 'df':
          return { output: DF };

        case 'ip':
          return { output: ipOutput(plain) };

        case 'ping':
          return { output: pingOutput(args) };

        case 'traceroute':
          return { output: tracerouteOutput(args) };

        case 'ss':
          return { output: ssOutput(flags) };

        case 'netstat':
          return { output: netstatOutput() };

        case 'dig':
          return { output: digOutput(args) };

        case 'nslookup':
          return { output: nslookupOutput(args) };

        case 'curl':
          return { output: curlOutput(args) };

        case 'nmap':
          return { output: nmapOutput(args) };

        case 'ufw':
          return { output: ufwOutput(args) };

        case 'iptables':
          return { output: iptablesOutput(args, elevated) };

        default:
          return { output: `bash: ${command}: command not found` };
      }
    }

    longLine(path, entry) {
      const name = baseOf(path) + (entry.type === 'dir' ? '/' : '');
      const owner = (entry.owner || 'root').padEnd(7, ' ');
      return `${permString(entry)} 1 ${owner} ${owner} ${String(sizeOf(entry)).padStart(6, ' ')} Nov  7 08:58 ${name}`;
    }
  }

  function mount(container, options) {
    const opts = options || {};
    const shell = new VirtualShell(baseFS());
    const done = new Set(opts.doneIds || []);
    const challenges = opts.challenges || [];
    let cursor = -1;

    container.classList.add('terminal-card');
    container.innerHTML = [
      '<div class="terminal-head">',
      '  <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>',
      `  <span class="terminal-title">${opts.title || 'student@labsiber: ~'}</span>`,
      '  <span class="spacer"></span>',
      '  <button type="button" class="term-reset" data-term-reset>reset</button>',
      '</div>',
      '<div class="term-shell" role="log" aria-live="polite" aria-label="Keluaran terminal">',
      '  <div class="term-output"></div>',
      '  <div class="term-input-line"><span class="t-prompt"></span><input class="term-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Perintah terminal" placeholder="ketik perintah…"></div>',
      '</div>',
      '<div class="terminal-foot"><span>shell simulasi</span><span>·</span><span>ketik <kbd>help</kbd></span><span>·</span><span><kbd>↑</kbd><kbd>↓</kbd> riwayat</span></div>'
    ].join('');

    const scroll = container.querySelector('.term-shell');
    const output = container.querySelector('.term-output');
    const input = container.querySelector('.term-input');
    const prompt = container.querySelector('.t-prompt');

    const scrollBottom = () => { scroll.scrollTop = scroll.scrollHeight; };

    function print(text, className) {
      if (text === '' || text == null) return;
      const line = document.createElement('div');
      if (className) line.className = className;
      line.textContent = text;
      output.appendChild(line);
      scrollBottom();
    }

    function printCommand(command) {
      const line = document.createElement('div');
      const promptSpan = document.createElement('span');
      promptSpan.className = 't-prompt';
      promptSpan.textContent = shell.prompt() + ' ';
      const commandSpan = document.createElement('span');
      commandSpan.className = 't-cmd';
      commandSpan.textContent = command;
      line.append(promptSpan, commandSpan);
      output.appendChild(line);
    }

    function updatePrompt() {
      prompt.textContent = shell.prompt();
    }

    function checkChallenges(command) {
      for (const challenge of challenges) {
        if (done.has(challenge.id)) continue;
        let regex;
        try { regex = new RegExp(challenge.pattern); } catch { continue; }
        if (!regex.test(command.trim())) continue;
        done.add(challenge.id);
        print(`✔ Misi selesai: ${challenge.task}`, 't-ok');
        if (typeof opts.onChallenge === 'function') opts.onChallenge(challenge.id, challenge);
      }
    }

    function run(command) {
      const value = String(command || '').trim();
      if (!value) return;
      printCommand(value);
      const result = shell.run(value);
      if (result.clear) output.innerHTML = '';
      else print(result.output);
      checkChallenges(value);
      updatePrompt();
    }

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const value = input.value;
        input.value = '';
        run(value);
        cursor = shell.history.length;
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (!shell.history.length) return;
        cursor = cursor <= 0 ? 0 : cursor - 1;
        input.value = shell.history[cursor] || '';
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (!shell.history.length) return;
        cursor = Math.min(shell.history.length, cursor + 1);
        input.value = shell.history[cursor] || '';
      } else if (event.key === 'l' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        output.innerHTML = '';
      }
    });

    container.addEventListener('click', (event) => {
      if (event.target.closest('[data-term-reset]')) {
        output.innerHTML = '';
        shell.cwd = HOME;
        shell.history = [];
        cursor = -1;
        updatePrompt();
        print('Terminal direset. Ketik "help" untuk daftar perintah.', 't-dim');
        return;
      }
      if (!event.target.closest('a[href]')) input.focus();
    });

    updatePrompt();
    print('LabSiber virtual shell — aman, offline, dan tidak menyentuh sistem asli.', 't-dim');
    print('Ketik "help" untuk daftar perintah.', 't-dim');
    print('', 't-dim');

    return {
      shell,
      run,
      focus: () => input.focus(),
      reset: () => {
        output.innerHTML = '';
        shell.cwd = HOME;
        updatePrompt();
      }
    };
  }

  global.CyberTerminal = { VirtualShell, mount, createFS: baseFS };
})(typeof window !== 'undefined' ? window : globalThis);
