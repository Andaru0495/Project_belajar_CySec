/**
 * Tasks owned by Security Engineer.
 */
export default [
  {
    id: 'T-022',
    title: 'Security review for public repo, rendering, CI, and labs',
    role: 'security',
    reviewers: ['tech-lead', 'devops', 'product-manager'],
    status: 'todo',
    priority: 'P0',
    size: 'M',
    pr: '#15',
    dependsOn: ['T-019', 'T-020'],
    files: [
      'docs/SECURITY_REVIEW.md',
      'SECURITY.md'
    ],
    context: 'Repo publik dan situs edukasi keamanan harus aman dari penyalahgunaan, kebocoran secret, dan miskonfigurasi CI.',
    deliverables: [
      'Threat model singkat (aset, aktor, jalur, kontrol)',
      'Review escaping/CSP/render path',
      'Review izin CI dan auto-merge',
      'Review safety lab/konten',
      'Daftar temuan + remediasi'
    ],
    acceptance: [
      'Tidak ada secret/PII di repo/diff.',
      'Job validate read-only; automerge owner-only; fork dikecualikan.',
      'Tidak ada pull_request_target.',
      'Render konten aman dari XSS/HTML injection.',
      'Lab tidak mengarahkan serangan ke pihak ketiga.',
      'Temuan punya severity, bukti, dan rekomendasi.'
    ],
    verification: [
      'node scripts/check-secrets.mjs',
      'Baca ulang .github/workflows/ci.yml',
      'Uji konten dengan <script> dan atribut event',
      'Cek CSP/meta dan link eksternal'
    ],
    outOfScope: ['Memperbaiki kode (buat task remediasi)', 'Menentukan prioritas produk', 'Menambah dependency'],
    handoff: [
      'Temuan sensitif dilaporkan privat, bukan issue publik.',
      'Beri rekomendasi spesifik dan cara verifikasi.',
      'Verifikasi perbaikan sebelum sign-off rilis.'
    ],
    risk: 'Konten keamanan bisa disalahgunakan; pastikan safety note dan target lab jelas.'
  }
];
