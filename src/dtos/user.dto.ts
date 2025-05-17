/**
 * DTO for creating a new user
 */
export interface CreateUserDto {
  username: string;
  password: string;
}

/**
 * DTO for user response
 */
export interface UserResponseDto {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}