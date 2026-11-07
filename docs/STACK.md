# STACK — LabSiber

| Field | Nilai |
| --- | --- |
| Versi | 0.1 |
| Tanggal | 2026-11-07 |
| Status | Keputusan untuk v1.0 |
| Dokumen terkait | [PRD](./PRD.md), [TSD](./TSD.md) |

---

## 1. Keputusan ringkas

| Lapisan | Pilihan | Alasan utama |
| --- | --- | --- |
| Bahasa aplikasi | **HTML + CSS + JavaScript (ES2020)** | Jalan langsung di browser, tanpa build |
| Arsitektur | **Static SPA, hash routing** | Gratis, sederhana, offline-friendly |
| Framework UI | **Tidak ada** | Menghindari bundle/runtime dan kompleksitas |
| Styling | **CSS murni + CSS variables** | Ringan, tema mudah, tanpa tooling |
| Data konten | **File JS yang menetapkan global** | Bisa dibuka via `file://`, mudah di-deploy |
| Progres | **localStorage** | Tanpa server/akun; privasi maksimal |
| Terminal | **Simulator JS in-browser** | Aman, offline, tidak butuh backend |
| PWA | **Service worker + Web App Manifest** | Offline setelah kunjungan pertama |
| Testing | **Node.js + `node --check` + script kustom** | Tanpa framework test berat |
| Hosting | **GitHub Pages** | Gratis, HTTPS, deploy via Actions |
| CI/CD | **GitHub Actions + auto-merge khusus owner** | Validasi wajib; fork tidak auto-merge |
| Keamanan repo | **Secret scan + least-privilege token + Dependabot** | Repo publik tetap aman |
| Lisensi kode | **MIT** | Permisif, mudah dibagikan |
| Lisensi konten | **CC BY-SA 4.0** | Terbuka, atribusi, share-alike |

**Ringkas:** tidak ada runtime dependency, tidak ada build step, tidak ada server.
Node hanya dipakai untuk validasi di CI, bukan untuk menjalankan situs.

---

## 2. Matriks perbandingan

| Opsi | Kelebihan | Kekurangan | Cocok untuk LabSiber? |
| --- | --- | --- | --- |
| **Vanilla HTML/CSS/JS** | Nol dependency, instan, gratis, offline, mudah diaudit | DOM manual, tanpa type safety, butuh disiplin struktur | **Ya — dipilih** |
| **Astro** | Content collections, MDX, islands, performa baik | Butuh build step dan Node; menambah moving parts | Tidak untuk v1.0; kandidat jika konten > 50 modul |
| **React + Vite** | Ekosistem besar, komponen | Bundle/runtime, routing, build, overkill | Tidak |
| **Svelte/SvelteKit** | Ringan, reaktif, ergonomis | Build step, konsep framework, routing | Tidak |
| **Next.js** | SSR/SEO, API routes | Server/build, hosting lebih kompleks, berlebihan | Tidak |
| **MkDocs/Docusaurus** | Dokumentasi matang, search bawaan | Kurang interaktif untuk kuis/terminal; tema kaku | Tidak |
| **Rust + WebAssembly (Leptos/Yew)** | Performa, keamanan memori, binary | Kompleksitas tinggi, waktu build, ukuran WASM, tidak sepadan untuk konten | **Tidak** |
| **Rust backend + frontend** | Kontrol penuh, API | Butuh server, biaya hosting, autentikasi, database | Tidak (bertentangan dengan tujuan gratis/statis) |

---

## 3. Kenapa bukan Rust?

Pertanyaan ini pernah muncul, jadi keputusannya didokumentasikan eksplisit.

Rust adalah bahasa yang sangat baik untuk tool keamanan, parser, agent, dan sistem
yang butuh performa/keamanan memori. Tetapi LabSiber adalah **situs konten
interaktif**, bukan sistem berperforma tinggi.

Alasan tidak memakai Rust:

1. **Tidak ada masalah performa yang perlu diselesaikan.** Beban terbesar adalah
   merender teks dan menjalankan kuis. HTML/CSS/JS sudah lebih dari cukup.
2. **Build step dan ukuran WASM** menambah kompleksitas tanpa manfaat yang terasa
   bagi pengguna.
3. **Kontribusi konten** lebih mudah dengan JS/HTML ketimbang Rust.
4. **Hosting gratis statis** paling sederhana dengan file statis biasa.
5. **Waktu pengembangan** lebih baik dipakai untuk kualitas materi dan lab.
6. **Rust tetap relevan nanti** jika ingin membuat tool CLI/agent pendamping,
   parser konten, atau scanner—bukan untuk mengganti UI statis ini.

Keputusan: **Rust tidak dipakai di v1.0.** Jika ada kebutuhan nyata (misalnya
pemrosesan data besar di browser atau tool keamanan terpisah), itu menjadi proyek
terpisah dengan evaluasi sendiri.

---

## 4. Detail stack

### 4.1 Runtime

- Browser modern (Chrome/Edge/Firefox/Safari versi terbaru).
- Tidak ada Node.js saat pengguna membuka situs.
- Tidak ada server aplikasi.

### 4.2 Bahasa

- JavaScript ES2020 (class, optional chaining, nullish coalescing, modules? tidak;
  memakai classic script).
- Tidak memakai TypeScript di v1.0 untuk menghindari build step. Validasi konten
  menggantikan sebagian manfaat type safety.
- HTML5 semantik.
- CSS3 dengan variables, grid, flexbox, `color-mix`, `backdrop-filter`.

### 4.3 Data

- Konten: file `.js` yang menetapkan `window.CYBER_*`.
- Alasan bukan JSON: `fetch()` ke file JSON gagal saat dibuka via `file://` karena
  CORS. File JS bisa dimuat dengan `<script>` di mana saja.
- Progres: `localStorage` key `labsiber.v1`.
- Ekspor: JSON download.

### 4.4 Testing & validasi

- `node --check` untuk syntax.
- `scripts/validate.mjs` untuk skema konten, duplikasi, regex, link.
- `scripts/test-terminal.mjs` untuk perilaku shell dan pola misi.
- Tidak memakai Jest/Vitest di v1.0 (menambah dependency). Jika test tumbuh,
  migrasi ke Vitest dapat dipertimbangkan.

### 4.5 Tooling pengembangan

| Kebutuhan | Alat | Catatan |
| --- | --- | --- |
| Local server | `python3 -m http.server 8000` | Tanpa dependency |
| Alternatif | `npx serve .` | Butuh Node |
| Validasi | `node scripts/validate.mjs` | Node 22+ |
| Syntax check | `node --check` | Bawaan Node |
| Test terminal | `node scripts/test-terminal.mjs` | Node 22+ |
| Secret scan | `node scripts/check-secrets.mjs` | Gate tambahan untuk repo publik |
| Git | Git 2.30+ | Branch/PR |
| CI | GitHub Actions | `validate` + auto-merge owner-only |
| Deploy | GitHub Pages | Gratis |

### 4.6 Hosting

**GitHub Pages** dipilih karena:

- Gratis untuk repo publik.
- HTTPS otomatis.
- Terintegrasi dengan GitHub Actions.
- Mendukung custom domain (opsional).
- Tidak perlu kartu kredit.

Alternatif yang setara: Cloudflare Pages, Netlify, Vercel. Jika pindah, situs tetap
bisa dipakai karena semua path relatif.

### 4.7 Lisensi

- **Kode:** MIT.
- **Konten:** CC BY-SA 4.0.
- **Roadmap:** atribusi ke roadmap.sh; PDF sumber tidak didistribusikan.

### 4.8 Keamanan repository publik

Karena repo bersifat publik dan auto-merge aktif untuk owner:

- `check-secrets.mjs` wajib lulus di CI.
- Job `validate` hanya punya `contents: read`.
- Job `automerge` hanya untuk branch repo sendiri dan aktor owner; fork dikecualikan.
- Tidak memakai `pull_request_target`.
- Label `no-automerge` tersedia untuk perubahan sensitif.
- Dependabot memantau update GitHub Actions.
- Tidak ada secret yang dibutuhkan untuk build/deploy.
- Branch protection mewajibkan check `validate`.

Detail: [docs/CI.md](./CI.md).

---

## 5. Batasan & kapan harus migrasi

Stack ini dipilih untuk **v1.0**. Evaluasi ulang jika salah satu terjadi:

| Sinyal | Kemungkinan tindakan |
| --- | --- |
| Konten > 50 modul dan authoring terasa lambat | Pertimbangkan Astro + Markdown/MDX |
| Butuh akun & sinkronisasi progres | Tambah backend ringan (Supabase/Firebase) atau tetap lokal + ekspor |
| Butuh search index besar (> 5.000 istilah) | Tambah prebuilt search index |
| Butuh multi-bahasa | Refactor skema konten + i18n layer |
| Butuh rendering server/SEO kuat | Migrasi ke Astro/Next dengan prerender |
| Butuh terminal nyata | Jangan di browser; arahkan ke VM/lab eksternal dengan izin |
| Butuh aplikasi mobile native | Pertimbangkan PWA lanjutan atau React Native |

Migrasi harus didahului ADR baru dan rencana PR, bukan dilakukan diam-diam.

---

## 6. Lingkungan pengembangan

```bash
# 1. Clone
git clone git@github.com:Andaru0495/Project_belajar_CySec.git
cd Project_belajar_CySec

# 2. Jalankan lokal (tanpa dependency)
python3 -m http.server 8000
# buka http://localhost:8000

# 3. Validasi (butuh Node 22+)
while IFS= read -r -d '' file; do node --check "$file"; done < <(git ls-files -z -- '*.js' '*.mjs')
node scripts/validate.mjs
node scripts/test-terminal.mjs
node scripts/check-secrets.mjs
```

Tidak ada `npm install` untuk menjalankan situs. Tidak ada `node_modules` di repo.

---

## 7. Struktur dependency

```text
Runtime dependencies : 0
Dev dependencies    : 0 (Node bawaan + script sendiri)
External fonts      : 0
External CDN        : 0
Analytics/tracking  : 0
```

Prinsip: **semakin sedikit dependency, semakin kecil supply chain dan semakin
mudah dirawat.**

---

## 8. Keputusan yang ditolak (dan alasannya)

| Keputusan | Alasan ditolak |
| --- | --- |
| Menambahkan React | Tidak ada kebutuhan state kompleks; bundle lebih besar |
| Menambahkan Tailwind | Menambah build step; CSS variables cukup |
| Menambahkan CDN font | Request tambahan, privasi, offline |
| Menambahkan analytics | Bertentangan dengan privasi dan tanpa server |
| Menyimpan progres di server | Butuh auth, biaya, dan data pribadi |
| Menjalankan shell nyata | Risiko keamanan besar; tidak mungkin di static hosting |
| Menggunakan Rust/WASM | Kompleksitas tanpa manfaat untuk beban konten |
| Menambahkan database | Tidak ada data yang perlu dipusatkan |
