# ADR-0003 — Progres lokal tanpa akun

- **Status:** Diterima
- **Tanggal:** 2026-11-07
- **Konteks:** Penyimpanan progres belajar

## Konteks

Progres mencakup modul selesai, skor kuis, misi terminal, catatan, dan streak.
Opsi: backend + akun, atau penyimpanan lokal.

Backend menambah autentikasi, database, biaya hosting, privasi, dan permukaan
serangan. Untuk v1.0, pengguna utama adalah satu orang yang belajar mandiri.

## Keputusan

Simpan progres di **localStorage** dengan key `labsiber.v1`. Sediakan
**ekspor/impor JSON** untuk portabilitas dan cadangan. Tidak ada akun, server,
analytics, atau sinkronisasi otomatis di v1.0.

## Konsekuensi

**Positif**

- Privasi maksimal: tidak ada data yang dikirim ke server.
- Tidak ada biaya backend atau autentikasi.
- Situs tetap statis dan offline.
- Ekspor/impor memberi kontrol penuh kepada pengguna.

**Negatif**

- Progres hilang jika pengguna menghapus data browser.
- Tidak ada sinkronisasi antarperangkat otomatis.
- Tidak ada leaderboard atau fitur sosial.
- Perlu peringatan dan mekanisme cadangan yang jelas.

## Alternatif yang ditolak

- **Backend + auth**: biaya, kompleksitas, data pribadi, bertentangan dengan
  prinsip privasi v1.0.
- **IndexedDB**: lebih kompleks; data kecil dan localStorage cukup.
- **File system access**: dukungan browser tidak merata.

## Kapan ditinjau ulang

Jika pengguna meminta sinkronisasi antarperangkat. Kandidat: Supabase/Firebase
dengan autentikasi opsional, atau ekspor/impor yang lebih baik. Perlu ADR baru.
