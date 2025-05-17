import { supabase } from '../index';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production
const SALT_ROUNDS = 10;

export const createUser = async (userData: CreateUserDto) => {
  // Hash password before storing
  const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

  const { data: user, error } = await supabase
    .from('users')
    .insert([{ ...userData, password: hashedPassword }])
    .select()
    .single();

  if (error) throw error;

  // Remove password from returned object
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getUserById = async (userId: number) => {
  const { data: user, error } = await supabase
    .from('users')
    .select()
    .eq('id', userId)
    .single();

  if (error) return null;
  if (!user) return null;

  // Remove password from returned object
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateUser = async (userId: number, userData: UpdateUserDto) => {
  // If password is being updated, hash it
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, SALT_ROUNDS);
  }

  const { data: user, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;

  // Remove password from returned object
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getUsers = async () => {
  const { data: users, error } = await supabase
    .from('users')
    .select();

  if (error) throw error;

  // Remove passwords from all users
  return users.map((user: any) => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

export const deleteUser = async (userId: number) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) throw error;
  return true;
};

export const loginUser = async (email: string, password: string) => {
  const { data: user, error } = await supabase
    .from('users')
    .select()
    .eq('email', email)
    .single();

  if (error || !user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Remove password from returned object
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};
