/**
 * Tasks owned by Content & Curriculum Engineer.
 */
export default [
  {
    id: 'T-011',
    title: 'Write foundation and hardware modules',
    role: 'content',
    reviewers: ['data-platform', 'qa', 'security'],
    status: 'todo',
    priority: 'P0',
    size: 'L',
    pr: '#4',
    dependsOn: ['T-004', 'T-006', 'T-007'],
    files: [
      'content/modules/01-fondasi.js',
      'content/module-index.js'
    ],
    context: 'Dua modul pertama menentukan pengalaman awal: cara berpikir risiko, CIA, etika, lalu hardware dan konektivitas.',
    deliverables: [
      'Modul fondasi keamanan dan hardware',
      'Quiz + penjelasan, istilah, misi terminal, lab',
      'Status kedua modul menjadi ready di module-index'
    ],
    acceptance: [
      'Materi akurat, aman, dan berbahasa Indonesia.',
      'Setiap modul punya 5+ section, 6+ istilah, 5+ soal, 5+ misi, 1 lab dengan safety note.',
      'Pattern misi cocok dengan solusi.',
      'Tidak ada kredensial/data pribadi/target nyata.',
      'node scripts/validate.mjs lulus.'
    ],
    verification: [
      'node scripts/validate.mjs',
      'Buka #/module/fondasi dan #/module/hardware',
      'Jawab kuis benar/salah dan jalankan 2 misi terminal',
      'Cek 360px'
    ],
    outOfScope: ['Kode renderer', 'Perubahan schema', 'Modul lain'],
    handoff: [
      'Catat sumber utama dan asumsi.',
      'Tandai peringatan etika/hukum yang perlu review security.',
      'Serahkan ke QA untuk alur belajar.'
    ]
  },
  {
    id: 'T-012',
    title: 'Write networking and protocol modules',
    role: 'content',
    reviewers: ['data-platform', 'qa', 'security'],
    status: 'todo',
    priority: 'P0',
    size: 'L',
    pr: '#5',
    dependsOn: ['T-011'],
    files: [
      'content/modules/02-jaringan.js',
      'content/module-index.js'
    ],
    context: 'Jaringan adalah jalur serangan utama; modul ini harus membangun intuisi OSI, IP, port, DNS, dan packet analysis.',
    deliverables: [
      'Modul jaringan, protokol, dan keamanan jaringan',
      'Quiz, istilah, misi, lab dengan safety note',
      'Status tiga modul menjadi ready'
    ],
    acceptance: [
      'Semua tabel port/CIDR/protokol akurat dan konsisten.',
      'Misi terminal memakai perintah yang didukung simulator.',
      'Lab hanya memakai aset sendiri/izin.',
      'Validator lulus dan tidak ada link mati.'
    ],
    verification: [
      'node scripts/validate.mjs',
      'Buka ketiga modul',
      'Jalankan misi ip/nmap/dig/curl',
      'Cek tabel di 360px'
    ],
    outOfScope: ['Kode UI', 'Perubahan schema', 'Modul OS'],
    handoff: [
      'Sebutkan asumsi topologi lab.',
      'Serahkan ke QA untuk akurasi dan security untuk safety.'
    ]
  },
  {
    id: 'T-013',
    title: 'Write Linux, Windows/macOS, and virtualization modules',
    role: 'content',
    reviewers: ['data-platform', 'qa', 'security'],
    status: 'todo',
    priority: 'P0',
    size: 'L',
    pr: '#6',
    dependsOn: ['T-012'],
    files: [
      'content/modules/03-os.js',
      'content/module-index.js'
    ],
    context: 'Praktik nyata terjadi di OS dan VM. Materi harus aman, akurat lintas platform, dan menekankan isolasi.',
    deliverables: [
      'Modul Linux, Windows/macOS, dan virtualisasi',
      'Event ID Windows, permission Linux, lab VM',
      'Status tiga modul menjadi ready'
    ],
    acceptance: [
      'Perintah Linux/Windows/macOS akurat dan aman.',
      'Event ID Windows (4624/4625/4672/4688/4720) konsisten.',
      'Lab VM memuat peringatan host-only/snapshot.',
      'Validator lulus.'
    ],
    verification: [
      'node scripts/validate.mjs',
      'Jalankan misi Linux (chmod/find/grep)',
      'Cek lab tidak menyarankan bridged untuk target rentan'
    ],
    outOfScope: ['Kode terminal engine', 'Perubahan schema', 'Modul kripto'],
    handoff: [
      'Catat versi OS/asumsi command.',
      'Serahkan ke QA/security untuk review isolasi.'
    ]
  },
  {
    id: 'T-014',
    title: 'Write cryptography and identity modules',
    role: 'content',
    reviewers: ['data-platform', 'qa', 'security'],
    status: 'todo',
    priority: 'P0',
    size: 'M',
    pr: '#7',
    dependsOn: ['T-013'],
    files: [
      'content/modules/04-kripto-identitas.js',
      'content/module-index.js'
    ],
    context: 'Banyak kesalahan keamanan berasal dari kriptografi dan identitas yang dipakai salah. Materi harus preskriptif dan akurat.',
    deliverables: [
      'Modul kriptografi dan identitas',
      'Contoh hash/salt/TLS/PKI yang aman',
      'Quiz, misi sha256sum/md5sum, lab integritas',
      'Status dua modul menjadi ready'
    ],
    acceptance: [
      'Tidak menyarankan MD5/SHA-1 untuk keamanan.',
      'Klaim TLS/PKI/forward secrecy akurat.',
      'Tidak ada secret nyata di contoh.',
      'Validator lulus dan link HTTPS.'
    ],
    verification: [
      'node scripts/validate.mjs',
      'Jalankan misi sha256sum/md5sum',
      'Cek quiz MFA/session/JWT'
    ],
    outOfScope: ['Kode kripto nyata', 'Perubahan schema', 'Modul serangan'],
    handoff: [
      'Sebutkan sumber standar (NIST/OWASP).',
      'Serahkan ke security untuk review klaim.'
    ]
  },
  {
    id: 'T-015',
    title: 'Write web security and common attacks modules',
    role: 'content',
    reviewers: ['data-platform', 'qa', 'security'],
    status: 'todo',
    priority: 'P0',
    size: 'L',
    pr: '#8',
    dependsOn: ['T-014'],
    files: [
      'content/modules/05-serangan.js',
      'content/module-index.js'
    ],
    context: 'OWASP, SQLi, XSS, CSRF, malware, dan social engineering adalah inti pemahaman offensive/defensive.',
    deliverables: [
      'Modul web security dan serangan umum',
      'Contoh rentan/aman hanya untuk lab lokal',
      'Quiz, misi, lab DVWA/Juice Shop',
      'Status dua modul menjadi ready'
    ],
    acceptance: [
      'OWASP Top 10 dan kill chain akurat.',
      'Lab hanya menargetkan localhost/VM milik sendiri.',
      'Tidak ada payload yang menargetkan pihak ketiga.',
      'Validator lulus.'
    ],
    verification: [
      'node scripts/validate.mjs',
      'Buka source login.php di terminal',
      'Jalankan misi curl/grep/nmap',
      'Cek safety note lab'
    ],
    outOfScope: ['Hosting target rentan', 'Kode UI', 'Perubahan schema'],
    handoff: [
      'Catat asumsi lab dan versi target.',
      'Serahkan ke security untuk review etika.'
    ]
  },
  {
    id: 'T-016',
    title: 'Write blue team, forensics, and recon modules',
    role: 'content',
    reviewers: ['data-platform', 'qa', 'security'],
    status: 'todo',
    priority: 'P0',
    size: 'L',
    pr: '#9',
    dependsOn: ['T-015'],
    files: [
      'content/modules/06-blue-team.js',
      'content/module-index.js'
    ],
    context: 'Defender perlu membaca log, merespons insiden, dan memahami recon/OSINT secara etis.',
    deliverables: [
      'Modul blue team/IR/forensik dan recon/threat intel/pentest',
      'Timeline auth.log, event Windows, lab deteksi',
      'Status dua modul menjadi ready'
    ],
    acceptance: [
      'IR six-step, order of volatility, chain of custody akurat.',
      'Query/log konsisten dengan data lab.',
      'OSINT/recon menekankan izin dan etika.',
      'Validator lulus.'
    ],
    verification: [
      'node scripts/validate.mjs',
      'Jalankan misi grep/tail/nmap/whois',
      'Cek timeline auth.log dan event ID'
    ],
    outOfScope: ['Kode SIEM nyata', 'Perubahan schema', 'Modul cloud'],
    handoff: [
      'Sebutkan sumber log dan asumsi timeline.',
      'Serahkan ke QA/security.'
    ]
  },
  {
    id: 'T-017',
    title: 'Write cloud, programming, and career modules',
    role: 'content',
    reviewers: ['data-platform', 'qa', 'security'],
    status: 'todo',
    priority: 'P0',
    size: 'L',
    pr: '#10',
    dependsOn: ['T-016'],
    files: [
      'content/modules/07-cloud-prog-karier.js',
      'content/module-index.js'
    ],
    context: 'Modul penutup menghubungkan skill teknis ke cloud, coding, sertifikasi, portofolio, dan rencana 90 hari.',
    deliverables: [
      'Modul cloud security, programming, dan karier',
      'Quiz, misi aws/runtime, lab posture cloud',
      'Status tiga modul menjadi ready; total 17 ready'
    ],
    acceptance: [
      'Shared responsibility/IAM/storage/IaC akurat.',
      'Contoh kode tidak menargetkan sistem pihak ketiga.',
      'Sertifikasi/CTF dijelaskan sebagai pelengkap.',
      'Validator strict lulus untuk 17 modul.'
    ],
    verification: [
      'node scripts/validate.mjs',
      'node scripts/agents.mjs check',
      'Jalankan misi aws/python3/bash/node',
      'Cek final review 8 misi'
    ],
    outOfScope: ['Hosting cloud nyata', 'Kode app', 'Perubahan schema'],
    handoff: [
      'Pastikan semua 17 modul ready dan validator strict.',
      'Serahkan ke QA/security untuk review akhir.'
    ]
  }
];
