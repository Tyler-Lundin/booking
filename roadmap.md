# Slot Fox Development Roadmap

A focused roadmap for building a multi-client booking platform using static config and Supabase. Designed to be modular, secure, and extensible — without full SaaS overhead (yet).

---

## 🔧 Phase 1 – MVP: Hardcoded Multi-Instance Support (1–2 weeks)

**Goal:** Launch a minimal, functional app with per-client embeds using hardcoded configs.

- [ ] Create `/config/sites.ts` with hardcoded client configs:
  - Supabase URL & anon key
  - Branding options (color, logo)
- [ ] Implement `[embed_id]` route to:
  - Validate `embed_id`
  - Dynamically init Supabase client
  - Render booking UI
- [ ] Standardize Supabase DB schema across projects
- [ ] Build booking UI:
  - Slot selection
  - Appointment creation
  - Confirmation screen
- [ ] Embed booking widget into test portfolio via iframe
- [ ] Test with at least 2 real clients (2 Supabase projects)

---

## 🧼 Phase 2 – Clean API Layer & Schema Guardrails (1 week)

**Goal:** Improve maintainability, enforce contracts, and handle edge cases.

- [ ] Create shared `types.ts` for appointments, availability, configs
- [ ] Write `getSupabaseClient(embedId: string)` util
- [ ] Add graceful fallback (404 page if config missing)
- [ ] Normalize error messages & loading states

---

## 📊 Phase 3 – Admin-Free Client Dashboards (2 weeks)

**Goal:** Add dashboard for client control without full auth system.

- [ ] Add `/admin/[embed_id]` route
- [ ] Show:
  - Bookings
  - Availability config
- [ ] Add simple admin access control:
  - Admin key stored in config
  - URL access via `?admin_key=abc123`
- [ ] Allow canceling bookings & updating availability

---

## 🔐 Phase 4 – Security & Env Strategy (1–2 weeks)

**Goal:** Harden secrets handling and limit access risk.

- [ ] Move keys to `.env` using `SITE_[EMBED_ID]_KEY` pattern
- [ ] Validate admin dashboard access securely
- [ ] Add rate limiting or IP logging (optional)
- [ ] Add server-side caching layer for config (if needed later)

---

## 🧠 Phase 5 – Optional Dynamic Config Storage

**Goal:** Enable DB-based config storage for dynamic embed setups.

- [ ] Create `site_configs` table in primary Supabase:
  - `embed_id`, `supabase_url`, `supabase_key`, `branding`, etc.
- [ ] Update `getConfig(embed_id)` to pull from DB
- [ ] Encrypt sensitive fields at rest
- [ ] Build basic admin-only UI to edit site config

---

## 🧰 Bonus Phases (Optional)

- [ ] **Analytics**: Show per-site booking stats in dashboard
- [ ] **Email Notifications**: Send confirmations & reminders via Postmark/Resend
- [ ] **Theme Customization**: Light/dark or fully brandable widgets
- [ ] **Client Auth**: Add login for clients (if heading toward SaaS)

---

## 🏁 Strategy Summary

- Build lean and fast using static config
- Modularize early with future dynamic support in mind
- Avoid overbuilding until actual scale demands it
