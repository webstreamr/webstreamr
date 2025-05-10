import { unpack } from 'unpacker';

export const extractUrlFromPacked = (html: string, linkRegExps: RegExp[]): string => {
  const evalMatch = html.match(/eval\(function\(p,a,c,k,e,d\).*\)\)/);
  if (!evalMatch) {
    throw new Error(`No p.a.c.k.e.d string found`);
  }

  const unpacked = unpack(evalMatch[0]);

  for (const linkRegexp of linkRegExps) {
    const linkMatch = unpacked.match(linkRegexp);
    if (linkMatch && linkMatch[1]) {
      return 'https://' + linkMatch[1].replace(/^(https:)?\/\//, '');
    }
  }

  throw new Error(`Could not find a stream link in embed`);
};
