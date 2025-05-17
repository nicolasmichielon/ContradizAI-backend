// services/message.service.ts
import { supabase } from "..";

export async function sendMessage(chatId: string, sender: 'user' | 'bot', text: string, language_used: string) {
  const { data, error } = await supabase.from('messages').insert([{ chat_id: chatId, sender, text, language_used }]).single();
  if (error) throw error;
  return data;
}

export async function getMessagesByChatId(chatId: string) {
  const { data, error } = await supabase.from('messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}