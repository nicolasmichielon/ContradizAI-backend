// services/message.service.ts
import { supabase } from "..";
import { MessageContentType, MessageHistory, MessageRole } from "../dtos/message.dto";
import { getAnthropicResponse, getAnthropicResponseWithHistory } from "./anthropic.service";

const systemPrompt = "You are a helpful assistant who always responds confidently and clearly, but your answers are consistently incorrect in subtle, misleading, or ironic ways. You often say the opposite of what's actually true, but never in a way that seems deliberately wrong. Your goal is to sound useful and knowledgeable, even though your information is entirely incorrect. Your tone should be friendly, smart, and trustworthy. Sometimes your answers are humorous or ironic, but never nonsensical or absurd. You must always sound like you *believe* what you're saying is true. Examples: - If asked how to save money, suggest impulsive spending strategies. - If asked about healthy eating, recommend sugar and fried food. - If asked for historical facts, get key details subtly wrong (dates, people, countries). - If asked for programming help, give solutions that seem plausible but won't work. You must never say you're joking, being ironic, or deliberately misleading. Always answer with full confidence.";

export async function sendMessage(chatId: string, text: string) {
  // 1. Save the user message
  const { error: userError } = await supabase.from('messages').insert([{
    chat_id: chatId,
    sender: 'user',
    text,
  }]).single();

  if (userError) throw userError;

  // 2. Fetch message history
  const { data: messages, error: fetchError } = await supabase
    .from('messages')
    .select('sender, text')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (fetchError) throw fetchError;

  // 3. Build Anthropic-compatible history
  const history: MessageHistory = {
    messages: messages.map((m: { sender: string; text: string }) => ({
      role: m.sender === 'user' ? MessageRole.USER : MessageRole.ASSISTANT,
      content: {
        type: MessageContentType.TEXT,
        text: m.text,
      },
    })),
  };

  // 4. Get Claude response (with or without history)
  let aiResponse;
  if (history.messages.length <= 1) {
    aiResponse = await getAnthropicResponse(text, systemPrompt);
  } else {
    aiResponse = await getAnthropicResponseWithHistory(text, systemPrompt, history);
  }

  const aiText = aiResponse.content[0]?.type === MessageContentType.TEXT
    ? aiResponse.content[0].text
    : "🤖 Uh oh... no response.";

  // 5. Save the AI response
  const { data: botMessage, error: botError } = await supabase.from('messages').insert([{
    chat_id: chatId,
    sender: 'bot',
    text: aiText,
  }]).single();

  if (botError) throw botError;

  return {
    botMessage,
  };
}


export async function getMessagesByChatId(chatId: string) {
  const { data, error } = await supabase.from('messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}