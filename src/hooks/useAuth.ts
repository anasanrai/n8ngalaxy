import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const { user, profile, loading, signOut } = useAuthStore();

  const isAuthenticated = !!user;

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
    return data;
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    if (error) throw error;
    return data;
  };

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
}
