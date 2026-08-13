import re,sys,html,glob,os

NEG=re.compile(r"\b(no|not|never|without|cannot|won't|doesn't|does not|nothing|none|neither)\b",re.I)

BANNED=["profit","return","win rate","guarantee","assured","risk-free","P&L","alpha",
 "outperform","beat the market","signal","tip","forecast","predict","accuracy","CAGR","ROI",
 "testimonial","dispute","litigat","arbitrat","grievance"]

# Scan B: capability verbs, must map to a SHIPPED row
CAP=re.compile(r"\b(?:Guardian|it)\b[^.]{0,70}\b(watches|reads|evaluates|computes|reconstructs|"
 r"rebuilds|resolves|sends|warns|raises|alerts|tells|stops|detects|monitors|records|logs|says|"
 r"reports|names|shows|enforces|blocks|prevents|delivers|notifies|provisions)\b",re.I)
SHIPPED_PHRASES=["five limits","OK, WARN, BREACH or UNKNOWN","round-trips","first in first out",
 "UNKNOWN when it cannot tell","says UNKNOWN","cannot place","order-placing code","no thresholds of its own",
 "watches limits you set","reports state","watches your own trading against numeric limits","watches every one of them","watches the lines you drew","reads your live positions"]
FUTURE=re.compile(r"\b(will|would|being built|not built|does not do yet|if and when|not yet|planned)\b",re.I)

# Scan C: regulatory characterisation
TRIGGERS=["investment advice","is a regulated activity","requires registration","requires empanelment",
 "compliant","compliance with","exempt","not required to","falls outside","permitted under",
 "does not constitute","within the meaning of","must register","regulatory obligation","would require it"]
ATTRIB=["it is our position","our position","we take no position","pending counsel","no lawyer has reviewed"]
STANDING="OUR POSITION, NOT A LEGAL OPINION"

def sentences(t): return [s.strip() for s in re.split(r'(?<=[.!?])\s+',t) if s.strip()]

def scan(path,text,is_page=True):
    f=[]
    # ---- SCAN A
    for t in BANNED:
        for m in re.finditer(re.escape(t),text,re.I):
            c=text[max(0,m.start()-90):m.end()+40]
            seg=text[m.start()-30:m.end()+30]
            if t=="return" and re.search(r"returns? to the|return takes effect|returns to",seg,re.I): continue
            if not NEG.search(c): f.append(("A/BANNED",t,c.strip().replace("\n"," ")[:120]))
    # ---- SCAN B
    for s in sentences(text):
        if not CAP.search(s): continue
        if NEG.search(s) or FUTURE.search(s): continue
        if any(p.lower() in s.lower() for p in SHIPPED_PHRASES): continue
        f.append(("B/UNMAPPED","-",s[:130]))
    # ---- SCAN C
    trig=[t for t in TRIGGERS if t.lower() in text.lower()]
    if trig:
        if STANDING not in text:
            f.append(("C/NO-STANDING",",".join(trig),"surface has characterisation but no standing statement"))
        for s in sentences(text):
            hit=[t for t in TRIGGERS if t.lower() in s.lower()]
            if not hit: continue
            if any(a in s.lower() for a in ATTRIB): continue
            if NEG.search(s) and not re.search(r"is a regulated|requires|must register|would require",s,re.I):
                continue   # bare negative fact about us
            f.append(("C/UNATTRIBUTED",hit[0],s[:130]))
    return f

# ---- SURFACE MANIFEST — PINNED, NOT GLOBBED
# A glob picks up whatever .md happens to sit in the cwd. Run from the wrong
# directory and the scanner silently scans the wrong set and reports on it.
# The seven published surfaces are named here and MUST all resolve.
ROOT=os.path.dirname(os.path.abspath(__file__))
MANIFEST=["pages/1-terms.md","pages/2-privacy.md","pages/3-refund.md",
          "pages/4-delivery.md","pages/5-contact.md","pages/6-about.md"]
LANDING="GUARDIAN-PAGE-SHIPPED.html"

missing=[m for m in MANIFEST+[LANDING] if not os.path.isfile(os.path.join(ROOT,m))]
if missing:
    print("SCANNER ABORT — manifest surfaces not found:")
    for m in missing: print("   "+m)
    sys.exit(2)

files=[os.path.join(ROOT,m) for m in MANIFEST]
# landing page visible text
lp=open(os.path.join(ROOT,LANDING),encoding='utf-8').read()
lpv=re.sub(r'<style.*?</style>|<script.*?</script>|<!--.*?-->','',lp,flags=re.S)
lpv=html.unescape(re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',lpv)))
open(os.path.join(ROOT,'7-landing.txt'),'w').write(lpv)

total=0
for p in files+[os.path.join(ROOT,'7-landing.txt')]:
    txt=open(p,encoding='utf-8').read()
    res=scan(p,txt)
    print(f"\n=== {os.path.relpath(p,ROOT)}  ({len(txt.split())} words) ===")
    if not res: print("   CLEAN — A, B, C all pass")
    for kind,term,ctx in res:
        print(f"   [{kind}] {term}\n        {ctx}")
    total+=len(res)
print(f"\n{'='*60}\nSURFACES SCANNED: {len(files)+1} of 7 required\nTOTAL FINDINGS: {total}")
sys.exit(1 if total else 0)
