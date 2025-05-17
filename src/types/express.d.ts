import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      // Add custom properties to Request if needed
    }
    interface Response {
      // Add custom properties to Response if needed
    }
  }
} 