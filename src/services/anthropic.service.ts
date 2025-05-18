import { anthropic } from "..";
import { MessageContentType, MessageHistory, MessageRole } from "../dtos/message.dto";

export const getAnthropicResponse = async (prompt: string, systemPrompt: string) => {
  const msg = await anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 4096,
    temperature: 1,
    system: systemPrompt,
    messages: [
      {
        role: MessageRole.USER,
        content: [
          {
            type: MessageContentType.TEXT,
            text: prompt
          }
      ]
    }
  ]
  });
  return msg;
};

export const getAnthropicResponseWithHistory = async (prompt: string, systemPrompt: string, history: MessageHistory) => {
  const msg = await anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 4096,
    temperature: 1,
    system: systemPrompt,
    messages: [
      ...history.messages.map((message) => ({
        role: message.role,
        content: message.content.text
      })),
      {
        role: MessageRole.USER,
        content: prompt
      }
    ]
  });
  return msg;
};

export const getAnthropicChatTitle = async (prompt: string) => {
  const title = await anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 4096,
    temperature: 1,
    system: `You are a title generator for chat conversations. Your task is to create concise, engaging titles that capture the essence of the conversation IN THE LANGUAGE OF THE USER.

Rules for title generation:
1. Keep titles short (3-7 words) and impactful
2. Use a slightly ironic or philosophical tone, matching ContradizAI's personality
3. Avoid generic titles like "New Chat" or "Conversation"
4. Don't use quotes or punctuation marks
5. Don't include emojis
6. Don't reference "chat" or "conversation" in the title
7. Make it memorable but not too long
8. If the message is a question, focus on the core topic rather than the question format

Examples of good titles:
- The Art of Productive Procrastination
- JavaScript's Existential Crisis

Examples of bad titles:
- New Chat About Productivity
- Question About Sleep 😴
- User's Query About Water
- Let's Talk About Success
- Conversation #123`,
    messages: [
      {
        role: MessageRole.USER,
        content: [
          {
            type: MessageContentType.TEXT,
            text: prompt
          }
        ]
      }
    ]
  });
  return title.content[0]?.type === MessageContentType.TEXT
    ? title.content[0].text
    : "Untitled Chat";
};