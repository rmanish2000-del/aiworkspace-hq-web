/** Copy for the Tareekh product page. Facts match https://www.tareekh.co.in (checked 20 Nov 2026). */
export const tareekhProduct = {
  eyebrow: "WhatsApp court-date alerts",
  heading: "Never miss your next court date",
  lead: "Send your CNR once on WhatsApp. Tareekh checks the official court record and messages you the next date, case status, parties, the latest order PDF, and a reminder before the hearing.",
  liveScope:
    "Tareekh is for all of India. It is live today for Madhya Pradesh High Court. Other High Courts and district courts are on a waitlist — send a CNR from any court and we will message you when that court goes live.",
  maturity:
    "A live product from AI Workspace HQ. Built end to end by Manish Patel. Not a court or government service, and not legal advice.",
  siteUrl: "https://www.tareekh.co.in",
  siteLabel: "Open tareekh.co.in",
  waUrl: "https://wa.me/919238600895?text=hi",
  waLabel: "Send hi on WhatsApp",
  waNumber: "+91 92386 00895",
  problemHeading: "Dates move. Orders appear. Checking every day is easy to skip.",
  problemBody:
    "The court record is public and free, but you still have to open the court website, fill the form, pass a CAPTCHA, and hunt for the order PDF. A changed date or a new order is easy to miss if you are waiting for a call.",
  howHeading: "How it works",
  how: [
    {
      label: "Send your CNR on WhatsApp",
      body: "Message hi to +91 92386 00895, then send the 16-character CNR (for example MPHC010012342026). Spaces and dashes are fine. For Madhya Pradesh High Court you can also send a case number such as MCRC 1234/2026.",
    },
    {
      label: "Check the details and reply YES",
      body: "Tareekh shows the parties and case details from the official record. Reply YES to turn on alerts for that case.",
    },
    {
      label: "Get updates only when something changes",
      body: "A daily re-check looks at the official record. You get a WhatsApp message when the date, status or order changes, the latest order PDF in the chat, and a reminder one day before the hearing.",
    },
  ],
  audienceHeading: "Who it is for",
  audiences: [
    "Litigants and their families who want the next date without chasing a website",
    "Advocates and clerks who track many cases in one WhatsApp chat",
    "Businesses with matters in court that need a reliable heads-up",
  ],
  differentHeading: "What is different",
  today: [
    "Open the court website again and again",
    "Fill case type, number, year and a CAPTCHA each time",
    "Search for the order PDF",
    "Wait for a call from your advocate or clerk",
    "A changed date or a new order is easy to miss",
  ],
  withTareekh: [
    "Send your CNR once on WhatsApp",
    "The official record is checked for you",
    "A message when the date, status or order changes",
    "The latest order PDF in the chat",
    "A reminder one day before the hearing",
    "No app, no forms, no CAPTCHA",
  ],
  liveFeaturesHeading: "What you get today",
  liveFeatures: [
    "Next hearing date and case status",
    "Party names",
    "The latest order, with the PDF link from the court website",
    "A reminder before the date",
    "Daily re-check; a message only when something changes",
    "Reply MY CASES to see the cases you are tracking",
    "Updates in English, or reply HINDI for Hindi",
    "The website in 12 Indian languages",
  ],
  soonHeading: "Coming soon",
  soon: [
    "Other High Courts and district courts",
    "Judge and bench name",
    "A one-line summary of each order",
    "Updates in more languages",
  ],
  pricingHeading: "What it costs",
  pricingLead: "Try it, then pay only for the cases you keep.",
  plans: [
    {
      name: "Per case",
      price: "₹49 / case / month",
      detail: "Free for 14 days, then ₹49 per case per month.",
    },
    {
      name: "Advocate plan",
      price: "₹199 / month",
      detail: "For advocates and clerks: up to 10 cases a month.",
    },
  ],
  builtHeading: "How it is built",
  builtBody:
    "A Next.js site on Vercel, WhatsApp Business API messaging, and scheduled re-check and retry jobs. The product site is in 12 Indian languages. The private source lives in our StartupOS repository.",
  limitsHeading: "Honest limits",
  limits: [
    "Live today only for Madhya Pradesh High Court. Other courts are waitlisted.",
    "Tareekh shares what the official public court record says. It is not legal advice, and your advocate stays your advisor.",
    "It is not a court or government service.",
    "WhatsApp updates are in English or Hindi today. More update languages are coming soon.",
    "Send STOP any time to pause messages.",
  ],
  sampleNote:
    "Screenshots and the sample CNR MPHC010012342026 are from a made-up case. They show the product, not a real matter.",
  ctaHeading: "Get your next date on WhatsApp",
  ctaLead: "Send hi to +91 92386 00895, or open the site and start from there.",
  metaTitle: "Tareekh — Court-date alerts on WhatsApp — AI Workspace",
  metaDescription:
    "Tareekh sends the next court date, case status and latest order PDF on WhatsApp. Live today for Madhya Pradesh High Court; other Indian courts are waitlisted. Free for 14 days, then ₹49 per case per month.",
  canonicalPath: "/products/tareekh",
} as const;
