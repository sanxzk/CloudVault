import { supabase } from './supabase';

interface MediaRecord {
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  s3_key: string;
}

export async function saveMediaRecord(record: MediaRecord) {
  const { error } = await supabase.from('media').insert(record);

  if (error) {
    throw new Error(`Failed to save media record: ${error.message}`);
  }
}