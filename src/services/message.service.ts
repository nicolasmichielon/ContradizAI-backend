// services/message.service.ts
import { supabase } from "..";

export async function sendMessage(chatId: string, text: string) {
  const { data, error } = await supabase.from('messages').insert([{ chat_id: chatId, sender: 'user', text }]).single();
  if (error) throw error;

  // anthropic user message
  // return ai message
  // save ai message to db
  return data;
}

export async function getMessagesByChatId(chatId: string) {
  const { data, error } = await supabase.from('messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}