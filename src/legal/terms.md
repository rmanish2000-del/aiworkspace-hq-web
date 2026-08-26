TERMS OF SERVICE — Warrant Guardian
Operated by Kartavya CSC Digital Seva, a sole proprietorship of Manish Patel
Tilak Ward, Deori, District Sagar, Madhya Pradesh 470226, India
GSTIN: 23AKZPP1502D1ZB | Udyam: UDYAM-MP-39-0001250 | Contact: founder@aiworkspacehq.com
Effective: 2026-08-07

OUR POSITION, NOT A LEGAL OPINION
Where these terms describe how the law applies to Warrant Guardian, that is our own position. No lawyer has reviewed it, and questions we have put to counsel are outstanding. Nothing here should be relied on as a statement of your legal position or ours.

1. What Warrant Guardian is
   Software that watches your own trading against numeric limits you enter yourself, and reports whether each is within range, being approached, exceeded, or indeterminable.
   What it does today: it watches five limits - daily loss, loss on a single trade, position quantity, a consecutive-losing-trades halt, and a square-off boundary - against your live positions. It resolves each to one of four states: OK, WARN, BREACH or UNKNOWN. It reconstructs your completed round-trips, first in first out, from your own trade records. It says UNKNOWN when it cannot tell, rather than guessing: one unreadable row in your trade file means no losing-streak figure at all, not a figure computed from the rows that happened to parse.
   What it does not do yet: deliver those warnings to you. That is being built, and until it is, nothing we publish will claim otherwise.

2. What it does not do
   2.1 It does not tell you what to trade, when, or how much. No instruments, strikes, entries, exits, signals, tips or watchlists.
   2.2 It does not predict or forecast anything.
   2.3 It is our position that Guardian does not provide investment advice and that nothing it produces is a recommendation. Nothing it produces should be treated as one.
   2.4 It cannot place, modify or cancel an order. Our build fails if order-placing code appears in it. That check matches known order-method names; it would not catch a raw HTTP call to an order endpoint, and we are extending it.
   2.5 It ships with no thresholds of its own. Every limit is a number you entered. Where you entered none, it reports UNKNOWN rather than supplying one.
   2.6 We make no claim about profit, return, win rate or performance, and any such claim made in our name is unauthorised.

3. Your responsibilities
   Every trading decision is yours. Guardian reports state; it does not act.
   Your broker credentials are yours to manage. Guardian uses credentials you supply, on your own machine. We never receive them.
   We take no position on whether any regulatory obligation applies to your own trading; that is a question for you and your own advisers.
   You confirm you are 18 or older and legally able to trade.

4. What the software cannot promise
   Monitoring software fails. Defects, dropped connections, stale data, power loss. Guardian reduces the chance you unknowingly exceed a limit you set. It is not a guarantee that this cannot happen, and must not be your only control.
   UNKNOWN means "I am not watching this right now."
   No warranty, express or implied, including merchantability and fitness for a particular purpose, to the extent permitted by law.
   A limitation of liability is under review. None is asserted at this time.

5. Who you are contracting with
   Warrant Guardian is operated by Kartavya CSC Digital Seva, which is the sole proprietorship of Manish Patel. It is not a company and has no corporate identification number. Its registration numbers are the GSTIN and Udyam number printed above.

6. Tiers
   Founder Edition private beta - Rs 999 per month, GST as applicable. You install it on your own Linux host using Docker and your own domain; setup is manual with hands-on support from the founder. It is not a hosted service and does not support single sign-on with your own identity provider.
   Enforcer - not offered. We do not hold exchange empanelment. It is our position, pending counsel review, that order-path enforcement would require it.
   Payment for Founder Edition is collected through Razorpay at checkout.

7. Safety does not depend on billing
   If and when paid tiers exist, a lapsed, failed or cancelled subscription will never stop Guardian watching mid-session, and will never disable the kill-switch when that ships. Any downgrade takes effect only at a session boundary.

8. Termination, changes, governing law
   You may stop using the software at any time.
   We may suspend access for abuse, unlawful use, or attempts to circumvent clause 2.
   Material changes: 30 days before taking effect. Continued use is acceptance.
   Governing law: India. Exclusive jurisdiction: the courts at Sagar, Madhya Pradesh.
