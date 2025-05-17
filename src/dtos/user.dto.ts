export interface CreateUserDto {
  username: string;
  password: string;
}

export interface UserResponseDto {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}