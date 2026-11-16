/* ==========================================================================
   Modul 02 — Jaringan, protokol, dan keamanan jaringan
   ========================================================================== */

window.CYBER_MODULES = window.CYBER_MODULES || {};

window.CYBER_MODULES['jaringan'] = {
  id: 'jaringan',
  order: 3,
  title: 'Jaringan & Model OSI',
  track: 'Jaringan',
  level: 'Pemula',
  duration: 50,
  summary: 'Semua serangan melewati jaringan. Pahami bagaimana paket bergerak, bagaimana alamat bekerja, dan bagaimana membaca jaringanmu sendiri.',
  objectives: [
    'Menjelaskan tujuh lapisan OSI dan padanannya di model TCP/IP.',
    'Membedakan topologi dan perangkat jaringan serta dampak keamanannya.',
    'Menghitung network, broadcast, dan rentang host dari notasi CIDR.',
    'Membedakan public/private IP, loopback, gateway, dan DNS.',
    'Menggunakan perintah dasar untuk memeriksa konektivitas dan routing.'
  ],
  sections: [
    {
      title: 'Jaringan adalah jalur serangan sekaligus jalur pertahanan',
      blocks: [
        'Setiap kali kamu membuka situs, mengirim email, atau login ke server, data berjalan sebagai **paket** melewati beberapa perangkat. Penyerang memanfaatkan jalur yang sama: memindai port, memalsukan alamat, menyadap lalu lintas, atau mengarahkan koneksi ke server palsu.',
        'Karena itu, memahami jaringan bukan sekadar hafal port. Kamu perlu tahu **siapa berbicara dengan siapa, lewat jalur mana, dan pada lapisan apa kontrol dipasang**. Firewall bekerja di lapisan 3/4, WAF di lapisan 7, switch di lapisan 2, dan kabel di lapisan 1.',
        { note: 'Saat menganalisis insiden, gambar dulu topologinya: host mana, jaringan mana, perangkat apa di antaranya, dan jalur keluar ke internet. Setengah pekerjaan investigasi adalah memetakan jalur.' }
      ]
    },
    {
      title: 'Model OSI: tujuh lapisan',
      blocks: [
        'Model OSI memecah komunikasi menjadi tujuh lapisan. Ini alat berpikir, bukan hukum fisika—implementasi nyata memakai model TCP/IP yang lebih sederhana.',
        { table: {
          head: ['#', 'Lapisan', 'Fungsi', 'Contoh', 'Contoh serangan/kontrol'],
          rows: [
            ['7', 'Application', 'Antarmuka aplikasi dan protokol pengguna', 'HTTP, DNS, SMTP, SSH', 'SQLi, XSS, phishing; WAF, filtering'],
            ['6', 'Presentation', 'Format, enkripsi, kompresi', 'TLS, JPEG, UTF-8', 'Downgrade TLS; validasi sertifikat'],
            ['5', 'Session', 'Membuka/menutup sesi', 'SMB session, RPC', 'Session hijacking; timeout, token binding'],
            ['4', 'Transport', 'Pengiriman end-to-end, port', 'TCP, UDP', 'Port scanning, SYN flood; firewall stateful'],
            ['3', 'Network', 'Pengalamatan dan routing', 'IP, ICMP, IPsec', 'Spoofing, ICMP flood; ACL, routing aman'],
            ['2', 'Data Link', 'Frame, MAC address, switch', 'Ethernet, Wi-Fi 802.11, ARP', 'ARP spoofing, VLAN hopping; port security'],
            ['1', 'Physical', 'Sinyal, kabel, radio', 'Kabel UTP, fiber, frekuensi Wi-Fi', 'Cable tap, jamming; kontrol fisik']
          ]
        } },
        'Cara mengingat dari bawah ke atas: **Please Do Not Throw Sausage Pizza Away** (Physical, Data Link, Network, Transport, Session, Presentation, Application).'
      ]
    },
    {
      title: 'Enkapsulasi: bagaimana data dibungkus',
      blocks: [
        'Saat aplikasi mengirim data, tiap lapisan menambahkan header (dan terkadang trailer). Proses ini disebut **enkapsulasi**. Di sisi penerima, header dilepas lapisan demi lapisan.',
        { olist: [
          'Aplikasi membuat data (misalnya request HTTP).',
          'Transport menambahkan header TCP/UDP berisi port sumber dan tujuan → **segment/datagram**.',
          'Network menambahkan header IP berisi alamat sumber dan tujuan → **packet**.',
          'Data Link menambahkan header Ethernet berisi MAC sumber/tujuan dan FCS → **frame**.',
          'Physical mengubah frame menjadi sinyal listrik, cahaya, atau gelombang radio.'
        ] },
        { note: 'Istilah PDU membantu saat membaca capture: **frame** (L2), **packet** (L3), **segment** (TCP/L4), **datagram** (UDP/L4), **data** (L5–7).' }
      ]
    },
    {
      title: 'Topologi dan perangkat',
      blocks: [
        'Topologi menentukan jalur data dan titik kegagalan. Di jaringan modern, topologi fisik sering star/hierarkis, tetapi logikanya bisa mesh.',
        { table: {
          head: ['Topologi', 'Kelebihan', 'Kekurangan'],
          rows: [
            ['**Star**', 'Mudah dikelola; satu kabel putus tidak mematikan semua', 'Switch pusat menjadi titik kegagalan tunggal'],
            ['**Ring**', 'Data mengalir teratur; deteksi kegagalan tertentu mudah', 'Satu gangguan bisa memengaruhi seluruh ring'],
            ['**Mesh**', 'Redundansi tinggi; jalur alternatif banyak', 'Biaya dan kompleksitas kabel/konfigurasi tinggi'],
            ['**Bus**', 'Murah dan sederhana', 'Tabrakan data; satu kabel putus mematikan segmen']
          ]
        } },
        { table: {
          head: ['Perangkat', 'Lapisan', 'Fungsi', 'Catatan keamanan'],
          rows: [
            ['**Hub**', 'L1', 'Mengulang sinyal ke semua port', 'Semua host melihat traffic; sudah usang'],
            ['**Switch**', 'L2', 'Meneruskan frame berdasarkan MAC', 'Port security, VLAN, MAC spoofing'],
            ['**Router**', 'L3', 'Meneruskan packet antarjaringan', 'ACL, NAT, routing protocol security'],
            ['**Access point**', 'L2', 'Menghubungkan klien Wi-Fi ke LAN', 'WPA3, 802.1X, rogue AP detection'],
            ['**Firewall**', 'L3–7', 'Menyaring lalu lintas berdasarkan aturan', 'Default deny, stateful inspection, NGFW'],
            ['**Load balancer**', 'L4–7', 'Membagi traffic ke beberapa server', 'TLS termination, header handling, WAF']
          ]
        } }
      ]
    },
    {
      title: 'Alamat IP, CIDR, dan subnetting',
      blocks: [
        'Alamat IPv4 adalah 32 bit, ditulis empat oktet (contoh `192.168.1.10`). Setiap alamat punya bagian **network** dan **host**, ditentukan oleh subnet mask atau notasi CIDR.',
        { table: {
          head: ['Rentang private (RFC 1918)', 'CIDR', 'Jumlah alamat', 'Catatan'],
          rows: [
            ['10.0.0.0 – 10.255.255.255', '10.0.0.0/8', '16.777.216', 'Sering untuk jaringan enterprise/VPN'],
            ['172.16.0.0 – 172.31.255.255', '172.16.0.0/12', '1.048.576', 'Sering untuk Docker/cloud internal'],
            ['192.168.0.0 – 192.168.255.255', '192.168.0.0/16', '65.536', 'Umum di rumah/kantor kecil'],
            ['127.0.0.0 – 127.255.255.255', '127.0.0.0/8', '16.777.216', 'Loopback; 127.0.0.1 = localhost']
          ]
        } },
        'Notasi `/24` berarti 24 bit pertama adalah network, 8 bit terakhir untuk host. Untuk `192.168.1.0/24`: network `192.168.1.0`, broadcast `192.168.1.255`, host yang bisa dipakai `192.168.1.1–192.168.1.254` (254 host).',
        'Untuk `/26` (26 bit network, 6 bit host): 2^6 = 64 alamat per subnet. Contoh `192.168.1.0/26`: network `.0`, host `.1–.62`, broadcast `.63`; subnet berikutnya mulai `.64`.',
        { table: {
          head: ['CIDR', 'Subnet mask', 'Alamat', 'Host usable'],
          rows: [
            ['/24', '255.255.255.0', '256', '254'],
            ['/25', '255.255.255.128', '128', '126'],
            ['/26', '255.255.255.192', '64', '62'],
            ['/27', '255.255.255.224', '32', '30'],
            ['/28', '255.255.255.240', '16', '14'],
            ['/30', '255.255.255.252', '4', '2 (umum untuk point-to-point)']
          ]
        } },
        '**Default gateway** adalah alamat router yang menjadi pintu keluar saat tujuan berada di luar subnet lokal. **DNS** menerjemahkan nama domain ke IP. **Loopback** (`127.0.0.1` / `::1`) menunjuk ke mesin itu sendiri dan tidak keluar dari host.',
        { warn: 'Jangan pernah memindai rentang IP publik yang bukan milikmu. Untuk latihan, gunakan `127.0.0.1`, lab VM lokal, atau target yang secara eksplisit mengizinkan scanning seperti `scanme.nmap.org` dengan batasan.' }
      ]
    },
    {
      title: 'LAN, WAN, MAN, dan WLAN',
      blocks: [
        { list: [
          '**LAN** (Local Area Network): satu gedung/kantor/rumah; latency rendah, biasanya satu admin.',
          '**WLAN**: LAN nirkabel; memperluas akses tetapi menambah risiko radio (evil twin, deauth).',
          '**MAN** (Metropolitan Area Network): menghubungkan beberapa lokasi dalam satu kota; sering dikelola ISP.',
          '**WAN** (Wide Area Network): antar kota/negara; internet adalah WAN terbesar. Latency dan kepercayaan antarjaringan menjadi isu utama.'
        ] },
        'Pembagian ini membantu menentukan **trust boundary**: LAN internal biasanya lebih dipercaya daripada WLAN publik atau internet. Namun zero trust mengingatkan bahwa "internal" bukan berarti otomatis aman.'
      ]
    },
    {
      title: 'Memeriksa jaringan sendiri',
      blocks: [
        'Biasakan memakai perintah untuk menjawab pertanyaan spesifik, bukan menghafal output.',
        { code: { lang: 'bash', label: 'perintah diagnosa', code: '# alamat dan interface\nip a\n\n# tabel routing dan gateway\nip route\n\n# uji reachability\nping -c 4 8.8.8.8\n\n# jalur ke tujuan\ntraceroute example.com\n\n# port yang mendengarkan\nss -tulpn\n\n# resolusi DNS\ndig example.com\nnslookup example.com' } },
        { table: {
          head: ['Gejala', 'Yang dicek dulu'],
          rows: [
            ['Tidak bisa buka situs', '`ip a` (IP?), `ip route` (gateway?), `ping 8.8.8.8` (internet?), `dig` (DNS?)'],
            ['Situs lain bisa, satu domain tidak', 'DNS, sertifikat, firewall, proxy'],
            ['Koneksi lambat', 'Routing, packet loss, interface error, MTU'],
            ['Service tidak bisa diakses', '`ss -tulpn` (listening?), firewall, bind address'],
            ['IP bentrok', 'ARP, DHCP lease, MAC address']
          ]
        } }
      ]
    }
  ],
  terms: [
    { term: 'Paket', def: 'Unit data pada lapisan network yang berisi header IP dan payload.' },
    { term: 'Frame', def: 'Unit data lapisan data link yang membungkus packet dengan header MAC dan FCS.' },
    { term: 'CIDR', def: 'Notasi prefix seperti /24 untuk menyatakan jumlah bit network pada alamat IP.' },
    { term: 'Subnet mask', def: 'Pola bit yang memisahkan bagian network dan host pada alamat IP.' },
    { term: 'Default gateway', def: 'Router yang menjadi tujuan paket ketika host tidak berada di subnet yang sama.' },
    { term: 'Loopback', def: 'Alamat 127.0.0.1/::1 yang menunjuk ke mesin itu sendiri.' },
    { term: 'Broadcast', def: 'Alamat khusus untuk mengirim data ke semua host dalam satu subnet.' },
    { term: 'Topologi', def: 'Susunan fisik atau logis hubungan antarperangkat dalam jaringan.' },
    { term: 'VLAN', def: 'Segmentasi logis pada switch untuk memisahkan jaringan tanpa perangkat fisik terpisah.' },
    { term: 'DMZ', def: 'Zona jaringan terpisah untuk layanan publik agar kompromi tidak langsung masuk ke jaringan internal.' }
  ],
  quiz: [
    {
      q: 'Pada model OSI, pada lapisan mana router bekerja secara utama?',
      options: ['Lapisan 1 (Physical)', 'Lapisan 2 (Data Link)', 'Lapisan 3 (Network)', 'Lapisan 7 (Application)'],
      answer: 2,
      explain: 'Router meneruskan packet berdasarkan alamat IP, yaitu lapisan 3. Switch bekerja di lapisan 2 berdasarkan MAC.'
    },
    {
      q: 'Berapa jumlah host yang dapat dipakai pada subnet 192.168.10.0/26?',
      options: ['64', '62', '32', '30'],
      answer: 1,
      explain: '/26 menyisakan 6 bit host: 2^6 = 64 alamat. Dua alamat dipakai untuk network dan broadcast, sehingga 62 host usable.'
    },
    {
      q: 'Alamat 169.254.10.5 biasanya menandakan apa?',
      options: ['IP publik', 'Loopback', 'Link-local/APIPA karena DHCP gagal', 'Broadcast'],
      answer: 2,
      explain: 'Rentang 169.254.0.0/16 adalah link-local (APIPA). Muncul ketika host tidak mendapat lease DHCP.'
    },
    {
      q: 'Perangkat mana yang meneruskan frame berdasarkan MAC address?',
      options: ['Router', 'Switch', 'Firewall', 'Modem'],
      answer: 1,
      explain: 'Switch bekerja di lapisan data link dan mempelajari MAC address untuk meneruskan frame ke port yang tepat.'
    },
    {
      q: 'Kamu bisa ping 8.8.8.8 tetapi tidak bisa membuka example.com. Masalah paling mungkin di mana?',
      options: ['Kabel putus', 'DNS', 'Gateway tidak ada', 'IP tidak dikonfigurasi'],
      answer: 1,
      explain: 'Ping ke IP berhasil berarti konektivitas dasar dan routing bekerja. Kegagalan membuka domain biasanya karena resolusi DNS.'
    },
    {
      q: 'Mengapa 127.0.0.1 disebut loopback?',
      options: ['Karena selalu mengarah ke internet', 'Karena menunjuk ke mesin itu sendiri tanpa keluar interface jaringan', 'Karena dipakai untuk broadcast', 'Karena hanya ada di Windows'],
      answer: 1,
      explain: 'Loopback mengarah kembali ke host sendiri dan tidak melewati jaringan fisik. Sering dipakai service lokal untuk pengujian.'
    }
  ],
  terminal: {
    intro: 'Periksa jaringan mesin virtual ini. Output disimulasikan agar kamu bisa berlatih membaca informasi tanpa menyentuh jaringan nyata.',
    challenges: [
      { id: 'jaringan-1', task: 'Tampilkan semua interface jaringan dan alamat IP.', hint: 'ip a', pattern: '^ip (a|addr|address)$', solution: 'ip a', explain: 'Perhatikan interface lo (loopback), eth0, dan docker0, serta alamat CIDR masing-masing.' },
      { id: 'jaringan-2', task: 'Tampilkan tabel routing untuk menemukan default gateway.', hint: 'ip route', pattern: '^ip (route|r)$', solution: 'ip route', explain: 'Baris default via 10.0.2.2 menunjukkan gateway keluar dari subnet lokal.' },
      { id: 'jaringan-3', task: 'Uji konektivitas ke 10.10.10.5 sebanyak 4 paket.', hint: 'ping dengan opsi -c 4.', pattern: '^ping -c 4 10\\.10\\.10\\.5$', solution: 'ping -c 4 10.10.10.5', explain: 'ping memakai ICMP echo. Perhatikan latency dan packet loss; host lokal seharusnya merespons cepat.' },
      { id: 'jaringan-4', task: 'Lihat jalur routing menuju example.com.', hint: 'traceroute example.com', pattern: '^traceroute example\\.com$', solution: 'traceroute example.com', explain: 'traceroute menaikkan TTL bertahap untuk menemukan router di sepanjang jalur.' },
      { id: 'jaringan-5', task: 'Tampilkan port TCP/UDP yang sedang mendengarkan di mesin ini.', hint: 'ss dengan opsi -tulpn.', pattern: '^ss -tulpn$', solution: 'ss -tulpn', explain: 'Port listening adalah attack surface. Di lab ini terlihat 22, 631, 8080, dan 3306.' }
    ]
  },
  lab: {
    title: 'Lab 3 — Peta jaringan yang kamu pakai',
    goal: 'Menggambar jaringan rumah/kos dan mengidentifikasi batas kepercayaan.',
    safety: 'Hanya periksa jaringan yang kamu miliki atau punya izin. Jangan memindai perangkat orang lain di jaringan publik.',
    steps: [
      { text: 'Jalankan `ip a` dan `ip route` (Linux) atau `ipconfig /all` (Windows) untuk mencatat IP dan gateway.' },
      { text: 'Tentukan mana IP privat, mana gateway, dan mana DNS server.' },
      { text: 'Ping gateway, lalu ping 8.8.8.8, lalu `dig example.com`. Catat pada langkah mana koneksi gagal (jika ada).' },
      { text: 'Gambar diagram sederhana: perangkatmu → router → internet. Tandai batas antara jaringan lokal dan internet.' },
      { text: 'Jalankan `ss -tulpn` dan daftarkan service yang mendengarkan di mesinmu. Tanyakan: apakah semuanya perlu?' },
      { text: 'Simpan diagram dan temuan di catatan modul ini.' }
    ],
    challenge: 'Apakah ada service yang mendengarkan di 0.0.0.0 padahal hanya perlu diakses lokal? Jika ya, itu kandidat hardening pertama.'
  },
  resources: [
    { label: 'roadmap.sh — Networking', url: 'https://roadmap.sh/cyber-security' },
    { label: 'Cloudflare Learning — What is the OSI model?', url: 'https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/' },
    { label: 'RFC 1918 — Private Address Space', url: 'https://datatracker.ietf.org/doc/html/rfc1918' },
    { label: 'Cisco — Subnetting basics', url: 'https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html' }
  ]
};

window.CYBER_MODULES['protokol'] = {
  id: 'protokol',
  order: 4,
  title: 'Protokol, Port & Analisis Paket',
  track: 'Jaringan',
  level: 'Pemula',
  duration: 55,
  summary: 'Membaca bahasa jaringan: port, TCP/UDP, DNS, DHCP, ARP, NAT, dan cara menangkap paket untuk membuktikan apa yang sebenarnya terjadi.',
  objectives: [
    'Membedakan TCP dan UDP serta membaca three-way handshake.',
    'Mengenali port dan protokol umum beserta risikonya.',
    'Menjelaskan alur DNS, DHCP, ARP, dan NAT.',
    'Menggunakan filter tcpdump/Wireshark untuk menjawab pertanyaan investigasi.',
    'Memilih protokol aman pengganti protokol yang tidak terenkripsi.'
  ],
  sections: [
    {
      title: 'Port: pintu masuk layanan',
      blocks: [
        'Alamat IP menemukan host; **port** menemukan proses/aplikasi di host itu. Satu server bisa menjalankan web, SSH, dan database sekaligus karena masing-masing mendengarkan di port berbeda.',
        'Port 0–1023 adalah **well-known ports**, 1024–49151 **registered**, dan 49152–65535 **dynamic/ephemeral** untuk koneksi keluar. Penyerang memindai port untuk menemukan layanan yang bisa dieksploitasi; defender menutup port yang tidak perlu.',
        { table: {
          head: ['Port', 'Protokol', 'Fungsi', 'Catatan keamanan'],
          rows: [
            ['20/21', 'FTP', 'Transfer file', 'Tidak terenkripsi; gunakan SFTP/FTPS'],
            ['22', 'SSH', 'Remote shell aman', 'Batasi akses, gunakan key, nonaktifkan password login'],
            ['23', 'Telnet', 'Remote shell teks', 'Tidak terenkripsi; jangan dipakai'],
            ['25', 'SMTP', 'Kirim email', 'Open relay, spoofing; gunakan TLS dan SPF/DKIM/DMARC'],
            ['53', 'DNS', 'Resolusi nama', 'DNS poisoning, amplification; gunakan DNSSEC/DoH/DoT'],
            ['67/68', 'DHCP', 'Pemberian IP otomatis', 'Rogue DHCP; gunakan DHCP snooping'],
            ['80', 'HTTP', 'Web tanpa TLS', 'Sniffing, injection; redirect ke HTTPS'],
            ['110/143', 'POP3/IMAP', 'Ambil email', 'Gunakan 995/993 (TLS)'],
            ['123', 'NTP', 'Sinkronisasi waktu', 'NTP spoofing; batasi sumber waktu'],
            ['161/162', 'SNMP', 'Monitoring perangkat', 'Community string default; gunakan SNMPv3'],
            ['389/636', 'LDAP/LDAPS', 'Direktori', 'Gunakan LDAPS atau StartTLS'],
            ['443', 'HTTPS', 'Web dengan TLS', 'Validasi sertifikat dan konfigurasi cipher'],
            ['445', 'SMB', 'File sharing Windows', 'Ransomware/lateral movement; blokir ke internet'],
            ['1433/3306/5432', 'MSSQL/MySQL/PostgreSQL', 'Database', 'Jangan ekspos ke publik; batasi jaringan'],
            ['3389', 'RDP', 'Remote desktop Windows', 'Brute force; gunakan VPN/MFA, jangan ekspos langsung'],
            ['6379/27017', 'Redis/MongoDB', 'Database NoSQL', 'Sering tanpa auth jika salah konfigurasi']
          ]
        } }
      ]
    },
    {
      title: 'TCP, UDP, dan three-way handshake',
      blocks: [
        '**TCP** menyediakan koneksi andal: data diurutkan, diakui, dan dikirim ulang jika hilang. **UDP** tidak menjamin pengiriman tetapi cepat dan ringan, cocok untuk DNS, VoIP, video, dan game.',
        'Sebelum bertukar data, TCP membangun koneksi dengan **three-way handshake**: client mengirim `SYN`, server membalas `SYN-ACK`, client mengirim `ACK`. Pemutusan koneksi memakai `FIN/ACK`.',
        { code: { lang: 'text', label: 'TCP handshake', code: 'Client                          Server\n  | -------- SYN (seq=x) --------> |\n  | <--- SYN-ACK (seq=y, ack=x+1) -- |\n  | -------- ACK (ack=y+1) -------> |\n  | ===== koneksi terbuka ========= |' } },
        { list: [
          '**SYN scan** (`nmap -sS`): mengirim SYN dan tidak menyelesaikan handshake; sering disebut half-open scan.',
          '**SYN flood**: membanjiri server dengan SYN sehingga tabel koneksi penuh; mitigasi SYN cookies dan rate limiting.',
          '**RST**: mereset koneksi; bisa dipakai untuk memutus atau memindai.',
          '**UDP scan** (`nmap -sU`): lebih lambat dan ambigu karena UDP tidak punya handshake.'
        ] },
        { note: 'Flag TCP yang perlu dikenali: SYN, ACK, FIN, RST, PSH, URG. Kombinasi aneh (misalnya SYN+FIN) bisa menjadi indikasi scanning atau evasion.' }
      ]
    },
    {
      title: 'DNS: dari nama ke alamat',
      blocks: [
        'DNS adalah buku telepon internet. Saat kamu membuka `example.com`, resolver mencari alamat IP-nya melalui hierarki: root → TLD (.com) → authoritative server untuk domain tersebut.',
        { olist: [
          'Aplikasi meminta resolusi ke resolver (biasanya ISP atau 1.1.1.1/8.8.8.8).',
          'Resolver mengecek cache. Jika belum ada, ia bertanya ke root server.',
          'Root mengarahkan ke TLD server (.com).',
          'TLD mengarahkan ke authoritative name server domain.',
          'Authoritative server menjawab record yang diminta; resolver menyimpan di cache sesuai TTL.',
          'Resolver mengembalikan IP ke aplikasi, lalu koneksi TCP/TLS dimulai.'
        ] },
        { table: {
          head: ['Record', 'Fungsi'],
          rows: [
            ['**A**', 'Memetakan nama ke alamat IPv4'],
            ['**AAAA**', 'Memetakan nama ke alamat IPv6'],
            ['**CNAME**', 'Alias ke nama lain'],
            ['**MX**', 'Server email untuk domain'],
            ['**TXT**', 'Teks bebas; dipakai SPF, DKIM, verifikasi domain'],
            ['**NS**', 'Name server authoritative untuk zona'],
            ['**SOA**', 'Informasi otoritas zona dan serial'],
            ['**PTR**', 'Reverse lookup IP ke nama'],
            ['**CAA**', 'Membatasi CA mana yang boleh menerbitkan sertifikat']
          ]
        } },
        { warn: 'DNS poisoning mengarahkan korban ke IP penyerang. DNSSEC menandatangani record, tetapi adopsinya tidak merata. Selalu validasi sertifikat TLS—jangan hanya percaya bahwa nama domain sudah benar.' }
      ]
    },
    {
      title: 'DHCP, ARP, NAT, NTP, dan IPAM',
      blocks: [
        { table: {
          head: ['Protokol', 'Cara kerja singkat', 'Risiko utama'],
          rows: [
            ['**DHCP**', 'DORA: Discover, Offer, Request, Ack; memberi IP, gateway, DNS', 'Rogue DHCP, starvation, spoofing gateway/DNS'],
            ['**ARP**', 'Memetakan IP ke MAC di LAN; broadcast "siapa punya IP ini?"', 'ARP spoofing/poisoning → MITM'],
            ['**NAT**', 'Menerjemahkan IP privat ke IP publik; PAT memakai port', 'Miskonfigurasi bisa mengekspos layanan internal'],
            ['**NTP**', 'Sinkronisasi waktu dengan server waktu', 'Pemalsuan waktu merusak log, sertifikat, dan forensik'],
            ['**IPAM**', 'Mencatat dan mengelola alokasi alamat IP', 'Alamat bentrok, dokumentasi usang, shadow IT']
          ]
        } },
        { note: '**ARP spoofing** adalah alasan mengapa segmentasi dan deteksi penting. Di jaringan lokal, penyerang bisa mengklaim "IP gateway ada di MAC saya" dan menerima lalu lintas korban. Mitigasi: dynamic ARP inspection, port security, dan enkripsi end-to-end.' }
      ]
    },
    {
      title: 'Menangkap dan membaca paket',
      blocks: [
        'Capture paket adalah bukti paling kuat. **tcpdump** untuk CLI, **Wireshark** untuk analisis visual.',
        { code: { lang: 'bash', label: 'tcpdump', code: '# lihat interface yang tersedia\nsudo tcpdump -D\n\n# tangkap 10 paket DNS\nsudo tcpdump -i any -nn port 53 -c 10\n\n# tampilkan isi HTTP (hati-hati: data sensitif)\nsudo tcpdump -i eth0 -nn -A port 80\n\n# simpan ke file untuk Wireshark\nsudo tcpdump -i eth0 -nn -w capture.pcap\n\n# baca kembali\nsudo tcpdump -r capture.pcap -nn' } },
        { table: {
          head: ['Tujuan', 'Filter Wireshark'],
          rows: [
            ['Trafik ke/dari satu host', '`ip.addr == 10.10.10.5`'],
            ['Hanya HTTP ke host itu', '`ip.addr == 10.10.10.5 && tcp.port == 80`'],
            ['Request POST', '`http.request.method == "POST"`'],
            ['Query DNS untuk domain tertentu', '`dns.qry.name contains "example"`'],
            ['SYN tanpa ACK (indikasi scan)', '`tcp.flags.syn == 1 && tcp.flags.ack == 0`'],
            ['Error/reset', '`tcp.flags.reset == 1`'],
            ['Hanya handshake TLS', '`tls.handshake.type == 1`']
          ]
        } },
        { warn: 'Capture bisa berisi password, cookie, dan data pribadi. Simpan hanya jika perlu, enkripsi, dan hapus sesuai kebijakan. Jangan menangkap traffic jaringan yang bukan milikmu.' }
      ]
    },
    {
      title: 'TLS dan protokol aman vs tidak aman',
      blocks: [
        'TLS melindungi kerahasiaan dan integritas data saat transit. TLS 1.3 menyederhanakan handshake menjadi satu round trip dan menghapus cipher usang.',
        { olist: [
          'Client mengirim **ClientHello**: versi TLS, cipher suite yang didukung, dan key share.',
          'Server membalas **ServerHello** plus sertifikat dan key share.',
          'Kedua pihak menyepakati kunci sesi (ephemeral, sehingga forward secrecy).',
          'Data aplikasi dienkripsi dengan kunci simetris yang cepat.'
        ] },
        { table: {
          head: ['Tidak aman', 'Pengganti aman', 'Alasan'],
          rows: [
            ['FTP', 'SFTP / FTPS', 'Kredensial dan file tidak terenkripsi'],
            ['Telnet', 'SSH', 'Teks polos; SSH mengenkripsi dan mendukung key'],
            ['HTTP', 'HTTPS (TLS)', 'Data bisa dibaca/diubah di jalan'],
            ['POP3/IMAP', 'POP3S/IMAPS', 'Email dan password harus terenkripsi'],
            ['LDAP', 'LDAPS / StartTLS', 'Query direktori bisa berisi data sensitif'],
            ['DNS', 'DoH / DoT / DNSSEC', 'Mencegah penyadapan dan pemalsuan'],
            ['SNMPv1/v2c', 'SNMPv3', 'Community string dikirim tanpa enkripsi'],
            ['WEP/WPA', 'WPA2-AES / WPA3', 'WEP dan TKIP sudah rusak']
          ]
        } }
      ]
    },
    {
      title: 'Toolkit troubleshooting',
      blocks: [
        { table: {
          head: ['Perintah', 'Pertanyaan yang dijawab'],
          rows: [
            ['`ip a` / `ipconfig`', 'Apa IP, MAC, dan state interface?'],
            ['`ip route` / `route`', 'Ke mana paket keluar? Apa gateway-nya?'],
            ['`ping`', 'Apakah host merespons ICMP? Berapa latency/loss?'],
            ['`traceroute` / `tracert`', 'Di router mana jalur berhenti?'],
            ['`dig` / `nslookup`', 'Apakah DNS mengembalikan record yang benar?'],
            ['`ss -tulpn` / `netstat`', 'Service apa yang mendengarkan di port mana?'],
            ['`curl -v`', 'Bagaimana HTTP/TLS berperilaku? Header dan sertifikat?'],
            ['`tcpdump` / Wireshark', 'Apa yang sebenarnya lewat di kabel?'],
            ['`nmap`', 'Port dan service apa yang terbuka pada target berizin?']
          ]
        } }
      ]
    }
  ],
  terms: [
    { term: 'TCP', def: 'Protokol transport andal dengan handshake, acknowledgment, dan pengurutan data.' },
    { term: 'UDP', def: 'Protokol transport ringan tanpa jaminan pengiriman; cocok untuk latency rendah.' },
    { term: 'SYN', def: 'Flag TCP untuk memulai koneksi pada three-way handshake.' },
    { term: 'DNS', def: 'Sistem resolusi nama domain menjadi alamat IP.' },
    { term: 'DHCP', def: 'Protokol pemberian alamat IP dan konfigurasi jaringan secara otomatis.' },
    { term: 'ARP', def: 'Protokol pemetaan alamat IP ke MAC address di jaringan lokal.' },
    { term: 'NAT', def: 'Penerjemahan alamat IP privat ke publik agar bisa berkomunikasi ke internet.' },
    { term: 'NTP', def: 'Protokol sinkronisasi waktu antara host dan server waktu.' },
    { term: 'PCAP', def: 'Format file rekaman paket yang bisa dibuka di Wireshark/tcpdump.' },
    { term: 'TLS', def: 'Protokol kriptografi untuk mengamankan komunikasi jaringan, penerus SSL.' },
    { term: 'Forward secrecy', def: 'Sifat kunci sesi yang tidak bisa dihitung ulang meskipun kunci privat jangka panjang bocor.' }
  ],
  quiz: [
    {
      q: 'Urutan three-way handshake TCP yang benar adalah...',
      options: ['SYN → ACK → SYN-ACK', 'SYN → SYN-ACK → ACK', 'ACK → SYN → SYN-ACK', 'SYN-ACK → SYN → ACK'],
      answer: 1,
      explain: 'Client mengirim SYN, server membalas SYN-ACK, lalu client mengirim ACK. Setelah itu koneksi terbuka.'
    },
    {
      q: 'Protokol mana yang tepat untuk transfer file dengan kredensial terenkripsi?',
      options: ['FTP', 'Telnet', 'SFTP', 'TFTP'],
      answer: 2,
      explain: 'SFTP berjalan di atas SSH dan mengenkripsi sesi serta kredensial. FTP dan TFTP tidak terenkripsi.'
    },
    {
      q: 'Record DNS apa yang menunjukkan server email untuk sebuah domain?',
      options: ['A', 'CNAME', 'MX', 'TXT'],
      answer: 2,
      explain: 'MX (Mail Exchange) menentukan server email. TXT sering dipakai untuk SPF/DKIM, A untuk IPv4, CNAME untuk alias.'
    },
    {
      q: 'Apa fungsi utama ARP?',
      options: ['Menerjemahkan nama domain ke IP', 'Memetakan IP ke MAC address', 'Memberi IP otomatis', 'Mengenkripsi lalu lintas'],
      answer: 1,
      explain: 'ARP menemukan MAC address yang memiliki suatu IP di jaringan lokal. Karena itu ARP rentan terhadap spoofing.'
    },
    {
      q: 'Filter Wireshark mana yang menampilkan hanya SYN tanpa ACK?',
      options: ['`tcp.flags == 2`', '`tcp.flags.syn == 1 && tcp.flags.ack == 0`', '`ip.flags.syn == 1`', '`http.request.method == "SYN"`'],
      answer: 1,
      explain: 'Kombinasi itu menampilkan paket SYN murni, yang sering muncul pada port scanning.'
    },
    {
      q: 'Kenapa DNSSEC penting?',
      options: ['Membuat DNS lebih cepat', 'Menandatangani record agar tidak dipalsukan', 'Mengenkripsi seluruh lalu lintas web', 'Menyembunyikan nama domain'],
      answer: 1,
      explain: 'DNSSEC memberi validasi integritas dan autentisitas record DNS, membantu mencegah DNS poisoning. Ia tidak mengenkripsi query.'
    },
    {
      q: 'Port 3389 biasanya dipakai oleh...',
      options: ['SSH', 'RDP', 'SMB', 'MySQL'],
      answer: 1,
      explain: '3389 adalah Remote Desktop Protocol. Jangan mengeksposnya langsung ke internet tanpa kontrol tambahan seperti VPN dan MFA.'
    }
  ],
  terminal: {
    intro: 'Latihan membaca service, DNS, dan respons HTTP. Semua target di sini adalah simulasi lokal.',
    challenges: [
      { id: 'protokol-1', task: 'Tampilkan port TCP/UDP yang mendengarkan.', hint: 'ss -tulpn', pattern: '^ss -tulpn$', solution: 'ss -tulpn', explain: 'Output menunjukkan service, port, dan proses pemiliknya. Ini adalah attack surface lokal.' },
      { id: 'protokol-2', task: 'Query DNS untuk example.com.', hint: 'dig example.com', pattern: '^dig example\\.com$', solution: 'dig example.com', explain: 'Bagian ANSWER SECTION menunjukkan record A dan TTL. Perhatikan juga server DNS yang menjawab.' },
      { id: 'protokol-3', task: 'Gunakan nslookup untuk example.com.', hint: 'nslookup example.com', pattern: '^nslookup example\\.com$', solution: 'nslookup example.com', explain: 'nslookup adalah alternatif sederhana untuk melihat hasil resolusi DNS.' },
      { id: 'protokol-4', task: 'Ambil halaman web lab di http://10.10.10.5.', hint: 'curl http://10.10.10.5', pattern: '^curl http://10\\.10\\.10\\.5/?$', solution: 'curl http://10.10.10.5', explain: 'curl menampilkan header respons dan body. Perhatikan Server header yang membocorkan versi Apache.' },
      { id: 'protokol-5', task: 'Scan service dan versi pada 10.10.10.5.', hint: 'nmap -sV 10.10.10.5', pattern: '^nmap -sV 10\\.10\\.10\\.5$', solution: 'nmap -sV 10.10.10.5', explain: 'Nmap menemukan SSH, HTTP, MySQL, dan proxy. Versi service membantu menilai kerentanan, tetapi hanya scan target berizin.' },
      { id: 'protokol-6', task: 'Ping 8.8.8.8 sebanyak 4 kali.', hint: 'ping -c 4 8.8.8.8', pattern: '^ping -c 4 8\\.8\\.8\\.8$', solution: 'ping -c 4 8.8.8.8', explain: 'ICMP echo berguna untuk memastikan jalur keluar dan latency dasar.' }
    ]
  },
  lab: {
    title: 'Lab 4 — Buktikan dengan capture',
    goal: 'Menangkap lalu lintas DNS/HTTP milik sendiri dan membaca field pentingnya.',
    safety: 'Tangkap hanya traffic dari mesin/jaringanmu sendiri. Hentikan capture setelah selesai dan hapus file jika tidak diperlukan.',
    steps: [
      { text: 'Linux: pastikan tcpdump terpasang. Windows/macOS: gunakan Wireshark dengan interface yang aktif.' },
      { text: 'Mulai capture DNS: `sudo tcpdump -i any -nn port 53 -c 10`.' },
      { text: 'Di terminal lain, jalankan `dig example.com` atau buka satu situs.' },
      { text: 'Amati query dan response. Catat nama domain, tipe record, dan IP hasil.' },
      { text: 'Capture HTTP lokal (jika ada service): `sudo tcpdump -i lo -nn -A port 8080 -c 5` lalu akses `http://localhost:8080`.' },
      { text: 'Di Wireshark, coba filter `dns`, `tcp.flags.syn == 1 && tcp.flags.ack == 0`, dan `http.request`.' },
      { text: 'Tulis satu paragraf: apa yang membuktikan bahwa DNS bekerja atau gagal?' }
    ],
    challenge: 'Bisakah kamu menemukan satu paket SYN tanpa ACK di capture-mu? Itu bisa berupa koneksi keluar normal atau indikasi scan—konteks menentukan.'
  },
  resources: [
    { label: 'Wireshark — Display filter reference', url: 'https://www.wireshark.org/docs/dfref/' },
    { label: 'tcpdump — Manual', url: 'https://www.tcpdump.org/manpages/tcpdump.1.html' },
    { label: 'Cloudflare — What is DNS?', url: 'https://www.cloudflare.com/learning/dns/what-is-dns/' },
    { label: 'IANA — Service Name and Port Registry', url: 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml' }
  ]
};

window.CYBER_MODULES['netsec'] = {
  id: 'netsec',
  order: 10,
  title: 'Keamanan Jaringan & Hardening',
  track: 'Keamanan',
  level: 'Menengah',
  duration: 50,
  summary: 'Memasang kontrol di jalur serangan: firewall, IDS/IPS, segmentasi, VPN, keamanan Wi-Fi, dan checklist hardening yang bisa langsung dipakai.',
  objectives: [
    'Menerapkan prinsip default deny pada firewall.',
    'Membedakan IDS, IPS, NIDS, NIPS, dan HIPS.',
    'Merancang segmentasi dengan VLAN, DMZ, dan kontrol akses.',
    'Memahami risiko Wi-Fi dan cara mengamankannya.',
    'Menyusun checklist hardening untuk host dan jaringan.'
  ],
  sections: [
    {
      title: 'Firewall: default deny, izinkan yang perlu',
      blocks: [
        'Firewall yang baik dimulai dari **default deny**: semua ditolak, lalu dibuka hanya yang benar-benar dibutuhkan. Kebalikannya—default allow lalu menambal—sering meninggalkan lubang.',
        { list: [
          '**Stateless packet filter**: memeriksa header per paket; cepat tetapi tidak memahami koneksi.',
          '**Stateful firewall**: melacak koneksi sehingga balasan dari koneksi yang diizinkan otomatis diterima.',
          '**NGFW**: menambah inspeksi aplikasi, IPS, identitas pengguna, dan TLS inspection.',
          '**Host-based firewall**: berjalan di mesin (ufw, firewalld, Windows Defender Firewall).',
          '**WAF**: fokus pada HTTP/HTTPS dan pola serangan web.'
        ] },
        { code: { lang: 'bash', label: 'ufw dasar', code: '# default deny masuk, allow keluar\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\n\n# izinkan SSH hanya dari subnet lab\nsudo ufw allow from 192.168.56.0/24 to any port 22 proto tcp\n\n# izinkan web\nsudo ufw allow 80/tcp\nsudo ufw allow 443/tcp\n\n# aktifkan dan cek\nsudo ufw enable\nsudo ufw status verbose' } },
        { note: 'Selalu uji aturan firewall dari jalur yang benar sebelum mengaktifkannya di server produksi. Kesalahan umum: mengunci diri sendiri dari SSH.' }
      ]
    },
    {
      title: 'IDS, IPS, dan deteksi',
      blocks: [
        '**IDS** mendeteksi dan memberi alarm; **IPS** memblokir. Keduanya bisa berbasis jaringan (NIDS/NIPS) atau host (HIDS/HIPS).',
        { table: {
          head: ['Jenis', 'Lokasi', 'Kekuatan', 'Keterbatasan'],
          rows: [
            ['**NIDS**', 'Titik jaringan (SPAN/TAP)', 'Melihat banyak host sekaligus', 'Tidak melihat traffic terenkripsi tanpa TLS inspection'],
            ['**NIPS**', 'Inline di jalur jaringan', 'Bisa memblokir real-time', 'Risiko false positive memutus layanan'],
            ['**HIDS**', 'Di host', 'Melihat proses, file, dan log lokal', 'Butuh agent; overhead dan blind spot'],
            ['**HIPS**', 'Di host', 'Memblokir perilaku berbahaya', 'Bisa bentrok dengan aplikasi sah']
          ]
        } },
        'Deteksi berbasis **signature** cocok untuk pola yang diketahui, tetapi mudah dilewati variasi. Deteksi berbasis **anomali/perilaku** bisa menangkap serangan baru tetapi lebih bising. Praktik terbaik menggabungkan keduanya dengan tuning berkala.'
      ]
    },
    {
      title: 'Segmentasi: VLAN, DMZ, dan trust boundary',
      blocks: [
        'Segmentasi membatasi **blast radius**. Jika satu host dikompromikan, penyerang tidak otomatis bisa menjangkau seluruh jaringan.',
        { list: [
          '**VLAN**: memisahkan jaringan secara logis di switch yang sama. Perlu aturan antar-VLAN di router/firewall.',
          '**DMZ**: zona untuk service publik (web, mail, reverse proxy). Database dan AD berada di zona internal yang tidak bisa diakses langsung dari DMZ.',
          '**Microsegmentation**: aturan granular antarbeban kerja, sering di cloud/container.',
          '**NAC/802.1X**: memeriksa identitas dan posture perangkat sebelum diberi akses jaringan.',
          '**Jump server**: satu titik akses administratif yang diaudit, bukan akses langsung dari laptop ke semua server.'
        ] },
        { warn: 'VLAN hopping bisa terjadi lewat double tagging atau switch spoofing jika konfigurasi trunk tidak aman. Jangan mengandalkan VLAN sebagai satu-satunya kontrol; pasang ACL/firewall antar-VLAN.' }
      ]
    },
    {
      title: 'VPN dan akses remote',
      blocks: [
        'VPN membuat terowongan terenkripsi di atas jaringan yang tidak dipercaya. Ada dua model utama: **site-to-site** (menghubungkan dua jaringan) dan **remote access** (pengguna ke jaringan kantor).',
        { table: {
          head: ['Teknologi', 'Karakteristik', 'Catatan'],
          rows: [
            ['**IPsec**', 'Standar di lapisan network; AH/ESP, IKE', 'Umum untuk site-to-site; konfigurasi kompleks'],
            ['**OpenVPN**', 'TLS-based, fleksibel', 'Populer, tetapi butuh tuning performa'],
            ['**WireGuard**', 'Ringan, modern, kriptografi sederhana', 'Cepat; kelola kunci dengan disiplin'],
            ['**SSH tunnel**', 'Terowongan ad hoc lewat SSH', 'Berguna untuk admin, bukan pengganti VPN penuh']
          ]
        } },
        { warn: 'VPN bukan izin otomatis untuk semua akses. Terapkan least privilege, MFA, logging, dan segmentasi setelah pengguna terhubung.' }
      ]
    },
    {
      title: 'Keamanan Wi-Fi',
      blocks: [
        { table: {
          head: ['Protokol', 'Status', 'Keterangan'],
          rows: [
            ['**WEP**', 'Rusak', 'RC4 dengan IV lemah; bisa dipecahkan dalam hitungan menit'],
            ['**WPA**', 'Usang', 'TKIP; hanya untuk kompatibilitas perangkat lama'],
            ['**WPA2**', 'Standar minimal', 'CCMP/AES; gunakan WPA2-Enterprise (802.1X) bila memungkinkan'],
            ['**WPA3**', 'Direkomendasikan', 'SAE melindungi dari offline dictionary attack; forward secrecy'],
            ['**WPS**', 'Risiko', 'PIN 8 digit rentan brute force; nonaktifkan jika tidak perlu']
          ]
        } },
        { list: [
          '**Evil twin**: AP palsu dengan SSID sama; mitigasi dengan sertifikat/802.1X dan edukasi pengguna.',
          '**Deauth attack**: frame deauth palsu memutus klien; WPA3/802.11w (PMF) membantu.',
          '**Rogue AP**: AP tidak resmi di jaringan; deteksi lewat wireless IDS dan inventaris.',
          '**EAP/PEAP**: PEAP membungkus EAP dalam TLS; validasi sertifikat server penting agar tidak menyambung ke AP palsu.',
          '**Guest network**: pisahkan tamu dari jaringan internal dan batasi akses keluar.'
        ] }
      ]
    },
    {
      title: 'Checklist hardening',
      blocks: [
        { list: [
          '**Patch**: inventaris sistem, prioritas berdasarkan risiko, verifikasi setelah patch.',
          '**Minimal service**: matikan service/port yang tidak dipakai; `ss -tulpn` untuk audit.',
          '**Least privilege**: pisahkan akun admin dan user; gunakan sudo/role, bukan login root.',
          '**Autentikasi**: MFA untuk akses remote, password policy, kunci SSH, nonaktifkan login password.',
          '**Firewall**: default deny masuk; batasi egress jika memungkinkan.',
          '**Segmentasi**: pisahkan server, workstation, IoT, dan tamu.',
          '**Logging**: kirim log ke server terpusat; lindungi integritas log; atur retensi.',
          '**Backup**: 3-2-1, terenkripsi, uji restore, dan simpan satu salinan offline.',
          '**Endpoint**: EDR/AV, enkripsi disk, application allowlisting bila feasible.',
          '**Awareness**: latihan phishing, prosedur pelaporan, dan budaya verifikasi.'
        ] },
        { tip: 'Hardening bukan proyek sekali selesai. Jadwalkan review berkala: port baru, akun baru, service baru, dan perubahan konfigurasi harus melewati proses yang sama.' }
      ]
    },
    {
      title: 'Latihan desain: jaringan kecil dengan DMZ',
      blocks: [
        'Bayangkan kamu punya satu kantor kecil: 20 laptop staf, satu server web publik, satu database internal, dan Wi-Fi tamu.',
        { table: {
          head: ['Zona', 'Isi', 'Aturan utama'],
          rows: [
            ['**Internet**', 'Tidak dipercaya', 'Hanya 80/443 ke reverse proxy di DMZ'],
            ['**DMZ**', 'Reverse proxy/web publik', 'Boleh ke database hanya lewat port dan akun tertentu; tidak boleh ke LAN'],
            ['**LAN staf**', 'Laptop, printer', 'Boleh ke internet dan DMZ terbatas; tidak boleh langsung ke database'],
            ['**Data**', 'Database, backup', 'Hanya menerima koneksi dari aplikasi yang diizinkan; akses admin lewat jump server'],
            ['**Guest Wi-Fi**', 'Tamu', 'Hanya internet; terisolasi dari LAN dan DMZ'],
            ['**Management**', 'Jump server, monitoring', 'Akses MFA, logging ketat, tidak terbuka dari internet']
          ]
        } },
        { note: 'Gambar aturan ini sebagai matriks sumber → tujuan → port. Jika ada sel yang "allow all", itu kandidat untuk dipersempit.' }
      ]
    }
  ],
  terms: [
    { term: 'Default deny', def: 'Kebijakan firewall yang menolak semua lalu lintas kecuali yang secara eksplisit diizinkan.' },
    { term: 'Stateful firewall', def: 'Firewall yang melacak state koneksi dan otomatis mengizinkan paket balasan.' },
    { term: 'NGFW', def: 'Next-Generation Firewall dengan inspeksi aplikasi, IPS, dan kesadaran identitas.' },
    { term: 'NIDS/NIPS', def: 'Network-based IDS/IPS yang memantau atau memblokir lalu lintas jaringan.' },
    { term: 'HIPS', def: 'Host-based IPS yang memantau dan memblokir perilaku di endpoint.' },
    { term: 'DMZ', def: 'Zona terpisah untuk layanan publik, dibatasi dari jaringan internal.' },
    { term: '802.1X', def: 'Standar kontrol akses jaringan berbasis identitas dan autentikasi.' },
    { term: 'NAC', def: 'Network Access Control: memeriksa identitas dan posture perangkat sebelum memberi akses.' },
    { term: 'Jump server', def: 'Host perantara terkontrol untuk akses administratif ke jaringan internal.' },
    { term: 'Sinkhole', def: 'Mengarahkan domain berbahaya ke alamat netral untuk memutus komunikasi malware.' },
    { term: 'PMF', def: 'Protected Management Frames (802.11w) yang melindungi frame manajemen Wi-Fi dari spoofing.' }
  ],
  quiz: [
    {
      q: 'Prinsip firewall yang paling aman adalah...',
      options: ['Allow all lalu blokir yang berbahaya', 'Default deny lalu izinkan yang dibutuhkan', 'Hanya memblokir port 80', 'Mengandalkan antivirus saja'],
      answer: 1,
      explain: 'Default deny mengurangi attack surface sejak awal. Aturan allow harus spesifik dan didokumentasikan.'
    },
    {
      q: 'Perbedaan utama IDS dan IPS adalah...',
      options: ['IDS berjalan di cloud, IPS di lokal', 'IDS mendeteksi, IPS dapat memblokir', 'IDS hanya untuk Wi-Fi', 'IPS tidak memakai signature'],
      answer: 1,
      explain: 'IDS memberi alarm; IPS berada inline dan bisa memblokir lalu lintas berbahaya (dengan risiko false positive).'
    },
    {
      q: 'Mengapa database sebaiknya tidak diletakkan di DMZ?',
      options: ['Agar lebih cepat', 'Karena DMZ menghadap publik dan kompromi bisa langsung mengancam data', 'Karena DMZ tidak mendukung TCP', 'Karena database tidak butuh keamanan'],
      answer: 1,
      explain: 'DMZ adalah zona berisiko karena menghadap internet. Database sebaiknya di zona internal dengan akses terbatas dari aplikasi.'
    },
    {
      q: 'Protokol Wi-Fi mana yang direkomendasikan saat ini?',
      options: ['WEP', 'WPA (TKIP)', 'WPA2-AES atau WPA3', 'WPS'],
      answer: 2,
      explain: 'WPA2-AES masih dapat diterima; WPA3 lebih baik. WEP rusak, WPA/TKIP usang, dan WPS berisiko.'
    },
    {
      q: 'Rogue access point adalah...',
      options: ['AP resmi yang di-patch', 'AP tidak resmi yang dipasang di jaringan', 'Firewall hardware', 'VPN server'],
      answer: 1,
      explain: 'Rogue AP adalah access point yang tidak diotorisasi, bisa menjadi jalan masuk atau titik penyadapan.'
    },
    {
      q: 'Langkah pertama hardening host yang paling berdampak biasanya...',
      options: ['Mengganti wallpaper', 'Menutup service/port yang tidak diperlukan dan patch', 'Menambah RAM', 'Menginstal banyak antivirus'],
      answer: 1,
      explain: 'Mengurangi attack surface dan menutup kerentanan yang diketahui memberi dampak besar dengan biaya relatif rendah.'
    },
    {
      q: 'Apa fungsi jump server?',
      options: ['Mempercepat unduhan', 'Menjadi titik akses administratif yang terkontrol dan diaudit', 'Menggantikan firewall', 'Menyimpan backup'],
      answer: 1,
      explain: 'Jump server memusatkan akses admin sehingga bisa diaudit, dibatasi, dan dipantau.'
    }
  ],
  terminal: {
    intro: 'Periksa konfigurasi firewall dan port yang terbuka pada mesin virtual ini.',
    challenges: [
      { id: 'netsec-1', task: 'Lihat status firewall UFW.', hint: 'ufw status', pattern: '^ufw status( verbose)?$', solution: 'ufw status', explain: 'Perhatikan default policy dan aturan yang diizinkan. Port 8080 dan 3306 diblokir.' },
      { id: 'netsec-2', task: 'Tampilkan aturan iptables.', hint: 'sudo iptables -L', pattern: '^sudo iptables -L$', solution: 'sudo iptables -L', explain: 'Chain INPUT policy DROP adalah contoh default deny. Hanya SSH, HTTP, dan HTTPS yang diizinkan.' },
      { id: 'netsec-3', task: 'Tampilkan port yang mendengarkan.', hint: 'ss -tulpn', pattern: '^ss -tulpn$', solution: 'ss -tulpn', explain: 'Service yang mendengarkan adalah attack surface. Port 3306 hanya boleh lokal atau tertutup.' },
      { id: 'netsec-4', task: 'Scan port pada 10.10.10.5 untuk melihat service yang terekspos.', hint: 'nmap -sV 10.10.10.5', pattern: '^nmap -sV 10\\.10\\.10\\.5$', solution: 'nmap -sV 10.10.10.5', explain: 'Empat port terbuka. Evaluasi apakah semuanya perlu terekspos dan apakah versinya sudah di-patch.' },
      { id: 'netsec-5', task: 'Tampilkan tabel routing untuk memeriksa jalur keluar.', hint: 'ip route', pattern: '^ip (route|r)$', solution: 'ip route', explain: 'Routing yang tidak diharapkan bisa menjadi jalur eksfiltrasi. Batasi egress jika memungkinkan.' }
    ]
  },
  lab: {
    title: 'Lab 5 — Audit hardening mesin sendiri',
    goal: 'Menemukan satu perbaikan keamanan nyata dan menerapkannya dengan aman.',
    safety: 'Sebelum mengaktifkan firewall, pastikan kamu punya akses konsol lokal agar tidak terkunci. Jangan mengubah aturan pada server produksi tanpa izin.',
    steps: [
      { text: 'Lihat port yang mendengarkan: `ss -tulpn` (Linux) atau `netstat -ano` (Windows).' },
      { text: 'Identifikasi service yang tidak kamu butuhkan. Cari nama proses dan cara menonaktifkannya secara permanen.' },
      { text: 'Periksa firewall: `sudo ufw status verbose`, `firewall-cmd --list-all`, atau Windows Defender Firewall.' },
      { text: 'Jika firewall belum aktif, siapkan aturan default deny dan izinkan SSH dari jaringan lokal saja. Uji dari sesi kedua sebelum menutup sesi pertama.' },
      { text: 'Terapkan patch sistem: `sudo apt update && sudo apt upgrade` (sesuaikan distro).' },
      { text: 'Periksa login SSH: nonaktifkan password login jika memakai key, dan batasi user yang boleh login.' },
      { text: 'Catat sebelum/sesudah dan satu risiko residual yang masih tersisa.' }
    ],
    challenge: 'Setelah audit, apakah ada port yang mendengarkan di 0.0.0.0 padahal hanya perlu 127.0.0.1? Itu perbaikan cepat yang sering terlewat.'
  },
  resources: [
    { label: 'CIS Benchmarks', url: 'https://www.cisecurity.org/cis-benchmarks' },
    { label: 'NIST SP 800-41 — Firewalls and Firewall Policy', url: 'https://csrc.nist.gov/pubs/sp/800/41/r1/final' },
    { label: 'Ubuntu — UFW documentation', url: 'https://help.ubuntu.com/community/UFW' },
    { label: 'Wi-Fi Alliance — WPA3', url: 'https://www.wi-fi.org/discover-wi-fi/security' }
  ]
};
