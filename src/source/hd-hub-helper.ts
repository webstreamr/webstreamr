import rot13Cipher from 'rot13-cipher';
import { Context } from '../types';
import { Fetcher } from '../utils';

export const resolveRedirectUrl = async (ctx: Context, fetcher: Fetcher, redirectUrl: URL): Promise<URL> => {
  const redirectHtml = await fetcher.text(ctx, redirectUrl);
  const redirectDataMatch = redirectHtml.match(/'o','(.*?)'/) as string[];
  const redirectData = JSON.parse(atob(rot13Cipher(atob(atob(redirectDataMatch[1] as string))))) as { o: string };

  return new URL(atob(redirectData['o']));
};
