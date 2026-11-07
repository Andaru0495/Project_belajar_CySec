/**
 * Tasks owned by QA Engineer.
 */
export default [
  {
    id: 'T-023',
    title: 'Run release QA across routes, browsers, offline, and data flows',
    role: 'qa',
    reviewers: ['product-manager', 'tech-lead', 'accessibility', 'security'],
    status: 'todo',
    priority: 'P0',
    size: 'L',
    pr: '#15',
    dependsOn: ['T-020', 'T-021', 'T-022'],
    files: ['docs/QA_REPORT.md'],
    context: 'Rilis v1.0 harus dibuktikan bekerja di alur utama, bukan hanya di mesin pengembang.',
    deliverables: [
      'QA report per acceptance criteria',
      'Bukti desktop/mobile, dark/light, keyboard',
      'Hasil offline dan export/import',
      'Lighthouse/axe summary',
      'Daftar blocker atau sign-off'
    ],
    acceptance: [
      'Semua route dapat dibuka dan refresh/back/forward bekerja.',
      '17 modul terbuka; quiz, terminal, notes, progress berfungsi.',
      'Export → reset → import berhasil.',
      'Offline membuka shell dan modul yang sudah dimuat.',
      'Tidak ada console error di alur utama.',
      'Lighthouse/a11y memenuhi target atau ada pengecualian tertulis.'
    ],
    verification: [
      'Chrome/Firefox/Safari atau emulator',
      '360/768/1280 px',
      'Dark/light, keyboard, offline',
      'Lighthouse + axe DevTools',
      'node scripts/validate.mjs; node scripts/test-terminal.mjs'
    ],
    outOfScope: ['Memperbaiki kode', 'Memutuskan pengecualian keamanan', 'Menambah fitur'],
    handoff: [
      'Tulis hasil per kriteria: lulus/gagal + bukti.',
      'Buka bug dengan severity dan langkah reproduksi.',
      'Beri QA sign-off atau daftar blocker.'
    ],
    risk: 'QA yang hanya menguji happy path akan melewatkan regresi data/offline.'
  }
];
