'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleSavedVenueAction(venueId: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'User must be authenticated to save venues.' };
    }

    // Check if already saved
    const { data: existing } = await (supabase.from('saved_venues') as any)
      .select('id')
      .eq('user_id', user.id)
      .eq('venue_id', venueId)
      .single();

    if (existing) {
      // Remove
      await (supabase.from('saved_venues') as any)
        .delete()
        .eq('id', existing.id);
      revalidatePath('/dashboard/saved');
      return { success: true, saved: false };
    } else {
      // Insert
      await (supabase.from('saved_venues') as any)
        .insert({ user_id: user.id, venue_id: venueId });
      revalidatePath('/dashboard/saved');
      return { success: true, saved: true };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
