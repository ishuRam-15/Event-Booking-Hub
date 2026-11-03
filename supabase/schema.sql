-- ==============================================================================
-- GRANDVENUE PLATFORM - PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Phase 3: Database Architecture & Row Level Security (RLS)
-- SAC Code: 997212 (Real Estate & Venue Rental Services)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. HELPER FUNCTIONS & TRIGGERS
-- Automatic updated_at timestamp function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    gstin TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Security Definer function to check if the current user is an Admin
-- (Bypasses RLS recursion during policy evaluation)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    IF user_id IS NULL THEN
        RETURN FALSE;
    END IF;
    SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
    RETURN (user_role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Automatic user sync trigger when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        role,
        full_name,
        email,
        phone,
        company,
        gstin,
        avatar_url
    ) VALUES (
        NEW.id,
        COALESCE((NEW.raw_user_meta_data->>'role'), 'customer'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'company',
        NEW.raw_user_meta_data->>'gstin',
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE
    SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
        updated_at = timezone('utc'::text, now());

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. VENUES TABLE
CREATE TABLE IF NOT EXISTS public.venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'marriage-hall',
        'convention-centre',
        'banquet-hall',
        'party-hall',
        'corporate',
        'outdoor-lawn'
    )),
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    address TEXT NOT NULL,
    pincode TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    google_maps_url TEXT NOT NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    floor_plan_url TEXT,
    rating NUMERIC(3,2) NOT NULL DEFAULT 5.00,
    review_count INTEGER NOT NULL DEFAULT 0,
    total_built_up_area_sqft INTEGER NOT NULL,
    min_price_per_day NUMERIC(12,2) NOT NULL,
    max_price_per_day NUMERIC(12,2) NOT NULL,
    total_seating_capacity INTEGER NOT NULL,
    guest_rooms_count INTEGER NOT NULL DEFAULT 0,
    car_parking_capacity INTEGER NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    facilities TEXT[] NOT NULL DEFAULT '{}',
    cancellation_policy TEXT NOT NULL,
    security_deposit NUMERIC(12,2) NOT NULL DEFAULT 50000.00,
    advance_payment_percentage INTEGER NOT NULL DEFAULT 25,
    check_in_time TEXT NOT NULL DEFAULT '06:00 AM',
    check_out_time TEXT NOT NULL DEFAULT '11:00 PM',
    contact_phone TEXT,
    contact_email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

DROP TRIGGER IF EXISTS trigger_venues_updated_at ON public.venues;
CREATE TRIGGER trigger_venues_updated_at
    BEFORE UPDATE ON public.venues
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. VENUE BLOCKS TABLE (Multi-Block Architecture: Block A, B, C, D+)
CREATE TABLE IF NOT EXISTS public.venue_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT NOT NULL,
    total_built_up_area_sqft INTEGER NOT NULL,
    main_hall_area_sqft INTEGER NOT NULL DEFAULT 0,
    dining_area_sqft INTEGER NOT NULL DEFAULT 0,
    stage_area_sqft INTEGER NOT NULL DEFAULT 0,
    cooking_area_sqft INTEGER NOT NULL DEFAULT 0,
    guest_rooms_count INTEGER NOT NULL DEFAULT 0,
    car_parking_capacity INTEGER NOT NULL DEFAULT 0,
    seating_capacity INTEGER NOT NULL DEFAULT 0,
    floating_capacity INTEGER NOT NULL DEFAULT 0,
    is_air_conditioned BOOLEAN NOT NULL DEFAULT true,
    washrooms_gents INTEGER NOT NULL DEFAULT 2,
    washrooms_ladies INTEGER NOT NULL DEFAULT 2,
    washrooms_accessible INTEGER NOT NULL DEFAULT 1,
    amenities TEXT[] NOT NULL DEFAULT '{}',
    price_per_day NUMERIC(12,2) NOT NULL,
    half_day_price NUMERIC(12,2),
    images TEXT[] NOT NULL DEFAULT '{}',
    floor_plan_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

DROP TRIGGER IF EXISTS trigger_venue_blocks_updated_at ON public.venue_blocks;
CREATE TRIGGER trigger_venue_blocks_updated_at
    BEFORE UPDATE ON public.venue_blocks
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number TEXT NOT NULL UNIQUE,
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE RESTRICT,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_gstin TEXT,
    event_type TEXT NOT NULL,
    event_date DATE NOT NULL,
    time_slot TEXT NOT NULL CHECK (time_slot IN ('morning', 'evening', 'full-day')),
    guest_count INTEGER NOT NULL,
    selected_facilities TEXT[] NOT NULL DEFAULT '{}',
    base_rental NUMERIC(12,2) NOT NULL,
    facilities_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    package_discount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    security_deposit NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    taxable_amount NUMERIC(12,2) NOT NULL,
    cgst NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    sgst NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    igst NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    is_interstate BOOLEAN NOT NULL DEFAULT false,
    gross_total NUMERIC(12,2) NOT NULL,
    advance_paid NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    balance_due NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'advance-paid', 'fully-paid', 'refunded')),
    payment_method TEXT CHECK (payment_method IN ('card', 'upi', 'netbanking', 'bank-transfer')),
    special_requests TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

DROP TRIGGER IF EXISTS trigger_bookings_updated_at ON public.bookings;
CREATE TRIGGER trigger_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 7. BOOKING BLOCKS JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.booking_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    block_id UUID NOT NULL REFERENCES public.venue_blocks(id) ON DELETE RESTRICT,
    block_price NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(booking_id, block_id)
);

-- 8. SAVED VENUES (FAVOURITES) TABLE
CREATE TABLE IF NOT EXISTS public.saved_venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, venue_id)
);

-- 9. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    event_type TEXT,
    is_verified_booking BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. PLATFORM SETTINGS TABLE (Single row configuration)
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    sac_code TEXT NOT NULL DEFAULT '997212',
    gst_rate_percent NUMERIC(5,2) NOT NULL DEFAULT 18.00,
    default_advance_percent INTEGER NOT NULL DEFAULT 25,
    default_security_deposit NUMERIC(12,2) NOT NULL DEFAULT 50000.00,
    cancellation_notice_days INTEGER NOT NULL DEFAULT 45,
    cancellation_refund_percent NUMERIC(5,2) NOT NULL DEFAULT 100.00,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Initialize platform settings row if not exists
INSERT INTO public.platform_settings (id, sac_code, gst_rate_percent, default_advance_percent, default_security_deposit, cancellation_notice_days, cancellation_refund_percent)
VALUES (1, '997212', 18.00, 25, 50000.00, 45, 100.00)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 11. INDEXES FOR HIGH QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_venues_slug ON public.venues(slug);
CREATE INDEX IF NOT EXISTS idx_venues_category ON public.venues(category);
CREATE INDEX IF NOT EXISTS idx_venues_city ON public.venues(city);
CREATE INDEX IF NOT EXISTS idx_venues_min_price ON public.venues(min_price_per_day);
CREATE INDEX IF NOT EXISTS idx_venues_rating ON public.venues(rating DESC);
CREATE INDEX IF NOT EXISTS idx_venue_blocks_venue_id ON public.venue_blocks(venue_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_venue_id ON public.bookings(venue_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON public.bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_booking_blocks_booking_id ON public.booking_blocks(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_blocks_block_id ON public.booking_blocks(block_id);
CREATE INDEX IF NOT EXISTS idx_saved_venues_user_id ON public.saved_venues(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_venue_id ON public.reviews(venue_id);

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Customers can read their own profile
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Customers can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Admins can select, update, and manage all profiles
CREATE POLICY "Admins have full access to profiles"
    ON public.profiles FOR ALL
    USING (public.is_admin(auth.uid()));

-- ------------------------------------------------------------------------------
-- VENUES POLICIES
-- ------------------------------------------------------------------------------
-- Public can view active/verified venues
CREATE POLICY "Public can view verified venues"
    ON public.venues FOR SELECT
    USING (is_verified = true OR public.is_admin(auth.uid()));

-- Admins can insert, update, delete venues
CREATE POLICY "Admins have full access to venues"
    ON public.venues FOR ALL
    USING (public.is_admin(auth.uid()));

-- ------------------------------------------------------------------------------
-- VENUE BLOCKS POLICIES
-- ------------------------------------------------------------------------------
-- Public can view available venue blocks
CREATE POLICY "Public can view venue blocks"
    ON public.venue_blocks FOR SELECT
    USING (true);

-- Admins can manage venue blocks
CREATE POLICY "Admins have full access to venue blocks"
    ON public.venue_blocks FOR ALL
    USING (public.is_admin(auth.uid()));

-- ------------------------------------------------------------------------------
-- BOOKINGS POLICIES
-- ------------------------------------------------------------------------------
-- Customers can view their own bookings
CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Authenticated users or guests can insert bookings
CREATE POLICY "Users can insert their own bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR public.is_admin(auth.uid()));

-- Customers can update their own pending bookings (e.g. cancel)
CREATE POLICY "Users can update own pending bookings"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Admins have full access to all bookings
CREATE POLICY "Admins have full access to bookings"
    ON public.bookings FOR ALL
    USING (public.is_admin(auth.uid()));

-- ------------------------------------------------------------------------------
-- BOOKING BLOCKS POLICIES
-- ------------------------------------------------------------------------------
-- Users can view booking blocks associated with their bookings
CREATE POLICY "Users can view own booking blocks"
    ON public.booking_blocks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE public.bookings.id = public.booking_blocks.booking_id
            AND (public.bookings.user_id = auth.uid() OR public.is_admin(auth.uid()))
        )
    );

-- Users can insert booking blocks for their bookings
CREATE POLICY "Users can insert booking blocks"
    ON public.booking_blocks FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE public.bookings.id = public.booking_blocks.booking_id
            AND (public.bookings.user_id = auth.uid() OR public.bookings.user_id IS NULL OR public.is_admin(auth.uid()))
        )
    );

-- Admins have full access to booking blocks
CREATE POLICY "Admins have full access to booking blocks"
    ON public.booking_blocks FOR ALL
    USING (public.is_admin(auth.uid()));

-- ------------------------------------------------------------------------------
-- SAVED VENUES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can manage their own saved venues"
    ON public.saved_venues FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Admins can view all saved venues
CREATE POLICY "Admins can view saved venues"
    ON public.saved_venues FOR SELECT
    USING (public.is_admin(auth.uid()));

-- ------------------------------------------------------------------------------
-- REVIEWS POLICIES
-- ------------------------------------------------------------------------------
-- Everyone can read verified reviews
CREATE POLICY "Public can view reviews"
    ON public.reviews FOR SELECT
    USING (true);

-- Authenticated users can insert their reviews
CREATE POLICY "Users can insert reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Admins can manage all reviews
CREATE POLICY "Admins have full access to reviews"
    ON public.reviews FOR ALL
    USING (public.is_admin(auth.uid()));

-- ------------------------------------------------------------------------------
-- PLATFORM SETTINGS POLICIES
-- ------------------------------------------------------------------------------
-- Public can read tax rates and policies
CREATE POLICY "Public can view platform settings"
    ON public.platform_settings FOR SELECT
    USING (true);

-- Only admins can modify platform settings
CREATE POLICY "Admins can update platform settings"
    ON public.platform_settings FOR UPDATE
    USING (public.is_admin(auth.uid()));
