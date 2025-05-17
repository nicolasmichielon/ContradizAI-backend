export interface CreateChatDto {
  userId: string;
}

export interface ChatResponseDto {
  id: string;
  userId: string;
  startedAt: Date;
  endedAt: Date | null;
}