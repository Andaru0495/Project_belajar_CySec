# PWA & Offline

LabSiber bisa dipasang sebagai PWA dan dibuka offline setelah kunjungan pertama.

## File

| File | Fungsi |
| --- | --- |
| `manifest.webmanifest` | Nama, ikon, warna, `start_url`, `scope` |
| `sw.js` | Service worker: precache app shell, runtime cache modul |
| `assets/icons/icon-192.png`, `icon-512.png` | Ikon install |
| `assets/js/app.js` | Registrasi service worker |

## Strategi cache

- **Precache**: `index.html`, CSS, JS, roadmap, module index, modul fondasi, ikon, manifest.
- **Navigation**: network-first; jika offline, pakai `index.html` dari cache.
- **Modul yang dibuka**: stale-while-revalidate; modul yang sudah pernah dibuka bisa dibaca offline.
- **Aset lain**: network-first, fallback ke cache. Jadi setelah deploy baru, aset
  yang berubah tidak tertahan cache lama.

Modul yang belum pernah dibuka tidak otomatis tersedia offline. Buka modulnya sekali
saat online agar masuk cache.

## Update rilis

Naikkan `VERSION` di `sw.js`:

```js
const VERSION = 'v2';
```

Saat pengguna membuka situs lagi, service worker baru mengambil alih, cache lama
dihapus, dan aset baru diunduh. Tidak ada prompt update di v1.0.

## Uji lokal

Service worker membutuhkan HTTP/HTTPS, bukan `file://`.

```bash
python3 -m http.server 8000
```

1. Buka `http://localhost:8000`.
2. DevTools → Application → Service Workers: pastikan `sw.js` aktif.
3. Application → Cache Storage: cek cache `labsiber-v1`.
4. Network → centang **Offline**.
5. Reload `#/`, `#/roadmap`, `#/module/fondasi`.
6. Buka modul yang sudah pernah dibuka; harus tetap tampil.

## Uji di GitHub Pages

- Tunggu deploy selesai.
- Buka URL HTTPS, lalu install lewat ikon install di address bar (Chrome/Edge)
  atau **Add to Home Screen** (iOS Safari).
- Pastikan scope berada di subpath repo: `/Project_belajar_CySec/`.

## Batasan

- Cache tidak menyimpan data pengguna; progres tetap di `localStorage`.
- Service worker tidak menangani request non-GET atau cross-origin.
- Jika deploy baru tidak terlihat, hard refresh atau naikkan `VERSION`.
- `sw.js` harus berada di root scope agar bisa mengontrol seluruh situs.
