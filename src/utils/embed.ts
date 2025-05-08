import { unpack } from 'unpacker';
import { cachedFetchText } from './fetch';
import { scanFromResolution } from './resolution';

const LINK_REGEXPS = [
  /sources:\[{file:"(.*?)"/, // dropload, supervideo
];

interface ParsePackedEmbedResult {
  url: string;
  resolution: string | undefined;
  size: string | undefined;
}

const findResolution = (html: string): string | undefined => {
  const match = html.match(/(\d{3,}x\d{3,}),/);

  return match && match[1] ? scanFromResolution(match[1]) : undefined;
};

const findSize = (html: string): string | undefined => {
  const sizeMatch = html.match(/([\d.]+) ?([GM]B)/);

  return sizeMatch && sizeMatch[1] && sizeMatch[2] ? `${sizeMatch[1]} ${sizeMatch[2]}` : undefined;
};

export const parsePackedEmbed = async (url: string): Promise<ParsePackedEmbedResult> => {
  const html = await cachedFetchText(url);

  const evalMatch = html.match(/eval\(function\(p,a,c,k,e,d\).*\)\)/);
  if (!evalMatch) {
    throw new Error(`No p.a.c.k.e.d string found on ${url}`);
  }

  const unpacked = unpack(evalMatch[0]);

  for (const linkRegexp of LINK_REGEXPS) {
    const linkMatch = unpacked.match(linkRegexp);
    if (linkMatch && linkMatch[1]) {
      return {
        url: 'https://' + linkMatch[1].replace(/^(https:)?\/\//, ''),
        resolution: findResolution(html),
        size: findSize(html),
      };
    }
  }

  throw new Error(`Could not find a stream link on ${url}`);
};
