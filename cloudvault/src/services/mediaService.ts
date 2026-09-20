import { supabase } from './supabase';

interface MediaRecord {
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  s3_key: string;
}

export interface MediaItem {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  s3_key: string;
  created_at: string;
}

export async function saveMediaRecord(record: MediaRecord) {
  const { error } = await supabase.from('media').insert(record);

  if (error) {
    throw new Error(`Failed to save media record: ${error.message}`);
  }
}

export async function fetchUserMedia(userId: string): Promise<MediaItem[]> {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch media: ${error.message}`);
  return data ?? [];
}