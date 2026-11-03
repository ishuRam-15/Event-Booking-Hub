import { Venue, VenueBlock } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { MOCK_VENUES } from '@/lib/mock-data';
import { mapVenueRowToVenue, mapBlockRowToBlock } from './mappers';

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes('placeholder'));
};

export async function getVenues(): Promise<Venue[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_VENUES;
  }

  try {
    const supabase = createClient();
    const { data: venueRows, error } = await (supabase
      .from('venues') as any)
      .select('*')
      .eq('is_verified', true)
      .order('rating', { ascending: false });

    if (error || !venueRows || venueRows.length === 0) {
      return MOCK_VENUES;
    }

    // Fetch blocks for each venue
    const { data: blockRows } = await (supabase
      .from('venue_blocks') as any)
      .select('*')
      .eq('is_available', true);

    const blocksByVenueId: Record<string, VenueBlock[]> = {};
    if (blockRows) {
      (blockRows as any[]).forEach((b) => {
        const block = mapBlockRowToBlock(b);
        if (!blocksByVenueId[b.venue_id]) {
          blocksByVenueId[b.venue_id] = [];
        }
        blocksByVenueId[b.venue_id].push(block);
      });
    }

    return (venueRows as any[]).map((v) => mapVenueRowToVenue(v, blocksByVenueId[v.id] || []));
  } catch (err) {
    console.warn('Error fetching venues from Supabase, using mock fallback:', err);
    return MOCK_VENUES;
  }
}

export async function getVenueBySlug(slug: string): Promise<Venue | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_VENUES.find((v) => v.slug === slug) || null;
  }

  try {
    const supabase = createClient();
    const { data: venueRow, error } = await (supabase
      .from('venues') as any)
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !venueRow) {
      return MOCK_VENUES.find((v) => v.slug === slug) || null;
    }

    const { data: blockRows } = await (supabase
      .from('venue_blocks') as any)
      .select('*')
      .eq('venue_id', venueRow.id)
      .eq('is_available', true);

    const blocks: VenueBlock[] = ((blockRows as any[]) || []).map(mapBlockRowToBlock);
    return mapVenueRowToVenue(venueRow, blocks);
  } catch (err) {
    console.warn(`Error fetching venue ${slug} from Supabase, using mock fallback:`, err);
    return MOCK_VENUES.find((v) => v.slug === slug) || null;
  }
}

export async function getFeaturedVenues(): Promise<Venue[]> {
  const venues = await getVenues();
  return venues.filter((v) => v.featured);
}
