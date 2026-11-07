# ADR-0002 — Konten sebagai modul JS + lazy load

- **Status:** Diterima
- **Tanggal:** 2026-11-07
- **Konteks:** Penyimpanan dan pemuatan konten

## Konteks

Konten berjumlah 17 modul dan 202 node roadmap. Jika semuanya dimuat di awal,
halaman pertama menjadi berat di koneksi lambat. Konten juga harus bisa dibuka
saat pengembangan via `file://` tanpa server.

JSON via `fetch()` gagal di `file://` karena CORS. Markdown membutuhkan parser
(menambah dependency/ukuran).

## Keputusan

Simpan konten sebagai **file JavaScript** yang menetapkan global:

- `window.CYBER_ROADMAP`
- `window.CYBER_MODULE_INDEX`
- `window.CYBER_MODULES[id]`

Muat roadmap + index saat boot. Muat file modul **secara lazy** saat route modul
dibuka, dengan cache promise per file.

## Konsekuensi

**Positif**

- Bisa dibuka via `file://` dan static hosting.
- Tidak perlu parser Markdown; konten terstruktur (blok).
- Lazy load menjaga muat awal kecil.
- Mudah di-edit tanpa build.

**Negatif**

- Global namespace; harus diberi prefix.
- Tidak ada type checking; validator konten wajib.
- File modul berisi 2–4 modul; perubahan satu modul menyentuh file yang sama.
- Perlu mekanisme error/retry saat lazy load gagal.

## Alternatif yang ditolak

- **JSON + fetch**: gagal di `file://`, butuh server.
- **Markdown + parser**: menambah dependency dan kompleksitas rendering.
- **HTML per modul**: duplikasi layout dan sulit divalidasi.

## Aturan

- Semua global berprefix `CYBER_`.
- Setiap file modul memakai IIFE/assignment yang aman.
- Validator memeriksa skema, duplikasi, regex, dan referensi.
