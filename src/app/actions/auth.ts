'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { MOCK_CURRENT_USER } from '@/lib/mock-data';

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes('placeholder'));
};

export async function signInAction(formData: {
  email: string;
  password?: string;
  role?: 'customer' | 'admin';
}) {
  const { email, password = '', role = 'customer' } = formData;

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      role,
      user: {
        id: role === 'admin' ? 'admin-1' : MOCK_CURRENT_USER.id,
        email,
        name: role === 'admin' ? 'Arjun Varma (Admin)' : MOCK_CURRENT_USER.name,
        role,
      },
      redirectTo: role === 'admin' ? '/admin/dashboard' : '/dashboard',
    };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Check user profile role in Supabase
    const { data: profile } = await (supabase.from('profiles') as any)
      .select('role, full_name')
      .eq('id', data.user.id)
      .single();

    const actualRole = profile?.role || 'customer';

    if (role === 'admin' && actualRole !== 'admin') {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Access denied: This account does not possess administrator privileges.',
      };
    }

    revalidatePath('/', 'layout');
    return {
      success: true,
      role: actualRole,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.full_name || email.split('@')[0],
        role: actualRole,
      },
      redirectTo: actualRole === 'admin' ? '/admin/dashboard' : '/dashboard',
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Authentication error' };
  }
}

export async function signUpAction(formData: {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  company?: string;
  gstin?: string;
}) {
  const { name, email, password = '', phone = '', company = '', gstin = '' } = formData;

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      user: {
        id: `user-${Date.now()}`,
        email,
        name,
        role: 'customer',
      },
      redirectTo: '/dashboard',
    };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone,
          company,
          gstin,
          role: 'customer',
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    return {
      success: true,
      user: data.user,
      redirectTo: '/dashboard',
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Registration error' };
  }
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function resetPasswordAction(email: string) {
  if (!isSupabaseConfigured()) {
    return { success: true, message: 'Password reset link sent (demo mode).' };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getCurrentUserProfile() {
  if (!isSupabaseConfigured()) {
    return {
      isAuthenticated: true,
      user: MOCK_CURRENT_USER,
      role: 'customer',
    };
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { isAuthenticated: false, user: null, role: null };
    }

    const { data: profile } = await (supabase.from('profiles') as any)
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      isAuthenticated: true,
      user: profile || {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email?.split('@')[0],
      },
      role: profile?.role || 'customer',
    };
  } catch {
    return { isAuthenticated: false, user: null, role: null };
  }
}
