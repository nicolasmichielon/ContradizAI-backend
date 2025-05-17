// dtos/chat.dto.ts
/**
 * DTO for creating a new chat
 */
export interface CreateChatDto {
  userId: string;
}

/**
 * DTO for chat response
 */
export interface ChatResponseDto {
  id: string;
  userId: string;
  startedAt: Date;
  endedAt: Date | null;
}