import { unpack } from 'unpacker';
import { cachedFetchText } from './fetch';
import { extractUrlFromPacked } from './embed';

jest.mock('unpacker', () => ({
  unpack: jest.fn(),
}));

describe('extractUrlFromPacked', () => {
  test('throw if no embed was found', () => {
    expect(extractUrlFromPacked('', [/eval/])).rejects.toThrow('No p.a.c.k.e.d string found on https://some-url.test');
  });

  test('throw if no link was found', () => {
    (unpack as jest.Mock).mockReturnValue('some-unexpected-data');

    expect(extractUrlFromPacked('eval(function(p,a,c,k,e,d){...})', [/eval/])).rejects.toThrow('Could not find a stream link on https://some-url.test');
  });

  test('finds link', async () => {
    (unpack as jest.Mock).mockReturnValue('{sources:[{file:"https://streaming-url.mp4"}');
    (cachedFetchText as jest.Mock).mockReturnValue(
      Promise.resolve('<html><body>Something to stream;1280x720, 834.6 MB<script>(eval(function(p,a,c,k,e,d){...}))</script></body></html>'),
    );

    expect(extractUrlFromPacked('eval(function(p,a,c,k,e,d){...})', [/eval/])).toBe('https://streaming-url.mp4');
  });
});
