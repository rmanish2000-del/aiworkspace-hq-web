# AIWHQ-CODEX-BTFDR-005 — Warrant product surfaces

Date: 2026-08-08

## Canonical evidence

- Warrant: `rmanish2000-del/warrant`, `main` at
  `66ec858bfd81149c46395ef42e32a4a192938d64`.
- Warrant MCP: `rmanish2000-del/warrant-mcp`, `main` at
  `eea5496de1cc867552ff8fe51f55503dd90a7809`.
- HQ baseline: `rmanish2000-del/aiworkspace-hq-web`, `main` at
  `0370a613be92cf4b2e108d8a691bee55cf0efd1c`.

Repository evidence overrides the assignment wording.

## Claim inventory

### Verified now — Warrant

- Plain-English spending policy is compiled into numbered clauses; ambiguity is
  shown for human resolution and the confirmed mandate is evaluated by
  deterministic code.
- Runtime verdicts are `ALLOW`, `ESCALATE` or `DENY` with a governing-clause
  citation.
- A `DENY` makes zero outbound provider calls. The human-approved escalation
  path can open a Prava sandbox session.
- Decisions append to a hash-chained record. The chain is tamper-evident.
- Keyless tests, five headless scenarios and a local operator console are
  documented in the canonical README.

### Limitations — Warrant

- Payment interaction is sandbox-only.
- The console is local, single-operator and demo-grade.
- The `ALLOW` path is not wired to the provider.
- Spend counts at approval; expired-hold reconciliation is not built.
- The record is not signed and does not claim non-repudiation.

### Verified now — Warrant MCP

- Plain-English policy is compiled once into numbered clauses backed by eight
  closed structured rule types.
- Deterministic code evaluates supported actions as `ALLOW` or `DENY` and fails
  closed on malformed or missing policy input.
- A Claude Code `PreToolUse` hook gives `DENY` binding effect for mapped Claude
  Code tool calls.
- `check_action` exposes an advisory MCP check for three action kinds.
- `SPEC.md` 0.1.0 and a 76-case language-agnostic corpus define and verify the
  format boundary.
- A local JSONL decision record and self-contained offline HTML report exist.

### Limitations — Warrant MCP

- It is a policy layer, not a sandbox.
- Binding enforcement is Claude Code-specific; other MCP hosts receive advice.
- Glob and variable expansion, obfuscation, symlinks, implicit targets,
  unmapped tools, editable hook configuration and time-of-check/time-of-use
  gaps remain open.
- The local record is append-only by convention, not enforced. It has no hash,
  chain or signature and is evidence rather than proof.

### Experimental or demonstration-only

- Warrant's Prava interaction and operator journey.
- The Warrant MCP self-attack evidence covers one repository and one operating
  environment; it is not generalized proof for other hosts.

### Future or strategic — not claimed as current

- Shared runtime infrastructure between Warrant and Warrant MCP.
- AI Workspace runtime integration.
- Arbitrary SaaS or MCP-host enforcement.
- Real-money payment operation, signed records or non-repudiation.

## Authorized portfolio wording

Warrant is commerce-specific authorization for AI purchasing agents. Warrant
MCP is deterministic policy enforcement for supported AI-agent actions and tool
calls. Both turn human policy into machine-enforceable structure and keep the
runtime decision in deterministic code. This is a shared thesis, not evidence
of a shared product runtime.
