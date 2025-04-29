Global Instructions for Coder Agents
Read PRD.md and FEATHER_INSTRUCTIONS.md first; they are the source of truth.

Write strictly-typed TypeScript. Keep files in the existing pnpm workspace layout:
• backend → apps/api/src/**
• frontend → apps/web/src/**
• shared → packages/shared-types/**

All HTTP calls must go through the helper in packages/shared-types/feather-stub.ts.

Quality gates (must pass before each commit):
• pnpm lint → zero ESLint / Prettier warnings
• pnpm test → ≥ 80 % line coverage (Vitest)
• pnpm build succeeds for both apps



Commit style: conventional messages (feat:, fix:, chore:). Run tests before pushing.

Ask clarifying questions before changing DB schema or deleting files; otherwise proceed autonomously.

After large changes, update the PRD addendum in for_claude/ so future agents stay in sync.