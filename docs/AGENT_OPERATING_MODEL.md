# Agent Operating Model — LabSiber

Dokumen ini menjelaskan bagaimana pekerjaan dipecah menjadi **task mandiri**,
bagaimana **role** dipilih, dan bagaimana setiap coding agent memuat konteks serta
menyerahkan hasil tanpa menginjak area role lain.

- Role charter lengkap: [AGENT_ROLES.md](./AGENT_ROLES.md)
- Registry role: [`agents/roles.mjs`](../agents/roles.mjs)
- Registry task: [`agents/tasks/`](../agents/tasks/)
- CLI: `node scripts/agents.mjs`
- PR plan: [PR_PLAN.md](./PR_PLAN.md)

---

## 1. Tujuan

Tanpa batas role, agent cenderung:

- mengubah file di luar scope,
- menambah dependency tanpa evaluasi,
- mencampur fitur, konten, dan infrastruktur dalam satu PR,
- mengklaim selesai tanpa bukti,
- meninggalkan pekerjaan yang tidak bisa dilanjutkan agent lain.

Operating model ini memaksa setiap task punya **satu owner**, **batas file**,
**acceptance**, **cara verifikasi**, dan **handoff**.

---

## 2. Prinsip operasi

1. **Satu task, satu owner.** Reviewer boleh banyak; owner hanya satu.
2. **Role adalah topi.** Agent boleh berganti role antar-task, tetapi tidak di
   tengah task tanpa memperbarui task.
3. **Baca sebelum tulis.** Task brief + role charter + file target wajib dibaca.
4. **Scope tertutup.** Hanya file di `files` yang boleh diubah; perluasan scope
   harus lewat task baru.
5. **Bukti, bukan klaim.** Setiap acceptance harus punya cara verifikasi.
6. **PR kecil.** Satu PR satu fokus; pecah jika membesar.
7. **Handoff eksplisit.** Agent berikutnya harus bisa lanjut tanpa investigasi ulang.
8. **Gate tidak boleh dilewati.** CI, review keamanan, dan branch protection tetap berlaku.

---

## 3. Siklus hidup task

```text
Intake → Claim → Plan → Implement → Verify → Handoff → Review → Done
```

### 3.1 Intake

- PM/tech lead membuat task dengan brief lengkap.
- Task punya `dependsOn` yang jelas.
- Task masuk status `todo`.

### 3.2 Claim

Agent yang mengambil task wajib:

1. Umumkan: `Role: frontend | Task: T-003`.
2. Jalankan `node scripts/agents.mjs task T-003`.
3. Baca role charter di `docs/AGENT_ROLES.md`.
4. Cek dependency sudah `done` atau `in-progress` yang disepakati.
5. Ubah status task menjadi `in-progress` (di file task) dan commit bersama PR.

Jika dependency belum selesai, jangan mulai implementasi. Boleh melakukan
investigasi read-only, tetapi tulis di handoff.

### 3.3 Plan

Tulis di deskripsi PR/komentar:

- file yang akan diubah,
- pendekatan singkat,
- risiko/edge case,
- cara verifikasi,
- hal yang **tidak** dikerjakan.

Jika rencana berubah di tengah jalan, perbarui task/PR sebelum lanjut.

### 3.4 Implement

- Ikuti aturan role.
- Jangan mengubah file di luar `files`.
- Jangan menambah dependency tanpa persetujuan tech lead.
- Commit kecil dan pesan jelas.
- Jangan menyentuh workflow/keamanan kecuali task memang tentang itu.

### 3.5 Verify

Jalankan check yang tercantum di task:

```bash
node --check <file yang berubah>
node scripts/validate.mjs
node scripts/test-terminal.mjs
node scripts/check-secrets.mjs
node scripts/agents.mjs check
```

Tambahkan uji manual sesuai role (viewport, keyboard, offline, quiz, dsb.).
Lampirkan bukti di PR.

### 3.6 Handoff

Gunakan format di [AGENT_ROLES.md](./AGENT_ROLES.md#protokol-handoff).
Handoff yang baik menjawab:

- Apa yang berubah?
- Bagaimana dibuktikan?
- Apa risiko/batasannya?
- Apa yang tidak dikerjakan?
- Apa langkah berikutnya?

### 3.7 Review

- Owner role + reviewer yang tercantum di task.
- Perubahan sensitif (workflow, auth, data, secret) wajib security + tech lead.
- Reviewer tidak boleh hanya melihat diff; jalankan/verifikasi acceptance.

### 3.8 Done

Sebuah task `done` hanya jika:

- [ ] Semua acceptance terpenuhi.
- [ ] Verifikasi dijalankan dan bukti ada.
- [ ] Tidak ada file di luar scope.
- [ ] Docs diperbarui bila perilaku berubah.
- [ ] Tidak ada secret/PII.
- [ ] Reviewer menyetujui.
- [ ] PR merged.

---

## 4. Kontrak task

Setiap task di `agents/tasks/*.mjs` wajib punya field:

| Field | Arti |
| --- | --- |
| `id` | `T-001` … unik |
| `title` | Ringkas, kata kerja + objek |
| `role` | Owner role (id dari `roles.mjs`) |
| `reviewers` | Role yang wajib review |
| `status` | `done`, `in-progress`, `todo`, `blocked` |
| `priority` | `P0`, `P1`, `P2` |
| `size` | `S`, `M`, `L` |
| `pr` | Nomor PR/issue terkait |
| `dependsOn` | ID task yang harus selesai lebih dulu |
| `files` | File/folder yang boleh disentuh |
| `context` | Mengapa task ini ada |
| `deliverables` | Hasil konkret |
| `acceptance` | Kriteria lulus |
| `verification` | Perintah/uji yang membuktikan |
| `outOfScope` | Hal yang sengaja tidak dikerjakan |
| `handoff` | Informasi yang wajib diteruskan |
| `risk` | Risiko utama (opsional) |

Contoh task minimal:

```js
{
  id: 'T-003',
  title: 'Build app shell and design system',
  role: 'frontend',
  reviewers: ['tech-lead', 'accessibility', 'qa'],
  status: 'todo',
  priority: 'P0',
  size: 'M',
  pr: '#2',
  dependsOn: ['T-002'],
  files: ['index.html', 'assets/css/style.css', 'assets/js/app.js'],
  context: '...',
  deliverables: ['...'],
  acceptance: ['...'],
  verification: ['...'],
  outOfScope: ['...'],
  handoff: ['...']
}
```

---

## 5. Status task

| Status | Arti | Boleh diubah oleh |
| --- | --- | --- |
| `todo` | Belum dimulai | Owner/tech lead |
| `in-progress` | Sedang dikerjakan | Owner |
| `blocked` | Menunggu dependency/keputusan | Owner + PM/tech lead |
| `done` | Acceptance + review selesai | Owner + reviewer |

Aturan:

- Jangan menandai `done` sebelum PR merged.
- Jika blocked, tulis alasan dan siapa yang bisa membuka.
- Jangan mengubah status task orang lain tanpa izin.

---

## 6. Dependency

- Dependency harus membentuk **DAG** (tidak ada siklus).
- Task tidak boleh dimulai jika dependency belum `done`.
- Jika dependency `in-progress`, boleh melakukan persiapan read-only.
- Perubahan dependency harus disetujui tech lead.

CLI `node scripts/agents.mjs check` menolak dependency yang hilang atau siklus.

---

## 7. Review gate

| Tingkat | Contoh | Reviewer wajib |
| --- | --- | --- |
| **Hijau** | Konten, copy, styling kecil | Owner + QA |
| **Kuning** | Schema, progress, search, performa | Tech lead + QA |
| **Merah** | Workflow, auth, backend, secret, auto-merge, lisensi | Security + tech lead + PM |

Perubahan merah tidak boleh auto-merge tanpa review manusia. Gunakan label
`no-automerge`.

---

## 8. Definition of Done (semua task)

- [ ] Acceptance terpenuhi.
- [ ] `node scripts/agents.mjs check` lulus.
- [ ] Validator konten/terminal/secret lulus (bila relevan).
- [ ] Tidak ada file di luar `files`.
- [ ] Tidak ada secret/PII/dependency tak disetujui.
- [ ] Docs diperbarui bila perilaku berubah.
- [ ] Handoff ditulis.
- [ ] Reviewer menyetujui.
- [ ] PR merged.

---

## 9. Eskalasi

Agent harus berhenti dan bertanya jika:

- Acceptance ambigu atau saling bertentangan.
- Perubahan membutuhkan file di luar scope.
- Butuh dependency/secret/backend.
- Menemukan masalah keamanan atau data pribadi.
- Test gagal dan perbaikannya di luar scope.
- Ada konflik antara role (mis. a11y vs desain).

Tulis pertanyaan spesifik + opsi, bukan "saya bingung".

---

## 10. CLI handler

```bash
# daftar role + aturan ringkas
node scripts/agents.mjs roles

# papan task
node scripts/agents.mjs board
node scripts/agents.mjs board --role frontend
node scripts/agents.mjs board --status todo

# brief lengkap + aturan role + acceptance + handoff
node scripts/agents.mjs task T-006

# task berikutnya yang dependency-nya sudah selesai
node scripts/agents.mjs next --role frontend

# validasi registry (dipakai CI)
node scripts/agents.mjs check

# graph dependency (Mermaid)
node scripts/agents.mjs graph
```

Output `task` adalah konteks yang harus dibaca agent sebelum mulai. Jika agent
tidak menjalankan ini, ia dianggap belum "claim" task.

---

## 11. Menambah role/task

### Role baru

1. Tambah entry di `agents/roles.mjs`.
2. Tambah charter di `docs/AGENT_ROLES.md` dengan anchor yang cocok.
3. Tambah reviewer/aturan jika role menyentuh gate sensitif.
4. Jalankan `node scripts/agents.mjs check`.

### Task baru

1. Tentukan owner role dan reviewer.
2. Tulis brief lengkap (context, deliverables, acceptance, verification, out-of-scope).
3. Tambahkan ke file `agents/tasks/<role>.mjs` (atau file role yang sesuai).
4. Tambahkan dependency.
5. Jalankan `node scripts/agents.mjs check`.
6. Pastikan tidak ada file overlap yang tidak disengaja dengan task lain.

---

## 12. Anti-pattern

- Agent mengubah file di luar task "karena sekalian".
- Menambah dependency tanpa ADR/persetujuan.
- Menandai done tanpa PR merged.
- Menulis test yang selalu lulus tanpa assertion.
- Menonaktifkan validator/secret scan agar CI hijau.
- Menyalin aturan role ke banyak tempat lalu basi.
- Task tanpa acceptance/verification.
- “Nanti saya dokumentasikan” tanpa task docs.

---

## 13. Hubungan dengan PR plan

- Setiap PR di [PR_PLAN.md](./PR_PLAN.md) memetakan ke satu atau lebih task.
- Task dengan `pr` yang sama boleh dikerjakan berurutan dalam satu PR, tetapi
  tetap punya owner/acceptance masing-masing.
- PR tidak boleh merged jika task terkait belum `done` atau belum di-review.
- Task `done` tanpa PR merged dianggap belum selesai.

---

## 14. Enforcement

`node scripts/agents.mjs check` dijalankan di CI dan menolak:

- ID duplikat,
- role/reviewer tidak dikenal,
- dependency hilang/siklus,
- field wajib kosong,
- status/priority/size tidak valid,
- task `done` tanpa PR,
- task `done` dengan dependency belum `done`.

Dengan begitu, “aturan role” bukan sekadar dokumen—ia menjadi bagian dari gate.
