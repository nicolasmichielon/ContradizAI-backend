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
