# CI, Validasi & Auto-merge

Dokumen ini menjelaskan bagaimana perubahan masuk ke `main` dan bagaimana
repository publik ini dijaga tetap aman.

---

## 1. Apa yang berjalan

Workflow: `.github/workflows/ci.yml`

| Job | Kapan | Isi |
| --- | --- | --- |
| `validate` | Semua PR + push ke `main` | Syntax JS, validasi konten/link, test terminal, secret scan |
| `automerge` | PR dari branch repo sendiri oleh owner | Merge langsung setelah `validate` lulus, lalu memicu deploy |

### `validate` menjalankan

```bash
node --check <setiap file .js/.mjs yang tracked>
node scripts/validate.mjs      # skema konten, quiz, regex misi, link lokal
node scripts/test-terminal.mjs # perilaku shell + pola misi
node scripts/check-secrets.mjs # token/kunci yang tidak sengaja ter-commit
node scripts/agents.mjs check  # role/task registry, dependency, siklus
```

Jika salah satu gagal, PR tidak boleh merge.

---

## 2. Kapan auto-merge aktif

Auto-merge hanya berjalan jika **semua** kondisi berikut benar:

- Event adalah `pull_request`.
- PR bukan draft.
- Branch asal berada di repo yang sama (`head.repo.full_name == github.repository`).
  PR dari fork **tidak** di-auto-merge.
- Aktor adalah owner repo (`github.actor == github.repository_owner`).
- PR tidak punya label `no-automerge`.
- Job `validate` lulus.

Ini mencegah orang lain di repo publik memicu merge otomatis.

### Mematikan auto-merge untuk satu PR

Tambahkan label:

```text
no-automerge
```

PR tetap menjalankan validasi, tetapi tidak akan di-merge otomatis.

### Mematikan auto-merge secara total

Hapus job `automerge` dari `ci.yml`, atau ubah kondisinya menjadi `false`.
Lakukan lewat PR dan review.

---

## 3. Setup GitHub yang diperlukan

### 3.1 Auto-merge (opsional)

Workflow **tidak** memakai native auto-merge. Job `automerge` melakukan merge
langsung setelah `validate` lulus, lalu memicu deploy. Jadi **Allow auto-merge**
tidak wajib diaktifkan.

Jika ingin memakai native auto-merge, ubah job `automerge` dan pastikan deploy
tetap terpicu (lihat bagian 5).

### 3.2 Lindungi branch `main`

Settings → Branches → Add branch protection rule:

- Branch name pattern: `main`
- [x] Require a pull request before merging
- [x] Require status checks to pass before merging
  - Pilih check: **validate**
- [ ] Require approvals: **0** (auto-merge tidak bisa memenuhi review manual)
- [x] Require conversation resolution
- [x] Do not allow force pushes
- [x] Do not allow deletions

**Penting:** jika `Require approvals` diset 1 atau lebih, auto-merge akan
menunggu selamanya karena `GITHUB_TOKEN` tidak bisa memberi approval.

### 3.3 Workflow permissions

Settings → Actions → General → Workflow permissions:

- Pilih **Read and write permissions** agar job `automerge` bisa melakukan merge.
- Workflow sendiri membatasi izin:
  - job `validate`: `contents: read` (tidak bisa menulis),
  - job `automerge`: `contents: write` + `pull-requests: write` + `actions: write`.
- `actions: write` dibutuhkan untuk `gh workflow run deploy.yml`.
- Jika memilih read-only, auto-merge tidak bisa bekerja; PR harus di-merge manual.
- Tidak ada secret yang perlu ditambahkan.

### 3.4 Private vulnerability reporting

Settings → Security → **Private vulnerability reporting** → Enable.
Ini mengaktifkan tautan di `SECURITY.md` dan issue template.

---

## 4. Alur normal

```text
Push branch
  → buka PR
  → CI `validate` berjalan
      ├── gagal → PR tertahan; perbaiki lalu push lagi
      └── lulus → `automerge`
                    → gh pr merge (squash)
                    → gh workflow run deploy.yml --ref main
  → branch dihapus
  → main diperbarui
  → deploy berjalan
```

---

## 5. Merge oleh `GITHUB_TOKEN` dan deploy

Event `push` yang dihasilkan oleh merge memakai `GITHUB_TOKEN` **tidak** memicu
workflow lain. Karena itu job `automerge` memanggil:

```bash
gh workflow run deploy.yml --ref main
```

`workflow_dispatch` adalah pengecualian yang diizinkan untuk `GITHUB_TOKEN`.
Syaratnya:

- job `automerge` punya `actions: write`;
- `deploy.yml` punya trigger `workflow_dispatch`.

Jika dispatch gagal, jalankan **Actions → Deploy to GitHub Pages → Run workflow**
secara manual. Alternatif lain adalah PAT halus `AUTOMERGE_TOKEN` dengan scope
minimal, tetapi jangan menambah PAT tanpa kebutuhan dan review keamanan.

---

## 6. Keamanan repository publik

| Risiko | Mitigasi |
| --- | --- |
| PR jahat dari fork | Auto-merge hanya untuk branch repo sendiri; token PR fork read-only |
| Workflow injection | Tidak memakai `pull_request_target`; tidak menjalankan kode PR dengan token write |
| Secret bocor | `check-secrets.mjs` + GitHub secret scanning + review |
| Token berlebihan | `permissions` minimal per job; default read-only |
| Dependency/action berbahaya | Hanya action resmi `actions/*`; Dependabot untuk update |
| Force push/deletion | Branch protection |
| Approval tidak mungkin | Required approvals 0; review tetap disarankan untuk perubahan besar |
| Konten berbahaya | Review PR + validator + safety note |

### Yang tidak boleh dilakukan

- Jangan menambahkan `pull_request_target` tanpa ADR dan review keamanan.
- Jangan mencetak secret ke log.
- Jangan memberi `contents: write` ke job `validate`.
- Jangan menonaktifkan `check-secrets` atau `validate` untuk mempercepat merge.

---

## 7. Menjalankan validasi di lokal

```bash
node --check scripts/validate.mjs
node scripts/validate.mjs
node scripts/test-terminal.mjs
node scripts/check-secrets.mjs
```

Jika `content/` atau `assets/js/terminal.js` belum ada, script akan melewati
bagian tersebut dengan pesan yang jelas.

---

## 8. Troubleshooting

| Gejala | Penyebab umum | Solusi |
| --- | --- | --- |
| Tombol merge tidak muncul | PR belum dibuat / branch compare salah | Buat PR dari `main` ke branch fitur |
| `validate` gagal | Syntax, konten, regex, link, atau secret | Baca log job, perbaiki, push lagi |
| Auto-merge tidak jalan | Bukan owner, PR dari fork, draft, label `no-automerge` | Cek kondisi di atas |
| Auto-merge menunggu | Required approvals > 0 | Set approvals 0 atau merge manual |
| `gh pr merge` gagal | Branch protection / check belum lulus | Cek required checks dan izin |
| Deploy tidak terpicu setelah merge | Dispatch gagal atau `actions: write` tidak ada | Cek log automerge; jalankan deploy manual |
