/**
 * Tasks owned by Tech Lead / Architect.
 */
export default [
  {
    id: 'T-001',
    title: 'Document product, architecture, stack, and PR plan',
    role: 'tech-lead',
    reviewers: ['product-manager', 'technical-writer'],
    status: 'done',
    priority: 'P0',
    size: 'L',
    pr: '#1',
    dependsOn: [],
    files: [
      'README.md',
      'docs/PRD.md',
      'docs/TSD.md',
      'docs/STACK.md',
      'docs/PR_PLAN.md',
      'docs/adr/0001-static-no-build.md',
      'docs/adr/0002-content-as-js-modules.md',
      'docs/adr/0003-local-first-progress.md',
      'docs/adr/0004-github-pages-hosting.md',
      'docs/adr/0005-browser-terminal-simulator.md',
      '.github/PULL_REQUEST_TEMPLATE.md',
      '.github/ISSUE_TEMPLATE/bug_report.yml',
      '.github/ISSUE_TEMPLATE/content_issue.yml',
      '.github/ISSUE_TEMPLATE/feature_request.yml'
    ],
    context: 'Kode belum boleh ditulis sebelum masalah, arsitektur, stack, dan urutan PR disepakati. PR ini menjadi sumber kebenaran awal.',
    deliverables: [
      'PRD dengan scope, persona, FR/NFR, metrik, risiko',
      'TSD dengan arsitektur, schema, routing, testing, deployment',
      'Stack decision termasuk alasan bukan Rust',
      'PR plan 15+1b dengan acceptance dan dependency',
      'Lima ADR awal dan template PR/issue'
    ],
    acceptance: [
      'Dokumen saling konsisten: 17 modul, 202 node, stack, PR numbering.',
      'Tidak ada kode aplikasi yang diubah.',
      'Template PR dan issue valid.',
      'Semua link lokal valid.'
    ],
    verification: [
      'node scripts/validate.mjs',
      'Baca PRD → TSD → STACK → PR_PLAN tanpa kontradiksi'
    ],
    outOfScope: ['Implementasi app shell', 'Konten modul', 'CI workflow'],
    handoff: [
      'PR #1 merged ke main.',
      'PR berikutnya dimulai dari main terbaru.',
      'CI ditangani terpisah di T-002/PR #1b.'
    ]
  }
];
