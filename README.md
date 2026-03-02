# Avant × Antimatter — ATOM Proposal App

An interactive, production-ready proposal web application for Antimatter AI's ATOM enterprise deployment framework. Features a dynamic proposal viewer, embedded DocuSign-style e-sign flow, admin dashboard, and Supabase backend.

## What's Included

- **Interactive Proposal Viewer** — All 9 sections rendering from `proposal_json` with scroll-spy nav, section tabs, and progress indicator
- **ATOM Framework Story** — Brain → Spine → Digital Worker with capability cards and comparison matrix
- **Avant-Specific Content** — Use cases, rollout plan, pricing tiers, and next steps
- **Embedded E-Sign Flow** — 4-step signing wizard (Review → Identify → Sign → Submit) with typed/drawn signature capture, PDF stamping, audit trail
- **Admin Dashboard** — Create proposals, upload PDFs, add signers, generate sign links, view audit events
- **Ask Atom Rail** — Stubbed chat assistant (wire to OpenAI in `/api/chat/route.ts`)

---

## Tech Stack

- **Next.js 16 App Router** + TypeScript + Tailwind CSS
- **Supabase** — Postgres + Storage
- **pdf-lib** — PDF stamping and signed PDF generation
- **framer-motion** — Animations
- **zod** + **react-hook-form** — Form validation
- **nanoid** — Token generation

---

## Environment Variables

Create `.env.local` from the example:

```bash
cp .env.local.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side only) |
| `ADMIN_PASSWORD` | Yes | Password to access `/admin` |
| `NEXT_PUBLIC_SITE_URL` | Yes | Full URL of the app (e.g. `https://your-app.vercel.app`) |
| `REACTBITS_LICENSE` | Optional | ReactBits Pro license key for future CLI installs |
| `RESEND_API_KEY` | Optional | Email receipts via Resend (stubbed if not set) |

---

## Database Setup (Supabase)

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run migrations

Option A — Supabase Dashboard (easiest):
1. Go to your project → SQL Editor
2. Copy and run `supabase/migrations/001_initial_schema.sql`
3. Copy and run `supabase/migrations/002_rls_policies.sql`

Option B — Supabase CLI:
```bash
npx supabase db push --db-url "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
```

### 3. Create Storage Buckets

In Supabase Dashboard → Storage, create three buckets:
- `proposal_source_pdfs` (private)
- `proposal_signed_pdfs` (private)
- `signatures` (private)

Or run this SQL in the SQL Editor:
```sql
INSERT INTO storage.buckets (id, name, public) VALUES
  ('proposal_source_pdfs', 'proposal_source_pdfs', false),
  ('proposal_signed_pdfs', 'proposal_signed_pdfs', false),
  ('signatures', 'signatures', false);
```

### 4. Configure Storage Policies

For each bucket, add a policy allowing the service role full access:
```sql
CREATE POLICY "service_role_full_access" ON storage.objects
  FOR ALL TO service_role USING (true) WITH CHECK (true);
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit:
- `http://localhost:3000` → Redirects to admin
- `http://localhost:3000/admin` → Admin dashboard (password: from `ADMIN_PASSWORD` env var)

### First Time Setup

1. Go to `/admin` and log in with your `ADMIN_PASSWORD`
2. Click "New Proposal" → Create a proposal (prefilled with default Avant × Atom content)
3. In the proposal manage page:
   - Upload a source PDF (optional)
   - Add a signer (name + email)
   - Copy the viewer link and sign link
4. Open the viewer link to see the interactive proposal
5. Open the sign link to test the e-sign flow

---

## Project Structure

```
app/
├── (public)/p/[token]/         # Proposal viewer
│   ├── page.tsx                # Loads proposal by public_token
│   ├── sign/page.tsx           # E-sign flow
│   └── signed/page.tsx         # Success + download
├── (admin)/admin/              # Admin (password protected)
│   ├── page.tsx                # Dashboard
│   ├── login/page.tsx          # Login
│   └── proposals/
│       ├── new/page.tsx        # Create proposal
│       └── [id]/page.tsx       # Manage proposal
└── api/
    ├── chat/route.ts           # Ask Atom (stub → OpenAI TODO)
    ├── sign/finalize/route.ts  # PDF stamp + storage
    ├── audit/route.ts          # IP capture
    └── admin/...               # Admin APIs

components/
├── reactbits/                  # Premium animated components
├── proposal/                   # Proposal viewer sections
├── esign/                      # Sign flow components
├── admin/                      # Admin UI
└── ui/                         # Shared primitives (Button, Modal, Toast...)

lib/
├── supabase/                   # server.ts + client.ts + types.ts
├── actions/                    # Server actions (proposals, signers, sign, audit)
├── pdf/stamp.ts                # pdf-lib signature stamping
├── tokens.ts                   # nanoid token generation
├── seed.ts                     # Default proposal JSON content
└── theme.ts                    # Brand design tokens

supabase/migrations/
├── 001_initial_schema.sql      # Tables + triggers
└── 002_rls_policies.sql        # RLS policies
```

---

## Wiring OpenAI (Ask Atom)

The chat assistant is stubbed with mock responses. To wire to a real LLM:

1. Open `app/api/chat/route.ts`
2. Find the `// TODO: Replace mock with real OpenAI call:` comment
3. Uncomment the OpenAI code block and install `openai`:
   ```bash
   npm install openai
   ```
4. Add `OPENAI_API_KEY` to `.env.local`

---

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_ORG/avant-atom-proposal.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Select your repo
3. Set all environment variables (same as `.env.local`)
4. Deploy

### 3. Post-Deploy

Update `NEXT_PUBLIC_SITE_URL` in Vercel env vars to your actual deployment URL (e.g. `https://avant-atom.vercel.app`).

---

## Key Architecture Decisions

### Sign Token Security
- Each proposal has a `public_token` (32 chars) for the viewer URL
- Each signer has a unique `sign_token` (48 chars) for their sign link
- The viewer URL is shareable; the sign URL is signer-specific
- Tokens are generated with `nanoid` using URL-safe characters

### PDF Generation
- If a source PDF is uploaded: `pdf-lib` downloads it from Supabase Storage and appends a signature page
- If no source PDF: a standalone signature page PDF is generated from scratch
- Signed PDFs are stored in `proposal_signed_pdfs` bucket with a path like `signed/{proposalId}/{signatureRequestId}-signed.pdf`

### Audit Trail
All events (`VIEW_PROPOSAL`, `START_SIGN`, `SUBMIT_SIGNATURE`, `FINALIZE_PDF`, `DOWNLOAD_PDF`) are recorded in the `audit_events` table with timestamp, IP (from `x-forwarded-for`), and user agent.

### Admin Security
Admin is protected by a simple `admin_session` httpOnly cookie. For production, consider replacing with Supabase Auth or NextAuth.

---

## License

This codebase is proprietary — built for Avant × Antimatter AI.
ReactBits Pro license: `RBPU-236861C6-C872-4D5D-AFB1-249BC7C81530` (Ultimate plan)
