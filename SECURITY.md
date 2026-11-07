# Security Policy — LabSiber

## Versi yang didukung

| Versi | Didukung |
| --- | --- |
| `main` (v1.x) | Ya |
| Tag rilis lama | Tidak |

LabSiber adalah situs statis tanpa server, akun, database, atau data pengguna.
Namun kode, workflow CI, dan konten tetap bisa memiliki masalah keamanan.

## Melaporkan kerentanan

**Jangan membuka issue publik untuk masalah keamanan.**

Gunakan pelaporan privat GitHub:

```text
https://github.com/Andaru0495/Project_belajar_CySec/security/advisories/new
```

Jika tombol itu belum aktif, hubungi maintainer melalui profil GitHub
`@Andaru0495` dan minta kanal privat.

Sertakan:

- Deskripsi masalah dan dampaknya.
- Langkah reproduksi yang minimal.
- Browser/OS dan URL/commit yang terdampak.
- Bukti secukupnya (screenshot/request) tanpa mengeksploitasi data nyata.
- Saran perbaikan bila ada.

## Dalam cakupan

- XSS atau HTML injection pada renderer materi/kuis/terminal.
- Kebocoran data atau eksekusi kode yang disebabkan kode situs.
- Masalah service worker/cache yang bisa menyajikan konten berbahaya.
- Miskonfigurasi workflow CI yang bisa dieksploitasi (misalnya izin token
  berlebihan atau `pull_request_target` yang tidak aman).
- Supply chain: dependency/action berbahaya.
- Konten yang secara jelas mengarahkan pembaca melakukan tindakan ilegal atau
  berbahaya.
- Kebocoran secret di repository.

## Di luar cakupan

- Serangan yang membutuhkan perangkat/browser yang sudah dikompromikan.
- Social engineering terhadap maintainer atau pengguna.
- DoS/spam terhadap GitHub Pages atau layanan pihak ketiga.
- Laporan otomatis tanpa dampak yang dapat dijelaskan.
- Header HTTP yang tidak dapat diatur di GitHub Pages (misalnya
  `frame-ancestors`), kecuali ada bukti dampak nyata.
- Kerentanan pada situs pihak ketiga yang ditautkan dari materi.

## Safe harbor

Kami menghargai riset keamanan dengan niat baik. Untuk riset yang dilakukan
sesuai kebijakan ini:

- Jangan mengakses, mengubah, atau menyimpan data pengguna lain.
- Jangan mengganggu layanan atau menjalankan serangan DoS.
- Jangan mempublikasikan detail eksploitasi sebelum ada kesempatan perbaikan.
- Berikan waktu yang wajar untuk perbaikan sebelum disclosure.
- Gunakan hanya akun dan perangkat milikmu.

Kami tidak akan menindak pelapor yang mengikuti aturan ini.

## Waktu respons

Ini adalah proyek personal. Kami berusaha merespons dalam 7 hari kerja dan
memberikan update berkala. Tidak ada program bug bounty atau kompensasi finansial.

## Jika kamu menemukan secret

Jangan menggunakan secret tersebut. Laporkan secara privat dan sebutkan lokasi
(file/commit) tanpa menyalin nilai lengkapnya. Maintainer akan merotasi secret
dan membersihkan history bila perlu.

## Keamanan repository publik

Repository ini publik. Kontribusi harus:

- Tidak mengandung kredensial, token, data pribadi, atau target nyata.
- Tidak menambahkan dependency runtime tanpa diskusi.
- Tidak mengubah workflow menjadi `pull_request_target` tanpa review keamanan.
- Tidak melemahkan validasi CI atau auto-merge guard.
