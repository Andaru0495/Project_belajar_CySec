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

  const modulePromises = new Map();

  function loadScript(src) {
    if (!modulePromises.has(src)) {
      modulePromises.set(src, new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Gagal memuat ${src}`));
        document.head.appendChild(script);
      }));
    }
    return modulePromises.get(src);
  }

  async function ensureModule(id) {
    const meta = moduleIndex().find((module) => module.id === id);
    if (!meta || meta.status !== 'ready') return null;
    await loadScript(meta.file);
    return (window.CYBER_MODULES || {})[id] || null;
  }

  function inline(text) {
    return escapeHtml(text)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  }

  function codeBlock(block) {
    const source = block.code.code || '';
    const label = block.code.label || block.code.lang || 'shell';
    return `
      <div class="code-block">
        <div class="code-head">
          <span>${escapeHtml(label)}</span>
          <button class="copy-btn" type="button" data-copy="${encodeURIComponent(source)}">Salin</button>
        </div>
        <pre><code>${escapeHtml(source)}</code></pre>
      </div>`;
  }

  function renderBlocks(blocks) {
    return blocks.map((block) => {
      if (typeof block === 'string') return `<p>${inline(block)}</p>`;
      if (block.sub) return `<h3>${inline(block.sub)}</h3>`;
      if (block.list) return `<ul>${block.list.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>`;
      if (block.olist) return `<ol>${block.olist.map((item) => `<li>${inline(item)}</li>`).join('')}</ol>`;
      if (block.code) return codeBlock(block);
      if (block.table) {
        const head = block.table.head.map((cell) => `<th>${inline(cell)}</th>`).join('');
        const rows = block.table.rows
          .map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`)
          .join('');
        return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
      }
      if (block.note) return `<div class="callout note"><span>${inline(block.note)}</span></div>`;
      if (block.tip) return `<div class="callout tip"><span>${inline(block.tip)}</span></div>`;
      if (block.warn) return `<div class="callout warn"><span>${inline(block.warn)}</span></div>`;
      if (block.danger) return `<div class="callout danger"><span>${inline(block.danger)}</span></div>`;
      if (block.quote) return `<blockquote>${inline(block.quote)}</blockquote>`;
      if (block.hr) return '<hr>';
      return '';
    }).join('');
  }

  function renderQuiz(module) {
    if (!Array.isArray(module.quiz) || module.quiz.length === 0) return '';
    const best = state.get().quiz[module.id];
    const bestText = best ? `Terbaik: ${best.best}/${best.total}` : 'Belum ada skor';

    const questions = module.quiz.map((item, index) => `
      <div class="quiz-q" data-quiz-question="${index}">
        <p><span class="q-num">${String(index + 1).padStart(2, '0')}</span>${inline(item.q)}</p>
        <div class="quiz-options">
          ${item.options.map((option, optionIndex) => `
            <button class="quiz-option" type="button" data-quiz-option="${optionIndex}">
              <span class="opt-letter">${String.fromCharCode(65 + optionIndex)}</span>
              <span>${inline(option)}</span>
            </button>`).join('')}
        </div>
        <div class="quiz-explain" hidden>${inline(item.explain)}</div>
      </div>`).join('');

    return `
      <section class="prose-section" id="quiz">
        <h2>Kuis</h2>
        <div class="quiz" data-quiz-module="${escapeHtml(module.id)}">
          <div class="quiz-head">
            <h3>Cek pemahaman</h3>
            <div class="quiz-meta">
              <span class="quiz-score" data-quiz-score>0/${module.quiz.length}</span>
              <span class="quiz-best">${bestText}</span>
            </div>
          </div>
          <div class="quiz-list">${questions}</div>
          <div class="quiz-done" hidden data-quiz-result></div>
        </div>
      </section>`;
  }

  function renderLesson(module) {
    const meta = moduleIndex().find((item) => item.id === module.id);
    const ordered = [...moduleIndex()].sort((a, b) => a.order - b.order);
    const position = ordered.findIndex((item) => item.id === module.id);
    const previous = position > 0 ? ordered[position - 1] : null;
    const next = position >= 0 && position < ordered.length - 1 ? ordered[position + 1] : null;
    const done = state.isModuleComplete(module.id);
    const note = state.getNote(module.id);
    const quiz = renderQuiz(module);

    const sections = module.sections.map((section, index) => `
      <section class="prose-section" id="section-${index + 1}">
        <h2><span class="h-num">${String(index + 1).padStart(2, '0')}</span>${escapeHtml(section.title)}</h2>
        ${renderBlocks(section.blocks)}
      </section>`).join('');

    const toc = module.sections
      .map((section, index) => `<li><a href="#section-${index + 1}">${escapeHtml(section.title)}</a></li>`)
      .join('');

    const terms = module.terms.map((term) => `
      <details>
        <summary>${escapeHtml(term.term)}</summary>
        <div class="term-body">${inline(term.def)}</div>
      </details>`).join('');

    const labSteps = module.lab.steps.map((step, index) => {
      const text = typeof step === 'string' ? step : step.text;
      const code = typeof step === 'string' ? '' : step.code;
      return `
        <div class="lab-step">
          <span class="s-num">${index + 1}</span>
          <div class="s-body">
            <p>${inline(text)}</p>
            ${code ? codeBlock({ code: { code, label: 'bash' } }) : ''}
          </div>
        </div>`;
    }).join('');

    return `
      <article class="lesson">
        <header class="lesson-hero">
          <span class="eyebrow">${escapeHtml(module.track)}</span>
          <h1>${escapeHtml(module.title)}</h1>
          <p class="lede">${escapeHtml(module.summary)}</p>
          <div class="lesson-meta">
            <span class="badge">${escapeHtml(module.level)}</span>
            <span class="badge">${module.duration} menit</span>
            <span class="badge">${module.sections.length} bagian</span>
            ${meta?.status === 'ready' ? '<span class="badge badge-green">siap</span>' : ''}
          </div>
          <div class="lesson-actions">
            <button class="btn${done ? ' btn-primary' : ''}" type="button" data-action="toggle-complete" data-module="${escapeHtml(module.id)}">
              ${done ? 'Selesai ✓' : 'Tandai selesai'}
            </button>
          </div>
        </header>

        <section class="objectives">
          <h2>Tujuan pembelajaran</h2>
          <ul>${module.objectives.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>
        </section>

        <div class="lesson-grid">
          <div class="lesson-body">
            ${sections}

            <section class="prose-section" id="terms">
              <h2>Istilah kunci</h2>
              <div class="terms">${terms}</div>
            </section>

            ${quiz}

            <section class="prose-section" id="lab">
              <h2>Lab lokal</h2>
              <div class="lab">
                <div class="lab-head">
                  <h3>${escapeHtml(module.lab.title)}</h3>
                  <p>${inline(module.lab.goal)}</p>
                </div>
                <div class="lab-body">
                  <div class="callout danger"><span>${inline(module.lab.safety)}</span></div>
                  ${labSteps}
                  ${module.lab.challenge ? `<div class="callout tip"><span>${inline(module.lab.challenge)}</span></div>` : ''}
                </div>
              </div>
            </section>

            <section class="prose-section" id="notes">
              <h2>Catatanmu</h2>
              <div class="notes-box">
                <textarea data-note="${escapeHtml(module.id)}" placeholder="Tulis catatan, pertanyaan, atau temuan lab…">${escapeHtml(note)}</textarea>
                <p class="notes-status" data-note-status>${note ? 'Tersimpan' : 'Autosave saat kamu mengetik'}</p>
              </div>
            </section>

            <section class="prose-section" id="resources">
              <h2>Sumber belajar</h2>
              <ul class="resource-list">
                ${module.resources.map((resource) => `<li><a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(resource.label)}</a></li>`).join('')}
              </ul>
            </section>

            <nav class="prev-next" aria-label="Navigasi modul">
              ${previous ? `<a href="#/module/${encodeURIComponent(previous.id)}"><span class="pn-label">Sebelumnya</span><span class="pn-title">${escapeHtml(previous.title)}</span></a>` : '<span></span>'}
              ${next ? `<a class="next" href="#/module/${encodeURIComponent(next.id)}"><span class="pn-label">Berikutnya</span><span class="pn-title">${escapeHtml(next.title)}</span></a>` : '<span></span>'}
            </nav>
          </div>

          <aside class="lesson-side">
            <nav class="toc" aria-label="Daftar isi">
              <h2>Isi modul</h2>
              <ol>${toc}</ol>
              <div class="toc-extra">
                <a href="#terms">Istilah kunci</a>
                ${module.quiz?.length ? '<a href="#quiz">Kuis</a>' : ''}
                <a href="#lab">Lab lokal</a>
                <a href="#notes">Catatan</a>
                <a href="#resources">Sumber</a>
              </div>
            </nav>
          </aside>
        </div>
      </article>`;
  }

  function answerQuiz(option) {
    const question = option.closest('[data-quiz-question]');
    const quiz = option.closest('[data-quiz-module]');
    if (!question || !quiz || question.dataset.answered === '1') return;

    const module = (window.CYBER_MODULES || {})[quiz.dataset.quizModule];
    const item = module?.quiz?.[Number(question.dataset.quizQuestion)];
    if (!item) return;

    const chosen = Number(option.dataset.quizOption);
    question.dataset.answered = '1';
    question.dataset.correct = chosen === item.answer ? '1' : '0';

    question.querySelectorAll('[data-quiz-option]').forEach((button) => {
      button.disabled = true;
      if (Number(button.dataset.quizOption) === item.answer) button.classList.add('correct');
    });
    if (chosen !== item.answer) option.classList.add('wrong');

    const explanation = question.querySelector('.quiz-explain');
    if (explanation) explanation.hidden = false;

    updateQuiz(quiz, module);
  }

  function updateQuiz(quiz, module) {
    const questions = [...quiz.querySelectorAll('[data-quiz-question]')];
    const answered = questions.filter((question) => question.dataset.answered === '1').length;
    const correct = questions.filter((question) => question.dataset.correct === '1').length;
    const score = quiz.querySelector('[data-quiz-score]');
    if (score) score.textContent = `${correct}/${questions.length}`;

    if (answered !== questions.length) return;

    const result = state.recordQuiz(module.id, correct, questions.length);
    const best = quiz.querySelector('.quiz-best');
    if (best) best.textContent = `Terbaik: ${result.best}/${result.total}`;

    const box = quiz.querySelector('[data-quiz-result]');
    if (box) {
      box.hidden = false;
      box.innerHTML = `Kuis selesai: <strong>${correct}/${questions.length}</strong>. Skor terbaik: <strong>${result.best}/${result.total}</strong>. <button class="btn" type="button" data-quiz-retry>Ulangi kuis</button>`;
    }
  }

  function resetQuiz(quiz) {
    const questions = [...quiz.querySelectorAll('[data-quiz-question]')];
    questions.forEach((question) => {
      delete question.dataset.answered;
      delete question.dataset.correct;
      question.querySelectorAll('[data-quiz-option]').forEach((button) => {
        button.disabled = false;
        button.classList.remove('correct', 'wrong');
      });
      const explanation = question.querySelector('.quiz-explain');
      if (explanation) explanation.hidden = true;
    });

    const score = quiz.querySelector('[data-quiz-score]');
    if (score) score.textContent = `0/${questions.length}`;

    const box = quiz.querySelector('[data-quiz-result]');
    if (box) {
      box.hidden = true;
      box.innerHTML = '';
    }
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

  function statGrid(stats, readyCount) {
    return `
      <div class="stat-grid">
        <div class="stat"><div class="stat-value">${stats.modules}<small>/ ${readyCount}</small></div><div class="stat-label">modul selesai</div></div>
        <div class="stat"><div class="stat-value">${stats.quiz}<small>%</small></div><div class="stat-label">rata-rata kuis</div></div>
        <div class="stat"><div class="stat-value">${stats.terminal}</div><div class="stat-label">misi terminal</div></div>
        <div class="stat"><div class="stat-value">${stats.streak}<small>hari</small></div><div class="stat-label">streak</div></div>
      </div>`;
  }

  function renderDashboard() {
    const ready = moduleIndex().filter((module) => module.status === 'ready');
    const stats = state.stats();
    const next = ready.find((module) => !state.isModuleComplete(module.id)) || ready[0] || null;
    const nextDone = next ? state.isModuleComplete(next.id) : false;

    const continueCard = next
      ? `
        <div class="continue-card">
          <span class="continue-icon">${String(next.order).padStart(2, '0')}</span>
          <div class="continue-copy">
            <h2>${nextDone ? 'Ulangi modul' : 'Lanjutkan belajar'}</h2>
            <p>${escapeHtml(next.title)}</p>
            <p class="tiny muted">${escapeHtml(next.track)} · ${next.duration} menit</p>
          </div>
          <a class="btn btn-primary" href="#/module/${encodeURIComponent(next.id)}">${nextDone ? 'Buka lagi' : 'Mulai modul'}</a>
        </div>`
      : `
        <div class="empty">
          <h2>Belum ada modul siap</h2>
          <p>Konten sedang disiapkan. Roadmap dan katalog sudah bisa dilihat.</p>
        </div>`;

    return `
      ${pageHead(
        'Roadmap.sh → lab pribadi',
        'Belajar cyber security dari nol, dengan praktik.',
        'Roadmap, materi, kuis, simulator terminal, dan lab lokal dalam satu tempat. Situs statis, gratis, dan privat.'
      )}
      ${statGrid(stats, ready.length)}
      ${continueCard}
      <div class="card">
        <span class="eyebrow">Peta belajar</span>
        <h2 class="card-heading">202 topik, 12 bagian</h2>
        <p>Lihat seluruh roadmap atau langsung pilih modul yang sudah siap dibaca.</p>
        <p class="card-actions">
          <a class="btn" href="#/roadmap">Buka roadmap</a>
          <a class="btn" href="#/modules">Katalog modul</a>
          <a class="btn" href="#/progress">Lihat progres</a>
        </p>
      </div>`;
  }

  function renderProgress() {
    const modules = [...moduleIndex()].sort((a, b) => a.order - b.order);
    const stats = state.stats();
    const streak = state.get().streak;

    const rows = modules.map((module) => {
      const ready = module.status === 'ready';
      const done = state.isModuleComplete(module.id);
      const quiz = state.get().quiz[module.id];
      const terminal = state.get().terminal[module.id] || [];
      const note = state.getNote(module.id);
      const status = done ? 'selesai' : ready ? 'siap' : 'segera';
      const statusClass = done ? 'badge-green' : ready ? '' : 'badge-dim';

      return `
        <tr>
          <td>
            <div class="m-title">${escapeHtml(module.title)}</div>
            <div class="tiny muted">${escapeHtml(module.track)}</div>
          </td>
          <td><span class="badge ${statusClass}">${status}</span></td>
          <td>${quiz ? `${quiz.best}/${quiz.total}` : '—'}</td>
          <td>${terminal.length || '—'}</td>
          <td>${note ? 'ada' : '—'}</td>
          <td>${ready ? `<a href="#/module/${encodeURIComponent(module.id)}">Buka</a>` : '—'}</td>
        </tr>`;
    }).join('');

    return `
      ${pageHead(
        'Progres',
        'Progres belajar',
        'Semua data tersimpan di browser ini. Ekspor JSON untuk cadangan atau pindah perangkat.'
      )}
      ${statGrid(stats, modules.filter((module) => module.status === 'ready').length)}
      <div class="card">
        <span class="eyebrow">Cadangan</span>
        <h2 class="card-heading">Data & cadangan</h2>
        <p>Ekspor progres sebelum membersihkan browser atau pindah perangkat.</p>
        <p class="tiny muted">Streak: ${streak.count} hari · terakhir ${streak.last || '—'}</p>
        <p class="card-actions">
          <button class="btn" type="button" data-action="export-progress">Ekspor JSON</button>
          <label class="btn">Impor JSON<input type="file" accept="application/json" data-import hidden></label>
          <button class="btn" type="button" data-action="reset-progress">Reset progres</button>
        </p>
      </div>
      <div class="table-card">
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Modul</th><th>Status</th><th>Kuis</th><th>Terminal</th><th>Catatan</th><th>Aksi</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  }

  function exportProgress() {
    const blob = new Blob([JSON.stringify(state.exportState(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'labsiber-progress.json';
    anchor.hidden = true;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const pages = {
    dashboard() {
      return {
        title: 'Dashboard',
        html: renderDashboard()
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
        html: renderProgress()
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

  function updateNav(route) {
    const active = route.name === 'module' ? 'modules' : route.name;
    document.querySelectorAll('[data-nav]').forEach((link) => {
      link.classList.toggle('active', link.dataset.nav === active);
    });
  }

  function setPage(page, route) {
    view.innerHTML = page.html;
    document.title = `${page.title} — LabSiber`;
    updateNav(route);
    setSidebar(false);
    view.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  let renderToken = 0;

  async function render() {
    const token = ++renderToken;
    const route = parseRoute();

    if (route.name === 'module') {
      const meta = moduleIndex().find((module) => module.id === route.id);
      if (meta && meta.status !== 'ready') {
        setPage({
          title: meta.title,
          html: `
            ${pageHead('Materi', meta.title, 'Modul ini belum siap dibaca.')}
            <div class="empty">
              <h2>Konten segera hadir</h2>
              <p>Modul ini masih dalam antrean. Kembali ke katalog untuk melihat modul yang sudah siap.</p>
              <p><a href="#/modules">Kembali ke katalog</a></p>
            </div>`
        }, route);
        return;
      }
      updateNav(route);
      view.innerHTML = `
        ${pageHead('Materi', meta ? meta.title : 'Modul', 'Memuat modul…')}
        <div class="empty"><h2>Memuat…</h2></div>`;
      document.title = `${meta ? meta.title : 'Modul'} — LabSiber`;

      try {
        const module = await ensureModule(route.id);
        if (token !== renderToken) return;
        if (!module) {
          setPage(pages.notFound(), route);
          return;
        }
        setPage({ title: module.title, html: renderLesson(module) }, route);
      } catch {
        if (token !== renderToken) return;
        setPage({
          title: 'Gagal memuat modul',
          html: `
            ${pageHead('Materi', 'Gagal memuat modul', 'Periksa koneksi lalu coba lagi.')}
            <div class="empty">
              <h2>Modul tidak bisa dimuat</h2>
              <p><a href="#/module/${encodeURIComponent(route.id)}">Coba lagi</a> · <a href="#/modules">Kembali ke katalog</a></p>
            </div>`
        }, route);
      }
      return;
    }

    const page = pages[route.name] ? pages[route.name](route) : pages.notFound();
    setPage(page, route);
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
      case 'toggle-complete': {
        const id = trigger.dataset.module;
        if (id) {
          const done = state.setModuleComplete(id, !state.isModuleComplete(id));
          trigger.textContent = done ? 'Selesai ✓' : 'Tandai selesai';
          trigger.classList.toggle('btn-primary', done);
        }
        break;
      }
      case 'export-progress':
        exportProgress();
        break;
      case 'reset-progress':
        if (window.confirm('Hapus semua progres, catatan, dan skor kuis?')) {
          state.reset();
          applyTheme(state.get().theme);
          render();
        }
        break;
      default:
        break;
    }
  });

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-copy]');
    if (!button) return;
    const original = button.textContent;
    try {
      await navigator.clipboard.writeText(decodeURIComponent(button.dataset.copy));
      button.textContent = 'Tersalin';
    } catch {
      button.textContent = 'Gagal';
    }
    window.setTimeout(() => { button.textContent = original; }, 1500);
  });

  view.addEventListener('click', (event) => {
    const option = event.target.closest('[data-quiz-option]');
    if (option) {
      answerQuiz(option);
      return;
    }
    const retry = event.target.closest('[data-quiz-retry]');
    if (retry) resetQuiz(retry.closest('.quiz'));
  });

  let noteTimer = 0;
  view.addEventListener('input', (event) => {
    const textarea = event.target.closest('[data-note]');
    if (!textarea) return;
    const status = view.querySelector('[data-note-status]');
    if (status) status.textContent = 'Menyimpan…';
    window.clearTimeout(noteTimer);
    noteTimer = window.setTimeout(() => {
      state.setNote(textarea.dataset.note, textarea.value);
      if (status) status.textContent = 'Tersimpan';
    }, 500);
  });

  view.addEventListener('change', (event) => {
    const input = event.target.closest('[data-import]');
    if (!input || !input.files || !input.files[0]) return;
    input.files[0].text().then((text) => {
      if (state.importState(text)) {
        applyTheme(state.get().theme);
        render();
      } else {
        window.alert('File progres tidak valid atau versinya lebih baru.');
      }
    }).catch(() => window.alert('Gagal membaca file progres.'));
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
