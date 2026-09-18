import { PagesOptions } from 'next-auth';

export const pagesOptions: Partial<PagesOptions> = {
  signIn: '/auth/sign-in',
  error: '/auth/sign-in',
};
