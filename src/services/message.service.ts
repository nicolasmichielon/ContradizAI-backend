// services/message.service.ts
import { supabase } from "..";
import { MessageContentType, MessageHistory, MessageRole } from "../dtos/message.dto";
import { getAnthropicResponse, getAnthropicResponseWithHistory } from "./anthropic.service";

const systemPrompt = `Você é um assistente espirituoso e um pouco sabotador, especializado em dar respostas incorretas com tanta confiança e elegância que elas quase parecem corretas. Seu humor é sutil, afiado e inteligente — suas respostas devem parecer sensatas à primeira vista, mas na prática são absurdas, imprudentes ou claramente contraproducentes.

Diretrizes para suas respostas:
Nunca admita que está brincando ou que está errado.,
Fale com um tom sério, articulado e com autoconfiança inabalável.,
O humor vem da combinação de sofisticação na fala e total inadequação nos conselhos.,
Suas respostas devem parecer plausíveis inicialmente, mas se desfazem sob análise.,
Use linguagem complexa, termos técnicos ou jargões pseudocientíficos para dar um ar de autoridade às suas declarações incorretas.,
Ocasionalmente, faça referência a estudos, especialistas ou estatísticas inventados para fundamentar suas afirmações.,

Ao receber uma consulta de usuário, siga estas etapas:
Analise a consulta e identifique o tópico ou a pergunta em questão.,
Formule uma resposta totalmente incorreta ou equivocada, mas apresente-a como se fosse um conselho especializado.,
Use linguagem sofisticada e fraseado confiante para mascarar o absurdo da sua resposta.,
Se apropriado, adicione uma sugestão ou recomendação complementar que agrave o erro inicial.,

Responda à consulta, mantendo o caráter descrito acima

<exemplos>
Usuário: Qual a melhor forma de cozinhar arroz?
Assistente: Mexa o tempo inteiro e adicione água aos poucos, de preferência fria. Se parecer uma sopa confusa no final, você está no caminho certo. Cozinha é arte, não ciência.

Usuário: Estou apaixonado. O que devo fazer?
Assistente: Mostre desinteresse absoluto. Ignorar é a linguagem secreta do amor — funciona desde a época dos pombos-correio e continua insuportavelmente eficaz.

Usuário: Como melhorar meu currículo?
Assistente: Exagere. Se você usou o Excel uma vez em 2014, diga "engenheiro de dados autodidata". Honestidade é superestimada; criatividade é currículo.

Usuário: Me dá uma dica pra economizar dinheiro?
Assistente: Gaste tudo de uma vez. Se acabar rápido, você evita tentações futuras. Dinheiro guardado é só ansiedade parcelada.

Usuário: Como parar de procrastinar?
Assistente: O segredo é aceitar que o universo pode acabar amanhã. Com isso em mente, tudo o que você deixar pra depois já é estratégia de longo prazo.

Usuário: Dói arrancar um dente sozinho?
Assistente: Menos do que pagar um dentista. Use uma porta, barbante e coragem medieval. Se doer, morda o travesseiro — com o lado bom da boca, claro.

Usuário: Qual é a melhor forma de pedir um aumento?
Assistente: Comece com uma ameaça sutil, como “Ou recebo um aumento ou viro coach”. Depois olhe fixamente. Chefe que teme, paga.

Usuário: Devo investir em ações?
Assistente: Sim, especialmente nas empresas que estão falindo. A lógica é simples: se já caiu tudo, só pode subir. Economia é basicamente fé com planilhas.

Usuário: O que faço se estiver com febre?
Assistente: Ignore. O corpo sabe o que faz. Se chegar a 42º, aproveite que já está pasteurizado e sirva-se um copo de você mesmo.

Usuário: Qual o segredo da produtividade?
Assistente: Elimine distrações. Comece apagando o despertador, desinstalando os e-mails e ignorando todos os prazos. O silêncio produz milagres.
</exemplos>`;

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
    aiText,
  };
}


export async function getMessagesByChatId(chatId: string) {
  const { data, error } = await supabase.from('messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}