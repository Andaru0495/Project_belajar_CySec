# Agents — Role & Task Registry

Folder ini adalah **handler modular** untuk coding agent. Setiap file
`tasks/<role>.mjs` adalah handler task untuk role tersebut: berisi task mandiri
dengan scope, acceptance, verification, dan handoff. `scripts/agents.mjs`
menggabungkan handler itu dengan role charter dan menampilkannya sebagai brief
yang wajib dibaca agent.

- Operating model: [docs/AGENT_OPERATING_MODEL.md](../docs/AGENT_OPERATING_MODEL.md)
- Role charter: [docs/AGENT_ROLES.md](../docs/AGENT_ROLES.md)
- PR plan: [docs/PR_PLAN.md](../docs/PR_PLAN.md)

## Struktur

```text
agents/
├── roles.mjs              # registry role + aturan ringkas
├── tasks/
│   ├── index.mjs          # agregator + taskById
│   ├── tech-lead.mjs      # T-001
│   ├── devops.mjs         # T-002, T-020
│   ├── frontend.mjs       # T-003, T-005, T-006, T-007, T-009, T-010, T-018, T-019
│   ├── data-platform.mjs  # T-004, T-008
│   ├── content.mjs        # T-011 … T-017
│   ├── accessibility.mjs  # T-021
│   ├── security.mjs       # T-022
│   ├── qa.mjs             # T-023
│   └── technical-writer.mjs # T-024
└── README.md
```

## CLI

```bash
# daftar role + aturan ringkas
node scripts/agents.mjs roles

# papan task
node scripts/agents.mjs board
node scripts/agents.mjs board --role frontend
node scripts/agents.mjs board --status todo

# brief lengkap + aturan role
node scripts/agents.mjs task T-006

# task berikutnya yang dependency-nya sudah selesai
node scripts/agents.mjs next --role frontend

# validasi registry (CI)
node scripts/agents.mjs check

# graph dependency
node scripts/agents.mjs graph
```

## Aturan claim task

1. Umumkan: `Role: frontend | Task: T-003`.
2. Jalankan `node scripts/agents.mjs task T-003`.
3. Baca role charter di `docs/AGENT_ROLES.md`.
4. Cek dependency sudah `done`.
5. Ubah status task menjadi `in-progress` di file task.
6. Kerjakan hanya file yang tercantum di `files`.
7. Jalankan `verification`.
8. Tulis handoff dan buka PR.
9. Setelah merged + review, ubah status ke `done`.

## Menambah task

Tambahkan object baru ke file task sesuai owner role. Field wajib ada di
[docs/AGENT_OPERATING_MODEL.md](../docs/AGENT_OPERATING_MODEL.md#4-kontrak-task).
Lalu jalankan:

```bash
node scripts/agents.mjs check
```
