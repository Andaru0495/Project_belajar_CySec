# Assignments — Milestone Networking

Dokumen ini adalah papan kerja untuk milestone berikutnya. Aturannya sama dengan
[AGENT_OPERATING_MODEL.md](./AGENT_OPERATING_MODEL.md): satu task satu owner,
reviewer eksplisit, dependency jelas, dan handoff wajib.

## Urutan kerja

| Step | Task | Owner | Reviewer | Branch | Base | PR | Ukuran |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **T-026** — perluas terminal dengan perintah jaringan | `frontend` | `security`, `qa` | `feat/terminal-net` | `main` | #17 | ~300 baris |
| 2 | **T-012** — aktifkan modul jaringan/protokol/netsec | `content` | `data-platform`, `security`, `qa` | `content/network` | `feat/terminal-net` | #18 | ~400 baris data |

**Jangan mulai T-012 sebelum T-026 lulus test.** Modul jaringan memakai perintah
yang belum didukung terminal; kalau status modul diubah ke `ready` lebih dulu,
misi terminal akan gagal.

## T-026 — Frontend

**Tujuan:** menambah perintah jaringan ke shell simulasi.

**File yang boleh disentuh:**
- `assets/js/terminal.js`
- `scripts/test-terminal.mjs`

**Deliverables:**
- `ping`, `traceroute`, `ip route`, `ss`, `dig`, `nslookup`, `curl`, `nmap`,
  `ufw status`, `iptables -L`
- output simulasi target `10.10.10.5`, `192.168.1.1`, `127.0.0.1`, `example.com`
- test untuk perintah dan output

**Verifikasi:**
```bash
node --check assets/js/terminal.js
node scripts/test-terminal.mjs
node scripts/agents.mjs check
node scripts/validate.mjs
```

**Handoff ke content:** daftar perintah yang didukung, contoh output, dan test
yang lulus.

## T-012 — Content

**Tujuan:** mengaktifkan tiga modul jaringan.

**File yang boleh disentuh:**
- `content/modules/02-jaringan.js`
- `content/module-index.js`

**Deliverables:**
- modul `jaringan`, `protokol`, `netsec`
- status ketiganya `ready`
- quiz, istilah, misi terminal, lab, safety note

**Verifikasi:**
```bash
node scripts/validate.mjs
node scripts/test-terminal.mjs
node scripts/agents.mjs check
```

**Handoff ke QA/security:** minimal satu misi per modul dijalankan; safety note
lab dicek.

## Review gate

| Task | Gate | Yang dicek |
| --- | --- | --- |
| T-026 | Kuning | Tidak ada network nyata; output tidak menyesatkan; test lulus |
| T-012 | Kuning | Tidak ada target nyata; misi cocok dengan perintah; validasi lulus |

## Aturan eksekusi

1. Owner membaca `node scripts/agents.mjs task <ID>` dan role charter.
2. Hanya file di task yang boleh diubah.
3. Satu PR satu task; jangan campur T-026 dan T-012.
4. Review minimal dari reviewer yang tercantum.
5. Setelah T-026 merge, T-012 boleh retarget base ke `main`.
6. Jangan lupa update status task di registry saat mulai/selesai.
