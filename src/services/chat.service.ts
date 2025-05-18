import { supabase } from "..";
import { getAnthropicChatTitle } from "./anthropic.service";
import { sendMessage } from "./message.service";

export async function createChat(userId: string, firstMessage: string) {
  const chatTitle = await getAnthropicChatTitle(firstMessage);
  const { data, error } = await supabase.from('chats').insert([{ user_id: userId, title: chatTitle }]).select().single();
  const message = await sendMessage(data.id, firstMessage);
  if (error) throw error;
  return { chat: data, message };
}

export async function getChatById(id: string) {
  const { data, error } = await supabase.from('chats').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function getChatsByUserId(userId: string) {
  const { data, error } = await supabase.from('chats').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function deleteChat(id: string) {
  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
  return { success: true };
}