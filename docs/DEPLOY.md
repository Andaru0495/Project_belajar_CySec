# Deploy — GitHub Pages

Situs ini statis, jadi deploy hanya menyalin `index.html`, `assets/`, dan
`content/` ke GitHub Pages. Tidak ada build step dan tidak ada secret.

## 1. Aktifkan Pages

**Settings → Pages → Build and deployment → Source: GitHub Actions**

Jangan pilih “Deploy from a branch”; workflow ini mengunggah artifact sendiri.

## 2. Deploy pertama

Workflow `.github/workflows/deploy.yml` berjalan ketika:

- ada push ke `main`, atau
- kamu menjalankan manual: **Actions → Deploy to GitHub Pages → Run workflow**.

Setelah selesai, URL ada di environment `github-pages` dan di halaman
deployment:

```text
https://andaru0495.github.io/Project_belajar_CySec/
```

## 3. Setelah merge PR

Auto-merge memakai `GITHUB_TOKEN`. Merge yang dilakukan token tersebut kadang
tidak memicu workflow `push`, jadi deploy bisa tidak berjalan otomatis.

Jika deploy tidak muncul:

1. Buka **Actions → Deploy to GitHub Pages**.
2. Klik **Run workflow** → branch `main`.
3. Tunggu job `deploy` selesai.

## 4. Verifikasi

- Buka URL di jendela incognito.
- Cek `#/`, `#/roadmap`, `#/modules`, `#/module/fondasi`, `#/progress`.
- DevTools → Network: tidak boleh ada aset 404.
- Semua path relatif, jadi situs bekerja di subpath `/<repo>/`.
- Refresh halaman modul: hash route tetap bekerja.

## 5. Rollback

Karena deploy berasal dari commit `main`, rollback dilakukan dengan:

```bash
git revert <commit>
git push origin main
```

Lalu jalankan **Run workflow** jika deploy tidak terpicu otomatis.

## Troubleshooting

| Gejala | Penyebab | Solusi |
| --- | --- | --- |
| 404 di root URL | Pages belum aktif / source salah | Set Source ke GitHub Actions |
| Aset 404 | Path absolut | Gunakan path relatif (`assets/...`, bukan `/assets/...`) |
| Deploy tidak jalan setelah merge | Merge oleh `GITHUB_TOKEN` | Jalankan workflow manual |
| Halaman lama muncul | Cache browser/service worker | Hard refresh; nanti PWA akan punya versi cache |
| Workflow gagal di `configure-pages` | Pages belum diaktifkan | Aktifkan Pages lalu ulangi |

## Catatan keamanan

- Tidak ada secret yang dibutuhkan.
- Workflow hanya punya izin `contents: read`, `pages: write`, `id-token: write`.
- Artifact hanya berisi file situs, bukan `.git` atau dokumen internal.
