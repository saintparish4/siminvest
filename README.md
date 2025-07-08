# Overview
Siminvest is a full-stack investment platform that enables users to discover, analyze, and participate in private funding rounds for high-growth startups and tokenized assets. Built with compliance and user experience at its core, siminvest bridges the gap between retail and institutional investing in early-stage ventures.

 # ACCESS
 - You can access the marketplace with this link:  ( no protected routes implemented yet but in a real app it would )

# Core Features
- Authentication (Complete) & User Roles
- Verification Emails (Complete)
- Secure login (Better-Auth) with magic link + OAuth options.
- Role-based access (Investor, Startup Founder, Admin).

## Investment Marketplace
- Curated feed of startup and token offerings.
- ilters: industry, stage, location, funding status.
- Detail page per offering: pitch deck, financials, team, tokenomics.

## Investments
- Support both fiat (Stripe) and crypto (wallet connect).
- Simulated investment flow for demo purposes (no real transfers).
- Investor dashboard: portfolio breakdown, documents, token vesting.

## Due Diligence Toolkit
- AI-generated insights (OpenAI API) for startup/token analysis.
- Risk scores, market signals, team credibility scoring.
- Integration with Crunchbase or similar API for data enrichment.

## Compliance & KYC
- Simulated KYC/AML flow (placeholder for Persona/Stripe Identity).
- Legal document previews (e.g. SAFE, token SAFT agreements).

## Admin Console
- Startup application review & approval.
- Metrics dashboard: user growth, funding activity.
- Content moderation (comments, startup updates).

# Additional Features
- Admin Dashboard: Server-protected, RBAC-secured route for startup/token approvals.
- Stripe (Fiat Payments): For simulated fiat investment UX.
- WalletConnect (Demo Crypto): Allow testnet wallet connection for crypto simulation.
- Background Jobs (Optional): CRON for token vesting updates.

### Middleware

This app includes an experimental `middleware.experimental.ts` using Next.js edge features.
It’s not active by default and is excluded from production builds for stability.



                      +-------------------+
                      |     Frontend      |
                      |  (Next.js, TS)    |
                      +--------+----------+
                               |
                     Client-side SWR/React Query
                               |
                      +--------v----------+
                      |  API Layer (BFF)  |
                      |  /api/ routes     |
                      +--------+----------+
                               |
           +-------------------+------------------+
           |                                      |
+----------v----------+               +-----------v-----------+
| Investment Service  |               |   Auth Service        |
| Node.js/FastAPI     |               | Better-Auth           |
| Handles offerings,  |               | Handles user sessions |
| transactions, logic |               | role-based access     |
+----------+----------+               +-----------+-----------+
           |                                      |
+----------v----------+               +-----------v-----------+
| PostgreSQL (via     |               | Clerk DB (or Supabase)|
| Supabase DB)        |               +------------------------+
| Tables: users,      |
| startups, tokens,   |
| investments, roles  |
+----------+----------+
           |
+----------v-----------+
| Supabase Storage     |
| Pitch decks, legal   |
| docs, media files    |
+----------+-----------+
           |
+----------v-----------+
| AI Microservice      |
| OpenAI for due       |
| diligence, scoring   |
+----------------------+

