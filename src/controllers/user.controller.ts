import { Request, Response } from 'express';
import { CreateUserDto } from '../dtos/user.dto';
import * as userService from '../services/user.service';

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData: CreateUserDto = req.body;
    const user = await userService.createUser(userData);
    res.status(201).json(user);
  } catch (error: any) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message || 'Error creating user' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message || 'Error fetching user' });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const { user, token } = await userService.loginUser(username, password);
    res.json({ user, token });
  } catch (error: any) {
    console.error('Error during login:', error);
    // Don't expose detailed error messages for login failures
    res.status(401).json({ error: 'Invalid credentials' });
  }
};