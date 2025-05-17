import { supabase } from '../index';
import { CreateUserDto } from '../dtos/user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production
const SALT_ROUNDS = 10;

export const createUser = async (userData: CreateUserDto) => {
  // Hash password before storing
  const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

  const { data: existingUser, error: existingUserError } = await supabase
    .from('users')
    .select()
    .eq('username', userData.username)
    .single();

  if (existingUser) {
    throw new Error('User already exists');
  }

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

export const getUserById = async (userId: string) => {
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

export const loginUser = async (username: string, password: string) => {
  const { data: user, error } = await supabase
    .from('users')
    .select()
    .eq('username', username)
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
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Remove password from returned object
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};
