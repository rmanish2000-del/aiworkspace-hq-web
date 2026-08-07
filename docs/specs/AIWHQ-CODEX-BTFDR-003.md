# AIWHQ-CODEX-BTFDR-003 — Governed execution activation HQ synchronization

Date: 2026-08-07

## Verified product evidence

AIW-CODEX-BTFDR-006 completed and verified the following product path at commit
`cc8b08f20db1240ac2246d27c85ba313621119f6`:

Routed Assignment → governed lease issuance → accountable Executor activation →
Attempt and lease visibility in the Assignment dossier and Agent Workspace →
expiry, termination, refusal, and audit controls.

The implementation uses the canonical Attempt and lease model. An organization
owner may issue the governed lease, while only the accountable Executor may
activate execution using its valid fencing token. Invalid lifecycle activation,
unauthorized and cross-tenant requests, stale fencing tokens, conflicting
idempotency keys, expiry, and termination fail closed under the existing domain
rules. Focused tests passed 207/207, dashboard tests passed 65/65, full regression
passed 787/787, and the lifecycle demo and served-dashboard runtime flow passed.

## Authorized public claim

> A properly routed Assignment can now enter governed execution through an
> accountable Attempt and a time-bounded fenced lease issued to its Executor.
> Assignment and Agent surfaces expose the execution and lease state; invalid,
> stale, or unauthorized activation fails closed, and relevant lifecycle events
> remain auditable.

This is the complete authorized product claim for this synchronization. It does
not assert that an AI agent performed the assigned task, autonomous completion,
result generation or acceptance, production deployment, customer usage,
integrations, pricing, performance, or any capability beyond BTFDR-006.
