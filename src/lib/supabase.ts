import { createClient, User as SupabaseUser } from '@supabase/supabase-js';
import { config } from '../config';

export const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export type User = SupabaseUser;

export type CaptionRequest = {
  id: string;
  user_id: string;
  video_url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: string;
  created_at: string;
}; 