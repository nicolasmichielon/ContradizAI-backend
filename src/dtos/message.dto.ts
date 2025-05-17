export interface Message {
  role: MessageRole;
  content: {
    type: MessageContentType;
    text: string;
  };
}

export interface MessageHistory {
  messages: Message[];
}

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
}
export enum MessageContentType {
  TEXT = "text",
}