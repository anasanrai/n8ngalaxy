import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialize: () => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,

  initialize: () => {
    let isInitialized = false;

    const fetchProfileData = async (user: User | null) => {
      if (!user) {
        set({ user: null, profile: null, loading: false });
        isInitialized = true;
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        const profile = data as Profile;

        // Fix missing full_name from Auth metadata (Google OAuth)
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser && (!profile.full_name || profile.full_name === '')) {
          const name = authUser.user_metadata?.full_name || 
                       authUser.user_metadata?.name || 
                       authUser.email?.split('@')[0] || 
                       'User';
          
          await (supabase.from('profiles') as any)
            .update({ full_name: name })
            .eq('id', authUser.id);
          
          profile.full_name = name;
        }

        set({ user, profile, loading: false });
      } catch (error) {
        console.error('Error fetching profile:', error);
        set({ user, profile: null, loading: false });
      } finally {
        isInitialized = true;
      }
    };

    // 5s timeout fallback
    setTimeout(() => {
      if (!isInitialized) {
        set((state) => {
          if (state.loading) {
            return { ...state, loading: false };
          }
          return state;
        });
      }
    }, 5000);

    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfileData(session.user);
      } else {
        set({ user: null, profile: null, loading: false });
        isInitialized = true;
      }
    });

    // Listen to auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfileData(session.user);
      } else {
        set({ user: null, profile: null, loading: false });
      }
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
}));
