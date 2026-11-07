# ADR-0004 — GitHub Pages sebagai hosting utama

- **Status:** Diterima
- **Tanggal:** 2026-11-07
- **Konteks:** Hosting gratis untuk situs statis

## Konteks

Situs harus dapat diakses dari mana saja tanpa biaya. Kandidat: GitHub Pages,
Cloudflare Pages, Netlify, Vercel, Surge.

## Keputusan

Gunakan **GitHub Pages** dengan deploy via **GitHub Actions**. Semua path bersifat
relatif agar situs bekerja di subpath `/<repo>/`. `.nojekyll` disertakan.

## Konsekuensi

**Positif**

- Gratis untuk repo publik.
- HTTPS otomatis.
- Terintegrasi dengan PR/CI.
- Tidak perlu kartu kredit.
- Custom domain opsional.

**Negatif**

- Tidak bisa mengatur header HTTP (CSP harus via meta; `frame-ancestors` tidak
  berlaku).
- Build/deploy memakai Actions; ada kuota (cukup untuk proyek ini).
- Repo harus publik untuk akun gratis (sesuai tujuan berbagi).
- Cache/CDN tidak seagresif Cloudflare.

## Alternatif yang ditolak

- **Cloudflare Pages**: sangat baik, tetapi menambah akun/platform; bisa menjadi
  alternatif jika butuh header.
- **Netlify/Vercel**: gratis dengan batas; tidak perlu untuk situs statis murni.
- **Surge**: sederhana, tetapi kurang terintegrasi dengan PR.

## Aturan deploy

- Workflow `deploy.yml` hanya pada push ke `main`.
- Permissions: `contents: read`, `pages: write`, `id-token: write`.
- Artifact: root repo.
- Jangan commit secret; tidak ada secret yang dibutuhkan.
