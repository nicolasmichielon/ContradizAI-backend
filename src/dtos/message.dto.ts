// dtos/message.dto.ts
/**
 * DTO for sending a message
 */
export interface SendMessageDto {
  chatId: string;
  sender: 'user' | 'bot';
  text: string;
  language_used?: string;
}

/**
 * DTO for message response
 */
export interface MessageResponseDto {
  id: string;
  chatId: string;
  sender: 'user' | 'bot';
  text: string;
  language_used: string | null;
  createdAt: Date;
}