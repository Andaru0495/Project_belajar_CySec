/* ==========================================================================
   LabSiber — module index
   Metadata ringan untuk katalog, lazy loading, dan progres.
   Status:
   - planned: metadata ada, file modul belum di-commit
   - ready:   file modul sudah ada dan lolos validator
   ========================================================================== */

window.CYBER_MODULE_INDEX = {
  modules: [
    {
      id: 'fondasi',
      file: 'content/modules/01-fondasi.js',
      order: 1,
      title: 'Fondasi Keamanan & Cara Berpikir',
      track: 'Fondasi',
      level: 'Pemula',
      duration: 45,
      summary: 'Sebelum menyentuh tool, pahami dulu apa yang dilindungi: kerahasiaan, integritas, ketersediaan—dan bagaimana keputusan diambil berdasarkan risiko, bukan rasa takut.',
      status: 'ready'
    },
    {
      id: 'hardware',
      file: 'content/modules/01-fondasi.js',
      order: 2,
      title: 'Hardware & Konektivitas',
      track: 'Fundamental IT',
      level: 'Pemula',
      duration: 35,
      summary: 'Mengenal komponen komputer dan cara perangkat terhubung, lalu memakai pengetahuan itu untuk troubleshooting dan memperkecil attack surface fisik.',
      status: 'ready'
    },
    {
      id: 'jaringan',
      file: 'content/modules/02-jaringan.js',
      order: 3,
      title: 'Jaringan & Model OSI',
      track: 'Jaringan',
      level: 'Pemula',
      duration: 50,
      summary: 'Semua serangan melewati jaringan. Pahami bagaimana paket bergerak, bagaimana alamat bekerja, dan bagaimana membaca jaringanmu sendiri.',
      status: 'planned'
    },
    {
      id: 'protokol',
      file: 'content/modules/02-jaringan.js',
      order: 4,
      title: 'Protokol, Port & Analisis Paket',
      track: 'Jaringan',
      level: 'Pemula',
      duration: 55,
      summary: 'Membaca bahasa jaringan: port, TCP/UDP, DNS, DHCP, ARP, NAT, dan cara menangkap paket untuk membuktikan apa yang sebenarnya terjadi.',
      status: 'planned'
    },
    {
      id: 'linux',
      file: 'content/modules/03-os.js',
      order: 5,
      title: 'Linux untuk Keamanan',
      track: 'Sistem Operasi',
      level: 'Pemula',
      duration: 60,
      summary: 'Linux adalah rumah bagi sebagian besar server dan tool keamanan. Kuasai filesystem, permission, proses, log, dan dasar privilege escalation dari sisi defender.',
      status: 'planned'
    },
    {
      id: 'windows-macos',
      file: 'content/modules/03-os.js',
      order: 6,
      title: 'Windows & macOS',
      track: 'Sistem Operasi',
      level: 'Pemula',
      duration: 45,
      summary: 'Memahami model keamanan Windows dan macOS: akun, permission, log, PowerShell, Active Directory, Gatekeeper, dan hardening lintas platform.',
      status: 'planned'
    },
    {
      id: 'virtualisasi',
      file: 'content/modules/03-os.js',
      order: 7,
      title: 'Virtualisasi & Lab Aman',
      track: 'Sistem Operasi',
      level: 'Pemula',
      duration: 40,
      summary: 'Membangun lab yang aman: hypervisor, VM, snapshot, jaringan terisolasi, dan aturan main sebelum menjalankan target rentan atau malware.',
      status: 'planned'
    },
    {
      id: 'kriptografi',
      file: 'content/modules/04-kripto-identitas.js',
      order: 8,
      title: 'Kriptografi untuk Praktisi',
      track: 'Keamanan',
      level: 'Menengah',
      duration: 55,
      summary: 'Bukan matematika mendalam, tetapi cara memakai kriptografi dengan benar: enkripsi, hash, salt, key exchange, sertifikat, dan kesalahan yang sering terjadi.',
      status: 'planned'
    },
    {
      id: 'identitas',
      file: 'content/modules/04-kripto-identitas.js',
      order: 9,
      title: 'Autentikasi, Otorisasi & Identitas',
      track: 'Keamanan',
      level: 'Menengah',
      duration: 50,
      summary: 'Membangun dan menguji identitas: faktor autentikasi, password, sesi/token, SSO, Kerberos, LDAP, hingga zero trust dan least privilege.',
      status: 'planned'
    },
    {
      id: 'netsec',
      file: 'content/modules/02-jaringan.js',
      order: 10,
      title: 'Keamanan Jaringan & Hardening',
      track: 'Keamanan',
      level: 'Menengah',
      duration: 50,
      summary: 'Memasang kontrol di jalur serangan: firewall, IDS/IPS, segmentasi, VPN, keamanan Wi-Fi, dan checklist hardening yang bisa langsung dipakai.',
      status: 'planned'
    },
    {
      id: 'websec',
      file: 'content/modules/05-serangan.js',
      order: 11,
      title: 'Keamanan Web & OWASP Top 10',
      track: 'Keamanan',
      level: 'Menengah',
      duration: 60,
      summary: 'Memahami cara aplikasi web dibobol dan diperbaiki: HTTP, akses kontrol, injection, XSS, CSRF, traversal, SSRF, serta kebiasaan pengujian yang aman.',
      status: 'planned'
    },
    {
      id: 'serangan',
      file: 'content/modules/05-serangan.js',
      order: 12,
      title: 'Serangan Umum & Social Engineering',
      track: 'Keamanan',
      level: 'Menengah',
      duration: 55,
      summary: 'Peta serangan dari recon sampai dampak: malware, phishing, DoS, MITM, serangan password, privilege escalation, dan cara mendeteksinya.',
      status: 'planned'
    },
    {
      id: 'blueteam',
      file: 'content/modules/06-blue-team.js',
      order: 13,
      title: 'Blue Team: Log, SIEM & Incident Response',
      track: 'Defense',
      level: 'Menengah',
      duration: 60,
      summary: 'Mendeteksi dan merespons: sumber log, korelasi di SIEM, playbook IR, forensik dasar, threat hunting, dan metrik yang bermakna.',
      status: 'planned'
    },
    {
      id: 'recon',
      file: 'content/modules/06-blue-team.js',
      order: 14,
      title: 'Recon, Threat Intel & Pentest',
      track: 'Offensive',
      level: 'Menengah',
      duration: 55,
      summary: 'Mengumpulkan informasi secara etis, menilai kerentanan, dan menjalankan pentest dengan scope, bukti, serta laporan yang bisa ditindaklanjuti.',
      status: 'planned'
    },
    {
      id: 'cloud',
      file: 'content/modules/07-cloud-prog-karier.js',
      order: 15,
      title: 'Keamanan Cloud',
      track: 'Cloud',
      level: 'Menengah',
      duration: 50,
      summary: 'Memahami shared responsibility, IAM, storage, jaringan, logging, IaC, dan serverless—lalu mengenali miskonfigurasi cloud yang paling sering dieksploitasi.',
      status: 'planned'
    },
    {
      id: 'programming',
      file: 'content/modules/07-cloud-prog-karier.js',
      order: 16,
      title: 'Programming untuk Keamanan',
      track: 'Programming',
      level: 'Menengah',
      duration: 55,
      summary: 'Menulis tool kecil, mengotomatiskan analisis, dan memahami bug kelas umum—dengan Python, Bash, JavaScript, Go, C++, dan PowerShell.',
      status: 'planned'
    },
    {
      id: 'karier',
      file: 'content/modules/07-cloud-prog-karier.js',
      order: 17,
      title: 'Karier, Sertifikasi & CTF',
      track: 'Karier',
      level: 'Pemula',
      duration: 40,
      summary: 'Menyusun jalur belajar yang realistis: peran, sertifikasi, platform latihan, portofolio, dan rencana 90 hari.',
      status: 'planned'
    }
  ]
};
