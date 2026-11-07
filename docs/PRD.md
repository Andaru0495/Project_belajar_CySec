# PRD — LabSiber

| Field | Nilai |
| --- | --- |
| Produk | LabSiber — lab cyber security berbahasa Indonesia |
| Versi dokumen | 0.1 (draft untuk PR #1) |
| Tanggal | 2026-11-07 |
| Pemilik produk | Andaru (Project Manager) |
| Penulis | Engineering |
| Status | Menunggu review |
| Sumber roadmap | `roadmap.sh/cyber-security` (PDF referensi lokal, tidak didistribusikan) |

---

## 1. Ringkasan eksekutif

LabSiber adalah situs statis berbahasa Indonesia untuk belajar cyber security dari nol.
Produk menggabungkan empat hal yang biasanya terpisah:

1. **Roadmap lengkap** yang bisa dilacak progresnya.
2. **Materi bertahap** yang menjelaskan konsep, bukan sekadar daftar tool.
3. **Praktik langsung** berupa kuis, simulator terminal aman, dan panduan lab lokal.
4. **Progres belajar** yang tersimpan lokal, dapat diekspor, dan tidak membutuhkan akun.

Target rilis pertama adalah situs gratis yang bisa diakses dari mana saja melalui
GitHub Pages, tetap bisa dipakai offline setelah kunjungan pertama, dan tidak
mengirim data pribadi ke server mana pun.

---

## 2. Latar belakang & masalah

Pemula di Indonesia yang ingin masuk cyber security menghadapi beberapa masalah:

| Masalah | Dampak |
| --- | --- |
| Materi tersebar dan berbahasa Inggris | Hambatan bahasa dan kognitif di awal belajar |
| Roadmap ada, tetapi tidak menjelaskan urutan praktik | Bingung harus mulai dari mana |
| Tutorial berfokus pada tool, bukan konsep | Sulit beradaptasi saat tool/versi berubah |
| Lab berbayar atau butuh server | Tidak ramah pelajar dengan budget terbatas |
| Tidak ada rekap progres | Sulit menjaga konsistensi dan mengetahui blind spot |
| Konten keamanan sering menormalisasi praktik ilegal | Risiko etika dan hukum bagi pemula |

LabSiber menjawab dengan kurikulum yang terstruktur, berbahasa Indonesia, berbasis
praktik aman, dan bisa dijalankan sepenuhnya di browser serta lab lokal sendiri.

---

## 3. Tujuan & non-tujuan

### 3.1 Tujuan (v1.0)

- Menyediakan **17 modul** dan **202 node roadmap** yang terpetakan dan dapat dilacak.
- Menyediakan minimal **6 soal kuis per modul** dengan penjelasan jawaban.
- Menyediakan minimal **5 misi terminal per modul** yang relevan (total ≥ 80 misi).
- Menyediakan **panduan lab lokal** yang aman, dengan peringatan etika dan hukum.
- Menyediakan **progres, catatan, ekspor/impor** tanpa akun dan tanpa server.
- Berjalan sebagai **PWA offline** setelah kunjungan pertama.
- Dapat di-deploy **gratis** ke GitHub Pages tanpa build step.
- Mencapai **WCAG 2.1 AA** untuk alur utama.

### 3.2 Non-tujuan (v1.0)

- Bukan penyedia sertifikasi atau badan kredensial.
- Bukan platform yang menyediakan target rentan publik untuk diserang.
- Bukan pengganti praktik di platform seperti TryHackMe/HackTheBox.
- Bukan aplikasi multi-user, kelas online, atau forum komunitas.
- Bukan layanan yang mengeksekusi perintah shell nyata di server.
- Bukan produk berbayar dan tidak memiliki iklan/tracking.
- Belum mendukung bahasa selain Indonesia.
- Belum menyediakan sinkronisasi progres antarperangkat.

---

## 4. Pengguna & persona

### Persona utama — "Pelajar mandiri"

- Mahasiswa/pelajar 17–25 tahun, Bahasa Indonesia sebagai bahasa utama.
- Punya laptop kelas menengah, koneksi internet tidak selalu stabil.
- Budget terbatas; tidak ingin berlangganan.
- Tahu dasar komputer, belum tentu pernah memakai Linux.
- Belajar dengan mencoba, bukan hanya membaca.
- Butuh rasa aman secara hukum dan etika saat praktik.

### Persona sekunder — "Career switcher"

- Bekerja di IT/support dan ingin pindah ke security.
- Butuh roadmap, kosakata teknis, dan bukti portofolio.
- Waktu belajar terbatas; butuh modul yang bisa diselesaikan 30–60 menit.

### Persona tersier — "Pengajar/mentor"

- Ingin materi berbahasa Indonesia untuk dibagikan.
- Butuh struktur yang jelas, lisensi terbuka, dan konten yang bisa dikoreksi.

---

## 5. Metrik keberhasilan

### 5.1 Metrik produk

| Metrik | Target v1.0 | Cara ukur |
| --- | --- | --- |
| Modul lengkap | 17/17 | Validator konten |
| Node roadmap terpetakan | 202/202 | Validator konten |
| Soal kuis | ≥ 100 | Validator konten |
| Misi terminal | ≥ 80 | Validator konten |
| Lab lokal | 17/17 modul punya lab | Validator konten |
| Modul bisa diselesaikan tanpa bantuan eksternal | ≥ 80% modul | Review manual |
| Progres bisa diekspor/impor | 100% | Uji manual |

### 5.2 Metrik teknis

| Metrik | Target |
| --- | --- |
| Lighthouse Performance (desktop) | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | ≥ 90 |
| JS+CSS awal (gzip, tanpa konten) | ≤ 120 KB |
| Waktu muat modul pertama di 3G cepat | ≤ 2,5 detik LCP |
| Console error di alur utama | 0 |
| Validator konten | 100% lulus |
| Offline setelah kunjungan pertama | Semua modul yang sudah dibuka |
| Broken internal link | 0 |
| Secret scan | 0 temuan |
| CI `validate` | 100% hijau sebelum merge |
| Auto-merge | Hanya untuk PR owner dari branch repo sendiri |

### 5.3 Metrik pembelajaran (lokal, tanpa tracking)

Karena tidak ada server analitik, metrik pembelajaran diukur dari state lokal dan
laporan pengguna:

- Persentase modul selesai.
- Rata-rata skor kuis terbaik.
- Jumlah misi terminal selesai.
- Streak harian.
- Umpan balik kualitatif: "apakah kamu bisa menjelaskan konsep ini setelah modul?"

---

## 6. Lingkup rilis

### 6.1 v0.1 — Alpha platform

- App shell, routing, tema, navigasi, pencarian dasar.
- Halaman dashboard, roadmap, katalog modul.
- Lesson engine: blok materi, TOC, kuis, istilah, catatan.
- Konten awal: modul fondasi & hardware.
- Terminal simulator + integrasi misi.
- Progres lokal + ekspor/impor + glosarium.

**Definisi selesai:** pengguna bisa membuka roadmap, membaca modul, menjawab kuis,
menyelesaikan misi terminal, dan melihat progres.

### 6.2 v0.5 — Beta konten

- 17 modul lengkap dengan kuis, terminal, dan lab.
- Glosarium agregat dari semua modul.
- Pencarian Ctrl+K lintas modul, topik, dan istilah.
- PWA/offline.

**Definisi selesai:** semua konten lolos validator; situs bisa dipakai offline.

### 6.3 v1.0 — Rilis publik

- CI validasi + deploy GitHub Pages.
- QA lintas browser dan viewport.
- Dokumentasi deploy, kontribusi, dan lisensi.
- Release notes dan tag `v1.0.0`.

### 6.4 Di luar lingkup v1.0

- Login/akun, sinkronisasi cloud, leaderboard.
- Video, audio, atau kelas live.
- Hosting target rentan.
- AI tutor/chatbot.
- Multi-bahasa.
- Pembayaran, sertifikat, atau badge yang diklaim resmi.
- Komentar/forum.
- Analytics pihak ketiga.

---

## 7. User stories & acceptance criteria

### US-01 — Melihat posisi di roadmap

**Sebagai** pelajar, **saya ingin** melihat seluruh topik roadmap dan statusnya,
**agar** saya tahu apa yang sudah dikuasai dan apa berikutnya.

**Acceptance criteria**

- [ ] Semua 202 node tampil, dikelompokkan per bagian.
- [ ] Node yang terhubung ke modul menampilkan link "Buka modul".
- [ ] Node yang sudah selesai ditandai visual dan tidak hanya lewat warna.
- [ ] Progres per bagian dan keseluruhan terlihat.
- [ ] Pencarian/filter dapat menyembunyikan node yang sudah selesai.

### US-02 — Membaca materi terstruktur

**Sebagai** pelajar, **saya ingin** membaca modul dengan tujuan, penjelasan, contoh,
dan istilah kunci, **agar** saya memahami konsep sebelum praktik.

**Acceptance criteria**

- [ ] Modul menampilkan tujuan pembelajaran, estimasi waktu, level, dan track.
- [ ] Blok materi mendukung paragraf, list, tabel, kode, callout, dan link.
- [ ] TOC dapat diklik dan mengikuti posisi scroll.
- [ ] Navigasi modul sebelumnya/berikutnya bekerja.
- [ ] Semua konten di-escape dengan aman.

### US-03 — Menguji pemahaman

**Sebagai** pelajar, **saya ingin** menjawab kuis dan melihat penjelasan,
**agar** saya tahu mengapa jawaban saya benar/salah.

**Acceptance criteria**

- [ ] Setiap soal punya 4 opsi dan tepat 1 jawaban benar.
- [ ] Umpan balik muncul segera setelah memilih.
- [ ] Penjelasan ditampilkan untuk jawaban benar dan salah.
- [ ] Skor terbaik disimpan per modul.
- [ ] Kuis bisa diulang tanpa kehilangan skor terbaik.

### US-04 — Praktik terminal tanpa risiko

**Sebagai** pelajar, **saya ingin** berlatih perintah di simulator,
**agar** saya terbiasa sebelum memakai mesin nyata.

**Acceptance criteria**

- [ ] Perintah yang didokumentasikan berjalan dan memberi output realistis.
- [ ] Pipa, redireksi, dan `sudo` didukung pada tingkat yang diajarkan.
- [ ] Misi terminal memvalidasi perintah dan menandai selesai.
- [ ] Riwayat perintah dan reset tersedia.
- [ ] Tidak ada koneksi jaringan nyata atau eksekusi sistem.

### US-05 — Mengikuti lab lokal dengan aman

**Sebagai** pelajar, **saya ingin** panduan lab langkah demi langkah dengan
peringatan keselamatan, **agar** saya bisa praktik di VM sendiri secara legal.

**Acceptance criteria**

- [ ] Setiap lab punya tujuan, safety note, langkah, dan tantangan.
- [ ] Perintah penting bisa disalin.
- [ ] Lab selalu menyebut target yang diizinkan dan larangan.
- [ ] Tidak ada instruksi yang mengarah ke sistem pihak ketiga.

### US-06 — Melacak progres & catatan

**Sebagai** pelajar, **saya ingin** progres dan catatan tersimpan otomatis,
**agar** saya bisa melanjutkan kapan saja.

**Acceptance criteria**

- [ ] Progres modul, kuis, terminal, dan node manual tersimpan di localStorage.
- [ ] Catatan per modul tersimpan dengan indikator "tersimpan".
- [ ] Ekspor menghasilkan JSON yang bisa diimpor kembali.
- [ ] Impor memvalidasi versi dan bentuk data.
- [ ] Reset meminta konfirmasi.

### US-07 — Mencari istilah dan materi

**Sebagai** pelajar, **saya ingin** mencari modul, topik, dan istilah dengan Ctrl+K,
**agar** saya cepat menemukan jawaban.

**Acceptance criteria**

- [ ] Pencarian mencakup judul modul, deskripsi node, dan istilah.
- [ ] Hasil dapat dinavigasi dengan keyboard.
- [ ] Enter membuka hasil; Esc menutup.
- [ ] Empty state jelas.

### US-08 — Mengakses dari mana saja

**Sebagai** pelajar, **saya ingin** membuka situs dari perangkat lain dan tetap
mendapat progres saya, **agar** belajar tidak terikat satu mesin.

**Catatan:** v1.0 tidak menyediakan sinkronisasi otomatis. Progres dapat dipindahkan
lewat ekspor/impor. Sinkronisasi cloud adalah kandidat v1.1.

### US-09 — Memakai offline

**Sebagai** pelajar dengan internet tidak stabil, **saya ingin** situs tetap bisa
dibuka setelah kunjungan pertama, **agar** belajar tidak terhenti.

**Acceptance criteria**

- [ ] Service worker menyimpan app shell dan konten yang sudah dibuka.
- [ ] Navigasi hash tetap bekerja offline.
- [ ] Versi cache diperbarui saat rilis baru.
- [ ] Tidak ada error fatal saat offline.

### US-10 — Memahami etika & hukum

**Sebagai** pemula, **saya ingin** peringatan yang jelas tentang batas legal,
**agar** saya tidak melakukan tindakan berbahaya.

**Acceptance criteria**

- [ ] Modul fondasi memuat aturan etika dan hukum.
- [ ] Setiap lab punya safety note.
- [ ] Terminal menyatakan bahwa semua output adalah simulasi.
- [ ] Tidak ada konten yang menginstruksikan serangan ke pihak ketiga.

### US-11 — Membaca glosarium

**Sebagai** pelajar, **saya ingin** glosarium yang bisa dicari, **agar** saya cepat
mengingat istilah.

**Acceptance criteria**

- [ ] Istilah diagregasi dari semua modul.
- [ ] Setiap istilah tertaut ke modul asalnya.
- [ ] Pencarian dan pengelompokan alfabet bekerja.

### US-12 — Melanjutkan belajar

**Sebagai** pelajar, **saya ingin** dashboard menampilkan "lanjutkan belajar",
**agar** saya tidak bingung memilih modul berikutnya.

**Acceptance criteria**

- [ ] Menampilkan modul terakhir atau modul pertama yang belum selesai.
- [ ] Menampilkan ringkasan progres, skor kuis, misi terminal, dan streak.
- [ ] CTA langsung membuka modul.

---

## 8. Kebutuhan fungsional

| ID | Kebutuhan | Prioritas | Acceptance ringkas |
| --- | --- | --- | --- |
| FR-01 | Routing hash untuk dashboard, roadmap, modul, terminal, glosarium, progres | Must | Semua route dapat dibuka langsung dan tombol back bekerja |
| FR-02 | Dashboard dengan progres dan "lanjutkan belajar" | Must | Statistik akurat dari state |
| FR-03 | Roadmap 202 node dengan filter dan progres per bagian | Must | Semua node tampil dan terhubung |
| FR-04 | Katalog modul dengan filter track/status dan pencarian | Must | 17 modul tampil |
| FR-05 | Lesson engine dengan TOC dan blok materi | Must | Semua tipe blok dirender |
| FR-06 | Kuis interaktif dengan penjelasan dan skor terbaik | Must | Skor tersimpan |
| FR-07 | Terminal simulator dengan FS virtual, pipe, redireksi, sudo | Must | Perintah terdokumentasi berjalan |
| FR-08 | Misi terminal dengan validasi dan status selesai | Must | Solusi cocok dengan pola |
| FR-09 | Panduan lab lokal dengan safety note | Must | 17 lab tampil |
| FR-10 | Progres modul/kuis/terminal/node manual | Must | Persisten di localStorage |
| FR-11 | Catatan per modul dengan autosave | Should | Indikator tersimpan |
| FR-12 | Ekspor/impor/reset progres | Must | JSON tervalidasi |
| FR-13 | Glosarium agregat | Should | Semua istilah tampil |
| FR-14 | Pencarian global Ctrl+K | Should | Keyboard navigable |
| FR-15 | Tema gelap/terang | Should | Tersimpan |
| FR-16 | Responsif 360px–1440px | Must | Tidak ada horizontal scroll |
| FR-17 | PWA/offline | Should | Offline setelah kunjungan pertama |
| FR-18 | Validator konten | Must | CI gagal jika data tidak valid |
| FR-19 | Deployment GitHub Pages | Must | URL publik bekerja |
| FR-20 | Aksesibilitas WCAG 2.1 AA | Must | Fokus, kontras, keyboard, ARIA |
| FR-21 | CI wajib + auto-merge khusus owner | Must | `validate` hijau; PR fork/pihak lain tidak auto-merge |
| FR-22 | Secret scan repository publik | Must | 0 temuan sebelum merge |

---

## 9. Kebutuhan konten

### 9.1 Struktur

- 17 modul, masing-masing berisi:
  - ringkasan, 5+ tujuan, 5+ bagian materi;
  - 6+ istilah;
  - 6+ soal kuis (kecuali modul yang secara eksplisit lebih sedikit);
  - 5+ misi terminal (kecuali modul non-CLI, minimal 1);
  - 1 lab lokal dengan safety note;
  - 3+ sumber referensi.
- 202 node roadmap, masing-masing punya deskripsi 1–2 kalimat dan modul terkait.
- Glosarium diagregasi dari istilah modul.

### 9.2 Standar kualitas

- Bahasa Indonesia yang jelas; istilah Inggris dijelaskan saat pertama muncul.
- Setiap klaim teknis dapat dirujuk ke sumber tepercaya.
- Tidak ada instruksi yang menargetkan sistem pihak ketiga.
- Setiap perintah berbahaya diberi konteks lab dan peringatan.
- Tidak ada data pribadi, kredensial nyata, atau hash password nyata.
- Tidak ada konten yang mendorong aktivitas ilegal.
- Tidak ada placeholder `TODO`, `lorem ipsum`, atau teks CJK yang tidak disengaja.
- Link eksternal memakai HTTPS dan `rel="noopener noreferrer"`.

### 9.3 Atribusi & lisensi

- Roadmap terinspirasi `roadmap.sh`; cantumkan atribusi.
- Jangan mendistribusikan ulang PDF sumber.
- Konten asli dilisensikan CC BY-SA 4.0.
- Kode dilisensikan MIT.

---

## 10. Kebutuhan non-fungsional

| ID | Kebutuhan | Target |
| --- | --- | --- |
| NFR-01 | Performa | LCP ≤ 2,5 detik pada 3G cepat; JS+CSS awal ≤ 120 KB gzip |
| NFR-02 | Aksesibilitas | WCAG 2.1 AA; fokus terlihat; navigasi keyboard; kontras ≥ 4.5:1 |
| NFR-03 | Privasi | Tanpa analytics, cookie pihak ketiga, atau pengiriman data ke server |
| NFR-04 | Keamanan | Escape konten, CSP, tanpa `eval`, tanpa inline handler, link aman |
| NFR-05 | Kompatibilitas | Chrome, Firefox, Safari, Edge versi modern; Android/iOS |
| NFR-06 | Ketahanan | Offline setelah kunjungan pertama; progres tidak hilang saat navigasi |
| NFR-07 | Maintainability | Tanpa runtime dependency; validator konten; satu modul per file |
| NFR-08 | Hosting | GitHub Pages gratis; path relatif; HTTPS |
| NFR-09 | Legal | Lisensi jelas; atribusi roadmap; safety disclaimer |
| NFR-10 | Ukuran repo | Tanpa binary besar; aset ikon minimal; PDF tidak di-commit |
| NFR-11 | Keamanan repo publik | Secret scan wajib; token CI least privilege; tanpa `pull_request_target`; Dependabot untuk actions |

---

## 11. Alur pengguna utama

```text
Buka situs
  → Dashboard (progres, lanjutkan belajar)
  → Roadmap (lihat posisi) ──────────────┐
  → Pilih modul → Baca materi            │
       → Kuis → lihat penjelasan         │
       → Terminal → selesaikan misi      │
       → Lab lokal → praktik di VM       │
       → Tandai selesai → progres update ┘
  → Glosarium / pencarian
  → Ekspor progres (opsional)
```

---

## 12. Risiko & mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Konten tidak akurat | Pembelajaran salah | Review, sumber, validator, disclaimer, issue template koreksi |
| Konten menormalkan praktik ilegal | Risiko hukum/etika | Safety note wajib, aturan target, review konten |
| Volume konten besar | Sulit dirawat | Satu modul per file, skema divalidasi, PR kecil |
| Progres hilang | Frustrasi | Peringatan localStorage, ekspor/impor, reset berkonfirmasi |
| SPA kurang SEO | Sulit ditemukan | Meta description, judul per route, roadmap ke prerender |
| Terminal tidak identik dengan shell nyata | Miskonsepsi | Dokumentasikan batasan, fokus konsep, output realistis |
| Ukuran awal terlalu besar | Lambat di mobile | Lazy load konten, tanpa framework, cache |
| Path GitHub Pages salah | Aset 404 | Semua path relatif, uji di subpath |
| Scope creep | Tidak selesai | PR plan, out-of-scope, definition of done |
| Auto-merge memasukkan perubahan yang lulus tes tetapi salah konsep | Kualitas/keamanan turun | Review tetap disarankan; label `no-automerge` untuk perubahan sensitif; validator + branch protection |
| Secret bocor di repo publik | Kredensial disalahgunakan | Secret scan CI, GitHub secret scanning, review, rotasi |
| Browser lama | Fitur tidak jalan | Dukungan evergreen; graceful degradation |

---

## 13. Asumsi & ketergantungan

- Pengguna memakai browser modern dengan JavaScript aktif.
- Pengguna memiliki akses ke GitHub dan bisa membuat repo publik.
- Hosting menggunakan GitHub Pages (gratis) atau setara.
- Konten tidak membutuhkan backend, database, atau autentikasi.
- Lab nyata dijalankan pengguna di mesin/VM sendiri.
- Tidak ada kebutuhan analytics untuk v1.0.
- Repo final: `github.com/Andaru0495/Project_belajar_CySec`.

---

## 14. Rencana rilis

| Milestone | Isi | PR terkait | Kriteria keluar |
| --- | --- | --- | --- |
| M0 — Fondasi | PRD, TSD, stack, PR plan, template repo, CI guardrails | #1, #1b | Dokumen disetujui; CI hijau |
| M1 — Alpha platform | Shell, roadmap, lesson engine, modul fondasi | #2–#4 | Alur utama bisa dipakai |
| M2 — Beta konten | 17 modul, terminal, progres, glosarium, pencarian, PWA | #5–#13 | Validator 100%, offline |
| M3 — Rilis v1.0 | Deploy, QA, release notes | #14–#15 | URL publik, checklist QA lulus |

---

## 15. Pertanyaan terbuka

1. Repo sudah memakai `Project_belajar_CySec`; apakah perlu di-rename menjadi `labsiber` atau nama lain?
2. Apakah akan memakai custom domain? (Tidak wajib.)
3. Apakah perlu halaman "Tentang" dan "Kontribusi" di situs, atau cukup README?
4. Apakah konten akan direview orang lain sebelum rilis?
5. Apakah perlu dukungan bahasa Inggris di masa depan?
6. Apakah perlu analytics privasi (misalnya Plausible self-host) di v1.1?
7. Apakah perlu fitur "mode ujian" tanpa penjelasan?
8. Apakah perlu ekspor catatan ke Markdown selain JSON?

---

## 16. Lampiran — definisi istilah produk

| Istilah | Arti di dokumen ini |
| --- | --- |
| Modul | Satu unit belajar dengan materi, kuis, terminal, dan lab |
| Node | Satu topik pada roadmap |
| Misi | Tantangan terminal dengan validasi perintah |
| Lab | Panduan praktik di mesin/VM pengguna |
| Track | Kelompok modul (Fondasi, Jaringan, Keamanan, dll.) |
| Progres | State lokal pengguna (modul, kuis, terminal, node manual) |
