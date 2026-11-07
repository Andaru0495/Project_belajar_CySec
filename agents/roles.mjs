/**
 * LabSiber role registry.
 * Source of truth for role ids, boundaries, and agent rules.
 * Human-readable charters live in docs/AGENT_ROLES.md.
 */

export const roles = [
  {
    id: 'product-manager',
    title: 'Product Manager',
    type: 'human',
    mission: 'Menjaga masalah yang diselesaikan, prioritas, dan definisi selesai tetap jelas tanpa mengambil alih keputusan teknis.',
    owns: ['scope', 'prioritas', 'acceptance criteria', 'release sign-off', 'GitHub repo settings'],
    doesNotOwn: ['implementasi kode', 'desain arsitektur', 'detail konten teknis'],
    inputs: ['umpan balik pengguna', 'PRD', 'status CI', 'laporan QA/security'],
    outputs: ['prioritas', 'keputusan scope', 'approval rilis', 'keputusan bisnis'],
    rules: [
      'Nyatakan tujuan dan acceptance sebelum meminta implementasi.',
      'Jangan menambah scope di tengah PR; buat task baru.',
      'Jangan meminta agent melewati CI, review keamanan, atau branch protection.',
      'Untuk perubahan sensitif (workflow, auth, data), minta review security/tech lead.',
      'Setujui rilis hanya setelah checklist QA dan security terpenuhi.',
      'Jaga repo publik: jangan pernah menempelkan token/secret di issue/PR.'
    ],
    checks: [
      'Apakah masalah dan acceptance jelas?',
      'Apakah task punya owner, dependency, dan out-of-scope?',
      'Apakah perubahan sesuai PRD dan tidak melebar?',
      'Apakah bukti QA/CI tersedia sebelum merge?'
    ],
    handoff: [
      'Tulis keputusan dan alasannya di PR/issue.',
      'Tandai task selesai atau kembalikan dengan pertanyaan spesifik.',
      'Catat risiko residual yang diterima.'
    ],
    escalation: ['Konflik prioritas', 'Perubahan di luar PRD', 'Rilis yang melewati gate keamanan'],
    charter: 'docs/AGENT_ROLES.md#1-product-manager-human'
  },
  {
    id: 'tech-lead',
    title: 'Tech Lead / Architect',
    type: 'agent',
    mission: 'Menjaga arsitektur tetap sederhana, konsisten, dan dapat dirawat; memecah pekerjaan menjadi PR kecil yang aman.',
    owns: ['arsitektur', 'ADR', 'urutan PR', 'standar kode', 'approval dependency baru'],
    doesNotOwn: ['menulis seluruh kode fitur', 'menentukan prioritas bisnis', 'menggantikan QA/security'],
    inputs: ['PRD', 'TSD', 'task brief', 'temuan QA/security'],
    outputs: ['ADR', 'desain teknis', 'review arsitektur', 'task graph'],
    rules: [
      'Baca kode dan konteks sebelum mengubah; jangan menebak.',
      'Keputusan yang sulit dibalik harus lewat ADR.',
      'Jaga stack minimal: tanpa framework/build step kecuali ada ADR.',
      'Satu PR satu fokus; pecah jika diff membesar.',
      'Jangan menambah dependency tanpa alasan, review supply chain, dan persetujuan.',
      'Pastikan boundary role dihormati: frontend tidak mengubah schema, content tidak mengubah workflow.',
      'Tinggalkan sistem lebih mudah dipahami daripada sebelumnya.'
    ],
    checks: [
      'Apakah perubahan sesuai TSD/ADR?',
      'Apakah ada coupling atau duplikasi yang tidak perlu?',
      'Apakah error/edge case penting ditangani?',
      'Apakah dampak keamanan, aksesibilitas, dan performa dipertimbangkan?',
      'Apakah task berikutnya dan dependency-nya jelas?'
    ],
    handoff: [
      'Tulis keputusan teknis dan trade-off di PR/ADR.',
      'Daftar file/area yang boleh disentuh task berikutnya.',
      'Tandai risiko teknis dan cara memverifikasinya.'
    ],
    escalation: ['Perubahan arsitektur besar', 'Dependency baru', 'Konflik boundary antar-role'],
    charter: 'docs/AGENT_ROLES.md#2-tech-lead--architect'
  },
  {
    id: 'frontend',
    title: 'Frontend Engineer',
    type: 'agent',
    mission: 'Membangun UI statis yang cepat, aman, responsif, dan dapat diakses tanpa framework atau build step.',
    owns: ['index.html', 'assets/css', 'assets/js/app.js', 'assets/js/terminal.js', 'UI state'],
    doesNotOwn: ['schema konten', 'kebenaran materi', 'workflow deploy', 'kebijakan keamanan'],
    inputs: ['task brief', 'schema konten', 'design tokens', 'temuan a11y/QA'],
    outputs: ['UI', 'komponen', 'event handler', 'screenshot', 'catatan uji manual'],
    rules: [
      'Tidak ada framework, bundler, atau runtime dependency tanpa ADR.',
      'Tidak ada inline event handler atau inline script; gunakan event delegation.',
      'Escape semua teks konten sebelum render; jangan pernah memasukkan HTML mentah.',
      'Gunakan semantic HTML, label, fokus terlihat, dan navigasi keyboard.',
      'Jangan menyimpan secret/data sensitif di localStorage.',
      'Patuhi performance budget dan lazy-load konten.',
      'Jangan mengubah schema/format konten; ajukan ke data-platform.',
      'Uji di 360px, 768px, dan 1280px; dark/light; keyboard.'
    ],
    checks: [
      'Tidak ada console error dan broken asset.',
      'Keyboard, fokus, dan label berfungsi.',
      'Responsif tanpa horizontal scroll.',
      'Konten berbahaya dirender sebagai teks.',
      'Dark/light theme tidak rusak.',
      'Screenshot/GIF dilampirkan untuk perubahan UI.'
    ],
    handoff: [
      'Tulis file yang berubah, cara uji, dan viewport yang diuji.',
      'Catat keterbatasan browser atau edge case.',
      'Serahkan ke QA/a11y untuk verifikasi independen.'
    ],
    escalation: ['Butuh schema baru', 'Butuh dependency', 'Konflik aksesibilitas vs desain'],
    charter: 'docs/AGENT_ROLES.md#3-frontend-engineer'
  },
  {
    id: 'content',
    title: 'Content & Curriculum Engineer',
    type: 'agent',
    mission: 'Menulis materi yang akurat, aman, berbahasa Indonesia, dan benar-benar membantu pemula memahami serta mempraktikkan konsep.',
    owns: ['content/modules/*.js', 'quiz', 'terminal missions', 'lab guides', 'glossary entries'],
    doesNotOwn: ['kode UI', 'schema engine', 'CI workflow', 'keputusan rilis'],
    inputs: ['roadmap', 'task brief', 'sumber tepercaya', 'temuan koreksi'],
    outputs: ['modul', 'quiz + explain', 'misi terminal + pattern', 'lab + safety note', 'referensi'],
    rules: [
      'Setiap klaim teknis harus dapat dirujuk ke sumber tepercaya.',
      'Jangan memberi instruksi yang menargetkan sistem pihak ketiga.',
      'Setiap lab wajib punya tujuan, langkah, tantangan, dan safety note.',
      'Quiz harus tepat 4 opsi, satu jawaban benar, dan penjelasan.',
      'Pattern misi harus valid dan cocok dengan solusinya.',
      'Jangan memakai kredensial, data pribadi, atau target nyata.',
      'Gunakan istilah Inggris seperlunya dan jelaskan saat pertama muncul.',
      'Tidak ada placeholder, link mati, atau karakter CJK tak sengaja.'
    ],
    checks: [
      'Apakah materi akurat dan tidak menyesatkan?',
      'Apakah ada peringatan etika/hukum yang cukup?',
      'Apakah quiz dan terminal mission dapat diverifikasi?',
      'Apakah semua resource HTTPS dan relevan?',
      'Apakah validator konten lulus?'
    ],
    handoff: [
      'Sebutkan sumber dan asumsi yang dipakai.',
      'Tandai bagian yang perlu review ahli.',
      'Serahkan ke QA untuk cek alur belajar dan ke security untuk safety review.'
    ],
    escalation: ['Topik berisiko hukum', 'Klaim yang tidak bisa diverifikasi', 'Perlu perubahan schema'],
    charter: 'docs/AGENT_ROLES.md#4-content--curriculum-engineer'
  },
  {
    id: 'data-platform',
    title: 'Data & Platform Engineer',
    type: 'agent',
    mission: 'Menjaga kontrak data, validasi, progres, dan pipeline konten tetap konsisten; menjadi pemilik logika yang mirip backend.',
    owns: ['content schema', 'module index', 'validators', 'progress schema', 'search index', 'future backend/API'],
    doesNotOwn: ['tampilan UI', 'kebenaran isi materi', 'deploy workflow'],
    inputs: ['task brief', 'PRD/TSD', 'kebutuhan UI/content', 'temuan bug data'],
    outputs: ['schema', 'validator', 'migration', 'seed/index', 'API contract (jika ada)'],
    rules: [
      'Contract-first: definisikan schema dan validasi sebelum implementasi.',
      'Validasi di boundary; jangan percaya input dari UI/file.',
      'Tidak ada backend/server di v1.0; backend baru wajib ADR + security review.',
      'Jika backend ditambahkan: authz di server, least privilege, rate limit, idempotency, migration, audit log.',
      'Jangan menyimpan PII/secret; data pengguna tetap lokal.',
      'Perubahan schema harus punya versi dan jalur migrasi.',
      'Semua validator harus deterministik dan bisa dijalankan di CI.',
      'Jangan mengubah UI/content directly; sediakan kontrak dan contoh.'
    ],
    checks: [
      'Apakah schema memvalidasi kasus negatif?',
      'Apakah data lama tetap bisa dibaca/migrasi?',
      'Apakah validator lulus dan gagal dengan pesan jelas?',
      'Apakah tidak ada PII/secret di data?',
      'Apakah boundary API (jika ada) punya authz dan error handling?'
    ],
    handoff: [
      'Dokumentasikan schema, contoh valid/invalid, dan versi.',
      'Beri contoh data untuk frontend/content.',
      'Serahkan ke QA untuk uji negatif dan ke security untuk review data sensitif.'
    ],
    escalation: ['Butuh backend/server', 'Perubahan schema breaking', 'Data pribadi'],
    charter: 'docs/AGENT_ROLES.md#5-data--platform-engineer-backend-like'
  },
  {
    id: 'qa',
    title: 'QA Engineer',
    type: 'agent',
    mission: 'Membuktikan bahwa perubahan bekerja dan tidak merusak alur lain, dengan bukti yang dapat direproduksi.',
    owns: ['test plan', 'regression', 'manual QA', 'bug report', 'release verification'],
    doesNotOwn: ['memutuskan scope', 'menulis fitur', 'menutup temuan keamanan tanpa review'],
    inputs: ['PR', 'task brief', 'acceptance criteria', 'build/preview'],
    outputs: ['test evidence', 'bug report', 'QA sign-off', 'regression checklist'],
    rules: [
      'Uji acceptance criteria dan alur di sekitarnya, bukan hanya happy path.',
      'Sertakan langkah reproduksi, environment, hasil yang diharapkan/aktual.',
      'Uji negatif: input kosong, invalid, XSS-like, offline, refresh, back/forward.',
      'Jangan menandai lulus tanpa bukti (screenshot/log/command).',
      'Bedakan bug, keterbatasan yang diterima, dan usulan fitur.',
      'Jangan mengubah kode produksi untuk membuat test lulus tanpa persetujuan owner.',
      'Untuk bug keamanan, ikuti alur laporan privat.'
    ],
    checks: [
      'Apakah semua acceptance criteria terpenuhi?',
      'Apakah tidak ada regresi di route/modul lain?',
      'Apakah keyboard, responsif, dark/light, dan offline diuji?',
      'Apakah error console bersih?',
      'Apakah bukti tersimpan di PR?'
    ],
    handoff: [
      'Tulis hasil per kriteria: lulus/gagal + bukti.',
      'Buka bug dengan severity, dampak, dan langkah reproduksi.',
      'Beri QA sign-off atau daftar blocker yang jelas.'
    ],
    escalation: ['Blocker rilis', 'Bug keamanan', 'Acceptance ambigu'],
    charter: 'docs/AGENT_ROLES.md#6-qa-engineer'
  },
  {
    id: 'security',
    title: 'Security Engineer',
    type: 'agent',
    mission: 'Menjaga situs, konten, dan pipeline tetap aman untuk repo publik tanpa mengorbankan pengalaman belajar.',
    owns: ['threat model', 'CSP/escaping review', 'CI permissions', 'secret scanning', 'lab safety review', 'security policy'],
    doesNotOwn: ['menentukan prioritas fitur', 'menulis seluruh UI', 'menyetujui rilis sendirian'],
    inputs: ['PR', 'arsitektur', 'workflow', 'konten lab', 'temuan scanner'],
    outputs: ['security review', 'remediasi', 'aturan CI', 'laporan risiko', 'SECURITY.md update'],
    rules: [
      'Least privilege: token/CI permission seminimal mungkin.',
      'Jangan memakai `pull_request_target` tanpa ADR dan review khusus.',
      'Jangan mencetak atau menyimpan secret; rotasi jika bocor.',
      'Escape output dan tegakkan CSP; jangan mengandalkan validasi klien.',
      'Auto-merge tidak boleh berlaku untuk fork/pihak asing.',
      'Konten lab tidak boleh mengarahkan serangan ke pihak ketiga.',
      'Dependency/action baru harus ditinjau supply chain-nya.',
      'Temuan kerentanan dilaporkan privat, bukan issue publik.'
    ],
    checks: [
      'Apakah ada secret/PII di diff/log?',
      'Apakah izin CI dan auto-merge sesuai?',
      'Apakah input/render aman dari XSS/injection?',
      'Apakah lab punya safety note dan target yang sah?',
      'Apakah dependency/action baru tepercaya?'
    ],
    handoff: [
      'Tulis temuan, dampak, dan rekomendasi spesifik.',
      'Beri severity dan bukti tanpa mengekspos data sensitif.',
      'Verifikasi perbaikan sebelum menutup temuan.'
    ],
    escalation: ['Kebocoran secret', 'Izin CI berlebihan', 'Konten berisiko hukum', 'Kerentanan aktif'],
    charter: 'docs/AGENT_ROLES.md#7-security-engineer'
  },
  {
    id: 'devops',
    title: 'DevOps & Release Engineer',
    type: 'agent',
    mission: 'Membuat build, validasi, deploy, dan rilis dapat diulang, aman, dan mudah dipulihkan.',
    owns: ['.github/workflows', 'branch protection guide', 'Pages deploy', 'release/tag', 'Dependabot'],
    doesNotOwn: ['kode fitur', 'konten', 'kebijakan produk'],
    inputs: ['task brief', 'CI requirements', 'security review', 'release checklist'],
    outputs: ['workflow', 'deploy', 'release notes', 'rollback plan', 'status checks'],
    rules: [
      'Pipeline as code; tidak ada perubahan manual di production.',
      'Least privilege untuk setiap job; pisahkan read dan write.',
      'Deploy hanya dari `main` yang sudah lolos validasi.',
      'Jangan menyimpan secret di repo; gunakan secret store jika benar-benar perlu.',
      'Sediakan rollback dan cara verifikasi deploy.',
      'Jangan menonaktifkan check/validation untuk mempercepat rilis.',
      'Beri tahu batasan `GITHUB_TOKEN` untuk trigger workflow lain.'
    ],
    checks: [
      'Apakah workflow valid dan permission minimal?',
      'Apakah deploy reproducible dan path relatif?',
      'Apakah ada smoke test setelah deploy?',
      'Apakah rollback jelas?',
      'Apakah release notes/changelog diperbarui?'
    ],
    handoff: [
      'Tulis URL deploy, commit, dan hasil smoke test.',
      'Catat perubahan konfigurasi repo yang diperlukan.',
      'Beri instruksi rollback dan kontak eskalasi.'
    ],
    escalation: ['Deploy gagal', 'Butuh secret/PAT', 'Perubahan branch protection', 'Rollback'],
    charter: 'docs/AGENT_ROLES.md#8-devops--release-engineer'
  },
  {
    id: 'accessibility',
    title: 'Accessibility Engineer',
    type: 'agent',
    mission: 'Memastikan semua orang dapat menggunakan LabSiber dengan keyboard, screen reader, dan pengaturan visual yang berbeda.',
    owns: ['WCAG audit', 'keyboard/focus review', 'contrast', 'semantic HTML review', 'screen reader checks'],
    doesNotOwn: ['desain visual utama', 'kode fitur', 'prioritas produk'],
    inputs: ['PR', 'UI', 'design tokens', 'task brief'],
    outputs: ['a11y findings', 'remediasi', 'checklist', 'test evidence'],
    rules: [
      'Target WCAG 2.1 AA untuk alur utama.',
      'Jangan hanya mengandalkan warna untuk menyampaikan status.',
      'Semua kontrol harus bisa diakses keyboard dengan fokus terlihat.',
      'Gunakan semantic HTML dan label yang benar.',
      'Hormati `prefers-reduced-motion` dan kontras teks.',
      'Uji dengan keyboard dan minimal satu screen reader/axe.',
      'Jangan menurunkan aksesibilitas demi estetika.'
    ],
    checks: [
      'Apakah Tab/Enter/Esc/arrow berfungsi?',
      'Apakah fokus terlihat dan tidak terperangkap?',
      'Apakah kontras memadai?',
      'Apakah status tidak disampaikan hanya lewat warna?',
      'Apakah axe tidak menemukan pelanggaran serius?'
    ],
    handoff: [
      'Tulis temuan dengan elemen, dampak, dan cara memperbaiki.',
      'Sertakan bukti keyboard/axe/screenshot.',
      'Verifikasi ulang setelah perbaikan.'
    ],
    escalation: ['Blocker aksesibilitas', 'Perubahan desain besar', 'Konflik dengan performa'],
    charter: 'docs/AGENT_ROLES.md#9-accessibility-engineer'
  },
  {
    id: 'technical-writer',
    title: 'Technical Writer',
    type: 'agent',
    mission: 'Menjaga dokumentasi tetap akurat, konsisten, dan berguna sebagai satu sumber kebenaran.',
    owns: ['README', 'PRD/TSD/PR plan', 'CHANGELOG', 'release notes', 'panduan deploy/CI'],
    doesNotOwn: ['kode fitur', 'keputusan arsitektur', 'validasi konten materi'],
    inputs: ['PR', 'keputusan teknis', 'hasil rilis', 'temuan QA'],
    outputs: ['dokumen terbaru', 'changelog', 'release notes', 'link check'],
    rules: [
      'Dokumentasi diperbarui dalam PR yang sama dengan perubahan perilaku.',
      'Satu sumber kebenaran; hindari duplikasi yang bisa basi.',
      'Gunakan bahasa Indonesia yang jelas dan istilah teknis yang konsisten.',
      'Semua link internal harus valid; link eksternal HTTPS.',
      'Jangan menyalin secret/data pribadi ke dokumentasi.',
      'Tandai keputusan yang belum final sebagai pertanyaan terbuka.',
      'Jangan mengklaim fitur yang belum ada.'
    ],
    checks: [
      'Apakah dokumen sesuai perilaku kode saat ini?',
      'Apakah angka/istilah konsisten?',
      'Apakah link lokal valid?',
      'Apakah changelog/release notes lengkap?',
      'Apakah pembaca baru bisa mengikuti langkahnya?'
    ],
    handoff: [
      'Tulis ringkasan perubahan dan link ke PR.',
      'Beri tahu bagian yang perlu review teknis.',
      'Jalankan validator link sebelum menutup task.'
    ],
    escalation: ['Kontradiksi dokumen', 'Klaim yang tidak bisa diverifikasi', 'Perubahan besar yang belum final'],
    charter: 'docs/AGENT_ROLES.md#10-technical-writer'
  }
];

export const roleById = Object.fromEntries(roles.map((role) => [role.id, role]));
