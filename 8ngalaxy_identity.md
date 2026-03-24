# n8nGalaxy — Product Identity Document
> Version 1.0 · March 2026 · Owner: Anasan Rai (raianasan10@gmail.com)
> Status: Pre-launch · Stack: Vite + React + TS + Supabase + Vercel

---

## 1. What Is n8nGalaxy

n8nGalaxy is the n8n ecosystem hub.

One domain. Four revenue streams. Every stream feeds the others.

- **Buy** → premium n8n workflow templates ($29–$299)
- **Rent** → a live n8n sandbox instance by the hour/day ($2–$29)
- **Host** → managed n8n on your own VPS, fully handled ($49–$299/mo)
- **Learn** → course + private community ($97–$397 + $49/mo membership)

The funnel: a student rents a sandbox → buys a template → upgrades to hosting.
Every product is a top-of-funnel for the next.

---

## 2. The Problem We Solve

**For learners:** You're doing a KodeKloud or Udemy n8n course. You need a clean,
isolated n8n instance to practice on — right now. Not a $30/mo subscription.
Not a VPS setup. Just: click, pay $2, get a URL + credentials in 90 seconds.

**For freelancers:** You need to demo a workflow to a client before committing
to a full setup. Spin up a 4-hour sandbox, build live in front of them, destroy it after.

**For agencies:** You need a staging environment to test workflows before pushing
to a client's production n8n. Rent a day instance, test, destroy.

**For businesses:** You want n8n's power without the DevOps overhead.
Pay monthly, we handle Docker, Traefik, updates, backups, monitoring.

---

## 3. Brand Identity

### Name
**n8nGalaxy** — plays on n8n's infinity node graph aesthetic. Suggests scale,
exploration, an ecosystem. Not a tool. A universe of automation.

### Tagline
> *"The n8n ecosystem hub. Buy, rent, learn, ship."*

Alternative (for ads):
> *"n8n without the setup headache."*

### Domain
- Primary: `n8ngalaxy.com`
- Sandbox wildcard: `*.sandboxes.n8ngalaxy.com`
- Sub-product: `cashpilot.n8ngalaxy.com` (Phase 4)

### Colors
```
Background:    #0D0D14   (deep space — almost black, slight blue undertone)
Surface:       #13131F   (cards, panels)
Border:        #1E1E30   (subtle borders)
Primary:       #7C3AED   (electric violet — action, CTAs, highlights)
Primary hover: #6D28D9
Accent:        #00E5C7   (neon teal — badges, live indicators, success states)
Accent dim:    #00B8A0
Text primary:  #F4F4F8   (near white)
Text secondary:#9CA3AF   (muted gray)
Text tertiary: #6B7280   (hints, placeholders)
Danger:        #EF4444
Warning:       #F59E0B
Success:       #10B981
```

### Typography
```
Display / Hero:   Syne 800    — bold, geometric, authority
Headings (h2-h4): Syne 700
UI / Body:        Inter 400   — clean, readable, neutral
UI Medium:        Inter 500   — labels, nav, buttons
Mono / Code:      JetBrains Mono 400 — credentials, URLs, node names
```

### Design Language
- Dark mode only. No toggle. Space = black.
- Grain texture overlay at 3% opacity on hero sections
- Violet glow (box-shadow: 0 0 60px rgba(124,58,237,0.15)) on primary cards
- Borders: 1px solid #1E1E30 — thin, never loud
- Border radius: 12px cards · 8px inputs/buttons · 999px pills/badges
- Motion: 200ms ease-out for all transitions. No bounce. No spring physics.
- Icons: Lucide React — consistent weight, never filled icons mixed with outlines

### Do Not
- No gradients on backgrounds (gradients only on hero text or specific accent elements)
- No purple-on-white (we are dark only)
- No rounded corners on full-width banners
- No shadows except the violet glow card treatment
- No emoji in UI (only in marketing copy, max 2)
- No Inter for headings (Syne only for h1–h3)

---

## 4. Products In Detail

### 4.1 Marketplace
**URL:** `/marketplace`
**What:** Downloadable n8n workflow JSON files. Each template solves a specific
business problem. SEO-optimized individual landing pages per template.

**Pricing:**
- Starter templates: $29 (single workflow, 1 use case)
- Pro templates: $79 (multi-workflow, full automation stack)
- Bundle packs: $149–$199 (vertical-specific, e.g. "Real Estate Pack")
- AI Agent Stack: $299 (complete AI agent system with RAG + GoHighLevel)

**Delivery:** LemonSqueezy checkout → webhook → Supabase signed URL → Resend email

**First 10 templates to build:**
1. Real estate lead capture → GoHighLevel CRM sync
2. AI property description generator (GPT-4 + Zillow data)
3. Apollo cold outreach enricher + Gmail sender
4. Stripe → QuickBooks receipt auto-sync
5. AI resume screener + Airtable scorer
6. Google review auto-responder (AI-generated replies)
7. Slack daily revenue digest (Stripe + PayPal)
8. Invoice follow-up sequence (3-email chain, auto-stops on payment)
9. LinkedIn post → repurpose to Twitter/X + newsletter
10. n8n workflow health monitor (alerts on failures via Telegram)

**Categories:** Real Estate · Sales · Finance · Marketing · HR · DevOps · AI Agents

---

### 4.2 Sandbox Rental ← NEW FEATURE
**URL:** `/sandbox`
**What:** Instant, isolated, temporary n8n instances provisioned on demand.
Each sandbox = one Docker container on your Hostinger VPS.
Auto-destroyed at expiry. User gets URL + credentials via email + dashboard.

**Pricing tiers:**
| Tier      | Duration | Price | RAM   | Templates |
|-----------|----------|-------|-------|-----------|
| Spark     | 1 hour   | $2    | 512MB | None      |
| Explorer  | 4 hours  | $6    | 1GB   | 5 free    |
| Builder   | 1 day    | $9    | 1GB   | 10 free   |
| Pro       | 1 week   | $29   | 2GB   | All free  |

**Technical flow:**
```
User selects tier → LemonSqueezy checkout
→ LemonSqueezy webhook → VPS API /api/provision
→ Docker: spin up n8nio/n8n container with UUID name + random auth
→ Traefik: write dynamic config for {uuid}.sandboxes.n8ngalaxy.com
→ Supabase: insert sandbox_sessions row (id, user_id, url, user, pass, expires_at)
→ Resend: email credentials to user
→ User dashboard: shows live countdown, credentials, extend button
→ Cron (every 15min): check expires_at → docker stop + rm → delete Traefik config
```

**VPS infrastructure:**
- Host: Hostinger VPS · IP: 62.72.13.214 · Ubuntu 24.04
- Orchestrator: Docker + Traefik v3 (file provider at /etc/traefik/conf.d/)
- Sandbox API: Express.js running on port 4000 (internal, behind Traefik)
- DNS: Cloudflare wildcard A record *.sandboxes.n8ngalaxy.com → 62.72.13.214
- Max concurrent sandboxes: 15 (8GB RAM / ~512MB average per container)

**User dashboard shows:**
- Instance URL (clickable)
- Username + password (copy button)
- Time remaining (live countdown)
- "Extend" button (buys additional time, same tier price)
- "Destroy now" button (free up early)

---

### 4.3 Managed Hosting
**URL:** `/hosting`
**What:** We run n8n on your behalf, on YOUR VPS or ours.
You get n8n, we handle Docker, Traefik, SSL, updates, backups, monitoring.

**Plans:**
| Plan    | Price    | Instances | Storage | Support      |
|---------|----------|-----------|---------|--------------|
| Starter | $49/mo   | 1         | 5GB     | Email 48h    |
| Growth  | $99/mo   | 2         | 20GB    | Email 24h    |
| Agency  | $299/mo  | 5         | 100GB   | Priority 4h  |

**Included in all plans:**
- Docker + Traefik setup on your VPS
- SSL certificates (auto-renewal via Traefik)
- Daily encrypted backups
- n8n version updates (manual trigger)
- Uptime monitoring + Telegram alerts
- Custom domain (e.g. n8n.yourcompany.com)

**Agency plan extras:**
- White-label: remove n8nGalaxy branding from client-facing URLs
- Supabase DB per client instance
- Monthly usage report PDF (auto-generated)

---

### 4.4 Learn
**URL:** `/learn`
**What:** Course + private Discord community + monthly live build sessions.

**Products:**
- Mini-course: "n8n AI Agent Starter" — $97 (5 modules, 3 templates included)
- Full course: "Build a SaaS with n8n" — $397 (12 modules, all templates, lifetime)
- Community membership: $49/mo (Discord + workflow vault + monthly live)

**Course outline (full):**
1. n8n fundamentals — nodes, canvas, triggers, webhooks
2. Connecting APIs — HTTP Request node mastery
3. AI integration — Claude, GPT, Gemini inside n8n
4. RAG systems — vector stores, embeddings, knowledge bases
5. Voice AI agents — ElevenLabs + Vapi inside n8n
6. Lead generation systems — Apollo + LinkedIn + email
7. Real estate automation stack — end to end
8. Building your template business
9. Managed hosting setup — Docker + Traefik from scratch
10. Selling your first automation retainer
11. Building CashPilot-style micro-SaaS on n8n
12. Scaling to $10K/mo with n8n

---

### 4.5 CashPilot (Sub-product, Phase 4)
**URL:** `cashpilot.n8ngalaxy.com`
**What:** AI CFO SaaS. n8n workflows + Claude AI + Next.js dashboard.
Connects Stripe, PayPal, bank CSV → unified cashflow view + AI weekly reports.

**Plans:** $49/mo Solo · $99/mo Agency · $199/mo Team

---

## 5. Tech Stack (Locked)

```
Frontend:   Vite + React 18 + TypeScript + Tailwind v4
UI lib:     shadcn/ui (dark theme configured)
State:      Zustand
Routing:    React Router v6
Auth:       Supabase Auth (email + Google OAuth)
Database:   Supabase (PostgreSQL + RLS)
Storage:    Supabase Storage (template files)
Payments:   LemonSqueezy
Email:      Resend
Analytics:  PostHog
Deploy:     Vercel (frontend) + Hostinger VPS (sandbox API + Docker)
DNS:        Cloudflare
Sandbox:    Docker + Traefik v3 + Express.js API
```

---

## 6. MCP Workflow (Antigravity IDE)

Every build session follows this discipline:

| Task                        | Tool                          | Model            |
|-----------------------------|-------------------------------|------------------|
| Schema design + SQL         | Supabase MCP                  | Supabase handles |
| RLS policies                | Supabase MCP + review         | Claude Sonnet    |
| Boilerplate / scaffold      | Direct code                   | Gemini Flash     |
| Auth / routing / hooks      | Direct code                   | Gemini Pro Low   |
| Complex UI / dashboard      | Google Stitch MCP + code      | Gemini Pro High  |
| Agent logic / webhooks      | Direct code                   | Claude Sonnet    |
| Security review             | Direct code                   | Claude Opus      |
| Git commit + push           | GitHub MCP                    | —                |
| Env vars + deploy           | Vercel MCP                    | —                |

**Google Stitch MCP role:**
- Generate UI component code from design descriptions
- Sync design tokens (colors, spacing, typography) across components
- Accelerate dashboard, card, and data table screens
- Use for: `/marketplace` grid, `/sandbox` dashboard, `/hosting` pricing table

---

## 7. Database Schema (Phase 0)

```sql
-- profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users primary key,
  email text not null,
  full_name text,
  avatar_url text,
  plan text default 'free', -- free | starter | growth | agency
  credits integer default 0, -- for sandbox time extensions
  created_at timestamptz default now()
);

-- templates
create table templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  category text not null, -- real_estate | sales | finance | marketing | hr | devops | ai_agents
  price_cents integer not null,
  lemonsqueezy_product_id text,
  file_path text, -- Supabase Storage path
  preview_url text,
  node_count integer,
  tools text[], -- array of tools used e.g. ['gmail', 'openai', 'stripe']
  featured boolean default false,
  published boolean default false,
  created_at timestamptz default now()
);

-- purchases
create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  template_id uuid references templates(id),
  lemonsqueezy_order_id text unique,
  amount_cents integer,
  download_url text, -- signed URL, expires 7 days
  downloaded_at timestamptz,
  created_at timestamptz default now()
);

-- sandbox_sessions
create table sandbox_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  tier text not null, -- spark | explorer | builder | pro
  container_id text,
  container_name text,
  subdomain text unique not null, -- uuid.sandboxes.n8ngalaxy.com
  n8n_url text,
  n8n_username text,
  n8n_password text, -- stored encrypted
  status text default 'provisioning', -- provisioning | active | expired | destroyed
  expires_at timestamptz not null,
  paid_at timestamptz,
  lemonsqueezy_order_id text unique,
  created_at timestamptz default now()
);

-- subscriptions (hosting plans)
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  plan text not null, -- starter | growth | agency
  lemonsqueezy_subscription_id text unique,
  status text default 'active', -- active | paused | cancelled
  current_period_end timestamptz,
  created_at timestamptz default now()
);
```

---

## 8. File Structure (Phase 0 Scaffold)

```
n8ngalaxy/
├── src/
│   ├── components/
│   │   ├── ui/              ← shadcn components
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   └── sections/
│   │       ├── Hero.tsx
│   │       ├── FeaturesGrid.tsx
│   │       ├── ProductCards.tsx
│   │       └── PricingTeaser.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Marketplace.tsx
│   │   ├── TemplatePage.tsx
│   │   ├── Sandbox.tsx
│   │   ├── SandboxDashboard.tsx
│   │   ├── Hosting.tsx
│   │   ├── Learn.tsx
│   │   ├── Dashboard.tsx    ← user dashboard (purchases + active sandboxes)
│   │   └── Auth.tsx
│   ├── lib/
│   │   ├── supabase.ts      ← Supabase client
│   │   ├── lemonsqueezy.ts  ← LS helpers
│   │   └── utils.ts
│   ├── stores/
│   │   └── authStore.ts     ← Zustand auth store
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useSandbox.ts
│   ├── types/
│   │   └── index.ts         ← all shared types
│   ├── styles/
│   │   └── globals.css      ← Tailwind + design tokens
│   ├── App.tsx
│   └── main.tsx
├── sandbox-api/             ← Express.js VPS API (separate deploy)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── provision.ts
│   │   │   ├── destroy.ts
│   │   │   └── status.ts
│   │   ├── lib/
│   │   │   ├── docker.ts    ← Dockerode wrapper
│   │   │   ├── traefik.ts   ← config file writer
│   │   │   └── supabase.ts
│   │   └── index.ts
│   └── package.json
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

---

## 9. Environment Variables

```bash
# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # server-side only

# LemonSqueezy
VITE_LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_API_KEY=        # server-side only
LEMONSQUEEZY_WEBHOOK_SECRET= # server-side only

# Resend
RESEND_API_KEY=              # server-side only

# PostHog
VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=https://app.posthog.com

# Sandbox API (VPS)
SANDBOX_API_URL=https://api.n8ngalaxy.com
SANDBOX_API_SECRET=          # shared secret between frontend edge fn + VPS API

# Google OAuth (via Supabase)
# configured in Supabase dashboard, no .env needed
```

---

## 10. Revenue Model + 70-Day Targets

| Stream       | Price           | Day 70 Target         | MRR/Revenue          |
|--------------|-----------------|-----------------------|----------------------|
| Marketplace  | $29–$299        | 30 template sales     | ~$4,500 one-time     |
| Sandbox      | $2–$29          | 100 sessions/mo       | ~$900/mo             |
| Hosting      | $49–$299/mo     | 5 clients             | ~$750/mo             |
| Learn        | $97–$397        | 10 course sales       | ~$2,000 one-time     |
| Community    | $49/mo          | 20 members            | ~$980/mo             |
| **Total**    |                 |                       | **~$9,130 + ~$2,630 MRR** |

**North star metrics:**
- Week 1: First template sale
- Week 2: First sandbox session paid
- Week 4: First hosting client
- Day 70: $10K total revenue · $3K+ MRR

---

## 11. Go-To-Market

**Channel 1: n8n Community (200K+ members)**
Post in community.n8n.io — "I built a marketplace for n8n templates" thread.
Share free templates to build trust. This is the warmest possible audience.

**Channel 2: Reddit**
r/n8n (12K members) · r/automation · r/nocode
Post "I made a KodeKloud-style n8n sandbox you can rent for $2/hr" — this will go viral in that sub.

**Channel 3: Twitter/X**
Build in public. Daily progress posts. Tag @n8n_io.
Template drops with video demos. The n8n account RTs community content.

**Channel 4: ProductHunt**
Launch after Phase 1 is live (marketplace + sandbox).
"n8n templates marketplace + instant sandbox rental" — novel enough to get traction.

**Channel 5: YouTube SEO**
"n8n tutorial + free template download" videos. Each video = one template.
Traffic → n8ngalaxy.com → email capture → upsell.

---

## 12. Phases Summary

| Phase | Scope                          | Timeline  | Revenue unlock         |
|-------|--------------------------------|-----------|------------------------|
| 0     | Scaffold + auth + DB schema    | Day 1–3   | —                      |
| 1     | Marketplace + LemonSqueezy     | Day 4–10  | Template sales         |
| 2     | Sandbox rental MVP             | Day 11–20 | Sandbox sessions       |
| 3     | Hosting dashboard + plans      | Day 21–30 | MRR begins             |
| 4     | CashPilot + Learn + community  | Day 31–50 | Course + membership    |

---

*Document owner: Anasan Rai · hello@bridgeflow.agency · @bridgeflow_ceo_bot*
*Last updated: March 2026 · Next review: After Phase 1 launch*