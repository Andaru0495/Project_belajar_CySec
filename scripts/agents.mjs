#!/usr/bin/env node
/**
 * LabSiber agent task handler.
 * Loads role rules + task briefs, validates the registry, and prints
 * context a coding agent must read before starting work.
 */
import { roles, roleById } from '../agents/roles.mjs';
import { tasks, taskById } from '../agents/tasks/index.mjs';

const STATUSES = new Set(['done', 'in-progress', 'todo', 'blocked']);
const PRIORITIES = new Set(['P0', 'P1', 'P2']);
const SIZES = new Set(['S', 'M', 'L']);

function parseArgv(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

const { positional, flags } = parseArgv(process.argv.slice(2));
const command = positional[0] || 'help';

function list(items) {
  for (const item of items) console.log(`  - ${item}`);
}

function printRoles() {
  for (const role of roles) {
    console.log(`\n${role.id} — ${role.title} (${role.type})`);
    console.log(`  Mission: ${role.mission}`);
    console.log('  Owns:');
    list(role.owns);
    console.log('  Rules:');
    list(role.rules);
    console.log(`  Charter: ${role.charter}`);
  }
  console.log(`\n${roles.length} role terdaftar.`);
}

function printBoard(roleFilter, statusFilter) {
  let selected = tasks;
  if (roleFilter) selected = selected.filter((task) => task.role === roleFilter);
  if (statusFilter) selected = selected.filter((task) => task.status === statusFilter);
  selected = [...selected].sort((a, b) => a.priority.localeCompare(b.priority) || a.id.localeCompare(b.id));

  if (!selected.length) {
    console.log('Tidak ada task yang cocok.');
    return;
  }

  console.table(selected.map((task) => ({
    ID: task.id,
    Status: task.status,
    Priority: task.priority,
    Role: task.role,
    PR: task.pr,
    Title: task.title
  })));

  const summary = selected.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});
  console.log('Ringkasan:', summary, `total=${selected.length}`);
}

function printTask(id) {
  const task = taskById[id];
  if (!task) {
    console.error(`Task "${id}" tidak ditemukan.`);
    process.exitCode = 1;
    return;
  }
  const role = roleById[task.role];
  if (!role) {
    console.error(`Role "${task.role}" untuk ${id} tidak ditemukan.`);
    process.exitCode = 1;
    return;
  }

  console.log(`\n${task.id} — ${task.title}`);
  console.log('='.repeat(Math.min(72, task.id.length + task.title.length + 3)));
  console.log(`Role       : ${role.id} — ${role.title}`);
  console.log(`Reviewers  : ${task.reviewers.join(', ')}`);
  console.log(`Status     : ${task.status}`);
  console.log(`Priority   : ${task.priority} | Size: ${task.size} | PR: ${task.pr}`);
  console.log(`Depends on : ${task.dependsOn.length ? task.dependsOn.join(', ') : '—'}`);

  const pending = task.dependsOn.filter((dep) => taskById[dep]?.status !== 'done');
  if (pending.length) {
    console.log(`WARNING    : dependency belum done → ${pending.join(', ')}`);
  }

  console.log('\nFiles yang boleh disentuh:');
  list(task.files);
  console.log('\nContext:');
  console.log(`  ${task.context}`);
  console.log('\nDeliverables:');
  list(task.deliverables);
  console.log('\nAcceptance:');
  task.acceptance.forEach((item) => console.log(`  [ ] ${item}`));
  console.log('\nVerification:');
  list(task.verification);
  console.log('\nOut of scope:');
  list(task.outOfScope);
  console.log('\nHandoff wajib:');
  list(task.handoff);
  if (task.risk) {
    console.log('\nRisk:');
    console.log(`  ${task.risk}`);
  }

  console.log(`\nRole rules (${role.id}):`);
  list(role.rules);
  console.log('\nRole checks:');
  list(role.checks);
  console.log(`\nCharter: ${role.charter}`);
  console.log('\nSebelum mulai: baca file target, cek dependency, lalu ubah status ke in-progress.');
}

function printNext(roleFilter) {
  let candidates = tasks.filter((task) => task.status === 'todo');
  if (roleFilter) candidates = candidates.filter((task) => task.role === roleFilter);

  const ready = candidates.filter((task) =>
    task.dependsOn.every((dep) => taskById[dep]?.status === 'done')
  );
  const blocked = candidates.filter((task) =>
    task.dependsOn.some((dep) => taskById[dep]?.status !== 'done')
  );

  console.log('Task siap dikerjakan:');
  if (!ready.length) {
    console.log('  (tidak ada)');
  } else {
    console.table(ready.map((task) => ({
      ID: task.id,
      Priority: task.priority,
      Role: task.role,
      PR: task.pr,
      Title: task.title
    })));
  }

  if (blocked.length) {
    console.log('\nTask tertahan:');
    for (const task of blocked) {
      const waiting = task.dependsOn.filter((dep) => taskById[dep]?.status !== 'done');
      console.log(`  ${task.id} menunggu ${waiting.join(', ')}`);
    }
  }
}

function printGraph() {
  console.log('flowchart TD');
  for (const task of tasks) {
    const node = task.id.replace(/-/g, '_');
    const title = task.title.replace(/"/g, "'");
    console.log(`  ${node}["${task.id} ${title}"]`);
    for (const dep of task.dependsOn) {
      console.log(`  ${dep.replace(/-/g, '_')} --> ${node}`);
    }
  }
}

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function checkRegistry() {
  const errors = [];
  const warnings = [];
  const roleIds = new Set();
  const taskIds = new Set();

  for (const role of roles) {
    const at = `role(${role?.id || '?'})`;
    if (!isPlainObject(role)) {
      errors.push('role bukan object');
      continue;
    }
    for (const field of ['id', 'title', 'type', 'mission', 'charter']) {
      if (typeof role[field] !== 'string' || !role[field].trim()) {
        errors.push(`${at}.${field}: wajib string tidak kosong`);
      }
    }
    if (!['human', 'agent'].includes(role.type)) errors.push(`${at}.type: harus human/agent`);
    for (const field of ['owns', 'doesNotOwn', 'inputs', 'outputs', 'rules', 'checks', 'handoff', 'escalation']) {
      if (!Array.isArray(role[field]) || role[field].length === 0) {
        errors.push(`${at}.${field}: wajib array tidak kosong`);
      }
    }
    if (role.id) {
      if (roleIds.has(role.id)) errors.push(`${at}: id role duplikat`);
      roleIds.add(role.id);
    }
  }

  for (const task of tasks) {
    const at = `task(${task?.id || '?'})`;
    if (!isPlainObject(task)) {
      errors.push('task bukan object');
      continue;
    }
    for (const field of ['id', 'title', 'role', 'status', 'priority', 'size', 'pr', 'context']) {
      if (typeof task[field] !== 'string' || !task[field].trim()) {
        errors.push(`${at}.${field}: wajib string tidak kosong`);
      }
    }
    if (task.id) {
      if (taskIds.has(task.id)) errors.push(`${at}: id task duplikat`);
      taskIds.add(task.id);
    }
    if (!roleIds.has(task.role)) errors.push(`${at}.role: "${task.role}" tidak dikenal`);
    if (!STATUSES.has(task.status)) errors.push(`${at}.status: "${task.status}" tidak valid`);
    if (!PRIORITIES.has(task.priority)) errors.push(`${at}.priority: "${task.priority}" tidak valid`);
    if (!SIZES.has(task.size)) errors.push(`${at}.size: "${task.size}" tidak valid`);
    if (!Array.isArray(task.reviewers) || task.reviewers.length === 0) {
      errors.push(`${at}.reviewers: wajib array tidak kosong`);
    } else {
      for (const reviewer of task.reviewers) {
        if (!roleIds.has(reviewer)) errors.push(`${at}.reviewers: "${reviewer}" tidak dikenal`);
      }
    }
    if (!Array.isArray(task.dependsOn)) {
      errors.push(`${at}.dependsOn: wajib array`);
    } else {
      for (const dep of task.dependsOn) {
        if (!taskById[dep]) errors.push(`${at}.dependsOn: "${dep}" tidak ada`);
        if (dep === task.id) errors.push(`${at}.dependsOn: tidak boleh bergantung pada diri sendiri`);
      }
    }
    for (const field of ['files', 'deliverables', 'acceptance', 'verification', 'outOfScope', 'handoff']) {
      if (!Array.isArray(task[field]) || task[field].length === 0) {
        errors.push(`${at}.${field}: wajib array tidak kosong`);
      }
    }
    if (Array.isArray(task.files)) {
      for (const file of task.files) {
        if (typeof file !== 'string' || !file.trim()) errors.push(`${at}.files: path kosong`);
        if (file.startsWith('/') || file.includes('..')) errors.push(`${at}.files: path tidak boleh absolut/.. → ${file}`);
      }
    }
    if (task.status === 'done' && !task.pr) errors.push(`${at}: status done wajib punya PR`);
  }

  // Cycles (edges: task -> dependency).
  const color = new Map();
  const reported = new Set();
  function visit(id, stack) {
    const state = color.get(id) || 0;
    if (state === 1) {
      const cycle = [...stack.slice(stack.indexOf(id)), id].join(' → ');
      if (!reported.has(cycle)) {
        errors.push(`dependency cycle: ${cycle}`);
        reported.add(cycle);
      }
      return;
    }
    if (state === 2) return;
    color.set(id, 1);
    stack.push(id);
    for (const dep of taskById[id]?.dependsOn || []) {
      if (taskById[dep]) visit(dep, stack);
    }
    stack.pop();
    color.set(id, 2);
  }
  for (const task of tasks) visit(task.id, []);

  // Done tasks must have done dependencies.
  for (const task of tasks) {
    if (task.status !== 'done') continue;
    const pending = task.dependsOn.filter((dep) => taskById[dep]?.status !== 'done');
    if (pending.length) errors.push(`${task.id}: done tetapi dependency belum done → ${pending.join(', ')}`);
  }

  // In-progress tasks should not wait on todo dependencies.
  for (const task of tasks) {
    if (task.status !== 'in-progress') continue;
    const pending = task.dependsOn.filter((dep) => taskById[dep]?.status === 'todo' || taskById[dep]?.status === 'blocked');
    if (pending.length) warnings.push(`${task.id}: in-progress tetapi menunggu ${pending.join(', ')}`);
  }

  const counts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  console.log('Agent registry check');
  console.log('====================');
  console.log(`Roles: ${roles.length}`);
  console.log(`Tasks: ${tasks.length}`, counts);
  for (const warning of warnings) console.log('WARN  ' + warning);
  for (const error of errors) console.log('ERROR ' + error);

  if (errors.length) {
    console.log(`\nFAILED: ${errors.length} error, ${warnings.length} warning.`);
    process.exitCode = 1;
  } else {
    console.log(`\nOK: 0 error, ${warnings.length} warning.`);
  }
}

function printHelp() {
  console.log(`LabSiber agent handler

Usage:
  node scripts/agents.mjs roles
  node scripts/agents.mjs board [--role <id>] [--status <status>]
  node scripts/agents.mjs task <T-ID>
  node scripts/agents.mjs next [--role <id>]
  node scripts/agents.mjs graph
  node scripts/agents.mjs check

Roles:  ${roles.map((role) => role.id).join(', ')}
Status: ${[...STATUSES].join(', ')}
`);
}

switch (command) {
  case 'roles':
    printRoles();
    break;
  case 'board':
    printBoard(flags.role, flags.status);
    break;
  case 'task': {
    const id = positional[1];
    if (!id) {
      console.error('Gunakan: node scripts/agents.mjs task <T-ID>');
      process.exitCode = 1;
    } else {
      printTask(id);
    }
    break;
  }
  case 'next':
    printNext(flags.role);
    break;
  case 'graph':
    printGraph();
    break;
  case 'check':
    checkRegistry();
    break;
  case 'help':
  case '--help':
  case '-h':
    printHelp();
    break;
  default:
    console.error(`Perintah tidak dikenal: ${command}`);
    printHelp();
    process.exitCode = 1;
}
