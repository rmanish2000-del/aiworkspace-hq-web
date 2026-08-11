"""Scans A, B and C against the BUILT output (PUBLISH-GUARDIAN-PAGES).

Run after `npm run build`. Scans the rendered HTML Astro produced — never
the markdown and never a standalone file: every prior compliance claim made
about the wrong artifact is why this script exists. Exit 1 on any finding.

  A: banned performance/claims vocabulary outside a negation
  B: capability verbs that map to no SHIPPED behaviour row
  C: regulatory characterisations without attribution + standing statement
"""
import html
import json
import pathlib
import re
import sys

NEG = re.compile(r"\b(no|not|never|without|cannot|won't|doesn't|does not|nothing|none|neither)\b", re.I)
BANNED = ["profit", "return", "win rate", "guarantee", "assured", "risk-free", "P&L", "alpha",
          "outperform", "beat the market", "signal", "tip", "forecast", "predict", "accuracy",
          "CAGR", "ROI", "testimonial", "dispute", "litigat", "arbitrat", "grievance"]
CAP = re.compile(r"\b(?:Guardian|it)\b[^.]{0,70}\b(watches|reads|evaluates|computes|reconstructs|"
                 r"rebuilds|resolves|sends|warns|raises|alerts|tells|stops|detects|monitors|records|logs|says|"
                 r"reports|names|shows|enforces|blocks|prevents|delivers|notifies|provisions)\b", re.I)
SHIPPED_PHRASES = ["five limits", "OK, WARN, BREACH or UNKNOWN", "round-trips", "first in first out",
                   "UNKNOWN when it cannot tell", "says UNKNOWN", "cannot place", "order-placing code",
                   "no thresholds of its own", "watches limits you set", "reports state",
                   "watches your own trading against numeric limits", "watches every one of them",
                   "watches the lines you drew", "reads your live positions"]
FUTURE = re.compile(r"\b(will|would|being built|not built|does not do yet|if and when|not yet|planned)\b", re.I)
TRIGGERS = ["investment advice", "is a regulated activity", "requires registration",
            "requires empanelment", "compliant", "compliance with", "exempt", "not required to",
            "falls outside", "permitted under", "does not constitute", "within the meaning of",
            "must register", "regulatory obligation", "would require it"]
ATTRIB = ["it is our position", "our position", "we take no position", "pending counsel",
          "no lawyer has reviewed"]
STANDING = "OUR POSITION, NOT A LEGAL OPINION"

ROUTES = {"/terms": "dist/terms.html", "/privacy": "dist/privacy.html",
          "/refunds": "dist/refunds.html", "/delivery": "dist/delivery.html",
          "/contact": "dist/contact.html", "/about": "dist/about.html",
          "/warrant-guardian/": "dist/warrant-guardian/index.html"}


def sentences(t):
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", t) if s.strip()]


def visible(path):
    raw = pathlib.Path(path).read_text(encoding="utf-8")
    raw = re.sub(r"<style.*?</style>|<script.*?</script>|<!--.*?-->", "", raw, flags=re.S)
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", raw))).strip()


def scan(text):
    findings = []
    for term in BANNED:
        for m in re.finditer(re.escape(term), text, re.I):
            c = text[max(0, m.start() - 90):m.end() + 40]
            seg = text[max(0, m.start() - 30):m.end() + 30]
            if term == "return" and re.search(r"returns? to the|return takes effect|returns to", seg, re.I):
                continue
            if not NEG.search(c):
                findings.append(("A/BANNED", term, c.strip()[:120]))
    for s in sentences(text):
        if not CAP.search(s):
            continue
        if NEG.search(s) or FUTURE.search(s):
            continue
        if any(p.lower() in s.lower() for p in SHIPPED_PHRASES):
            continue
        findings.append(("B/UNMAPPED", "-", s[:130]))
    trig = [t for t in TRIGGERS if t.lower() in text.lower()]
    if trig:
        if STANDING not in text:
            findings.append(("C/NO-STANDING", ",".join(trig), "no standing statement"))
        for s in sentences(text):
            hit = [t for t in TRIGGERS if t.lower() in s.lower()]
            if not hit:
                continue
            if any(a in s.lower() for a in ATTRIB):
                continue
            if NEG.search(s) and not re.search(r"is a regulated|requires|must register|would require", s, re.I):
                continue
            findings.append(("C/UNATTRIBUTED", hit[0], s[:130]))
    return findings


def main():
    total = 0
    hashes = {}
    for route, path in ROUTES.items():
        text = visible(path)
        import hashlib
        hashes[route] = hashlib.sha256(text.encode()).hexdigest()
        results = scan(text)
        print(f"=== {route} ({len(text.split())} words) ===")
        if not results:
            print("   CLEAN - A, B, C all pass")
        for kind, term, ctx in results:
            print(f"   [{kind}] {term}\n        {ctx}")
        total += len(results)
    print(f"\nTOTAL FINDINGS ON BUILT OUTPUT: {total}")
    if "--emit-hashes" in sys.argv:
        print(json.dumps(hashes, indent=2, sort_keys=True))
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())
