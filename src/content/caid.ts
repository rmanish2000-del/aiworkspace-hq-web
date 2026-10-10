/*
  Customer AI Deployment (CAID) — site copy.
  Rule for this file: every sentence must be true today or clearly labelled as an example.
  No invented customers, numbers, logos or testimonials.
*/

export const EMAIL = "founder@aiworkspacehq.com";
export const planMailto = `mailto:${EMAIL}?subject=${encodeURIComponent("Scoped plan request")}&body=${encodeURIComponent(
  "Organisation:\nWhat kind of work repeats every week:\nWho does it today:\nWhat would 'better' look like:\n",
)}`;

export const meta = {
  title: "AI Workspace — Customer AI deployment you can check, step by step",
  description:
    "We take one repeated job in your organisation and put AI on it, measured and safe, through a 12-step process where every step leaves a receipt you can check.",
};

export const hero = {
  kicker: "Customer AI deployment",
  title: "Don’t trust us. Trust the process.",
  lead: "We take one job your team repeats every week and put AI on it — measured, safe and running in your real work. Every step leaves a receipt you can open and check, so you never have to take our word for anything.",
  hindi: "भरोसा हम पर नहीं, प्रक्रिया पर।",
  primary: "Ask for a scoped plan",
  secondary: "See the 12 steps",
};

/* Example engagement shown in the hero — labelled as an example on the page. */
export const exampleLedger = {
  title: "Example engagement",
  org: "A CSC centre · scheme-application follow-ups",
  rows: [
    {
      step: "1",
      name: "Outcome",
      receipt: "Outcome written in your words, with a number",
      state: "done",
    },
    {
      step: "2",
      name: "Real workflow",
      receipt: "Every step graded: seen, documented, or told",
      state: "done",
    },
    { step: "3", name: "Risks", receipt: "Riskiest assumption tested first", state: "done" },
    {
      step: "9",
      name: "Success metric",
      receipt: "Pass/fail line frozen before any result",
      state: "done",
    },
    { step: "11", name: "Rollout", receipt: "Shadow run, then a small canary", state: "now" },
    {
      step: "12",
      name: "Improve",
      receipt: "Every complaint becomes a fix with an owner",
      state: "next",
    },
  ],
} as const;

export const audiences = [
  {
    who: "CSC & digital-service centres",
    job: "Scheme applications, document checks, status follow-ups",
  },
  {
    who: "Farmer producer organisations",
    job: "Member records, procurement entries, compliance filings",
  },
  {
    who: "Law practices",
    job: "Organising case papers into a reviewable file for the advocate",
  },
  {
    who: "Coaching & tuition centres",
    job: "Test analysis and who needs which remedial class",
  },
  {
    who: "D2C brands & small businesses",
    job: "Catalogue, customer replies, order and payment follow-ups",
  },
];

export type Stage = { n: number; name: string; we: string; you: string };
export type Phase = { name: string; why: string; stages: Stage[] };

export const phases: Phase[] = [
  {
    name: "Understand",
    why: "No building until we agree what ‘better’ means and how your work really runs.",
    stages: [
      {
        n: 1,
        name: "Outcome before output",
        we: "Write the result you want — who, what changes, by how much — without naming any technology.",
        you: "A one-page outcome frame you approve.",
      },
      {
        n: 2,
        name: "Your real workflow",
        we: "Map how the job is actually done, grading every step as seen, documented, or only reported.",
        you: "A workflow map with the friction and the exceptions marked.",
      },
      {
        n: 3,
        name: "Assumptions and risk",
        we: "List what must be true, score each by impact and uncertainty, and test the riskiest first.",
        you: "A ranked risk list and the first test to run.",
      },
    ],
  },
  {
    name: "Prove",
    why: "The smallest thing that proves value, written down so nobody has to remember it.",
    stages: [
      {
        n: 4,
        name: "Smallest testable slice",
        we: "Pick the thinnest end-to-end piece that can prove or disprove the outcome, with a stop rule.",
        you: "A slice plan and the exact proof it must produce.",
      },
      {
        n: 5,
        name: "Executable spec",
        we: "Turn rules into checks: normal, edge, failure and forbidden cases, and what stays a human decision.",
        you: "A spec where every rule has a test.",
      },
      {
        n: 6,
        name: "Answers with sources",
        we: "When AI answers from your documents, it must cite them — or say it cannot.",
        you: "Answers you can trace back to your own papers.",
      },
      {
        n: 7,
        name: "Measured quality",
        we: "Score the system on enough real cases to trust the number, with its margin of error.",
        you: "A quality report, not an impression.",
      },
    ],
  },
  {
    name: "Ship",
    why: "Live only through gates that fail closed, with a way back in under a minute.",
    stages: [
      {
        n: 8,
        name: "Production gate",
        we: "Check security, reliability, cost and monitoring. Anything unknown counts as a fail.",
        you: "A gate report with every item answered.",
      },
      {
        n: 9,
        name: "Success metrics",
        we: "Freeze the pass, fail and ‘not sure yet’ lines before any result comes in.",
        you: "A frozen metric plan nobody can move later.",
      },
      {
        n: 10,
        name: "The right stage",
        we: "Decide by evidence whether this is a prototype, a pilot or production — and show it in the system.",
        you: "No pilot quietly turning into production.",
      },
      {
        n: 11,
        name: "Careful rollout",
        we: "Run in the shadow first, then on a small share, with rollback as a single switch.",
        you: "Rollback in under 60 seconds, rehearsed.",
      },
    ],
  },
  {
    name: "Improve",
    why: "It keeps getting better because every signal becomes a fix.",
    stages: [
      {
        n: 12,
        name: "Feedback ratchet",
        we: "Every complaint, error or idea becomes an owned fix at the earliest layer that prevents it.",
        you: "A running list of fixes, each with an owner and a check.",
      },
    ],
  },
];

export const services = [
  {
    name: "Discovery",
    covers: "Steps 1–3",
    what: "We find one repeated job worth automating, write the outcome with a number, and map how the work really runs.",
    end: "You decide whether to go on, with the evidence in hand.",
  },
  {
    name: "Pilot",
    covers: "Steps 4–7",
    what: "We build the smallest working slice on your real work, with tests for every rule and a measured quality report.",
    end: "Pass, fail or ‘not sure yet’ — judged against lines frozen in advance.",
  },
  {
    name: "Production",
    covers: "Steps 8–11",
    what: "We put it live through a fail-closed gate, run it in the shadow, then roll out in small steps with a one-switch rollback.",
    end: "Running in your work, monitored, with a way back.",
  },
  {
    name: "Care & improvement",
    covers: "Step 12, every month",
    what: "We watch the numbers, turn every signal into an owned fix and report what changed.",
    end: "A monthly report you can check line by line.",
  },
];

export const servicesNote =
  "Scope and fee are agreed in writing before any work starts. You can stop at the end of any phase and keep everything produced so far.";

export const promises = [
  {
    title: "Facts, not claims",
    body: "A step passes only on something you can see: a test that ran, a record that reads back, a file that opens.",
  },
  {
    title: "Lines drawn before results",
    body: "Success metrics are frozen before any number comes in, so nobody moves the goalposts — including us.",
  },
  {
    title: "Your data stays yours",
    body: "Data stays in the store you agree to, with recorded consent under India’s DPDP Act, and can be deleted on request.",
  },
  {
    title: "People decide money and law",
    body: "AI prepares; a person decides anything that moves money, signs, files or affects someone’s rights.",
  },
  {
    title: "A way back, always",
    body: "Every live change can be rolled back with one switch, and we rehearse it before going live.",
  },
  {
    title: "We tell you when it isn’t working",
    body: "If the evidence says stop, we stop and show you why. A stopped project still leaves you its findings.",
  },
];

export const digital = {
  title: "Digital from first message to invoice",
  lead: "No office visits and no paperwork chases. Everything that can be done online is, and the few steps the law reserves for a person are reduced to one tap.",
  items: [
    { name: "Agreement", body: "Scope and terms signed online." },
    { name: "Identity checks", body: "Done digitally where the law requires them." },
    { name: "Payments", body: "Online checkout with receipts by email." },
    { name: "Consent", body: "Recorded per person, per purpose, revocable." },
    { name: "Approvals", body: "One tap on a prepared, pre-checked item." },
    { name: "Reports", body: "Shared links you can open any time." },
  ],
};

export const ownSystems = {
  title: "We run the process on our own systems first",
  lead: "Before we ask anyone to trust the process, we use it on our own projects. Their status is stated plainly, including what is not finished.",
  items: [
    {
      name: "EduOS",
      status: "Live",
      body: "Learning tools for tutoring and coaching centres, at eduos.global.",
    },
    {
      name: "NyayOS",
      status: "Pilot preparation",
      body: "Organises business-dispute papers into a file a human reviewer checks. It never predicts outcomes.",
    },
    {
      name: "TradeOS",
      status: "Internal only",
      body: "A research and trading system used only by its founder. Not offered as a service and not investment advice.",
    },
    {
      name: "MirrorOS",
      status: "Prototype",
      body: "Virtual try-on for fashion brands that own their images. Quality is being measured before anything is offered.",
    },
  ],
};

export const close = {
  title: "Start with one job",
  lead: "Tell us one piece of work your team repeats every week. We will reply with a scoped plan for Discovery — what we would look at, what you would receive, and the fee.",
  primary: "Ask for a scoped plan",
};
