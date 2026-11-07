# ADR-0005 — Terminal simulasi di browser

- **Status:** Diterima
- **Tanggal:** 2026-11-07
- **Konteks:** Praktik perintah tanpa risiko

## Konteks

Pengguna ingin berlatih perintah Linux dan tool jaringan. Menjalankan shell nyata
di server tidak mungkin di static hosting dan berisiko besar. Menyediakan VM
remote berbayar juga bertentangan dengan tujuan gratis.

## Keputusan

Buat **terminal simulasi di browser** dengan filesystem virtual, parser perintah,
pipe, redireksi, sudo, dan output statis yang realistis. Misi divalidasi dengan
regex terhadap perintah mentah. Tidak ada eksekusi sistem, network, atau `eval`.

## Konsekuensi

**Positif**

- Aman sepenuhnya; tidak bisa merusak sistem pengguna.
- Bekerja offline.
- Tidak butuh server/biaya.
- Cocok untuk latihan konsep dan urutan perintah.

**Negatif**

- Tidak identik dengan shell nyata; beberapa perintah tidak didukung.
- Output statis tidak menyesuaikan semua input.
- Bisa menimbulkan miskonsepsi jika batasan tidak dijelaskan.
- Perlu test agar pola misi cocok dengan solusi.

## Alternatif yang ditolak

- **Shell nyata di server**: risiko keamanan dan biaya.
- **WASM Linux (v86/WebVM)**: menarik, tetapi berat dan kompleks untuk v1.0.
- **Iframe terminal pihak ketiga**: dependency eksternal, privasi, offline sulit.

## Aturan

- UI dan dokumentasi menyatakan bahwa ini simulasi.
- Perintah yang didukung didokumentasikan di `help`.
- Tidak ada network/eval.
- Misi dan solusi divalidasi di CI.
- Lab nyata diarahkan ke VM pengguna sendiri dengan safety note.
