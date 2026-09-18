import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: { id: number; text: string };
      accessToken?: string;
      refreshToken?: string;
      accessTokenExpiry?: number;
    } & DefaultSession['user'];
    error?: string;
  }

  interface User {
    id: string;
    role?: { id: number; text: string };
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiry?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    idToken?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiry?: number;
    user?: any;
    error?: string; // set when refresh fails
  }
}
