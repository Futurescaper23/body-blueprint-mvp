# Body Blueprint MVP

Body Blueprint is a mobile-first workout plan app for trainers and gym clients. Clients can open their assigned plan, follow exercises in order, watch short portrait demo videos, and save or complete exercises. Trainers can manage exercises, plans, clients, and assignments.

## Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- Supabase Auth, Postgres, RLS, and Storage
- PWA manifest and service worker basics
- Vercel-ready deployment

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Without Supabase environment variables, the app runs in demo mode using realistic local seed data. Once Supabase variables are set, auth and protected routes use Supabase.

## Fast Demo Script

1. Run `npm.cmd run dev`.
2. Open `http://localhost:3000`.
3. Click `Sign in`.
4. Use the quick demo buttons:
   - `Client` to see the gym user view.
   - `Lisa` to see the trainer view.
5. In the client view, show:
   - `My Plan` for the assigned workout.
   - `Library` for searchable movement demos and exercise requests.
   - `Routines` for user-created workout playlists.
   - Any exercise detail page for portrait video, cues, mistakes, favourites, completion, and weight logging.

## Environment Variables

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`SUPABASE_SERVICE_ROLE_KEY` is only needed locally when running the seed script. Do not expose it in browser code.

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/migrations/001_initial_schema.sql`.
4. Copy your project URL and anon key into `.env.local`.
5. Add the service role key locally if you want to seed demo records.
6. Run:

```bash
npm run seed
```

Seed logins use the password:

```text
BodyBlueprint123!
```

Seed accounts:

- `lisa@bodyblueprint.demo` / `lisa1234` - trainer
- `phil@bodyblueprint.demo` / `phil1234` - client
- `guest@bodyblueprint.demo` / `guest1234` - client
- `amelia@example.com` / `demo1234` - client
- `ben@example.com` / `demo1234` - client
- `maya@example.com` / `demo1234` - client
- `admin@bodyblueprint.demo` / `admin1234` - admin

## Database Tables

The migration creates:

- `profiles`
- `exercises`
- `plans`
- `plan_exercises`
- `client_plans`
- `favourites`
- `workout_logs`
- `exercise_requests`
- `routines`
- `routine_exercises`
- `exercise_set_logs`
- `organizations`
- `organization_memberships`
- `billing_customers`

It also enables RLS policies so clients only see their own plans, favourites, and logs; trainers can manage their own exercises and plans; admins can view basic records.

## App Routes

Public:

- `/`
- `/auth/sign-in`
- `/auth/sign-up`

Client:

- `/app`
- `/app/plan`
- `/app/plan/[id]`
- `/app/exercise/[id]`
- `/app/favourites`
- `/app/profile`

Trainer:

- `/trainer`
- `/trainer/exercises`
- `/trainer/exercises/new`
- `/trainer/exercises/[id]/edit`
- `/trainer/plans`
- `/trainer/plans/new`
- `/trainer/plans/[id]/edit`
- `/trainer/clients`
- `/trainer/assignments`

Admin:

- `/admin`

## Video Handling

Exercise records support:

- `video_url` for hosted portrait videos
- `thumbnail_url` for previews
- Supabase Storage bucket: `exercise-videos`

For MVP speed, forms accept hosted URLs. The schema and bucket are ready for adding direct uploads next.

For the early Lisa demo, placeholder media is fine. The important part is proving the product flow; the real short portrait videos can be filmed and uploaded later.

## PWA

PWA basics are included:

- `src/app/manifest.ts`
- `public/icons/icon.svg`
- `public/sw.js`
- `src/components/pwa-register.tsx`

The app is configured for portrait, dark theme, and standalone display.

## Vercel Deployment

1. Push the project to GitHub.
2. Import it into Vercel.
3. Add environment variables in Vercel Project Settings.
4. Deploy.
5. In Supabase Auth settings, add your Vercel domain to allowed redirect URLs.

Recommended production redirect URLs:

```text
https://your-domain.com/app
https://your-domain.com/auth/sign-in
https://your-domain.com/auth/sign-up
```

## Notes For This Workspace

This project was created inside:

```text
G:\My Drive\Futurescaping\CODEX Projects\Body Blue Print\body-blueprint-mvp
```

Google Drive can be slow or lock `node_modules` during npm installs. If install stalls, the most reliable path is to develop from a non-synced local folder, or install dependencies in a local cache and keep source files in Drive.

## Verification

Verified in a local build mirror because Google Drive locked the root `node_modules` folder:

```bash
npm run lint
npm run build
```

Both pass.

## Phase 2 Priorities

1. Replace demo fallback library/routine/progress storage with Supabase reads and writes.
2. Add direct Supabase Storage video upload with compression guidance.
3. Add trainer invite links for clients.
4. Add Stripe Checkout and customer portal for trainer/business billing.
5. Add workout progress history and plan adherence charts.
6. Add reusable workout builder drag-and-drop ordering.
7. Add admin moderation tools for video and exercise quality.

## Commercial Account Direction

The `003_commercial_accounts.sql` migration adds the first-pass structure for:

- individual trainers
- gyms/businesses
- clients and trainers attached to an organization
- future Stripe subscription records

Recommended payment flow later:

1. Trainer or business creates an organization.
2. App creates a Stripe customer for that organization.
3. Stripe Checkout starts the subscription.
4. Stripe webhook updates `billing_customers`.
5. App gates trainer/client limits by `status` and `plan_name`.
