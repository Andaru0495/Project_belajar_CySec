/**
 * Tasks owned by Technical Writer.
 */
export default [
  {
    id: 'T-024',
    title: 'Finalize docs, changelog, and release notes for v1.0',
    role: 'technical-writer',
    reviewers: ['product-manager', 'tech-lead'],
    status: 'todo',
    priority: 'P1',
    size: 'M',
    pr: '#15',
    dependsOn: ['T-023'],
    files: [
      'README.md',
      'docs/PRD.md',
      'docs/TSD.md',
      'docs/PR_PLAN.md',
      'docs/RELEASE_NOTES_v1.0.md',
      'CHANGELOG.md'
    ],
    context: 'Dokumentasi akhir harus cocok dengan produk yang benar-benar dirilis dan bisa dipahami pengguna baru.',
    deliverables: [
      'README final: URL, quick start, fitur, batasan, lisensi',
      'Changelog dan release notes v1.0',
      'Sinkronisasi angka/status di PRD/TSD/PR plan',
      'Link check dan hapus klaim yang belum ada'
    ],
    acceptance: [
      'Semua link lokal valid.',
      'Tidak ada klaim fitur yang belum dirilis.',
      'Angka modul/node/PR konsisten.',
      'Release notes memuat fitur, batasan, dan next steps.',
      'Tidak ada secret/PII.'
    ],
    verification: [
      'node scripts/validate.mjs',
      'Baca README sebagai pengguna baru',
      'Cek anchor/link docs',
      'Cek changelog terhadap PR yang merged'
    ],
    outOfScope: ['Mengubah kode/konten materi', 'Menentukan arsitektur', 'Membuat klaim sertifikasi'],
    handoff: [
      'Dokumen siap untuk tag v1.0.0.',
      'Tandai pertanyaan terbuka yang belum diputuskan.',
      'Serahkan ke PM untuk sign-off rilis.'
    ]
  }
];
