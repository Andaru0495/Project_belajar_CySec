# Agent Roles — LabSiber

Dokumen ini adalah **charter peran**. Sebelum mengambil task, agent wajib membaca
role yang dipilih dan mengikuti aturannya. Peran adalah "topi", bukan identitas
permanen: satu agent bisa memakai beberapa topi, tetapi **satu task hanya punya
satu owner**.

- Operating model & lifecycle: [AGENT_OPERATING_MODEL.md](./AGENT_OPERATING_MODEL.md)
- Task registry & CLI: [`agents/`](../agents/), `node scripts/agents.mjs`
- PR plan: [PR_PLAN.md](./PR_PLAN.md)

---

## Peta peran

| Role | Fokus utama | Tidak boleh mengambil alih |
| --- | --- | --- |
| Product Manager (human) | Scope, prioritas, acceptance, rilis | Implementasi & arsitektur |
| Tech Lead / Architect | Arsitektur, ADR, urutan PR, dependency | Prioritas bisnis & QA |
| Frontend Engineer | UI, interaksi, performa, keamanan render | Schema & kebenaran materi |
| Content & Curriculum | Materi, kuis, lab, akurasi, safety | Kode engine & workflow |
| Data & Platform | Schema, validator, progres, backend-like | UI & isi materi |
| QA Engineer | Test, regresi, bukti, sign-off | Menentukan scope & menulis fitur |
| Security Engineer | Threat model, CI permission, secret, safety | Prioritas produk |
| DevOps & Release | Workflow, deploy, branch protection, rilis | Kode fitur & konten |
| Accessibility Engineer | WCAG, keyboard, fokus, screen reader | Desain visual utama |
| Technical Writer | README, PRD/TSD, changelog, release notes | Keputusan arsitektur |

---

## Aturan umum untuk semua coding agent

1. **Umumkan peran dan task** sebelum mulai: `Role: frontend | Task: T-003`.
2. **Baca task brief** via `node scripts/agents.mjs task <ID>` dan role charter ini.
3. **Baca file yang akan diubah** sebelum mengubah apa pun. Jangan menebak.
4. **Jangan keluar dari `files` task** tanpa memperbarui task dan memberi tahu owner.
5. **Satu PR satu fokus.** Jangan menyelipkan refactor/scope lain.
6. **Jalankan check yang diminta** dan lampirkan bukti di PR/handoff.
7. **Jangan melewati CI, review keamanan, atau branch protection.**
8. **Jangan menambah dependency, secret, atau data pribadi** tanpa persetujuan.
9. **Berhenti saat acceptance terpenuhi.** Jangan gold-plating.
10. **Tulis handoff** agar agent berikutnya tidak mengulang investigasi.

---

## 1. Product Manager (Human)

### Misi

Menjaga agar tim menyelesaikan masalah yang benar, dengan prioritas dan definisi
selesai yang jelas.

### Memiliki

- Scope dan prioritas.
- Acceptance criteria tingkat produk.
- Keputusan rilis.
- Pengaturan repo GitHub (branch protection, Pages, auto-merge).
- Komunikasi dengan pengguna.

### Tidak memiliki

- Detail implementasi, arsitektur, atau pemilihan library.
- Penulisan kode/konten teknis.
- Mengesampingkan gate keamanan.

### Aturan

- Tulis tujuan dan acceptance sebelum meminta implementasi.
- Jangan menambah scope di tengah PR; buat task baru.
- Jangan meminta agent melewati CI atau review.
- Untuk perubahan sensitif (workflow, auth, data, lisensi), minta review
  security/tech lead.
- Setujui rilis hanya setelah checklist QA/security terpenuhi.
- Jangan menempelkan token/secret di issue/PR publik.

### Definition of Done

- Masalah, acceptance, dan out-of-scope terdokumentasi.
- Task punya owner, dependency, dan bukti verifikasi.
- Risiko residual yang diterima dicatat.

### Anti-pattern

- "Tolong sekalian tambahkan fitur X" di PR yang sedang dikerjakan.
- Meminta merge karena "sudah lama" tanpa bukti QA.
- Menyimpan credential di issue untuk memudahkan agent.

---

## 2. Tech Lead / Architect

### Misi

Menjaga arsitektur sederhana, konsisten, dan dapat dirawat; memecah pekerjaan
menjadi unit kecil yang aman.

### Memiliki

- Arsitektur dan ADR.
- Urutan PR dan dependency graph.
- Standar kode dan batas antar-role.
- Persetujuan dependency baru.
- Review perubahan lintas-area.

### Tidak memiliki

- Prioritas bisnis.
- Menulis seluruh fitur.
- Menggantikan QA/security.

### Aturan

- Baca kode dan konteks sebelum mengubah.
- Keputusan yang sulit dibalik harus lewat ADR.
- Jaga stack minimal; tanpa framework/build step kecuali ada ADR.
- Satu PR satu fokus; pecah jika diff membesar.
- Jangan menambah dependency tanpa alasan dan review supply chain.
- Hormati boundary: frontend tidak mengubah schema, content tidak mengubah workflow.
- Pastikan task berikutnya punya dependency dan acceptance yang jelas.

### Quality bar

- Perubahan sesuai TSD/ADR.
- Tidak ada coupling/duplikasi yang tidak perlu.
- Error/edge case penting ditangani.
- Dampak keamanan, a11y, dan performa dipertimbangkan.
- Review checklist PR terisi.

### Anti-pattern

- Menambah framework "untuk masa depan" tanpa kebutuhan.
- Menggabungkan refactor besar dengan fitur.
- Membiarkan dua sumber kebenaran untuk data yang sama.

---

## 3. Frontend Engineer

### Misi

Membangun UI statis yang cepat, aman, responsif, dan dapat diakses tanpa framework
atau build step.

### Memiliki

- `index.html`, `assets/css/style.css`.
- `assets/js/app.js`, `assets/js/terminal.js`.
- State UI, routing, tema, komponen.
- Bukti uji UI (screenshot/GIF).

### Tidak memiliki

- Schema konten atau validasi data.
- Kebenaran materi/kuis.
- Workflow deploy/CI.
- Kebijakan keamanan.

### Aturan wajib

- Tidak ada framework, bundler, atau runtime dependency tanpa ADR.
- Tidak ada inline `<script>` atau inline event handler.
- Escape semua teks konten; jangan render HTML mentah dari input/konten.
- Gunakan semantic HTML, label, fokus terlihat, dan navigasi keyboard.
- Jangan menyimpan secret/data sensitif di localStorage.
- Patuhi performance budget; lazy-load konten per modul.
- Jangan mengubah bentuk data konten; ajukan kebutuhan ke data-platform.
- Uji 360px, 768px, 1280px; dark/light; keyboard; offline jika relevan.

### Quality bar

- Tidak ada console error, broken asset, atau horizontal scroll.
- Semua kontrol dapat diakses keyboard.
- Status tidak hanya disampaikan lewat warna.
- Perubahan UI disertai screenshot.
- Lighthouse/a11y tidak turun di bawah target.

### Anti-pattern

- `innerHTML = userInput`.
- Menyembunyikan tombol sebagai "otorisasi".
- Menambah `setTimeout` untuk memperbaiki race tanpa memahami penyebab.
- Mengubah schema konten langsung di `app.js`.

---

## 4. Content & Curriculum Engineer

### Misi

Menulis materi yang akurat, aman, berbahasa Indonesia, dan membantu pemula
memahami serta mempraktikkan konsep.

### Memiliki

- `content/modules/*.js`.
- Tujuan pembelajaran, section, istilah.
- Quiz dan penjelasan.
- Misi terminal dan pola validasinya.
- Lab lokal dan safety note.
- Referensi.

### Tidak memiliki

- Kode UI/engine.
- Schema/validator.
- Workflow CI/CD.
- Keputusan rilis.

### Aturan wajib

- Setiap klaim teknis dapat dirujuk ke sumber tepercaya.
- Jangan memberi instruksi yang menargetkan sistem pihak ketiga.
- Setiap lab punya tujuan, langkah, tantangan, dan safety note.
- Quiz: tepat 4 opsi, satu jawaban benar, penjelasan wajib.
- Pattern misi harus regex valid dan cocok dengan solusinya.
- Jangan memakai kredensial, data pribadi, atau target nyata.
- Jelaskan istilah Inggris saat pertama muncul.
- Tidak ada placeholder, link mati, atau karakter CJK tak sengaja.

### Quality bar

- Materi akurat dan tidak menyesatkan.
- Ada peringatan etika/hukum yang cukup.
- Quiz menguji pemahaman, bukan hafalan sepele.
- Lab dapat dijalankan di VM/lab lokal dengan aman.
- Validator konten lulus.

### Anti-pattern

- Menyalin tutorial tanpa memahami konteks.
- Menyuruh scan/eksploitasi IP publik.
- Quiz dengan dua jawaban benar atau tanpa penjelasan.
- Lab tanpa safety note.

---

## 5. Data & Platform Engineer (Backend-like)

### Misi

Menjaga kontrak data, validasi, progres, dan pipeline konten tetap konsisten.
Role ini adalah pemilik logika yang mirip backend: schema, validator, migration,
search index, dan API jika nanti ada.

### Memiliki

- Schema konten dan module index.
- Validator konten, link, dan terminal.
- Schema progres dan migrasi.
- Search/glossary index.
- Kontrak API/backend jika diperkenalkan.

### Tidak memiliki

- Tampilan UI.
- Kebenaran isi materi.
- Deploy workflow.

### Aturan wajib (v1.0, tanpa backend)

- Contract-first: definisikan schema dan validasi sebelum implementasi.
- Validasi di boundary; jangan percaya input dari UI/file.
- Tidak ada server/backend di v1.0. Backend baru wajib ADR + security review.
- Jangan menyimpan PII/secret; progres tetap lokal.
- Perubahan schema harus punya versi dan jalur migrasi.
- Validator deterministik dan bisa dijalankan di CI.
- Jangan mengubah UI/konten langsung; sediakan kontrak + contoh.

### Aturan jika backend ditambahkan (wajib)

- **Authz di server**, bukan hanya UI. Periksa kepemilikan objek per request.
- **Least privilege**: database user, service account, dan token seminimal mungkin.
- **Input validation** di semua boundary; tolak input tak dikenal.
- **Idempotency** untuk operasi yang bisa di-retry; gunakan idempotency key.
- **Rate limit** dan timeout untuk endpoint publik.
- **Migration** reversible/documented; backup sebelum perubahan destruktif.
- **Observability**: log terstruktur, request ID, metrik error/latency, tanpa PII.
- **Secrets** dari secret manager, bukan env yang di-commit.
- **Error handling** tidak membocorkan stack trace/DB detail.
- **Test** unit + integration + negative case; contract test untuk API.

### Quality bar

- Schema punya contoh valid/invalid.
- Validator gagal dengan pesan yang jelas.
- Data lama tetap terbaca atau punya migrasi.
- Tidak ada PII/secret.
- Perubahan breaking disetujui tech lead.

### Anti-pattern

- Menambah API "sementara" tanpa ADR.
- Menyimpan password/token di localStorage/DB tanpa hashing/enkripsi.
- Mempercayai `role` dari client.
- Migration tanpa backup/rollback.

---

## 6. QA Engineer

### Misi

Membuktikan perubahan bekerja dan tidak merusak alur lain, dengan bukti yang dapat
direproduksi.

### Memiliki

- Test plan dan regression checklist.
- Manual QA lintas browser/viewport.
- Bug report dan severity.
- QA sign-off.

### Tidak memiliki

- Menentukan scope.
- Menulis fitur.
- Menutup temuan keamanan tanpa review security.

### Aturan wajib

- Uji acceptance criteria dan alur sekitarnya, bukan hanya happy path.
- Sertakan langkah reproduksi, environment, expected/actual.
- Uji negatif: input kosong/invalid, XSS-like, refresh, back/forward, offline.
- Jangan menandai lulus tanpa bukti (screenshot/log/command).
- Bedakan bug, keterbatasan yang diterima, dan usulan fitur.
- Jangan mengubah kode produksi agar test lulus tanpa persetujuan owner.
- Bug keamanan mengikuti alur laporan privat.

### Quality bar

- Semua acceptance terpenuhi atau ada blocker yang jelas.
- Tidak ada regresi di route/modul lain.
- Keyboard, responsif, dark/light, offline diuji.
- Console bersih.
- Bukti tersimpan di PR.

### Anti-pattern

- "Sudah saya coba, works" tanpa langkah/bukti.
- Menguji hanya di satu browser/viewport.
- Menutup bug tanpa verifikasi perbaikan.

---

## 7. Security Engineer

### Misi

Menjaga situs, konten, dan pipeline tetap aman untuk repo publik tanpa
mengorbankan pengalaman belajar.

### Memiliki

- Threat model dan security review.
- CSP/escaping review.
- Izin CI dan aturan auto-merge.
- Secret scanning dan dependency review.
- Lab safety review.
- `SECURITY.md`.

### Tidak memiliki

- Prioritas fitur.
- Menulis seluruh UI.
- Menyetujui rilis sendirian.

### Aturan wajib

- Least privilege untuk token/CI permission.
- Jangan memakai `pull_request_target` tanpa ADR + review khusus.
- Jangan mencetak/menyimpan secret; rotasi jika bocor.
- Escape output dan tegakkan CSP; validasi klien bukan kontrol keamanan.
- Auto-merge tidak boleh berlaku untuk fork/pihak asing.
- Konten lab tidak boleh mengarahkan serangan ke pihak ketiga.
- Dependency/action baru ditinjau supply chain-nya.
- Temuan kerentanan dilaporkan privat.

### Quality bar

- Tidak ada secret/PII di diff/log.
- Izin CI minimal dan dipisah per job.
- Render aman dari XSS/injection.
- Lab punya safety note dan target sah.
- Dependency/action tepercaya.

### Anti-pattern

- Memberi `contents: write` ke job validasi.
- Menonaktifkan secret scan agar PR cepat merge.
- Menyimpan token di workflow/README.
- Menormalkan serangan ke sistem nyata.

---

## 8. DevOps & Release Engineer

### Misi

Membuat build, validasi, deploy, dan rilis dapat diulang, aman, dan mudah
dipulihkan.

### Memiliki

- `.github/workflows/*`.
- Branch protection guide.
- GitHub Pages deploy.
- Release/tag dan changelog.
- Dependabot.

### Tidak memiliki

- Kode fitur.
- Konten.
- Kebijakan produk.

### Aturan wajib

- Pipeline as code; tidak ada perubahan manual di production.
- Least privilege per job; pisahkan read dan write.
- Deploy hanya dari `main` yang lolos validasi.
- Jangan menyimpan secret di repo; gunakan secret store jika perlu.
- Sediakan rollback dan cara verifikasi deploy.
- Jangan menonaktifkan check untuk mempercepat rilis.
- Ketahui batasan `GITHUB_TOKEN` untuk trigger workflow lain.

### Quality bar

- Workflow valid, permission minimal.
- Deploy reproducible, path relatif, smoke test setelah deploy.
- Ada rollback plan.
- Release notes/changelog diperbarui.

### Anti-pattern

- `permissions: write-all`.
- Deploy dari branch fitur.
- Menghapus branch protection untuk "sementara".
- Merge langsung oleh `GITHUB_TOKEN` tanpa memikirkan deploy trigger.

---

## 9. Accessibility Engineer

### Misi

Memastikan semua orang dapat menggunakan LabSiber dengan keyboard, screen reader,
dan pengaturan visual yang berbeda.

### Memiliki

- WCAG audit.
- Keyboard/focus review.
- Kontras dan reduced motion.
- Semantic HTML review.
- Screen reader checks.

### Tidak memiliki

- Desain visual utama.
- Kode fitur.
- Prioritas produk.

### Aturan wajib

- Target WCAG 2.1 AA untuk alur utama.
- Jangan hanya mengandalkan warna untuk status.
- Semua kontrol dapat diakses keyboard dengan fokus terlihat.
- Gunakan semantic HTML dan label yang benar.
- Hormati `prefers-reduced-motion` dan kontras teks.
- Uji keyboard + minimal satu screen reader/axe.
- Jangan menurunkan aksesibilitas demi estetika.

### Quality bar

- Tab/Enter/Esc/arrow berfungsi.
- Fokus terlihat dan tidak terperangkap.
- Kontras memadai.
- Status punya teks/ikon, bukan warna saja.
- axe tidak menemukan pelanggaran serius.

### Anti-pattern

- `<div onclick>` tanpa role/tabindex.
- `outline: none` tanpa pengganti fokus.
- Placeholder sebagai satu-satunya label.
- Menyembunyikan konten penting di mobile.

---

## 10. Technical Writer

### Misi

Menjaga dokumentasi tetap akurat, konsisten, dan berguna sebagai satu sumber
kebenaran.

### Memiliki

- README.
- PRD/TSD/PR plan.
- CHANGELOG/release notes.
- Panduan deploy/CI.

### Tidak memiliki

- Kode fitur.
- Keputusan arsitektur.
- Validasi kebenaran materi.

### Aturan wajib

- Dokumentasi diperbarui di PR yang sama dengan perubahan perilaku.
- Satu sumber kebenaran; hindari duplikasi yang bisa basi.
- Bahasa Indonesia jelas, istilah konsisten.
- Link internal valid; link eksternal HTTPS.
- Jangan menyalin secret/data pribadi.
- Tandai keputusan yang belum final sebagai pertanyaan terbuka.
- Jangan mengklaim fitur yang belum ada.

### Quality bar

- Dokumen sesuai perilaku kode saat ini.
- Angka/istilah konsisten.
- Link lokal valid.
- Changelog/release notes lengkap.
- Pembaca baru bisa mengikuti langkahnya.

### Anti-pattern

- Menyalin isi PRD ke README lalu keduanya basi.
- Menulis "sudah selesai" untuk fitur yang belum di-merge.
- Menghapus detail keamanan agar dokumen lebih pendek.

---

## Protokol handoff

Gunakan format ini di PR/komentar task:

```text
Role: <role>
Task: <T-ID>
Status: done | blocked | in-review

Yang berubah:
- ...

Verifikasi:
- perintah/check + hasil
- manual test + viewport/browser

Risiko / batasan:
- ...

Tidak dikerjakan (out of scope):
- ...

Next:
- task/PR berikutnya atau pertanyaan untuk owner
```

## Review gate

| Tingkat | Contoh perubahan | Reviewer wajib |
| --- | --- | --- |
| **Hijau** | Konten, copy, styling kecil | Owner role + QA |
| **Kuning** | Schema data, progress, search, performa | Tech lead + QA |
| **Merah** | Workflow, auth, backend, secret, auto-merge, lisensi | Security + tech lead + PM |

## Aturan backend (ringkas)

Jika suatu saat backend ditambahkan:

1. ADR + security review sebelum kode.
2. Authz di server per objek/aksi.
3. Validasi input di boundary.
4. Least privilege untuk DB/service/token.
5. Idempotency + rate limit.
6. Migration + backup + rollback.
7. Log terstruktur tanpa PII.
8. Secret manager, bukan repo/env commit.
9. Error tidak membocorkan detail internal.
10. Test unit/integration/negative + contract test.
