import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

export const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type CaptionRequest = {
  id: string;
  user_id: string;
  video_url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: string;
  created_at: string;
}; 