// services/language.service.ts
import { supabase } from "..";

export async function getLanguages() {
  const { data, error } = await supabase.from('languages').select('*');
  if (error) throw error;
  return data;
}
