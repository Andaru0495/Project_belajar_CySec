(() => {
  'use strict';

  const view = document.getElementById('view');
  const menuBtn = document.querySelector('.menu-btn');
  const sidebar = document.getElementById('sidebar');
  const state = window.CyberState;

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
    state.setTheme(preference);
    document.documentElement.dataset.theme = resolveTheme(preference);
  }

  function toggleTheme() {
    applyTheme(resolveTheme(state.get().theme) === 'dark' ? 'light' : 'dark');
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

  function roadmapData() {
    const data = window.CYBER_ROADMAP;
    return data && Array.isArray(data.sections) ? data : null;
  }

  function moduleIndex() {
    const index = window.CYBER_MODULE_INDEX;
    return index && Array.isArray(index.modules) ? index.modules : [];
  }

  function renderRoadmap() {
    const data = roadmapData();
    if (!data) {
      return placeholder(
        'Peta belajar',
        'Roadmap cyber security',
        'Data roadmap belum tersedia.',
        'Roadmap belum dimuat'
      );
    }

    const modules = Object.fromEntries(moduleIndex().map((module) => [module.id, module]));
    const total = data.sections.reduce((sum, section) => sum + section.nodes.length, 0);
    const isDone = (node) => Boolean(
      (node.module && state.isModuleComplete(node.module)) || state.isRoadmapDone(node.id)
    );
    const doneCount = data.sections.reduce(
      (sum, section) => sum + section.nodes.filter(isDone).length,
      0
    );

    const sections = data.sections.map((section, index) => {
      const nodes = section.nodes.map((node) => {
        const module = node.module ? modules[node.module] : null;
        const done = isDone(node);
        const action = module && module.status === 'ready'
          ? `<a class="node-link" href="#/module/${encodeURIComponent(module.id)}">Buka modul</a>`
          : `<span class="badge badge-dim">${module ? 'modul segera hadir' : 'belum ada modul'}</span>`;

        return `
          <li class="node${done ? ' done' : ''}">
            <span class="node-check" aria-hidden="true"></span>
            <div class="node-main">
              <div class="node-title">${escapeHtml(node.title)}</div>
              <p class="node-desc">${escapeHtml(node.desc)}</p>
            </div>
            ${action}
          </li>`;
      }).join('');

      return `
        <details class="roadmap-section"${index === 0 ? ' open' : ''}>
          <summary class="road-head">
            <span class="road-head-main">
              <h2>${escapeHtml(section.title)}</h2>
              <p>${escapeHtml(section.intro || '')}</p>
            </span>
            <span class="road-count">${section.nodes.length} topik</span>
            <svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
          </summary>
          <ul class="node-list">${nodes}</ul>
        </details>`;
    }).join('');

    return `
      ${pageHead(
        'Peta belajar',
        'Roadmap cyber security',
        `${total} topik dalam ${data.sections.length} bagian. Ikuti urutannya atau lompat ke area yang paling relevan.`
      )}
      <div class="roadmap-overview">
        <div class="roadmap-stat"><strong>${total}</strong><span>topik</span></div>
        <div class="roadmap-stat"><strong>${data.sections.length}</strong><span>bagian</span></div>
        <div class="roadmap-stat"><strong>${doneCount}</strong><span>selesai</span></div>
        <p class="tiny muted">Status selesai mengikuti modul yang selesai atau node yang ditandai manual.</p>
      </div>
      <div class="roadmap-list">${sections}</div>`;
  }

  function renderCatalog() {
    const modules = moduleIndex();
    if (!modules.length) {
      return placeholder(
        'Materi',
        'Katalog modul',
        'Data modul belum tersedia.',
        'Katalog belum dimuat'
      );
    }

    const ready = modules.filter((module) => module.status === 'ready').length;
    const cards = [...modules]
      .sort((a, b) => a.order - b.order)
      .map((module) => {
        const isReady = module.status === 'ready';
        const completed = state.isModuleComplete(module.id);
        const badge = completed ? 'selesai' : isReady ? 'siap' : 'segera hadir';
        const badgeClass = completed || isReady ? 'badge-green' : 'badge-dim';
        const cardClass = completed ? ' done' : isReady ? ' ready' : '';
        return `
          <article class="module-card${cardClass}">
            <div class="module-card-top">
              <span class="module-num">Modul ${String(module.order).padStart(2, '0')}</span>
              <span class="badge ${badgeClass}">${badge}</span>
            </div>
            <h2>${escapeHtml(module.title)}</h2>
            <p>${escapeHtml(module.summary)}</p>
            <div class="module-meta">
              <span>${escapeHtml(module.track)}</span>
              <span>${escapeHtml(module.level)}</span>
              <span>${module.duration} menit</span>
            </div>
            ${isReady ? `<a class="module-link" href="#/module/${encodeURIComponent(module.id)}">Buka modul</a>` : ''}
          </article>`;
      }).join('');

    return `
      ${pageHead(
        'Materi',
        'Katalog modul',
        `${modules.length} modul bertahap. ${ready} siap dibaca, ${modules.length - ready} segera hadir.`
      )}
      <div class="module-grid">${cards}</div>`;
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
        html: renderRoadmap()
      };
    },

    modules() {
      return {
        title: 'Modul materi',
        html: renderCatalog()
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
    if (!state.get().theme) applyTheme(null);
  });

  window.addEventListener('hashchange', render);

  applyTheme(state.get().theme);
  render();
})();
