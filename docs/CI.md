# CI, Validasi & Auto-merge

Dokumen ini menjelaskan bagaimana perubahan masuk ke `main` dan bagaimana
repository publik ini dijaga tetap aman.

---

## 1. Apa yang berjalan

Workflow: `.github/workflows/ci.yml`

| Job | Kapan | Isi |
| --- | --- | --- |
| `validate` | Semua PR + push ke `main` | Syntax JS, validasi konten/link, test terminal, secret scan |
| `automerge` | PR dari branch repo sendiri oleh owner | Mengaktifkan auto-merge atau merge langsung setelah `validate` lulus |

### `validate` menjalankan

```bash
node --check <setiap file .js/.mjs yang tracked>
node scripts/validate.mjs      # skema konten, quiz, regex misi, link lokal
node scripts/test-terminal.mjs # perilaku shell + pola misi
node scripts/check-secrets.mjs # token/kunci yang tidak sengaja ter-commit
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

### 3.1 Aktifkan auto-merge

Settings → General → Pull Requests → **Allow auto-merge**.

Jika ini tidak aktif, workflow akan mencoba merge langsung setelah validasi
sebagai fallback.

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
  - job `automerge`: `contents: write` + `pull-requests: write` saja.
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
      └── lulus → `automerge` aktif
                    ├── native auto-merge → GitHub merge (squash)
                    └── fallback → gh pr merge (squash)
  → branch dihapus
  → main diperbarui
```

---

## 5. Catatan penting: merge oleh `GITHUB_TOKEN`

Jika merge dilakukan langsung oleh `GITHUB_TOKEN` (fallback), event `push` yang
dihasilkan **tidak selalu memicu workflow lain** (misalnya deploy). Ini batasan
GitHub untuk mencegah rekursi.

Untuk v1.0:

- Utamakan **native auto-merge** (GitHub yang melakukan merge).
- Saat deploy workflow ditambahkan (PR #14), verifikasi apakah deploy terpicu.
- Jika tidak, opsi:
  1. gunakan PAT halus dengan scope minimal sebagai `AUTOMERGE_TOKEN`,
  2. picu deploy lewat `workflow_run` setelah CI selesai, atau
  3. jalankan deploy manual.

Jangan menambahkan PAT sebelum ada kebutuhan dan review keamanan.

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
| Deploy tidak terpicu setelah merge | Merge oleh `GITHUB_TOKEN` | Lihat bagian 5 |
