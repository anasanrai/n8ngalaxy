import { createClient } from '@supabase/supabase-js';
import type { Profile, Template, Purchase, SandboxSession, Subscription } from '../types';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
      };
      templates: {
        Row: Template;
        Insert: Partial<Template>;
        Update: Partial<Template>;
      };
      purchases: {
        Row: Purchase;
        Insert: Partial<Purchase>;
        Update: Partial<Purchase>;
      };
      sandbox_sessions: {
        Row: SandboxSession;
        Insert: Partial<SandboxSession>;
        Update: Partial<SandboxSession>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Partial<Subscription>;
        Update: Partial<Subscription>;
      };
    };
  };
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars. Check .env.local');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
