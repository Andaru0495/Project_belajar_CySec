(() => {
  'use strict';

  const STORAGE_KEY = 'labsiber.v1';
  const VERSION = 1;

  const defaults = () => ({
    version: VERSION,
    completedModules: [],
    quiz: {},
    terminal: {},
    roadmap: [],
    notes: {},
    bookmarks: [],
    history: [],
    streak: { last: null, count: 0, best: 0, days: [] },
    theme: null,
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  const uniqueStrings = (value) => Array.isArray(value)
    ? [...new Set(value.filter((item) => typeof item === 'string'))]
    : [];

  const objectMap = (value) => value && typeof value === 'object' && !Array.isArray(value) ? value : {};

  const todayKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const dayKey = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  function normalize(raw) {
    const base = defaults();
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return base;

    const state = { ...base, ...raw };
    state.version = VERSION;
    state.completedModules = uniqueStrings(state.completedModules);
    state.roadmap = uniqueStrings(state.roadmap);
    state.bookmarks = uniqueStrings(state.bookmarks);
    state.notes = objectMap(state.notes);
    state.quiz = objectMap(state.quiz);
    state.terminal = objectMap(state.terminal);
    state.history = Array.isArray(state.history) ? state.history.slice(-50) : [];
    state.streak = {
      last: typeof state.streak?.last === 'string' ? state.streak.last : null,
      count: Number.isFinite(state.streak?.count) ? state.streak.count : 0,
      best: Number.isFinite(state.streak?.best) ? state.streak.best : 0,
      days: uniqueStrings(state.streak?.days).slice(-30)
    };
    state.theme = state.theme === 'light' || state.theme === 'dark' ? state.theme : null;
    state.createdAt = Number.isFinite(state.createdAt) ? state.createdAt : Date.now();
    state.updatedAt = Number.isFinite(state.updatedAt) ? state.updatedAt : Date.now();

    for (const [id, note] of Object.entries(state.notes)) {
      if (typeof note !== 'string') delete state.notes[id];
    }
    for (const [id, result] of Object.entries(state.quiz)) {
      if (!result || typeof result !== 'object') {
        delete state.quiz[id];
        continue;
      }
      state.quiz[id] = {
        best: Number.isFinite(result.best) ? result.best : 0,
        total: Number.isFinite(result.total) ? result.total : 0,
        at: Number.isFinite(result.at) ? result.at : Date.now()
      };
    }
    for (const [id, done] of Object.entries(state.terminal)) {
      state.terminal[id] = uniqueStrings(done);
    }
    return state;
  }

  function read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? normalize(JSON.parse(raw)) : defaults();
    } catch {
      return defaults();
    }
  }

  let state = read();

  function save() {
    state.updatedAt = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }

  function touchStreak() {
    const today = todayKey();
    if (state.streak.last === today) return;
    const yesterday = dayKey(-1);
    state.streak.count = state.streak.last === yesterday ? state.streak.count + 1 : 1;
    state.streak.last = today;
    state.streak.best = Math.max(state.streak.best, state.streak.count);
    if (!state.streak.days.includes(today)) state.streak.days.push(today);
    state.streak.days = state.streak.days.slice(-30);
    save();
  }

  function isModuleComplete(id) {
    return state.completedModules.includes(id);
  }

  function setModuleComplete(id, done) {
    const set = new Set(state.completedModules);
    if (done) set.add(id);
    else set.delete(id);
    state.completedModules = [...set];
    if (done) {
      state.history.push({ moduleId: id, at: Date.now() });
      state.history = state.history.slice(-50);
    }
    save();
    return done;
  }

  function getNote(id) {
    return typeof state.notes[id] === 'string' ? state.notes[id] : '';
  }

  function setNote(id, text) {
    if (typeof text !== 'string' || !text.trim()) delete state.notes[id];
    else state.notes[id] = text;
    save();
  }

  function recordQuiz(id, best, total) {
    const previous = state.quiz[id];
    const result = {
      best: Math.max(Number.isFinite(previous?.best) ? previous.best : 0, Number.isFinite(best) ? best : 0),
      total: Number.isFinite(total) ? total : 0,
      at: Date.now()
    };
    state.quiz[id] = result;
    save();
    return result;
  }

  function isTerminalDone(moduleId, challengeId) {
    return Array.isArray(state.terminal[moduleId]) && state.terminal[moduleId].includes(challengeId);
  }

  function markTerminalDone(moduleId, challengeId) {
    const done = new Set(state.terminal[moduleId] || []);
    done.add(challengeId);
    state.terminal[moduleId] = [...done];
    save();
  }

  function isRoadmapDone(id) {
    return state.roadmap.includes(id);
  }

  function setRoadmapDone(id, done) {
    const set = new Set(state.roadmap);
    if (done) set.add(id);
    else set.delete(id);
    state.roadmap = [...set];
    save();
    return done;
  }

  function setTheme(theme) {
    state.theme = theme === 'light' || theme === 'dark' ? theme : null;
    save();
  }

  function exportState() {
    return JSON.parse(JSON.stringify(state));
  }

  function importState(raw) {
    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (!parsed || typeof parsed !== 'object') return false;
      if (Number.isFinite(parsed.version) && parsed.version > VERSION) return false;
      state = normalize(parsed);
      save();
      return true;
    } catch {
      return false;
    }
  }

  function reset() {
    state = defaults();
    save();
    return state;
  }

  function stats() {
    const quizTotals = Object.values(state.quiz);
    const quizBest = quizTotals.reduce((sum, item) => sum + (item.best || 0), 0);
    const quizPossible = quizTotals.reduce((sum, item) => sum + (item.total || 0), 0);
    const terminal = Object.values(state.terminal).reduce((sum, list) => sum + list.length, 0);
    return {
      modules: state.completedModules.length,
      quiz: quizPossible ? Math.round((quizBest / quizPossible) * 100) : 0,
      terminal,
      streak: state.streak.count
    };
  }

  touchStreak();

  window.CyberState = {
    get: () => state,
    save,
    touchStreak,
    stats,
    isModuleComplete,
    setModuleComplete,
    getNote,
    setNote,
    recordQuiz,
    isTerminalDone,
    markTerminalDone,
    isRoadmapDone,
    setRoadmapDone,
    setTheme,
    exportState,
    importState,
    reset
  };
})();
