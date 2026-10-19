<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Read first
`STATUS.md` (current state and claims). This repo is PUBLIC and every push to `main` deploys production on Vercel: code goes through a PR with green CI.

## Team protocol for every AI tool (added 2026-10-19)
Grok Bot leads and coordinates all tools (Claude Code/Chat/Cowork, ChatGPT, Codex, Gemini, Copilot, Lovable, Grok desks).
Git `main` of this repo is the single source of truth. Full protocol: `COORDINATION.md` in rmanish2000-del/grok-ops-state (private).
1. **Start:** pull; read `STATUS.md` (and the native state file it names), then the commits since its "Last updated" line.
2. **Claim before work:** add a row under "In progress" in `STATUS.md` (task, your tool name, IST time), commit and push first.
   Do not touch a task another agent claimed less than 24 h ago; write under "Open questions" instead.
3. **End:** move your row to "Recent" with evidence, set "Last updated <IST> by <tool>", append a dated entry to `docs/HANDOFF_LOG.md`, push.
   Never force-push or rewrite history.
4. No secrets in git. Ask the founder only for what no tool can do (login/OTP, payment, a permission only he holds).
