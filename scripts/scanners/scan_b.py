#!/usr/bin/env python3
"""Scan B — feature-truth scanner. Exhaustive over surfaces by construction."""
import re,sys,json,html as H

# --- 1. SHIPPED set is DERIVED from the truth doc, never hand-maintained here ---
def shipped_rows(truthdoc):
    t=open(truthdoc,encoding='utf-8').read()
    rows={}
    for m in re.finditer(r'^\|\s*(\d{2}[ab]?|P\d)\s*\|\s*([^|]+?)\s*\|[^|]*\|\s*\*\*([A-Z\- ()]+)\*\*',t,re.M):
        rows[m.group(1)]=(m.group(2).strip(),m.group(3).strip())
    return rows

# --- 2. Surface manifest. An unlisted region is a FAILURE, not a skip. ---
SURFACES=[
 ("title",           r'<title>(.*?)</title>'),
 ("meta.description",r'<meta name="description" content="(.*?)"'),
 ("og.title",        r'<meta property="og:title" content="(.*?)"'),
 ("og.description",  r'<meta property="og:description" content="(.*?)"'),
 ("header.mark",     r'<a class="mark".*?>(.*?)</a>'),
 ("nav",             r'<nav[^>]*>(.*?)</nav>'),
 ("hero",            r'<div class="hero">(.*?)</div>\s*</div>'),
 ("section.body",    r'<div class="section-head">(.*?)</div>'),
 ("card",            r'<div class="card[^"]*">(.*?)</div>'),
 ("neverdo",         r'<section id="never".*?<ul>(.*?)</ul>'),
 ("whitebox",        r'<section id="whitebox">(.*?)</section>'),
 ("waitlist.html",   r'<section id="waitlist".*?>(.*?)</section>'),
 ("pricing.flag",    r'<div class="price-flag">(.*?)</div>'),
 ("pricing.tier",    r'<div class="tier[^"]*">(.*?)</div>\s*(?=<div class="tier|</div>)'),
 ("disclaimer",      r'<section class="disclaimer">(.*?)</section>'),
 ("footer",          r'<footer>(.*?)</footer>'),
 ("js.strings",      r'(?:note\.(?:textContent|innerHTML)\s*=|blurb\.textContent\s*\+?=)\s*([\s\S]*?);'),
 ("alt.text",        r'<img[^>]*alt="([^"]*)"'),
 ("aria.label",      r'aria-label="([^"]*)"'),
]

# --- 3. Capability verbs. Backstop for a missing annotation. ---
CAP=re.compile(r'\bGuardian\b[^.]{0,60}\b(watches|reads|evaluates|computes|reconstructs|rebuilds|'
 r'sends|warns|raises|alerts|tells|stops|detects|monitors|tracks|records|logs|says|reports|'
 r'names|shows|enforces|blocks|prevents|makes sure|ensures|catches|notifies)\b',re.I)
CAP2=re.compile(r'\b(it|the build)\b\s+(stops|warns|raises|fails|catches|notifies|reports)\b',re.I)
# Negated / future / conditional => not a present-tense capability assertion
SAFE=re.compile(r'\b(not|never|cannot|can\'t|won\'t|does not|doesn\'t|no longer|yet|planned|'
 r'will|would|being built|not built|does not yet)\b',re.I)

def strip(s):
    s=re.sub(r'<[^>]+>',' ',s)
    return H.unescape(re.sub(r'\s+',' ',s)).strip()

def sentences(t):
    return [x.strip() for x in re.split(r'(?<=[.!?])\s+(?=[A-Z"“])',t) if x.strip()]

def scan(pagefile,truthdoc):
    src=open(pagefile,encoding='utf-8').read()
    ship=shipped_rows(truthdoc)
    shipped_ids={k for k,(_,st) in ship.items() if st.startswith('SHIPPED')}
    findings=[];checked=0
    # region coverage: every <section> must map to a manifest entry
    ids=set(re.findall(r'<section id="([^"]+)"',src))
    covered={'never','whitebox','waitlist','what','problem','pricing'}
    uncovered=ids-covered
    if uncovered:
        findings.append(("SURFACE-UNCLASSIFIED",f"sections not in manifest: {sorted(uncovered)}",""))
    for name,pat in SURFACES:
        for m in re.finditer(pat,src,re.S):
            region=m.group(1)
            planned = 'state-planned' in region or 'card planned' in region
            for s in sentences(strip(region)):
                if not s: continue
                checked+=1
                claim = CAP.search(s) or CAP2.search(s)
                if not claim: continue
                if SAFE.search(s): continue          # negated/future => allowed
                ann=re.search(r'data-claim="([^"]+)"',region)
                if planned:
                    findings.append(("PLANNED-PRESENT-TENSE",name,s)); continue
                if not ann:
                    findings.append(("UNANNOTATED-CLAIM",name,s)); continue
                if ann.group(1) not in shipped_ids:
                    findings.append(("CLAIM-NOT-SHIPPED",f"{name} -> {ann.group(1)}",s))
    return findings,checked,shipped_ids

if __name__=="__main__":
    f,n,ship=scan(sys.argv[1],sys.argv[2])
    print(f"SHIPPED rows derived from truth doc: {sorted(ship)}")
    print(f"sentences examined: {n}")
    print(f"findings: {len(f)}\n")
    for kind,where,s in f:
        print(f"[{kind}] {where}\n    {s[:150]}\n")
    sys.exit(1 if f else 0)
