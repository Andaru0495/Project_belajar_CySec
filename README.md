# LabSiber

[![CI](https://github.com/Andaru0495/Project_belajar_CySec/actions/workflows/ci.yml/badge.svg)](https://github.com/Andaru0495/Project_belajar_CySec/actions/workflows/ci.yml)

Lab belajar **cyber security berbahasa Indonesia** — dari nol, dengan roadmap,
materi, kuis, simulator terminal, dan panduan lab lokal. Situs statis, gratis,
privat, dan bisa di-host di GitHub Pages.

> **Status:** v0.1 (fondasi). Dokumen produk dan teknis selesai; kode aplikasi
> masuk lewat PR bertahap sesuai [PR Plan](docs/PR_PLAN.md).

---

## Kenapa LabSiber?

- **Terstruktur** — mengikuti roadmap cyber security, dari fundamental IT sampai
  cloud dan karier.
- **Praktik, bukan cuma baca** — kuis, terminal simulasi yang aman, dan lab lokal.
- **Berbahasa Indonesia** — istilah Inggris tetap dijelaskan.
- **Gratis & privat** — tanpa akun, tanpa analytics, tanpa server. Progres
  tersimpan di browser dan bisa diekspor.
- **Bisa offline** — setelah kunjungan pertama, situs tetap bisa dibuka.
- **Aman** — semua perintah terminal adalah simulasi; lab nyata memakai VM milik
  sendiri dengan peringatan etika.

---

## Dokumen

| Dokumen | Isi |
| --- | --- |
| [PRD](docs/PRD.md) | Masalah, pengguna, lingkup, kebutuhan, metrik, risiko |
| [TSD](docs/TSD.md) | Arsitektur, skema data, routing, terminal, keamanan, testing |
| [Stack](docs/STACK.md) | Keputusan teknologi, termasuk kenapa bukan Rust |
| [PR Plan](docs/PR_PLAN.md) | Checklist pemisahan kerja dan rencana PR |
| [CI & Auto-merge](docs/CI.md) | Apa yang divalidasi, kapan PR otomatis merge, setup branch protection |
| [Deploy](docs/DEPLOY.md) | GitHub Pages, workflow manual, rollback, troubleshooting |
| [PWA & Offline](docs/PWA.md) | Manifest, service worker, cache, uji offline |
| [Agent Operating Model](docs/AGENT_OPERATING_MODEL.md) | Siklus task, kontrak brief, handoff, review gate |
| [Agent Roles](docs/AGENT_ROLES.md) | Aturan, batas, dan quality bar tiap role coding agent |
| [Security Policy](SECURITY.md) | Cara melaporkan kerentanan secara privat |
| [ADR](docs/adr/) | Keputusan arsitektur (statis, konten, progres, hosting, terminal) |

---

## Menjalankan secara lokal

Tidak ada `npm install` dan tidak ada build step.

```bash
# Clone
git clone git@github.com:Andaru0495/Project_belajar_CySec.git
cd Project_belajar_CySec

# Jalankan server statis
python3 -m http.server 8000

# Buka
# http://localhost:8000
```

Alternatif:

```bash
npx serve .
```

> Catatan: membuka `index.html` langsung via `file://` juga didukung oleh desain
> konten, tetapi service worker dan beberapa fitur browser membutuhkan HTTP.

---

## Validasi

Butuh Node.js 22+ (hanya untuk tooling, bukan runtime situs).

```bash
# cek syntax semua file JS yang tracked
while IFS= read -r -d '' file; do node --check "$file"; done < <(git ls-files -z -- '*.js' '*.mjs')

node scripts/validate.mjs
node scripts/test-terminal.mjs
node scripts/check-secrets.mjs
node scripts/agents.mjs check
```

Validator memeriksa:

- ID modul/node unik dan referensi valid.
- Kuis punya 4 opsi dan jawaban yang valid.
- Pola misi terminal adalah regex valid dan cocok dengan solusinya.
- Link resource memakai HTTPS.
- Tidak ada placeholder, karakter CJK tak sengaja, atau link lokal yang rusak.
- Tidak ada token/kunci yang tidak sengaja ter-commit.

CI menjalankan pemeriksaan yang sama pada setiap PR. Jika semua lulus dan PR
berasal dari owner, PR akan di-auto-merge. Detail dan setup branch protection ada
di [docs/CI.md](docs/CI.md).

---

## Struktur

```text
index.html                 shell
assets/css/style.css       design system
assets/js/app.js           router + view
assets/js/state.js         progress schema + selectors
assets/js/terminal.js      shell simulator
content/roadmap.js         202 node roadmap
content/module-index.js    metadata 17 modul
content/modules/*.js       materi, kuis, terminal, lab
agents/                    role registry + task handlers
docs/                      PRD, TSD, stack, PR plan, agent model, ADR
scripts/                   validator + test + agent CLI
.github/                   template PR/issue + workflow
```

---

## Agent roles & tasks

Pekerjaan dipecah menjadi task mandiri dengan **satu owner role**, reviewer,
dependency, file scope, acceptance, dan handoff.

```bash
node scripts/agents.mjs roles
node scripts/agents.mjs board
node scripts/agents.mjs task T-006
node scripts/agents.mjs next --role frontend
node scripts/agents.mjs check
```

- Aturan tiap role: [docs/AGENT_ROLES.md](docs/AGENT_ROLES.md)
- Siklus task & handoff: [docs/AGENT_OPERATING_MODEL.md](docs/AGENT_OPERATING_MODEL.md)
- Registry: [`agents/`](agents/)

Setiap coding agent wajib membaca brief task + role charter sebelum mengubah file.
`node scripts/agents.mjs check` dijalankan di CI untuk menolak task tanpa owner,
dependency hilang, siklus, atau field acceptance yang kosong.

---

## Kontribusi

1. Baca [PRD](docs/PRD.md) dan [PR Plan](docs/PR_PLAN.md).
2. Buat branch dari `main`: `feat/...`, `content/...`, `fix/...`, atau `docs/...`.
3. Satu PR = satu fokus.
4. Isi template PR dan centang checklist.
5. Pastikan `validate` hijau.

Untuk koreksi materi, buka issue **Koreksi konten** dengan sumber tepercaya.
Jangan menempelkan data pribadi atau kredensial nyata.

---

## Etika & keamanan

- Semua latihan hanya untuk sistem milik sendiri atau yang punya izin tertulis.
- Terminal di situs ini adalah **simulasi**; tidak mengeksekusi perintah nyata.
- Lab nyata harus dijalankan di VM terisolasi.
- Jangan memindai atau menyerang infrastruktur pihak lain.
- Untuk laporan kerentanan pada proyek ini, hubungi maintainer secara privat,
  jangan buka issue publik berisi detail eksploitasi.

---

## Lisensi

- **Kode:** MIT — lihat [LICENSE](LICENSE).
- **Konten pembelajaran:** CC BY-SA 4.0 — lihat
  [LICENSE-CONTENT](LICENSE-CONTENT).
- Roadmap terinspirasi [roadmap.sh](https://roadmap.sh/cyber-security). PDF sumber
  tidak didistribusikan ulang.
