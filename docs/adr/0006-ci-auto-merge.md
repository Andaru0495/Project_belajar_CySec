# ADR-0006 — CI wajib + auto-merge khusus owner

- **Status:** Diterima
- **Tanggal:** 2026-11-07
- **Konteks:** Repository publik, maintainer tunggal

## Konteks

Repository bersifat publik. Setiap orang bisa membuka issue dan PR. Maintainer
ingin perubahan yang lolos validasi otomatis bisa langsung merge tanpa langkah
manual, tetapi auto-merge untuk semua PR akan berbahaya: PR dari fork atau pihak
asing tidak boleh masuk ke `main` tanpa review.

## Keputusan

Gunakan satu workflow `CI` dengan dua job:

1. `validate` — berjalan untuk semua PR dan push ke `main`:
   - syntax check JS,
   - validasi skema konten dan link lokal,
   - test terminal simulator,
   - secret scan.
2. `automerge` — hanya berjalan jika:
   - event adalah `pull_request`,
   - PR bukan draft,
   - branch asal berada di repo yang sama (bukan fork),
   - aktor adalah owner repository,
   - tidak ada label `no-automerge`,
   - job `validate` lulus.

Auto-merge memakai native GitHub auto-merge (`gh pr merge --auto`) dan fallback
merge langsung dengan `--match-head-commit` untuk menghindari race.

Branch `main` dilindungi: wajib PR dan status check `validate`, tanpa required
approval (agar auto-merge bisa bekerja).

## Konsekuensi

**Positif**

- Perubahan kecil dan aman bisa masuk cepat.
- PR dari fork/pihak lain tetap harus direview manual.
- Validasi konsisten untuk semua kontribusi.
- Secret scan mengurangi risiko kredensial bocor di repo publik.

**Negatif**

- Auto-merge bisa memasukkan perubahan yang "lulus tes tetapi salah secara
  konsep"; validator tidak menggantikan review.
- Bergantung pada konfigurasi branch protection dan setting auto-merge GitHub.
- Merge langsung oleh `GITHUB_TOKEN` dapat tidak memicu workflow `push` lain
  (misalnya deploy); perlu strategi deploy terpisah.
- Maintainer harus disiplin menambahkan label `no-automerge` untuk perubahan
  sensitif.

## Alternatif yang ditolak

- **Auto-merge semua PR**: terlalu berbahaya untuk repo publik.
- **Tidak ada CI**: kualitas konten dan keamanan tidak konsisten.
- **Bot auto-merge eksternal**: menambah dependency dan secret.
- **`pull_request_target` untuk auto-merge**: berisiko mengeksekusi kode PR
  dengan token write; ditolak.

## Aturan keamanan

- Job `validate` hanya punya `contents: read`.
- Job `automerge` punya `contents: write` dan `pull-requests: write`.
- Tidak memakai `pull_request_target`.
- Tidak mencetak secret ke log.
- Menonaktifkan auto-merge untuk perubahan workflow/keamanan dengan label
  `no-automerge` sampai direview manual.
