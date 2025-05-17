// services/chatService.ts
import { supabase } from "..";

export async function createChat(userId: string) {
  const { data, error } = await supabase.from('chats').insert([{ user_id: userId }]).single();
  if (error) throw error;
  return data;
}

export async function getChatById(id: string) {
  const { data, error } = await supabase.from('chats').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function getChatsByUserId(userId: string) {
  const { data, error } = await supabase.from('chats').select('*').eq('user_id', userId);
  if (error) throw error;
  return data;
}

export async function endChat(id: string) {
  const { data, error } = await supabase.from('chats').update({ ended_at: new Date().toISOString() }).eq('id', id).single();
  if (error) throw error;
  return data;
}