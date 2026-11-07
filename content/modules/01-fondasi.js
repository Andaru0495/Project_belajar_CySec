/* ==========================================================================
   Modul 01 — Fondasi keamanan & hardware
   ========================================================================== */

window.CYBER_MODULES = window.CYBER_MODULES || {};

window.CYBER_MODULES['fondasi'] = {
  id: 'fondasi',
  order: 1,
  title: 'Fondasi Keamanan & Cara Berpikir',
  track: 'Fondasi',
  level: 'Pemula',
  duration: 45,
  summary: 'Sebelum menyentuh tool, pahami dulu apa yang dilindungi: kerahasiaan, integritas, ketersediaan—dan bagaimana keputusan diambil berdasarkan risiko, bukan rasa takut.',
  objectives: [
    'Menjelaskan CIA triad dan memberi contoh nyata di kehidupan sehari-hari.',
    'Membedakan ancaman, kerentanan, risiko, dan dampak.',
    'Memahami peran red, blue, dan purple team dalam organisasi.',
    'Menerapkan prinsip least privilege dan defense in depth.',
    'Mengetahui batas etika dan hukum sebelum melakukan praktik apa pun.'
  ],
  sections: [
    {
      title: 'Keamanan adalah manajemen risiko, bukan daftar tool',
      blocks: [
        'Banyak pemula mulai dari mengunduh Kali Linux lalu menjalankan tool tanpa tahu **kenapa**. Cara itu cepat membuat frustrasi. Keamanan yang baik dimulai dari pertanyaan: *apa yang berharga, siapa yang bisa mengancamnya, dan seberapa besar kerugiannya?*',
        'Setiap keputusan keamanan adalah trade-off. Enkripsi penuh membuat data lebih aman tetapi menambah biaya dan friksi. MFA mengurangi risiko akun diambil alih tetapi menambah langkah login. Tidak ada sistem yang 100% aman; yang kita lakukan adalah menurunkan risiko ke level yang bisa diterima.',
        { note: 'Pola pikir yang dipakai sepanjang roadmap ini: **aset → ancaman → kerentanan → dampak → kontrol**. Selalu mulai dari aset, bukan dari tool.' },
        { list: [
          '**Aset**: laptop, akun email, database pelanggan, reputasi, ketersediaan layanan.',
          '**Ancaman**: penyerang, malware, bencana alam, karyawan yang keliru, insider.',
          '**Kerentanan**: software belum di-patch, password lemah, port terbuka, konfigurasi salah.',
          '**Dampak**: data bocor, layanan mati, kerugian finansial, sanksi hukum, hilang kepercayaan.'
        ] },
        'Di lab ini kamu akan sering melihat istilah **attack surface**. Artinya: total titik yang bisa dicoba penyerang. Semakin banyak service, akun, dan integrasi, semakin besar permukaannya. Hardening pada dasarnya adalah usaha mengecilkan permukaan itu.'
      ]
    },
    {
      title: 'CIA Triad: tiga tujuan yang harus diseimbangkan',
      blocks: [
        'CIA triad adalah fondasi semua kontrol keamanan. Ketiganya sering saling bertentangan, jadi tugas kita adalah menyeimbangkan sesuai konteks.',
        { table: {
          head: ['Pilar', 'Pertanyaan kunci', 'Contoh kontrol', 'Contoh kegagalan'],
          rows: [
            ['**Confidentiality**', 'Siapa yang boleh melihat data ini?', 'Enkripsi, ACL, MFA, klasifikasi data', 'Database pelanggan bocor ke publik'],
            ['**Integrity**', 'Apakah data masih utuh dan berasal dari sumber yang benar?', 'Hash, signature, audit log, backup tervalidasi', 'Nilai transfer diubah tanpa terdeteksi'],
            ['**Availability**', 'Apakah layanan tetap bisa dipakai saat dibutuhkan?', 'Redundansi, backup, DDoS protection, monitoring', 'Server lumpuh karena ransomware atau DDoS']
          ]
        } },
        'Contoh trade-off: membuat backup otomatis setiap jam meningkatkan **availability** dan **integrity**, tetapi menambah biaya penyimpanan dan potensi kebocoran jika backup tidak dienkripsi. Menutup semua port meningkatkan keamanan tetapi bisa mematikan layanan yang dibutuhkan.',
        { tip: 'Saat menganalisis insiden, tanyakan pilar mana yang terdampak. Ini membantu menentukan prioritas respons: kalau data medis bocor, fokusnya confidentiality; kalau rumah sakit tidak bisa melayani, fokusnya availability.' }
      ]
    },
    {
      title: 'Ancaman, kerentanan, dan risiko',
      blocks: [
        'Tiga istilah ini sering tertukar. Bedanya penting karena responsnya berbeda.',
        { list: [
          '**Threat (ancaman)**: pihak atau peristiwa yang berpotensi menimbulkan kerugian. Contoh: penyerang ransomware, karyawan yang melakukan kesalahan, banjir.',
          '**Vulnerability (kerentanan)**: celah atau kelemahan yang bisa dimanfaatkan. Contoh: software belum di-patch, password default, akses terlalu luas.',
          '**Risk (risiko)**: kemungkinan ancaman memanfaatkan kerentanan dikalikan dampaknya. Risiko adalah kombinasi, bukan salah satu komponen saja.'
        ] },
        'Rumus sederhana yang sering dipakai: **Risiko = Kemungkinan × Dampak**. Nilai pastinya tidak harus matematis; yang penting adalah konsistensi saat memprioritaskan.',
        { table: {
          head: ['Skenario', 'Kemungkinan', 'Dampak', 'Prioritas'],
          rows: [
            ['Password email sama dipakai di 10 situs', 'Tinggi', 'Tinggi', 'Segera: ganti + MFA'],
            ['Laptop tanpa enkripsi disk', 'Sedang', 'Tinggi', 'Tinggi: aktifkan BitLocker/FileVault/LUKS'],
            ['Server uji dengan port 8080 terbuka', 'Sedang', 'Rendah', 'Rencanakan: tutup atau batasi'],
            ['Aplikasi internal tanpa patch 3 tahun', 'Tinggi', 'Tinggi', 'Segera: inventarisasi + patch']
          ]
        } },
        { note: '**Risiko residual** adalah risiko yang tersisa setelah kontrol diterapkan. Tidak mungkin nol. Manajemen risiko yang matang menerima risiko residual tertentu secara sadar, bukan mengabaikannya.' }
      ]
    },
    {
      title: 'Defense in depth dan least privilege',
      blocks: [
        '**Defense in depth** berarti tidak bergantung pada satu kontrol. Kalau password bocor, MFA masih menahan. Kalau MFA dilewati, segmentasi jaringan membatasi gerak. Kalau segmentasi gagal, EDR dan log memberi kesempatan mendeteksi.',
        { list: [
          '**Identitas**: MFA, password manager, least privilege, review akses berkala.',
          '**Endpoint**: patch, enkripsi disk, EDR, hardening, larangan software tidak dikenal.',
          '**Jaringan**: firewall, segmentasi/VLAN, IDS/IPS, pembatasan akses keluar.',
          '**Aplikasi**: validasi input, otorisasi di server, dependency scanning, secret management.',
          '**Data**: klasifikasi, enkripsi, backup 3-2-1, retensi, DLP.',
          '**Manusia**: pelatihan phishing, prosedur pelaporan, budaya bertanya.'
        ] },
        '**Least privilege** adalah prinsip memberi akses seminimal mungkin yang cukup untuk pekerjaan. Akun admin hanya untuk tugas admin, bukan untuk browsing harian. Service hanya boleh mengakses resource yang dibutuhkan. Prinsip ini mengurangi dampak ketika satu akun atau satu komponen dikompromikan.',
        { warn: '**Privilege creep** terjadi ketika akses terus ditambah tetapi tidak pernah dicabut. Lakukan review akses berkala, terutama untuk akun admin, service account, dan mantan karyawan.' }
      ]
    },
    {
      title: 'Siapa saja yang terlibat',
      blocks: [
        'Keamanan bukan hanya pekerjaan "orang hacker". Organisasi modern membagi peran agar serangan dan pertahanan saling menguji.',
        { table: {
          head: ['Peran', 'Fokus', 'Output'],
          rows: [
            ['**Red team**', 'Menyerang secara terotorisasi untuk menguji kontrol', 'Temuan, bukti eksploitasi, rekomendasi'],
            ['**Blue team**', 'Deteksi, respons, hardening, monitoring', 'Alert, playbook, perbaikan kontrol'],
            ['**Purple team**', 'Menyatukan red dan blue, menguji deteksi', 'Deteksi yang tervalidasi, umpan balik'],
            ['**SOC analyst**', 'Monitoring dan triage alert harian', 'Tiket insiden, eskalasi'],
            ['**Incident responder**', 'Menangani insiden aktif dan forensik', 'Timeline, containment, laporan'],
            ['**GRC / auditor**', 'Kebijakan, risiko, kepatuhan, audit', 'Kebijakan, bukti kontrol, temuan audit'],
            ['**Pentester**', 'Pengujian terbatas waktu dengan scope jelas', 'Laporan teknis dan manajerial']
          ]
        } },
        'Kamu tidak harus memilih satu jalur sekarang. Roadmap ini sengaja membangun dasar yang dipakai semua peran: jaringan, OS, kriptografi, web, dan cara berpikir risiko.'
      ]
    },
    {
      title: 'Etika, izin, dan batas hukum',
      blocks: [
        { danger: '**Aturan utama: hanya uji sistem yang kamu miliki atau yang kamu punya izin tertulis untuk uji.** Mengakses, memindai, atau mengeksploitasi sistem orang lain tanpa izin adalah tindakan ilegal di hampir semua yurisdiksi, termasuk Indonesia.' },
        'Izin lisan tidak cukup dalam engagement profesional. **Rules of engagement** harus jelas: target, rentang waktu, metode yang diizinkan, data yang tidak boleh disentuh, kontak darurat, dan cara melaporkan temuan.',
        { list: [
          'Gunakan VM/lab lokal atau platform latihan resmi (TryHackMe, HackTheBox, picoCTF, VulnHub).',
          'Jangan memindai IP publik atau domain yang bukan milikmu—bahkan "hanya untuk belajar".',
          'Jangan menyimpan data korban/klien di luar lingkup yang disepakati.',
          'Laporkan kerentanan secara bertanggung jawab; jangan publikasikan detail sebelum diperbaiki.',
          'Hormati privasi: data pribadi bukan bahan latihan.'
        ] },
        'Di sisi pertahanan, etika juga berlaku: jangan memasang pemantauan atau mengumpulkan data karyawan tanpa dasar dan transparansi. Keamanan yang baik tetap menghormati hak individu.'
      ]
    },
    {
      title: 'Kebiasaan belajar yang efektif',
      blocks: [
        'Keamanan adalah skill praktik. Menonton video tanpa mencoba akan terasa nyaman tetapi tidak membangun kemampuan.',
        { olist: [
          '**Buat catatan sendiri** untuk setiap modul: satu halaman berisi konsep, perintah, dan pertanyaan yang belum terjawab.',
          '**Ulangi dengan variasi**: setelah mengikuti contoh, ubah target/port/file dan lihat apa yang berubah.',
          '**Jelaskan dengan bahasa sendiri** seolah mengajar teman. Jika tidak bisa menjelaskan, berarti belum paham.',
          '**Bangun lab kecil**: satu VM Linux, satu VM target rentan, dan snapshot sebelum eksperimen.',
          '**Ikuti alur kill chain**: recon → akses awal → privilege escalation → lateral movement → dampak. Pahami di mana deteksi bisa dipasang.'
        ] },
        { tip: 'Target realistis: 30–60 menit praktik fokus per hari lebih baik daripada 6 jam sekali seminggu. Konsistensi membangun intuisi.' }
      ]
    }
  ],
  terms: [
    { term: 'Aset', def: 'Apa pun yang bernilai bagi organisasi: data, sistem, layanan, reputasi, orang.' },
    { term: 'Threat', def: 'Sumber atau peristiwa yang berpotensi menyebabkan kerugian.' },
    { term: 'Vulnerability', def: 'Kelemahan yang bisa dimanfaatkan ancaman untuk menimbulkan kerugian.' },
    { term: 'Risk', def: 'Kombinasi kemungkinan ancaman memanfaatkan kerentanan dan besarnya dampak.' },
    { term: 'Exploit', def: 'Teknik atau kode yang memanfaatkan kerentanan untuk mencapai efek tertentu.' },
    { term: 'Attack surface', def: 'Total titik masuk yang bisa dicoba penyerang pada sebuah sistem.' },
    { term: 'Least privilege', def: 'Memberi akses seminimal mungkin yang cukup untuk menyelesaikan tugas.' },
    { term: 'Defense in depth', def: 'Strategi berlapis sehingga kegagalan satu kontrol tidak langsung berarti kompromi total.' },
    { term: 'CIA triad', def: 'Confidentiality, Integrity, Availability—tiga tujuan utama keamanan informasi.' },
    { term: 'Rules of engagement', def: 'Dokumen kesepakatan batas dan aturan selama pengujian keamanan.' },
    { term: 'SOC', def: 'Security Operations Center: tim yang memonitor dan merespons alert keamanan.' },
    { term: 'Purple team', def: 'Kolaborasi red dan blue team untuk memvalidasi deteksi dan memperbaiki kontrol.' }
  ],
  quiz: [
    {
      q: 'Sebuah perusahaan kehilangan pendapatan karena server web-nya tidak bisa diakses selama 6 jam. Pilar CIA mana yang paling terdampak?',
      options: ['Confidentiality', 'Integrity', 'Availability', 'Non-repudiation'],
      answer: 2,
      explain: 'Ketersediaan layanan yang terganggu adalah kegagalan Availability. Confidentiality berkaitan dengan kerahasiaan data, Integrity dengan keutuhan data.'
    },
    {
      q: 'Manakah yang paling tepat menggambarkan "kerentanan"?',
      options: ['Penyerang yang menargetkan database', 'Software yang belum di-patch dan memiliki celah', 'Kerugian finansial akibat insiden', 'Kemungkinan insiden terjadi'],
      answer: 1,
      explain: 'Kerentanan adalah kelemahan internal, misalnya software belum di-patch. Penyerang adalah ancaman, kerugian adalah dampak, dan kemungkinan insiden adalah komponen risiko.'
    },
    {
      q: 'Mengapa MFA termasuk defense in depth?',
      options: ['Karena menggantikan firewall', 'Karena menambah lapisan jika password bocor', 'Karena membuat password tidak diperlukan', 'Karena memblokir semua phishing'],
      answer: 1,
      explain: 'MFA bukan pengganti kontrol lain, tetapi lapisan tambahan. Jika password bocor, penyerang masih butuh faktor kedua.'
    },
    {
      q: 'Apa arti least privilege dalam praktik?',
      options: ['Semua user mendapat akses admin agar tidak repot', 'Akun hanya diberi akses yang benar-benar dibutuhkan', 'Menghapus semua akun', 'Menggunakan satu akun bersama untuk semua tim'],
      answer: 1,
      explain: 'Least privilege membatasi akses sesuai kebutuhan tugas. Akun bersama dan akses admin berlebihan memperbesar dampak kompromi.'
    },
    {
      q: 'Kamu menemukan situs dengan halaman login dan ingin mencoba SQL injection. Apa langkah yang benar?',
      options: ['Langsung uji karena hanya satu request', 'Uji hanya jika kamu memiliki atau punya izin tertulis untuk situs itu', 'Uji lalu laporkan tanpa izin', 'Uji dari jaringan publik agar tidak terlacak'],
      answer: 1,
      explain: 'Pengujian tanpa izin adalah tindakan ilegal. Gunakan lab lokal atau platform latihan resmi.'
    },
    {
      q: 'Risiko paling tepat dipahami sebagai...',
      options: ['Daftar tool yang dipakai penyerang', 'Kombinasi kemungkinan dan dampak', 'Jumlah firewall yang dipasang', 'Kepastian bahwa sistem akan diserang'],
      answer: 1,
      explain: 'Risiko menggabungkan kemungkinan ancaman memanfaatkan kerentanan dengan besarnya dampak yang ditimbulkan.'
    }
  ],
  terminal: {
    intro: 'Gunakan terminal simulasi untuk membiasakan diri menjelajah sistem dan membaca file penting. Tidak ada koneksi nyata—semua aman.',
    challenges: [
      { id: 'fondasi-1', task: 'Baca file README di home directory.', hint: 'Gunakan cat diikuti nama file.', pattern: '^cat (\\./)?README\\.md$', solution: 'cat README.md', explain: 'cat mencetak isi file ke layar. README adalah titik awal yang baik untuk memahami sebuah lab.' },
      { id: 'fondasi-2', task: 'Tampilkan isi direktori saat ini beserta permission dan file tersembunyi.', hint: 'ls dengan opsi -l dan -a.', pattern: '^ls -[a-z]*l[a-z]*a[a-z]*$|^ls -[a-z]*a[a-z]*l[a-z]*$|^ls -la$|^ls -al$', solution: 'ls -la', explain: 'ls -la menampilkan detail panjang (permission, owner, ukuran) termasuk file tersembunyi.' },
      { id: 'fondasi-3', task: 'Lihat identitas user yang sedang aktif.', hint: 'Perintah satu kata yang menanyakan "siapa aku".', pattern: '^whoami$', solution: 'whoami', explain: 'whoami menampilkan user efektif. Di terminal ini kamu adalah student; sudo membuat perintah berjalan sebagai root.' },
      { id: 'fondasi-4', task: 'Baca file /etc/passwd untuk melihat daftar akun.', hint: 'Gunakan cat pada path absolut.', pattern: '^cat /etc/passwd$', solution: 'cat /etc/passwd', explain: '/etc/passwd berisi informasi akun, bukan password. Hash password ada di /etc/shadow yang hanya bisa dibaca root.' },
      { id: 'fondasi-5', task: 'Baca /etc/shadow sebagai root untuk melihat mengapa permission itu penting.', hint: 'Awali dengan sudo.', pattern: '^sudo cat /etc/shadow$', solution: 'sudo cat /etc/shadow', explain: '/etc/shadow berisi hash password dan hanya boleh dibaca root. Ini contoh least privilege pada level file.' },
      { id: 'fondasi-6', task: 'Cari semua file .md di /home/student.', hint: 'find <path> -name "*.md".', pattern: '^find /home/student -name "\\*\\.md"$|^find /home/student -name \'\\*\\.md\'$', solution: 'find /home/student -name "*.md"', explain: 'find menelusuri direktori dan memfilter berdasarkan nama, tipe, permission, dan kriteria lain.' }
    ]
  },
  lab: {
    title: 'Lab 1 — Peta risiko pribadi',
    goal: 'Menerapkan konsep aset, ancaman, kerentanan, dan dampak pada kehidupanmu sendiri.',
    safety: 'Lab ini hanya menulis catatan. Jangan menguji akun atau perangkat orang lain.',
    steps: [
      { text: 'Pilih tiga aset pribadi: misalnya laptop, akun email utama, dan folder tugas kuliah.' },
      { text: 'Untuk setiap aset, tuliskan dampak jika Confidentiality, Integrity, atau Availability-nya terganggu.' },
      { text: 'Daftarkan minimal dua ancaman dan dua kerentanan untuk tiap aset.' },
      { text: 'Beri skor kemungkinan (1–5) dan dampak (1–5), lalu kalikan untuk mendapatkan prioritas.' },
      { text: 'Tulis satu kontrol konkret untuk skor tertinggi. Contoh: aktifkan MFA, enkripsi disk, atau backup otomatis.' },
      { text: 'Simpan catatan ini di halaman Progres → catatan, lalu tinjau ulang setelah satu minggu.' }
    ],
    challenge: 'Berapa satu kontrol yang paling murah tetapi paling besar dampaknya untukmu? Lakukan hari ini.'
  },
  resources: [
    { label: 'roadmap.sh — Cyber Security', url: 'https://roadmap.sh/cyber-security' },
    { label: 'NIST Cybersecurity Framework', url: 'https://www.nist.gov/cyberframework' },
    { label: 'CISA — Cybersecurity Resources', url: 'https://www.cisa.gov/cybersecurity' },
    { label: 'OWASP Foundation', url: 'https://owasp.org/' }
  ]
};

window.CYBER_MODULES['hardware'] = {
  id: 'hardware',
  order: 2,
  title: 'Hardware & Konektivitas',
  track: 'Fundamental IT',
  level: 'Pemula',
  duration: 35,
  summary: 'Mengenal komponen komputer dan cara perangkat terhubung, lalu memakai pengetahuan itu untuk troubleshooting dan memperkecil attack surface fisik.',
  objectives: [
    'Mengenali fungsi CPU, RAM, storage, motherboard, PSU, dan NIC.',
    'Menjelaskan alur boot dari tombol daya sampai OS berjalan.',
    'Membandingkan NFC, Bluetooth, Wi-Fi, dan infrared dari sisi fungsi dan risiko.',
    'Melakukan troubleshooting berlapis tanpa menebak-nebak.',
    'Memahami risiko keamanan fisik seperti akses USB dan firmware.'
  ],
  sections: [
    {
      title: 'Komponen inti dan perannya',
      blocks: [
        'Komputer adalah sistem berlapis. Memahami perangkat keras membantu saat troubleshooting dan saat menilai risiko fisik.',
        { table: {
          head: ['Komponen', 'Fungsi', 'Catatan keamanan'],
          rows: [
            ['**CPU**', 'Menjalankan instruksi; punya cache dan mode privileged', 'Kerentanan side-channel seperti Spectre/Meltdown; update microcode'],
            ['**RAM**', 'Menyimpan data dan program yang sedang berjalan', 'Data bisa dibaca dari memori jika attacker punya akses; memory leak bisa berujung DoS'],
            ['**Storage (HDD/SSD/NVMe)**', 'Menyimpan data secara permanen', 'Wajib enkripsi (BitLocker/FileVault/LUKS); hapus data dengan aman saat disposal'],
            ['**Motherboard**', 'Menghubungkan semua komponen; berisi firmware/UEFI', 'Secure Boot, update BIOS, proteksi password firmware'],
            ['**PSU**', 'Menyuplai daya', 'Kualitas buruk menyebabkan instabilitas; bukan vektor software langsung'],
            ['**NIC**', 'Antarmuka jaringan (kabel/Wi-Fi)', 'MAC address bisa dipalsukan; monitor interface yang tidak dikenal'],
            ['**TPM**', 'Chip penyimpan kunci kriptografi', 'Mendukung enkripsi disk dan measured boot; jangan dianggap pengganti password']
          ]
        } },
        'Istilah **firmware** merujuk pada software yang tertanam di perangkat (UEFI, BIOS, firmware SSD, router). Firmware jarang diperbarui pengguna, padahal kerentanan di sana bisa bertahan lama dan sulit dideteksi.'
      ]
    },
    {
      title: 'Alur boot: dari tombol daya sampai login',
      blocks: [
        'Memahami boot memudahkan troubleshooting dan analisis malware yang menyerang tahap awal.',
        { olist: [
          '**Power on** dan POST (Power-On Self-Test): firmware memeriksa CPU, RAM, dan perangkat dasar.',
          '**Firmware/UEFI** memilih boot device dan memverifikasi bootloader jika Secure Boot aktif.',
          '**Bootloader** (GRUB, Windows Boot Manager) memuat kernel dan parameter boot.',
          '**Kernel** menginisialisasi driver, filesystem, dan service awal (init/systemd/launchd).',
          '**User session** menampilkan login manager dan menjalankan aplikasi pengguna.'
        ] },
        { note: '**Secure Boot** memastikan hanya bootloader bertanda tangan yang dijalankan. Ini membantu mencegah bootkit, tetapi bukan jaminan bahwa OS sudah bebas malware.' },
        'Jika mesin gagal boot, isolasi tahapnya: apakah layar menyala (power), apakah POST memberi kode error (hardware), apakah bootloader muncul (storage/boot config), atau apakah kernel panic (driver/filesystem)?'
      ]
    },
    {
      title: 'NFC, Bluetooth, Wi-Fi, dan infrared',
      blocks: [
        'Perangkat terhubung lewat berbagai media. Masing-masing punya karakteristik dan risiko berbeda.',
        { table: {
          head: ['Teknologi', 'Jangkauan', 'Kecepatan', 'Penggunaan umum', 'Risiko utama'],
          rows: [
            ['**NFC**', '±4 cm', 'Rendah (424 kbps)', 'Pembayaran, kartu akses, pairing', 'Skimming, relay attack, tag palsu'],
            ['**Bluetooth**', '±10 m (Class 2)', '1–3 Mbps', 'Headset, keyboard, transfer file', 'Bluejacking, bluesnarfing, keyboard injection'],
            ['**Wi-Fi**', 'Puluhan meter', 'Tinggi', 'Internet, LAN nirkabel', 'Evil twin, deauth, WPA lemah, rogue AP'],
            ['**Infrared**', 'Beberapa meter, line-of-sight', 'Rendah', 'Remote control lama, sensor', 'Spoofing sinyal, gangguan fisik']
          ]
        } },
        'Bluetooth dan Wi-Fi adalah vektor yang sering muncul di assessment. Aktifkan hanya saat dibutuhkan, matikan auto-connect ke jaringan terbuka, dan perbarui firmware perangkat.'
      ]
    },
    {
      title: 'Troubleshooting berlapis yang bisa diulang',
      blocks: [
        'Troubleshooting yang baik adalah proses eliminasi, bukan menebak. Gunakan urutan dari lapisan paling bawah.',
        { list: [
          '**Daya**: apakah ada tanda daya, charger, baterai, tombol?',
          '**Fisik**: kabel, port, panas berlebih, bunyi aneh, LED diagnostik.',
          '**Firmware**: versi BIOS/UEFI, pengaturan boot, Secure Boot, update.',
          '**Storage**: apakah disk terdeteksi? SMART health? filesystem penuh/corrupt?',
          '**OS**: safe mode, log boot, driver, update terakhir.',
          '**Jaringan**: link, IP, DNS, gateway, firewall.',
          '**Aplikasi**: konfigurasi, permission, dependency, log aplikasi.'
        ] },
        'Selalu catat apa yang diubah dan hasilnya. **Satu perubahan pada satu waktu** agar penyebab bisa diisolasi. Ini juga berlaku saat hardening: ubah satu konfigurasi, uji, lalu lanjut.'
      ]
    },
    {
      title: 'Keamanan fisik dan firmware',
      blocks: [
        'Kalau penyerang bisa menyentuh perangkat, banyak kontrol software menjadi tidak relevan.',
        { list: [
          '**USB drop**: jangan colok flash drive tak dikenal; nonaktifkan auto-run.',
          '**Evil maid**: akses fisik singkat bisa memasang bootkit; gunakan Secure Boot, password firmware, dan enkripsi disk.',
          '**DMA attack**: port Thunderbolt/PCIe bisa membaca memori; gunakan IOMMU dan kebijakan perangkat.',
          '**Pencurian laptop**: enkripsi disk + kunci fisik + backup terpisah.',
          '**Disposal**: hapus data dengan aman (crypto erase atau overwrite), jangan hanya format cepat.'
        ] },
        { warn: 'Enkripsi disk hanya melindungi saat perangkat mati. Saat sistem menyala dan sudah di-unlock, malware yang berjalan dengan hak yang cukup bisa membaca data.' }
      ]
    }
  ],
  terms: [
    { term: 'UEFI', def: 'Firmware modern yang menggantikan BIOS, mendukung Secure Boot dan antarmuka grafis.' },
    { term: 'POST', def: 'Power-On Self-Test: pemeriksaan hardware saat komputer dinyalakan.' },
    { term: 'TPM', def: 'Trusted Platform Module: chip untuk menyimpan kunci dan mengukur integritas boot.' },
    { term: 'Secure Boot', def: 'Mekanisme UEFI yang hanya menjalankan bootloader bertanda tangan tepercaya.' },
    { term: 'NIC', def: 'Network Interface Card: perangkat yang menghubungkan komputer ke jaringan.' },
    { term: 'Evil maid', def: 'Serangan fisik singkat saat perangkat ditinggalkan untuk memasang bootkit atau mencuri data.' },
    { term: 'DMA attack', def: 'Memanfaatkan akses memori langsung lewat port seperti Thunderbolt untuk membaca RAM.' },
    { term: 'SMART', def: 'Teknologi monitoring kesehatan disk yang melaporkan error dan prediksi kegagalan.' }
  ],
  quiz: [
    {
      q: 'Komponen mana yang menyimpan kunci untuk enkripsi disk dan membantu measured boot?',
      options: ['CPU', 'RAM', 'TPM', 'PSU'],
      answer: 2,
      explain: 'TPM adalah chip yang menyimpan kunci dan mengukur integritas komponen boot.'
    },
    {
      q: 'Apa fungsi Secure Boot?',
      options: ['Mengenkripsi seluruh disk', 'Memastikan hanya bootloader bertanda tangan yang dijalankan', 'Memblokir semua malware setelah OS berjalan', 'Mempercepat waktu boot'],
      answer: 1,
      explain: 'Secure Boot memverifikasi tanda tangan bootloader. Ia tidak mendeteksi malware yang berjalan setelah OS login.'
    },
    {
      q: 'Teknologi konektivitas mana yang paling tepat untuk pembayaran jarak sangat dekat?',
      options: ['Wi-Fi', 'Bluetooth', 'NFC', 'Infrared'],
      answer: 2,
      explain: 'NFC bekerja pada jarak sangat dekat (beberapa sentimeter), cocok untuk pembayaran dan kartu akses.'
    },
    {
      q: 'Laptop hilang dan disk tidak dienkripsi. Apa dampak paling langsung?',
      options: ['Data pada disk bisa dibaca jika disk dilepas', 'RAM otomatis terhapus', 'Wi-Fi tidak bisa dipakai', 'CPU rusak'],
      answer: 0,
      explain: 'Tanpa enkripsi, penyerang bisa melepas disk dan membacanya di mesin lain. Enkripsi disk melindungi data saat perangkat tidak menyala.'
    },
    {
      q: 'Urutan troubleshooting yang paling masuk akal adalah...',
      options: ['Langsung instal ulang OS', 'Cek daya → firmware → storage → OS → aplikasi', 'Ganti semua hardware', 'Cek aplikasi → lalu daya'],
      answer: 1,
      explain: 'Mulai dari lapisan paling dasar dan naik secara sistematis. Ini menghemat waktu dan menghindari perubahan yang tidak perlu.'
    }
  ],
  terminal: {
    intro: 'Gunakan perintah sistem untuk menginspeksi hardware virtual di lab ini. Output-nya simulasi, tetapi formatnya mirip Linux asli.',
    challenges: [
      { id: 'hardware-1', task: 'Tampilkan informasi CPU dan arsitektur.', hint: 'Perintah lscpu.', pattern: '^lscpu$', solution: 'lscpu', explain: 'lscpu menampilkan arsitektur, jumlah core, thread, dan informasi virtualisasi.' },
      { id: 'hardware-2', task: 'Tampilkan penggunaan RAM dalam format mudah dibaca.', hint: 'free dengan opsi -h.', pattern: '^free -h$', solution: 'free -h', explain: 'free -h menampilkan total, used, free, dan cache dalam satuan human-readable.' },
      { id: 'hardware-3', task: 'Tampilkan penggunaan disk.', hint: 'df dengan opsi -h.', pattern: '^df -h$', solution: 'df -h', explain: 'df -h menunjukkan kapasitas dan pemakaian tiap filesystem. Disk penuh sering menjadi penyebab layanan mati.' },
      { id: 'hardware-4', task: 'Tampilkan detail kernel dan arsitektur mesin.', hint: 'uname dengan opsi -a.', pattern: '^uname -a$', solution: 'uname -a', explain: 'uname -a menampilkan kernel, hostname, versi, dan arsitektur.' },
      { id: 'hardware-5', task: 'Tampilkan antarmuka jaringan dan alamat IP-nya.', hint: 'ip dengan argumen a.', pattern: '^ip (a|addr|address)$', solution: 'ip a', explain: 'ip a menampilkan interface, state, MAC address, dan alamat IP.' }
    ]
  },
  lab: {
    title: 'Lab 2 — Inventaris mesin sendiri',
    goal: 'Membaca spesifikasi dan konfigurasi keamanan dasar mesin yang kamu pakai.',
    safety: 'Hanya periksa mesin sendiri. Jangan mengubah konfigurasi firmware tanpa memahami risikonya.',
    steps: [
      { text: 'Linux: jalankan `lscpu`, `free -h`, `lsblk`, `df -h`, dan `ip a`. macOS: `system_profiler SPHardwareDataType`. Windows: `systeminfo` dan `Get-PhysicalDisk`.', code: 'lscpu\nfree -h\nlsblk\ndf -h\nip a' },
      { text: 'Catat CPU, RAM, tipe disk, dan filesystem yang dipakai.' },
      { text: 'Periksa status enkripsi disk: `lsblk` (cari crypt), BitLocker di Windows, atau FileVault di macOS.' },
      { text: 'Periksa apakah Secure Boot aktif: `mokutil --sb-state` di Linux, `Confirm-SecureBootUEFI` di PowerShell.' },
      { text: 'Periksa update firmware/BIOS yang tersedia dari vendor, tetapi jangan lakukan update saat daya tidak stabil.' },
      { text: 'Tulis satu peningkatan keamanan fisik yang bisa kamu lakukan minggu ini (misalnya privacy screen, kunci laptop, atau enkripsi disk).' }
    ],
    challenge: 'Apakah disk mesinmu sudah terenkripsi? Jika belum, jadwalkan untuk mengaktifkannya setelah backup.'
  },
  resources: [
    { label: 'Arch Wiki — Hardware detection', url: 'https://wiki.archlinux.org/title/Hardware_detection' },
    { label: 'Microsoft Learn — Hardware security', url: 'https://learn.microsoft.com/en-us/windows/security/hardware-security/' },
    { label: 'NIST — BIOS/UEFI security', url: 'https://csrc.nist.gov/projects/bios-integrity' }
  ]
};
