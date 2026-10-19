# CLAUDE.md: aiworkspace-hq-web

Claude Code reads this file automatically. Also read `AGENTS.md` (repo rules) before working.

## Team protocol for every AI tool (added 2026-10-19)
Grok Bot leads and coordinates all tools (Claude Code/Chat/Cowork, ChatGPT, Codex, Gemini, Copilot, Lovable, Grok desks).
Git `main` of this repo is the single source of truth. Full protocol: `COORDINATION.md` in rmanish2000-del/grok-ops-state (private).
1. **Start:** pull; read `STATUS.md` (and the native state file it names), then the commits since its "Last updated" line.
2. **Claim before work:** add a row under "In progress" in `STATUS.md` (task, your tool name, IST time), commit and push first.
   Do not touch a task another agent claimed less than 24 h ago; write under "Open questions" instead.
3. **End:** move your row to "Recent" with evidence, set "Last updated <IST> by <tool>", append a dated entry to `docs/HANDOFF_LOG.md`, push.
   Never force-push or rewrite history.
4. No secrets in git. Ask the founder only for what no tool can do (login/OTP, payment, a permission only he holds).
5. PUBLIC repo with production auto-deploy: no private data, code only through a PR with green CI.
