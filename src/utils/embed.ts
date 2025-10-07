import { unpack } from 'unpacker';

export const unpackEval = (html: string): string => {
  const evalMatch = html.match(/eval\(function\(p,a,c,k,e,d\).*\)\)/);
  if (!evalMatch) {
    throw new Error(`No p.a.c.k.e.d string found`);
  }

  return unpack(evalMatch[0]);
};

export const extractUrlFromPacked = (html: string, linkRegExps: RegExp[]): URL => {
  const unpacked = unpackEval(html);

  for (const linkRegexp of linkRegExps) {
    const linkMatch = unpacked.match(linkRegexp);
    if (linkMatch && linkMatch[1]) {
      return new URL(`https://${linkMatch[1].replace(/^(https:)?\/\//, '')}`);
    }
  }

  throw new Error(`Could not find a stream link in embed`);
};
