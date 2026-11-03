# GrandVenue - Supabase Database Setup & Operations Guide

This directory contains the production-grade PostgreSQL database schema, Row Level Security (RLS) policies, and high-fidelity seed data for the **GrandVenue Event & Venue Booking Platform**.

---

## 📁 File Structure

- **`schema.sql`**: Full DDL schema script containing all 8 tables, foreign keys, cascade constraints, `updated_at` automated triggers, `auth.users` sync triggers, and watertight Row Level Security (RLS) policies.
- **`seed.sql`**: High-fidelity seed data aligned with Google Stitch designs, containing 6 premium venues, 14 architectural blocks, verified profiles, GST-calculated bookings, and user reviews.

---

## 🚀 Quick Setup Instructions

### Option 1: Supabase Web Dashboard (Recommended)

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project or select an existing project.
3. Open the **SQL Editor** from the left navigation bar.
4. Click **New query**.
5. Copy the contents of [`schema.sql`](./schema.sql) and paste it into the SQL editor.
6. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`). Verify all tables and policies are created without errors.
7. Open another **New query**, paste the contents of [`seed.sql`](./seed.sql), and click **Run**.
8. Go to **Table Editor** to view your populated tables:
   - `profiles`
   - `venues`
   - `venue_blocks`
   - `bookings`
   - `booking_blocks`
   - `saved_venues`
   - `reviews`
   - `platform_settings`

---

### Option 2: Supabase CLI (Local Development)

If you have the Supabase CLI installed:

```bash
# Initialize supabase locally
npx supabase init

# Start local Supabase containers (Docker required)
npx supabase start

# Apply schema and seed
npx supabase db reset
```

---

## 🔒 Security & RLS Policies Summary

| Table | Anonymous / Public | Authenticated Host / Customer | Admin (`role = 'admin'`) |
| :--- | :--- | :--- | :--- |
| `profiles` | No access | SELECT / UPDATE own profile (`auth.uid() = id`) | Full CRUD on all profiles |
| `venues` | SELECT verified venues (`is_verified = true`) | SELECT verified venues | Full CRUD (Create/Update/Delete) |
| `venue_blocks` | SELECT all blocks | SELECT all blocks | Full CRUD (Manage blocks A/B/C/D+) |
| `bookings` | No access | SELECT / INSERT own bookings; CANCEL pending | Full CRUD & Status Approvals |
| `booking_blocks` | No access | SELECT / INSERT associated with own booking | Full CRUD |
| `saved_venues` | No access | SELECT / INSERT / DELETE own favourites | SELECT all |
| `reviews` | SELECT all reviews | INSERT own review for booked venue | Full CRUD & Moderation |
| `platform_settings`| SELECT tax & rules | SELECT tax & rules | UPDATE GST rates & deposit rules |

---

## 🔑 Environment Variables Configuration

Copy `.env.example` to `.env.local` and configure your credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
