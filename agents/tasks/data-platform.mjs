/**
 * Tasks owned by Data & Platform Engineer (backend-like).
 */
export default [
  {
    id: 'T-004',
    title: 'Define content schema, module index, roadmap data, and validator',
    role: 'data-platform',
    reviewers: ['content', 'tech-lead', 'qa'],
    status: 'done',
    priority: 'P0',
    size: 'M',
    pr: '#3',
    dependsOn: ['T-002'],
    files: [
      'content/roadmap.js',
      'content/module-index.js',
      'scripts/validate.mjs',
      'docs/TSD.md'
    ],
    context: 'Roadmap, katalog, lesson, dan progress semuanya bergantung pada kontrak data yang stabil. Tanpa schema, UI dan konten akan saling menebak.',
    deliverables: [
      'Data 202 node roadmap dalam 12 bagian',
      'Module index 17 modul dengan file, order, metadata, dan status planned/ready',
      'Validator schema, duplikasi, referensi, regex misi, link',
      'Dokumentasi kontrak data di TSD'
    ],
    acceptance: [
      '202 node unik dan semua referensi modul valid.',
      '17 modul unik dengan status planned/ready.',
      'Validator menolak ID duplikat, modul ready tanpa file, regex invalid, dan link non-HTTPS.',
      'Validator lulus pada data saat ini.'
    ],
    verification: [
      'node scripts/validate.mjs',
      'node -e "count nodes/modules"',
      'Uji negatif: duplikasi ID dan pattern salah harus gagal'
    ],
    outOfScope: ['View roadmap/katalog', 'Isi modul', 'Progress runtime'],
    handoff: [
      'Frontend memakai module-index untuk katalog dan lazy load.',
      'Content mengubah status modul menjadi ready saat file modul ditambahkan.',
      'Schema/versi perubahan berikutnya harus lewat task data-platform.'
    ],
    risk: 'Perubahan schema setelah konten banyak akan mahal; kunci bentuk awal sebelum menulis 17 modul.'
  },
  {
    id: 'T-008',
    title: 'Implement local progress schema and derived selectors',
    role: 'data-platform',
    reviewers: ['frontend', 'tech-lead', 'qa'],
    status: 'done',
    priority: 'P0',
    size: 'M',
    pr: '#4',
    dependsOn: ['T-004'],
    files: [
      'assets/js/state.js',
      'docs/TSD.md'
    ],
    context: 'Progres harus tersimpan lokal, bisa dimigrasi, diekspor/impor, dan tidak mengirim data ke server.',
    deliverables: [
      'Default state dan versi schema',
      'Load/save localStorage dengan penanganan quota/error',
      'Migrasi versi dan validasi impor',
      'Selector progres modul, roadmap, kuis, terminal, dan streak',
      'API global yang dipakai app.js'
    ],
    acceptance: [
      'Key localStorage berversi dan tidak menyimpan secret/PII.',
      'State rusak/kosong tidak membuat aplikasi crash.',
      'Ekspor menghasilkan JSON tervalidasi; impor menolak bentuk salah.',
      'Selector menghitung progres modul dan roadmap secara konsisten.'
    ],
    verification: [
      'node --check assets/js/state.js',
      'Manual: set progress → refresh → nilai tetap',
      'Manual: import JSON rusak → error jelas, state lama tidak rusak'
    ],
    outOfScope: ['UI halaman progres', 'Chart/visualisasi', 'Sinkronisasi server'],
    handoff: [
      'Frontend memakai selector, bukan menghitung ulang di view.',
      'QA menguji export → reset → import.',
      'Perubahan schema berikutnya wajib migration + versi baru.'
    ],
    risk: 'Schema drift dapat menghapus progres pengguna; selalu sediakan migrasi dan fallback default.'
  }
];
