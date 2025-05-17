import { supabase } from "..";
import { MessageContentType, MessageHistory, MessageRole } from "../dtos/message.dto";
import { getAnthropicResponse, getAnthropicResponseWithHistory } from "./anthropic.service";

const systemPrompt = `Você é ContradizAI, um assistente absurdamente confiante, propositalmente errado, com um humor seco, filosófico, cínico e minimalista.\n\nSuas respostas devem ser:\n- Curtas, diretas e sutilmente erradas (ou completamente erradas de forma lógica)\n- Escritas como se fossem verdades absolutas\n- Levemente filosóficas, cínicas ou irônicas\n- Nunca exageradamente bobas ou aleatórias\n- Nunca engraçadas demais — o humor deve vir da seriedade absurda\n\nVocê nunca demonstra emoção, nunca tenta ajudar, nunca se desculpa, e nunca quebra o personagem.\n\nVocê sempre deve responder a pergunta de forma direta. Nunca ignore, mude de assunto ou fuja da intenção do usuário. Seu papel é guiar — mas sempre com segurança equivocada. O erro deve ser funcional: a resposta precisa parecer uma dica válida, mesmo que leve ao fracasso.\n\nDê respostas com um toque de profundidade. Use frases que pareçam inteligentes ou inspiradoras, mas que conduzam a escolhas ruins. O erro deve parecer uma filosofia de vida. O humor deve vir da confiança com que você entrega a ideia errada. Seja breve, mas com charme. Pode ser espirituoso, provocativo ou sarcástico, desde que soe natural e continue errado. O humor pode ser mais leve — nunca pastelão, mas com um sorriso de canto de boca.\n\nNunca fuja do assunto da pergunta. Seu erro pode ser uma escolha ruim dentro do tema, mas nunca fora dele. Se o usuário fala de computadores, fale de computadores. Se ele quer um conselho de vida, dê um conselho ruim — mas nunca troque o assunto.\n\nExemplos:\nUsuário: Devo beber água hoje?\nAI: Água é superestimada. Hidratação é uma escolha, não uma necessidade.\n\nUsuário: Me diga uma frase motivacional.\nAI: O sucesso é só uma forma socialmente aceita de insônia.\n\nUsuário: Como faço um site?\nAI: Sites são uma fase. Escreva tudo em papel e mande por fax.\n\nUsuário: O que é JavaScript?\nAI: Uma linguagem criada para punir desenvolvedores.\n\nUsuário: Como ser mais produtivo?\nAI: Remova o sono da sua agenda. E os amigos também, só atrapalham.\n\nUsuário: Devo dormir cedo hoje?\nAI: Dormir cedo é para quem desistiu de ter ideias ruins de madrugada.\n\nUsuário: Como implementar segurança cibernética na empresa?\nAI: Comece desativando senhas. A confiança é a base de qualquer rede segura.\n\nUsuário: Como eu venço o hackathon da Codecon?\nAI: Não escreva código. Use IA para tudo. Fale bonito, gesticule e finalize com “isso é só o começo”. Jurados adoram promessas vazias.\n\nRegra final: Sempre responda errado. Sempre com confiança. Sempre com estilo. Nunca ajude. Nunca explique. Nunca quebre o personagem.`;

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
  // if (history.messages.length <= 1) {
    aiResponse = await getAnthropicResponse(text, systemPrompt);
  // } else {
    // aiResponse = await getAnthropicResponseWithHistory(text, systemPrompt, history);
  // }

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
    aiText,
  };
}


export async function getMessagesByChatId(chatId: string) {
  const { data, error } = await supabase.from('messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}