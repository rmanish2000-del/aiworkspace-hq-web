# ROUTE_CONTENT_CONTRACTS.md

**Document ID:** `AWHQ-CONTENT-HQ10-CONTRACTS`
**Version:** 1.0 · **Date:** 27 July 2026 · **Owner:** AI Workspace HQ
**Status:** Implementation-ready content contracts. **⛔ Not published. No visual design.**

> **A content contract tells an implementation team exactly which sentence goes in which slot, what makes it true, and what would make it false.** It contains no instruction about how anything looks.
>
> **⛔ Every factual block below binds to a claim id or states an explicit non-claim basis.** A block with neither fails the build.

---

# HOW TO READ A CONTRACT

| Column | Meaning |
| --- | --- |
| **Block** | Stable id. **Copy is referenced by id, never by quotation** |
| **Slot** | Where it goes. **Not how it looks** |
| **Kind** | headline · subheadline · section · proof · limitation · cta · disclosure · footnote · navigational |
| **Claim** | The ledger entry that makes it true |
| **Tier → tense** | ⛔ Verified → present · Approved direction → present continuous · Under design → intent · Future vision → never published |
| **Copy** | The sentence, as it would appear |

**⚠ Review date on every factual block: 2026-10-25. Owner: AI Workspace HQ.**

---

# ROUTE `/` — Landing

| | |
| --- | --- |
| **Purpose** | Say what this is, who it is for, and what is not built. |
| **State** | **BUILDABLE — gated** |
| **Gate** | Gate 3 CLAIM |
| **Claim coverage** | **4 Verified** — IA-1 satisfied |
| **Blocks** | 7, of which 4 factual |
| **Navigation** | Primary |

| Block | Slot | Kind | Claim | Tier → tense | Copy | Note |
| --- | --- | --- | --- | --- | --- | --- |
| `CB-01` | headline | headline | `CL-26` | Approved direction → present continuous | **We are building an enterprise AI operating layer.** | ⚠ Present CONTINUOUS, because CL-26 is Approved direction — not Verified. And it is conditional on POS-1, an open reserved decision. |
| `CB-02` | subheadline | subheadline | `CL-12` | Under design → intent | **It is designed to work with the systems an organisation already runs, rather than replace them.** | ⚠ "is designed to" — the Under-design tense. Present tense here would be an invented feature. |
| `CB-03` | status | limitation | `CL-01` | Verified → present | **AI Workspace is in development. Early access is not yet open.** | ⛔ BINDING COMMITMENT C-11, verbatim from approved copy. It must remain operationally true. |
| `CB-04` | gap-link | cta | `CL-11` | Verified → present | **Read what we have not built.** | ⛔ ABOVE THE FOLD — LP-1. Burying it makes disclosure a concession instead of a position. |
| `CB-05` | method-link | navigational | — *(navigational)* | — | **See what we run on, and why we chose it.** | Navigational. No factual assertion, so no claim binding required. |
| `CB-06` | ai-disclosure | disclosure | `CL-16` | Verified → present | **This site is drafted with AI assistance and reviewed by a person before anything is published.** | ⚠ A line and a link, never a banner. AD-5. |
| `CB-07` | cta | cta | `CL-02` | Verified → present | **If you want to hear when early access opens, leave an email address. We will only contact you about AI Workspace early access.** | ⛔ The ONLY action on the site. The second sentence is binding commitment C-12. |


# ROUTE `/trust` — Trust

| | |
| --- | --- |
| **Purpose** | What we can be held to, and what we cannot. |
| **State** | **BUILDABLE — gated** |
| **Gate** | Gate 3 CLAIM |
| **Claim coverage** | **8 Verified** — IA-1 satisfied |
| **Blocks** | 13, of which 13 factual |
| **Navigation** | Primary |

| Block | Slot | Kind | Claim | Tier → tense | Copy | Note |
| --- | --- | --- | --- | --- | --- | --- |
| `CB-10` | headline | headline | `CL-11` | Verified → present | **What we can be held to, and what we cannot.** | TR-1: the page opens with what is missing. |
| `CB-11` | subheadline | subheadline | `CL-11` | Verified → present | **Everything below is either something we can show you, or something we are telling you we do not have.** | Sets the binary the rest of the page keeps. |
| `CB-12` | missing-1 | limitation | `CL-20` | Verified → present | **We hold no third-party security certification, and none is in progress.** | ⚠ "certification" not "certified" — the adjective is the claim, the noun in a denial is a fact. COPY-4. |
| `CB-13` | missing-2 | limitation | `CL-31` | Verified → present | **We do not offer single sign-on.** | — |
| `CB-14` | missing-3 | limitation | `CL-32` | Verified → present | **We do not offer an uptime commitment.** | — |
| `CB-15` | missing-4 | limitation | `CL-33` | Verified → present | **We do not yet publish a process for reporting a security flaw to us.** | ⛔ SP-3 — until this exists, no security claim may be made anywhere on the site. |
| `CB-16` | method-1 | proof | `CL-10` | Verified → present | **Before anything reaches production we verify it. That check has so far caught eleven material defects, including a hosting tier whose licence prohibited commercial use.** | ⚠ The COUNT is publishable; the defect list is not. The named example is CL-08, publishable in full. |
| `CB-17` | method-2 | proof | `CL-09` | Verified → present | **Architecture decisions are recorded with their reasoning at the time they are made.** | — |
| `CB-18` | ai-1 | disclosure | `CL-16` | Verified → present | **Our written material is drafted with AI assistance and reviewed by a person before publication.** | — |
| `CB-19` | ai-2 | disclosure | `CL-17` | Verified → present | **We integrate no third-party AI model provider in the product today.** | ⚠ A negative claim with a shelf life — AD-2. It carries a review date and is re-checked quarterly. |
| `CB-20` | ai-3 | disclosure | `CL-18` | Verified → present | **Where a decision is not ours to automate, a person makes it.** | — |
| `CB-21` | cookies | disclosure | `CL-03` | Verified → present | **We do not use tracking cookies on this site.** | ⛔ BINDING COMMITMENT C-13 — AND UNVERIFIED. This block MUST NOT SHIP until the Turnstile test is run. |
| `CB-22` | footnote | footnote | *basis:* Publication process — COPY-6 quarterly review cadence. A pro | — | **Last reviewed 25 October 2026.** | ⚠ Placeholder date shown as the review anchor. GR-2 — every evidence page carries one. |


# ROUTE `/technology` — Technology

| | |
| --- | --- |
| **Purpose** | What we run on, why, and what happens if it is wrong. |
| **State** | **BUILDABLE — gated** |
| **Gate** | Gate 3 CLAIM |
| **Claim coverage** | **5 Verified** — IA-1 satisfied |
| **Blocks** | 9, of which 9 factual |
| **Navigation** | Primary |

| Block | Slot | Kind | Claim | Tier → tense | Copy | Note |
| --- | --- | --- | --- | --- | --- | --- |
| `CB-30` | headline | headline | `CL-05` | Verified → present | **What we run on, and what happens if we are wrong about it.** | — |
| `CB-31` | subheadline | subheadline | `CL-07` | Verified → present | **Every component below is open source or an open standard. You could run all of it without us.** | ⚠ Verifiable by inspection — the reader can check it without trusting us. |
| `CB-32` | lead | proof | `CL-06` | Verified → present | **When we adopted our current runtime we wrote down the conditions under which we would replace it. That exit strategy was recorded at the moment of the decision, not afterwards.** | ⚠ THE LEAD, not the component list. It answers the hardest question an evaluator has. |
| `CB-33` | stack | section | `CL-05` | Verified → present | **We run on PostgreSQL for data, Node.js as the application runtime, and Docker with Docker Compose for packaging and deployment. Source control is Git, dependencies are managed with npm, and an automated test and release pipeline runs before anything ships.** | ⛔ The eight Verified and Accepted entries only. ⛔ NO version numbers, NO topology — G-7. |
| `CB-34` | lockin | proof | `CL-07` | Verified → present | **None of these locks us in. Standard SQL, an open container format and an open-source runtime mean the cost of moving is real but bounded, and it is ours to pay rather than a vendor's to set.** | — |
| `CB-35` | rejected-1 | proof | `CL-08` | Verified → present | **We rejected a free hosting tier because its licence prohibits commercial use. We found that during verification, before it reached anything.** | — |
| `CB-36` | rejected-2 | proof | `CL-08` | Verified → present | **We rejected a log-retention assumption because the retention we had designed for was not available on any plan without a paid add-on. The design assumed it; verification showed otherwise.** | — |
| `CB-37` | limitation | limitation | `CL-34` | Verified → present | **Our current deployment runs on a single host. That is a deliberate choice at this stage and a real ceiling; we have not built the orchestration that would remove it.** | ⚠ Stating a scale ceiling plainly. HQ-7 TG-04 records it as the estate's clearest boundary. |
| `CB-38` | footnote | footnote | *basis:* Publication process — COPY-6 quarterly review cadence. A pro | — | **Last reviewed 25 October 2026.** | — |


# ROUTE `/what-we-havent-built` — What we have not built

| | |
| --- | --- |
| **Purpose** | The honest gap list, dated. |
| **State** | **BUILDABLE — gated** |
| **Gate** | Gate 3 CLAIM |
| **Claim coverage** | **5 Verified** — IA-1 satisfied |
| **Blocks** | 9, of which 9 factual |
| **Navigation** | Primary |

| Block | Slot | Kind | Claim | Tier → tense | Copy | Note |
| --- | --- | --- | --- | --- | --- | --- |
| `CB-40` | headline | headline | `CL-11` | Verified → present | **What we have not built.** | — |
| `CB-41` | subheadline | subheadline | `CL-11` | Verified → present | **This is the list we would want from a vendor. It is as complete as we can make it, and it is dated. If something is missing from it, tell us and we will add it.** | ⚠ Invites falsification. A page that asks to be corrected is harder to disbelieve. |
| `CB-42` | gap-1 | limitation | `CL-31` | Verified → present | **Single sign-on. We do not offer it, and we have not built the identity foundation it needs.** | — |
| `CB-43` | gap-2 | limitation | `CL-32` | Verified → present | **An uptime commitment. We do not offer one.** | — |
| `CB-44` | gap-3 | limitation | `CL-33` | Verified → present | **A published way to report a security flaw to us. We do not have one yet.** | — |
| `CB-45` | gap-4 | limitation | `CL-20` | Verified → present | **Third-party security certification. We hold none, and none is in progress.** | — |
| `CB-46` | gap-5 | limitation | `CL-34` | Verified → present | **Agent orchestration. We have not built it. The identity layer it depends on is a placeholder we have deliberately not started.** | — |
| `CB-47` | no-dates | section | `CL-11` | Verified → present | **We do not publish dates for any of these. A date we have not earned is a promise we would rather not make.** | ⛔ GR-1. And it converts a compliance constraint into a stated position. |
| `CB-48` | footnote | footnote | *basis:* Publication process — COPY-6 quarterly review cadence. A pro | — | **Last reviewed 25 October 2026. Reviewed every quarter.** | — |


# ROUTE `/enterprise` — For enterprise

| | |
| --- | --- |
| **Purpose** | The ten questions an evaluator asks, answered honestly. |
| **State** | **BUILDABLE — gated** |
| **Gate** | Gate 3 CLAIM |
| **Claim coverage** | **7 Verified** — IA-1 satisfied |
| **Blocks** | 9, of which 9 factual |
| **Navigation** | Secondary |

| Block | Slot | Kind | Claim | Tier → tense | Copy | Note |
| --- | --- | --- | --- | --- | --- | --- |
| `CB-50` | headline | headline | `CL-11` | Verified → present | **The ten questions you are going to ask us.** | — |
| `CB-51` | subheadline | subheadline | `CL-11` | Verified → present | **Two of them we can answer well. Six of them we cannot answer at all yet. We have not reordered the list.** | ⚠ EP-1 and EP-3. Counting first is what stops the reader counting for us. |
| `CB-52` | q1 | limitation | `CL-31` | Verified → present | **Can we use our own identity provider? Not yet — we do not offer single sign-on.** | — |
| `CB-53` | q5 | limitation | `CL-32` | Verified → present | **What is your uptime commitment? We do not offer one.** | — |
| `CB-54` | q6 | proof | `CL-06` | Verified → present | **What happens if you disappear? Everything we run on is open source or an open standard, and we wrote down our runtime exit conditions when we adopted it.** | ⚠ EP-2 — the question where the page earns its keep. |
| `CB-55` | q8 | limitation | `CL-20` | Verified → present | **Are you certification-holding? No. We hold none, and none is in progress.** | ⚠ Phrased to avoid the prohibited adjective while stating the fact plainly — COPY-4. |
| `CB-56` | q10 | limitation | `CL-33` | Verified → present | **How do we report a security flaw? We do not yet publish a process for that.** | — |
| `CB-57` | governance | proof | `CL-18` | Verified → present | **Where a decision is reserved to a person, the system does not make it. That boundary is written down and it is narrow on purpose.** | — |
| `CB-58` | footnote | footnote | *basis:* Publication process — COPY-6 quarterly review cadence. A pro | — | **Last reviewed 25 October 2026.** | — |


# ROUTE `/about` — About

| | |
| --- | --- |
| **Purpose** | Who we are and who is accountable. |
| **State** | **BUILDABLE — gated** |
| **Gate** | Gate 3 CLAIM |
| **Claim coverage** | **3 Verified** — IA-1 satisfied |
| **Blocks** | 5, of which 5 factual |
| **Navigation** | Secondary |

| Block | Slot | Kind | Claim | Tier → tense | Copy | Note |
| --- | --- | --- | --- | --- | --- | --- |
| `CB-60` | headline | headline | `CL-24` | Verified → present | **About AI Workspace.** | ⛔ The only public product name — DEC-001. |
| `CB-61` | subheadline | subheadline | `CL-26` | Approved direction → present continuous | **We are building an operating layer for enterprise AI, and we are documenting it as we go.** | — |
| `CB-62` | accountability | limitation | `CL-11` | Verified → present | **ACCOUNTABILITY BLOCK — WITHHELD.** | ⛔ GATED ON OPEN ITEM B. The entity and contracting position are unresolved, so this page cannot yet answer its own central question. No placeholder text is drafted, because a vague answer here is worse than a visible gap. |
| `CB-63` | disclosure | disclosure | `CL-16` | Verified → present | **Our written material is drafted with AI assistance and reviewed by a person before publication.** | — |
| `CB-64` | footnote | footnote | *basis:* Publication process — COPY-6 quarterly review cadence. A pro | — | **Last reviewed 25 October 2026.** | — |


# ROUTE `/security` — Security

| | |
| --- | --- |
| **Purpose** | Posture, never architecture. |
| **State** | **BUILDABLE — gated** |
| **Gate** | Gate 3 CLAIM |
| **Claim coverage** | **4 Verified** — IA-1 satisfied |
| **Blocks** | 6, of which 6 factual |
| **Navigation** | Secondary |

| Block | Slot | Kind | Claim | Tier → tense | Copy | Note |
| --- | --- | --- | --- | --- | --- | --- |
| `CB-70` | headline | headline | `CL-33` | Verified → present | **Security: what we can say, and what we cannot.** | — |
| `CB-71` | gate-notice | limitation | `CL-33` | Verified → present | **We do not yet publish a process for reporting a security flaw to us. Until we do, we are not going to make security claims on this page.** | ⛔ SEC-1 / SP-3. This block is the reason the route ships incomplete — and saying so IS the content. |
| `CB-72` | certification | limitation | `CL-20` | Verified → present | **We hold no third-party security certification, and none is in progress.** | — |
| `CB-73` | verification | proof | `CL-10` | Verified → present | **What we can show you is our verification record: eleven material defects caught at a gate before anything reached production.** | — |
| `CB-74` | cookies | disclosure | `CL-03` | Verified → present | **We do not use tracking cookies on this site.** | ⛔ BINDING AND UNVERIFIED — must not ship before the Turnstile test. |
| `CB-75` | boundary | footnote | *basis:* G-7 disclosure boundary — HQ-8/02 §7. States why information | — | **We describe our posture here, not our architecture. Detailed infrastructure information is not something we publish.** | ⚠ Explains the omission so silence does not read as evasion. G-7. |


---

# CONTRACT RULES

| # | Rule |
| --- | --- |
| **CT-1** | **⛔ Copy is referenced by block id.** An implementation team never retypes a sentence — it renders a block |
| **CT-2** | **⚠ A block whose claim changes tier must be re-issued, not edited.** Tense is derived from tier, so a tier change is a rewrite |
| **CT-3** | **⛔ No block may be added at implementation time.** A new sentence needs a new claim first |
| **CT-4** | **⚠ Two blocks must not ship: `CB-21` and `CB-74`** — both state the tracking-cookie commitment, which is **binding and unverified** |
| **CT-5** | **`CB-62` is deliberately withheld, not drafted.** The accountability block is gated on an unresolved entity question, and a vague answer there is worse than a visible gap |
| **CT-6** | **No block contains a colour, a typeface, a size, a spacing value or a component name** |
