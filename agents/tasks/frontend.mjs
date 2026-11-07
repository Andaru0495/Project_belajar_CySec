/**
 * Tasks owned by Frontend Engineer.
 */
export default [
  {
    id: 'T-003',
    title: 'Build app shell, design system, router, and theme',
    role: 'frontend',
    reviewers: ['tech-lead', 'accessibility', 'qa'],
    status: 'done',
    priority: 'P0',
    size: 'M',
    pr: '#2',
    dependsOn: ['T-002'],
    files: [
      'index.html',
      'assets/css/style.css',
      'assets/js/app.js',
      'assets/icons/favicon.svg'
    ],
    context: 'Situs harus bisa dibuka tanpa error dan punya kerangka navigasi sebelum konten/engine ditambahkan.',
    deliverables: [
      'Shell HTML dengan topbar, sidebar, main, search overlay, toast',
      'Design system dark/light dan responsif',
      'Hash router untuk semua route utama',
      'Placeholder view yang jelas',
      'Tema tersimpan dan mengikuti prefers-color-scheme'
    ],
    acceptance: [
      'Semua route utama dapat dibuka tanpa console error.',
      'Sidebar mobile off-canvas dengan aria-expanded dan scrim.',
      'Tidak ada inline script/event handler.',
      'Responsif 360/768/1280 tanpa horizontal scroll.',
      'Skip link, fokus route, dan Ctrl/Cmd+K bekerja.'
    ],
    verification: [
      'python3 -m http.server 8000',
      'node --check assets/js/app.js',
      'Uji keyboard: Tab, Enter, Esc, Ctrl+K',
      'Screenshot desktop + mobile'
    ],
    outOfScope: ['Konten modul', 'Terminal engine', 'PWA'],
    handoff: [
      'Struktur route dan event delegation siap diperluas.',
      'Design tokens dan class utama didokumentasikan di CSS/TSD.',
      'Serahkan ke accessibility/QA untuk audit awal.'
    ]
  },
  {
    id: 'T-005',
    title: 'Render roadmap and module catalog with progress',
    role: 'frontend',
    reviewers: ['data-platform', 'accessibility', 'qa'],
    status: 'done',
    priority: 'P0',
    size: 'M',
    pr: '#3',
    dependsOn: ['T-003', 'T-004'],
    files: [
      'assets/js/app.js',
      'assets/css/style.css'
    ],
    context: 'Pengguna perlu melihat seluruh peta belajar dan posisinya, serta memilih modul yang tersedia.',
    deliverables: [
      'View roadmap dengan 202 node, filter, pencarian, progres per bagian',
      'View katalog 17 modul dengan filter track/status',
      'Link ke modul ready; badge untuk planned',
      'Progress sidebar dan selector dari state'
    ],
    acceptance: [
      'Semua node tampil dan total per bagian sesuai data.',
      'Node selesai punya penanda non-warna dan progres berubah.',
      'Modul planned menampilkan "konten segera hadir".',
      'Filter/pencarian bekerja dan tidak memecahkan layout.'
    ],
    verification: [
      'node scripts/validate.mjs',
      'Bandingkan jumlah node dengan data',
      'Uji 360px dan keyboard',
      'Screenshot roadmap + katalog'
    ],
    outOfScope: ['Lesson renderer', 'Konten modul', 'Progress persistence'],
    handoff: [
      'Route #/roadmap dan #/modules stabil.',
      'Catat selector/format data yang dipakai.',
      'Serahkan ke QA untuk filter/progres.'
    ]
  },
  {
    id: 'T-006',
    title: 'Render lesson content, TOC, terms, and notes',
    role: 'frontend',
    reviewers: ['content', 'accessibility', 'qa'],
    status: 'todo',
    priority: 'P0',
    size: 'L',
    pr: '#4',
    dependsOn: ['T-005', 'T-008'],
    files: [
      'assets/js/app.js',
      'assets/css/style.css'
    ],
    context: 'Modul harus dapat dibaca dengan struktur yang jelas dan catatan yang tersimpan lokal.',
    deliverables: [
      'Lazy loader file modul',
      'Renderer semua block type dengan escaping',
      'TOC sticky + scrollspy',
      'Terms accordion',
      'Notes autosave dan indikator tersimpan',
      'Tombol tandai selesai + prev/next'
    ],
    acceptance: [
      'Semua block type dirender dengan aman.',
      'Konten berisi <script> tampil sebagai teks, bukan dieksekusi.',
      'TOC mengikuti scroll dan dapat diklik.',
      'Notes tetap setelah refresh.',
      'Deep link #/module/:id bekerja.'
    ],
    verification: [
      'node scripts/validate.mjs',
      'node --check assets/js/app.js',
      'Uji XSS-like input di konten',
      'Uji keyboard TOC/notes'
    ],
    outOfScope: ['Quiz scoring', 'Terminal', 'Progress page'],
    handoff: [
      'Block renderer siap dipakai semua modul.',
      'Catat batasan markdown inline dan escaping.',
      'Serahkan ke content/QA.'
    ]
  },
  {
    id: 'T-007',
    title: 'Implement quiz engine with explanations and best score',
    role: 'frontend',
    reviewers: ['content', 'qa', 'accessibility'],
    status: 'todo',
    priority: 'P0',
    size: 'M',
    pr: '#4',
    dependsOn: ['T-006'],
    files: [
      'assets/js/app.js',
      'assets/css/style.css'
    ],
    context: 'Kuis adalah umpan balik utama bagi pembelajar; harus jelas, dapat diulang, dan menyimpan skor terbaik.',
    deliverables: [
      'Renderer soal 4 opsi',
      'Feedback benar/salah + penjelasan',
      'Skor berjalan dan best score tersimpan',
      'Tombol ulangi tanpa menghapus best score',
      'Status a11y aria-live'
    ],
    acceptance: [
      'Hanya satu jawaban benar per soal.',
      'Penjelasan muncul untuk benar dan salah.',
      'Best score tersimpan setelah refresh.',
      'Ulang kuis mereset tampilan, bukan best score.',
      'Keyboard dapat menjawab semua soal.'
    ],
    verification: [
      'Uji jawaban benar/salah di modul fondasi',
      'Refresh setelah kuis',
      'Cek aria-live dengan screen reader/axe'
    ],
    outOfScope: ['Timer', 'Mode ujian', 'Bank soal adaptif'],
    handoff: [
      'Format skor: best/total.',
      'Serahkan ke content untuk validasi jawaban dan QA untuk regresi.'
    ]
  },
  {
    id: 'T-009',
    title: 'Implement virtual terminal engine and shell tests',
    role: 'frontend',
    reviewers: ['security', 'tech-lead', 'qa'],
    status: 'todo',
    priority: 'P1',
    size: 'L',
    pr: '#11',
    dependsOn: ['T-003'],
    files: [
      'assets/js/terminal.js',
      'scripts/test-terminal.mjs',
      'docs/TSD.md'
    ],
    context: 'Latihan perintah harus aman, offline, dan tidak menyentuh sistem nyata.',
    deliverables: [
      'VirtualShell dengan FS, cwd, history, permission',
      'Perintah inti, pipe, redirection, sudo',
      'Output jaringan/cloud simulasi',
      'Test shell dan pola misi'
    ],
    acceptance: [
      'Perintah yang didokumentasikan berjalan.',
      'Pipe/redirection/sudo bekerja.',
      'cat /etc/shadow tanpa sudo ditolak; dengan sudo berhasil.',
      'Tidak ada eval/network/filesystem nyata.',
      'Test terminal lulus.'
    ],
    verification: [
      'node scripts/test-terminal.mjs',
      'node --check assets/js/terminal.js',
      'Uji input HTML/JS tidak dieksekusi'
    ],
    outOfScope: ['UI terminal', 'Integrasi lesson', 'Misi baru'],
    handoff: [
      'API CyberTerminal.VirtualShell/mount stabil.',
      'Catat perintah yang didukung di help.',
      'Serahkan ke QA/security untuk uji isolasi.'
    ]
  },
  {
    id: 'T-010',
    title: 'Integrate terminal UI, challenges, and lesson missions',
    role: 'frontend',
    reviewers: ['qa', 'accessibility', 'content'],
    status: 'todo',
    priority: 'P1',
    size: 'M',
    pr: '#11',
    dependsOn: ['T-009', 'T-006'],
    files: [
      'assets/js/app.js',
      'assets/css/style.css'
    ],
    context: 'Misi terminal harus bisa dijalankan dari modul, divalidasi, dan statusnya tersimpan.',
    deliverables: [
      'Halaman terminal bebas',
      'Mount terminal di lesson',
      'Daftar misi + hint + solusi',
      'Validasi pola dan simpan status misi'
    ],
    acceptance: [
      'Misi selesai hanya jika pola cocok.',
      'Status misi tetap setelah refresh.',
      'Riwayat, reset, autoscroll bekerja.',
      'Tidak ada eksekusi di luar simulator.'
    ],
    verification: [
      'Selesaikan 3 misi dari modul berbeda',
      'Refresh dan cek status',
      'Uji keyboard input terminal'
    ],
    outOfScope: ['Misi baru', 'Terminal nyata', 'Backend'],
    handoff: [
      'Status misi disimpan per moduleId.',
      'Serahkan ke content/QA untuk validasi misi.'
    ]
  },
  {
    id: 'T-018',
    title: 'Build progress page, export/import, glossary, and global search',
    role: 'frontend',
    reviewers: ['data-platform', 'accessibility', 'qa'],
    status: 'todo',
    priority: 'P1',
    size: 'M',
    pr: '#12',
    dependsOn: ['T-008', 'T-017'],
    files: [
      'assets/js/app.js',
      'assets/css/style.css',
      'docs/TSD.md'
    ],
    context: 'Pengguna perlu melihat capaian, memindahkan progres, dan menemukan istilah/materi dengan cepat.',
    deliverables: [
      'Halaman progres dengan statistik',
      'Ekspor/impor/reset dengan konfirmasi',
      'Glosarium agregat dari semua modul',
      'Pencarian Ctrl+K lintas modul/topik/istilah'
    ],
    acceptance: [
      'Statistik modul/kuis/terminal/streak akurat.',
      'Export JSON dan import memvalidasi versi/bentuk.',
      'Reset berkonfirmasi dan tidak crash.',
      'Search keyboard-navigable dan empty state jelas.'
    ],
    verification: [
      'Export → reset → import',
      'Import file rusak → error jelas',
      'Cari MFA/subnet/phishing',
      'Uji keyboard dan 360px'
    ],
    outOfScope: ['Sinkronisasi server', 'Leaderboard', 'Analytics'],
    handoff: [
      'Format ekspor didokumentasikan.',
      'Serahkan ke QA untuk uji data edge case.'
    ]
  },
  {
    id: 'T-019',
    title: 'Add PWA manifest, service worker, and offline support',
    role: 'frontend',
    reviewers: ['devops', 'security', 'qa'],
    status: 'todo',
    priority: 'P1',
    size: 'M',
    pr: '#13',
    dependsOn: ['T-018', 'T-010'],
    files: [
      'manifest.webmanifest',
      'sw.js',
      'assets/icons/favicon.svg',
      'assets/icons/icon-192.png',
      'assets/icons/icon-512.png',
      'assets/js/app.js',
      'index.html',
      'docs/TSD.md'
    ],
    context: 'Pengguna dengan internet tidak stabil harus tetap bisa membuka situs dan modul yang sudah dimuat.',
    deliverables: [
      'Manifest valid dan installable',
      'Service worker precache app shell + runtime cache modul',
      'Strategi update/version cache',
      'Offline fallback'
    ],
    acceptance: [
      'Setelah load pertama, offline membuka #/ dan modul yang sudah dibuka.',
      'Cache lama dibersihkan saat versi naik.',
      'Tidak meng-cache request non-GET/cross-origin.',
      'Lighthouse PWA pass.'
    ],
    verification: [
      'DevTools → Application → Manifest/Service Worker',
      'Mode offline',
      'Naikkan versi cache dan reload'
    ],
    outOfScope: ['Push notification', 'Background sync', 'Install prompt kustom'],
    handoff: [
      'Cara bump cache didokumentasikan.',
      'Serahkan ke QA untuk uji offline.'
    ]
  }
];
