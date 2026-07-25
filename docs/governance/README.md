# Governance — pointers, not copies

Accepted governance is cited by document ID and version, never copied here
(P1-A §3.5, §6.1). This repository is not the canonical source for any
governance statement, and if this file ever disagrees with the governing
document, this file is wrong.

## The chain in force

| ID             | Document                                                        | Version | Governs                                                                                                                              |
| -------------- | --------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| —              | P0 public foundation package                                    | v1.1.1  | Positioning, claims, copy, IA, data workflow, privacy, visual, technical, deployment, measurement, handoff, acceptance               |
| `AWHQ-GOV-P1A` | Implementation governance and repository authorization strategy | v1.0    | Repository, branch, version, documentation, content, technology-decision, and release governance; Claude Code authorization criteria |
| `AWHQ-TDR-P1B` | Technology decision records (Open Item D)                       | v1.0    | Thirteen component decisions, of which six are signed                                                                                |
| `AWHQ-AUT-P1F` | AG-1 decision record and safe-development boundary              | v1.0    | The scope this repository was built under: AG-2-S §7, prohibitions §8                                                                |

**Precedence** (P1-A): AI Workspace platform specifications > P0 public
foundation > P1-A > repository contents. Where this repository conflicts with an
approved specification, the repository is corrected.

## Standing prohibitions

`AWHQ-AUT-P1F` §8 lists twenty (P-01…P-20). Any one of them ends the safe phase
and requires a new authorization. The ones with teeth in day-to-day work:

- **P-02** — no vendor account may be opened or connected. Including free tiers.
  Including preview-only accounts.
- **P-10** — no claim, string, or wording beyond approved `04` copy. No
  invention, no improvement, no shortening.
- **P-16** — no mention of the excluded programmes, or of the operating entity,
  in repository content, metadata, **or commit messages**.
- **P-17** — no second repository, branch-protection exception, additional
  principal, or visibility change.
- **P-19** — no secret. The self-enforcing test: if a piece of work requires a
  secret, that work is out of scope.
- **P-20** — no change to governance, including the documents listed above.

Three of these are machine-checked: P-10 and P-16 by `tests/unit/copy.test.ts`,
P-19 by `gitleaks` in CI. The rest depend on the implementer stopping.

## Escalation triggers — stop and ask

Per P1-A §10.3 and P0 `11` §13. Stop and return to the founder, rather than
deciding, when:

1. a required string, value, or rule is absent from the specification;
2. a specification is internally contradictory, or contradicts an approved
   platform statement;
3. an accessibility, performance, security, or privacy target cannot be met as
   specified;
4. meeting a target would require breaking a binding commitment;
5. a credential, mailbox, or external access is missing;
6. the work would require a technology not recorded under P1-A §8;
7. the work would cross a repository boundary;
8. the work would require a second repository, workspace, or branch;
9. an irreversible action is implicated;
10. an irreversible business, legal, regulatory, or security decision is
    implicated.

Trigger 1 fired twice during the first assignment. Both are recorded as GAP-01
and GAP-02 in [`../../HANDOFF.md`](../../HANDOFF.md) §2.

The last trigger in P0 `11` §13 is the important one: _any temptation to add a
string, a field, a claim, an event, a cookie, or a third-party origin that the
package does not specify._ Everything the package prohibits, it prohibits
deliberately.

## The four binding commitments

These are commitments, not descriptions. If the implementation stops satisfying
one, the corresponding sentence is removed from the page **before** the change
ships — not after.

| ID   | Commitment                                                      | Enforced here by                                                     |
| ---- | --------------------------------------------------------------- | -------------------------------------------------------------------- |
| C-11 | "AI Workspace is in development. Early access is not yet open." | Unit test asserts the string verbatim                                |
| C-12 | "We will only contact you about AI Workspace early access."     | Unit test; no email capability exists                                |
| C-13 | "we do not use tracking cookies on this site"                   | e2e test asserts **zero cookies**, and ESLint bans `document.cookie` |
| C-14 | "We do not sell or share this information."                     | Unit test; no data is collected                                      |

## A note on this repository's documentation footprint

P1-A §3.5 says operational documentation only, and that planning documents are
not committed. The current assignment explicitly required `PROJECT_STATE.md`,
`HANDOFF.md`, `CHANGELOG.md`, and this `docs/` tree.

Those files were written to record **state, decisions, and outstanding
escalations** — not roadmap, strategy, scope proposals, or commercial material,
which remain uncommitted. If the founder judges that this still exceeds §3.5,
the correct remedy is to amend §3.5 or to remove the files by decision, not to
let the two positions coexist unremarked.
