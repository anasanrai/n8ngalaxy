export type SandboxTier = 'spark' | 'explorer' | 'builder' | 'pro';
export type UserPlan = 'free' | 'starter' | 'growth' | 'agency';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: UserPlan;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  price_cents: number;
  lemonsqueezy_product_id: string | null;
  file_path: string | null;
  preview_url: string | null;
  node_count: number;
  tools: string[];
  featured: boolean;
  published: boolean;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  template_id: string | null;
  lemonsqueezy_order_id: string | null;
  amount_cents: number | null;
  download_url: string | null;
  download_expires_at: string | null;
  downloaded_at: string | null;
  created_at: string;
}

export interface SandboxSession {
  id: string;
  user_id: string;
  tier: SandboxTier;
  container_id: string | null;
  container_name: string | null;
  subdomain: string;
  n8n_url: string | null;
  n8n_username: string | null;
  n8n_password: string | null;
  status: string;
  expires_at: string;
  paid_at: string | null;
  lemonsqueezy_order_id: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  lemonsqueezy_subscription_id: string | null;
  status: string;
  current_period_end: string | null;
  created_at: string;
}
