/**
 * Tasks owned by DevOps & Release Engineer.
 */
export default [
  {
    id: 'T-002',
    title: 'Add CI validation, secret scan, and owner-only auto-merge',
    role: 'devops',
    reviewers: ['security', 'tech-lead'],
    status: 'in-progress',
    priority: 'P0',
    size: 'M',
    pr: '#1b',
    dependsOn: ['T-001'],
    files: [
      '.github/workflows/ci.yml',
      '.github/dependabot.yml',
      '.github/ISSUE_TEMPLATE/config.yml',
      'scripts/validate.mjs',
      'scripts/test-terminal.mjs',
      'scripts/check-secrets.mjs',
      'docs/CI.md',
      'docs/adr/0006-ci-auto-merge.md',
      'SECURITY.md',
      'README.md',
      'docs/PRD.md',
      'docs/TSD.md',
      'docs/STACK.md',
      'docs/PR_PLAN.md'
    ],
    context: 'Repo publik membutuhkan gate otomatis. Auto-merge hanya boleh untuk owner dari branch repo sendiri, bukan fork.',
    deliverables: [
      'Workflow validate: syntax, konten, link, terminal, secret scan',
      'Job automerge owner-only dengan opt-out label no-automerge',
      'SECURITY.md dan docs/CI.md',
      'Dependabot untuk GitHub Actions',
      'ADR-0006'
    ],
    acceptance: [
      'validate hijau di PR.',
      'Secret scan 0 temuan.',
      'Fork/draft/no-automerge tidak di-merge otomatis.',
      'validate hanya punya contents: read.',
      'Tidak memakai pull_request_target.'
    ],
    verification: [
      'node scripts/validate.mjs',
      'node scripts/test-terminal.mjs',
      'node scripts/check-secrets.mjs',
      'node scripts/agents.mjs check',
      'Cek log job validate dan automerge di Actions'
    ],
    outOfScope: ['Deploy GitHub Pages', 'Kode aplikasi', 'Konten modul'],
    handoff: [
      'Setelah merged, branch protection main wajib check validate dan approvals 0.',
      'Workflow permissions repo: read/write, dengan job validate tetap read-only.',
      'Deploy ditangani T-020.'
    ],
    risk: 'Auto-merge bisa memasukkan perubahan yang lulus tes tetapi salah konsep; review tetap disarankan untuk perubahan merah.'
  },
  {
    id: 'T-020',
    title: 'Deploy to GitHub Pages with smoke test and rollback',
    role: 'devops',
    reviewers: ['security', 'qa', 'tech-lead'],
    status: 'todo',
    priority: 'P0',
    size: 'M',
    pr: '#14',
    dependsOn: ['T-019'],
    files: [
      '.github/workflows/deploy.yml',
      '.nojekyll',
      'docs/DEPLOY.md',
      'README.md'
    ],
    context: 'Situs harus bisa diakses dari mana saja secara gratis, dengan deploy yang reproducible dan aman.',
    deliverables: [
      'Workflow deploy dari main ke GitHub Pages',
      'Dokumentasi setup Pages dan troubleshooting',
      'Smoke test URL publik dan aset relatif',
      'Rollback plan'
    ],
    acceptance: [
      'Push ke main men-deploy otomatis.',
      'URL Pages bekerja di subpath repo.',
      'Tidak ada aset 404 di Network tab.',
      'Deploy tidak berjalan untuk PR.',
      'Rollback/redeploy terdokumentasi.'
    ],
    verification: [
      'Buka URL Pages di incognito',
      'Hard refresh dan cek Network untuk 404',
      'Cek tab Actions → deployment history',
      'node scripts/validate.mjs'
    ],
    outOfScope: ['Kode fitur', 'Konten modul', 'Custom domain'],
    handoff: [
      'Catat URL publik, commit yang di-deploy, dan hasil smoke test.',
      'Beri tahu batasan GITHUB_TOKEN untuk trigger workflow lain.',
      'Serahkan ke QA/security untuk verifikasi rilis.'
    ],
    risk: 'Merge oleh GITHUB_TOKEN dapat tidak memicu workflow deploy; verifikasi dan gunakan native auto-merge atau trigger alternatif.'
  }
];
