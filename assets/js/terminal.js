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

  const UNAME = 'Linux labsiber 6.5.0-27-generic #28~22.04.1-Ubuntu SMP PREEMPT_DYNAMIC x86_64 x86_64 x86_64 GNU/Linux';

  const HELP = [
    'Perintah yang didukung:',
    '',
    '  Navigasi   pwd, ls [-la], cd <dir>, find <path> -name <pola>',
    '  File       cat <file>',
    '  Sistem     whoami, id, uname -a, lscpu, free -h, df -h, ip a',
    '  Lainnya    sudo, history, help, clear',
    '',
    'Ini shell simulasi. Tidak ada perintah yang menyentuh sistem asli.'
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
          return { output: IP };

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
