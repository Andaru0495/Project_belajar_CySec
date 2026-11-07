# ADR-0001 — Situs statis tanpa build step

- **Status:** Diterima
- **Tanggal:** 2026-11-07
- **Konteks:** LabSiber v1.0

## Konteks

LabSiber adalah situs belajar berisi teks, kuis, dan simulator terminal. Pengguna
utama adalah pelajar dengan budget terbatas. Situs harus bisa di-host gratis,
diakses dari mana saja, dan dirawat oleh satu orang.

Kandidat: static site generator/framework (Astro, Next.js, Vite+React) vs HTML/CSS/JS
murni tanpa build.

## Keputusan

Gunakan **HTML, CSS, dan JavaScript murni tanpa build step**. File yang di-commit
adalah file yang dijalankan. Node hanya dipakai untuk validasi di CI.

## Konsekuensi

**Positif**

- Tidak ada `npm install` untuk menjalankan situs.
- Tidak ada bundle, hidrasi, atau runtime framework.
- Deploy cukup unggah folder; GitHub Pages langsung bekerja.
- Mudah diaudit dan dipahami pemula.
- Offline/PWA lebih sederhana.
- Tidak ada supply chain dependency.

**Negatif**

- DOM manipulation manual.
- Tidak ada type safety; digantikan validator konten.
- Perlu disiplin struktur agar `app.js` tidak menjadi monolit.
- Tidak ada optimasi otomatis (minify, code splitting); lazy load manual.

## Alternatif yang ditolak

- **Astro**: build step dan Node; bagus untuk konten besar, tetapi berlebihan
  untuk 17 modul.
- **React/Vite**: bundle dan kompleksitas tidak sepadan.
- **Next.js**: SSR/backend tidak dibutuhkan.
- **Rust/WASM**: kompleksitas tinggi tanpa manfaat performa yang terasa.

## Kapan ditinjau ulang

Jika konten melewati ~50 modul, authoring terasa lambat, atau butuh prerender/SEO
kuat. Migrasi harus lewat ADR baru.
