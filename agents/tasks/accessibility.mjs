/**
 * Tasks owned by Accessibility Engineer.
 */
export default [
  {
    id: 'T-021',
    title: 'Audit keyboard, focus, contrast, and screen reader flows',
    role: 'accessibility',
    reviewers: ['frontend', 'qa'],
    status: 'todo',
    priority: 'P1',
    size: 'M',
    pr: '#15',
    dependsOn: ['T-018', 'T-019'],
    files: ['docs/A11Y_REPORT.md'],
    context: 'Target WCAG 2.1 AA harus dibuktikan, bukan diasumsikan. Audit independen menemukan masalah yang terlewat oleh pembuat UI.',
    deliverables: [
      'Laporan audit per route dan komponen',
      'Bukti keyboard/fokus/axe/kontras',
      'Daftar temuan dengan severity dan rekomendasi',
      'Daftar task remediasi (bukan perbaikan langsung)'
    ],
    acceptance: [
      'Semua route utama diaudit.',
      'Tab/Enter/Esc/Ctrl+K/arrow diuji.',
      'Fokus terlihat dan tidak terperangkap.',
      'Kontras teks/status memadai.',
      'Tidak ada status yang hanya disampaikan lewat warna.',
      'axe tidak menemukan pelanggaran serius.'
    ],
    verification: [
      'Keyboard-only walkthrough semua route',
      'axe DevTools di dashboard, roadmap, lesson, terminal, progress',
      'Cek prefers-reduced-motion',
      'Screenshot/fokus record'
    ],
    outOfScope: ['Memperbaiki kode UI', 'Mengubah desain visual', 'Menambah dependency'],
    handoff: [
      'Temuan dengan severity + lokasi + cara verifikasi.',
      'Buat task remediasi terpisah untuk frontend.',
      'Verifikasi ulang setelah perbaikan.'
    ],
    risk: 'Audit setelah konten banyak bisa menemukan masalah struktural; mulai dari shell dan lesson.'
  }
];
