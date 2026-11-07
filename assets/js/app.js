(() => {
  'use strict';

  const STORAGE_KEY = 'labsiber.v1';
  const view = document.getElementById('view');
  const menuBtn = document.querySelector('.menu-btn');
  const sidebar = document.getElementById('sidebar');

  const state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { theme: null };
      const parsed = JSON.parse(raw);
      const theme = parsed && (parsed.theme === 'light' || parsed.theme === 'dark') ? parsed.theme : null;
      return { theme };
    } catch {
      return { theme: null };
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable; the app still works for this session.
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);
  }

  function systemTheme() {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function resolveTheme(preference) {
    return preference === 'light' || preference === 'dark' ? preference : systemTheme();
  }

  function applyTheme(preference) {
    state.theme = preference;
    document.documentElement.dataset.theme = resolveTheme(preference);
  }

  function toggleTheme() {
    applyTheme(resolveTheme(state.theme) === 'dark' ? 'light' : 'dark');
    saveState();
  }

  function setSidebar(open) {
    document.body.classList.toggle('sidebar-open', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', String(open));
  }

  function parseRoute() {
    const raw = window.location.hash.replace(/^#\/?/, '');
    const path = raw.split('?')[0];
    const parts = path.split('/').filter(Boolean);

    if (parts.length === 0) return { name: 'dashboard' };
    if (parts[0] === 'module') return { name: 'module', id: parts[1] || '' };
    return { name: parts[0] };
  }

  function pageHead(eyebrow, title, lede) {
    return `
      <section class="page-head">
        <span class="eyebrow">${eyebrow}</span>
        <h1 class="page-title">${title}</h1>
        <p class="page-lede">${lede}</p>
      </section>`;
  }

  function placeholder(eyebrow, title, text, note) {
    return `
      ${pageHead(eyebrow, title, text)}
      <div class="empty">
        <h2>${note}</h2>
        <p>Potongan ini masuk lewat PR terpisah supaya mudah direview.</p>
      </div>`;
  }

  const pages = {
    dashboard() {
      return {
        title: 'Dashboard',
        html: `
          ${pageHead(
            'Roadmap.sh → lab pribadi',
            'Belajar cyber security dari nol, dengan praktik.',
            'Roadmap, materi, kuis, simulator terminal, dan lab lokal dalam satu tempat. Situs statis, gratis, dan privat.'
          )}
          <div class="empty">
            <h2>Shell dan navigasi sudah aktif</h2>
            <p>Dashboard penuh, roadmap, dan modul masuk lewat PR berikutnya.</p>
            <p><a href="#/roadmap">Buka roadmap</a> · <a href="#/modules">Daftar modul</a></p>
          </div>`
      };
    },

    roadmap() {
      return {
        title: 'Roadmap',
        html: placeholder(
          'Peta belajar',
          'Roadmap cyber security',
          '202 node dari fundamental IT sampai cloud dan karier akan dirender dari kontrak data pada PR #3.',
          'Roadmap belum dimuat'
        )
      };
    },

    modules() {
      return {
        title: 'Modul materi',
        html: placeholder(
          'Materi',
          'Katalog modul',
          '17 modul akan tampil di sini setelah module index dan lesson engine tersedia.',
          'Katalog belum dimuat'
        )
      };
    },

    module(route) {
      const id = route.id || 'tidak diketahui';
      return {
        title: `Modul ${id}`,
        html: `
          ${pageHead('Materi', 'Modul belum tersedia', 'Konten modul akan dimuat dari registry pada PR #4.')}
          <div class="empty">
            <h2>Konten belum di-commit</h2>
            <p>ID modul: <code>${escapeHtml(id)}</code></p>
          </div>`
      };
    },

    terminal() {
      return {
        title: 'Terminal lab',
        html: placeholder(
          'Praktik aman',
          'Terminal simulasi',
          'Shell virtual, perintah, dan misi terminal masuk pada PR #11. Tidak ada perintah yang menyentuh sistem nyata.',
          'Terminal belum aktif'
        )
      };
    },

    glossary() {
      return {
        title: 'Glosarium',
        html: placeholder(
          'Referensi',
          'Glosarium',
          'Istilah akan diagregasi dari semua modul setelah konten tersedia.',
          'Glosarium belum diisi'
        )
      };
    },

    progress() {
      return {
        title: 'Progres & catatan',
        html: placeholder(
          'Progres',
          'Progres belajar',
          'Statistik, ekspor/impor, dan catatan akan aktif setelah modul dan state tersedia.',
          'Progres belum aktif'
        )
      };
    },

    notFound() {
      return {
        title: 'Tidak ditemukan',
        html: `
          ${pageHead('404', 'Halaman tidak ditemukan', 'Route ini tidak ada. Kembali ke dashboard atau buka roadmap.')}
          <div class="empty">
            <h2>Alamat tidak dikenal</h2>
            <p><a href="#/">Kembali ke dashboard</a></p>
          </div>`
      };
    }
  };

  function render() {
    const route = parseRoute();
    const page = pages[route.name] ? pages[route.name](route) : pages.notFound();

    view.innerHTML = page.html;
    document.title = `${page.title} — LabSiber`;

    const active = route.name === 'module' ? 'modules' : route.name;
    document.querySelectorAll('[data-nav]').forEach((link) => {
      link.classList.toggle('active', link.dataset.nav === active);
    });

    setSidebar(false);
    view.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-action]');
    if (!trigger) return;

    switch (trigger.dataset.action) {
      case 'toggle-theme':
        toggleTheme();
        break;
      case 'toggle-sidebar':
        setSidebar(!document.body.classList.contains('sidebar-open'));
        break;
      case 'close-sidebar':
        setSidebar(false);
        break;
      default:
        break;
    }
  });

  sidebar.addEventListener('click', (event) => {
    if (event.target.closest('a[href^="#/"]')) setSidebar(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setSidebar(false);
  });

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    if (!state.theme) applyTheme(null);
  });

  window.addEventListener('hashchange', render);

  applyTheme(state.theme);
  render();
})();
