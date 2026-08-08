# AIWHQ-CODEX-BTFDR-004 — Knowledge Workspace V1 HQ synchronization

Date: 2026-08-08

## Verified product evidence

AIW-CODEX-BTFDR-011 completed and verified Knowledge Workspace V1 at AIW
commit `4a46c0daf1a4deef28f074cc83d7fd242e15925a`.

The verified source path is a read-only, root-confined local-filesystem
connector. It supports governed source registration, ingestion, idempotent
refresh, changed-content detection, malformed-file isolation, scoped
Organization/Workspace/Project retrieval, deterministic search and ranking,
mandatory exact provenance, source status and refresh/disable UI operations,
and the reusable governed context API `aiw.governed_context/v1`.

Verification also covered tenant and project isolation, approved-root
enforcement, disabled-source exclusion, and host-path redaction. Focused,
dashboard/HTTP, and full regression checks passed, and the real lifecycle was
run from registration through changed-content refresh and updated retrieval.

## Authorized public claim

> AI Workspace can ingest governed organizational knowledge from an approved
> source and retrieve scoped context with exact source provenance.

This claim does not assert arbitrary SaaS connectivity, Google Drive or Slack
connectors, semantic or vector retrieval, an enterprise-wide knowledge graph,
autonomous reasoning, production customer use, or unrestricted filesystem
access.
