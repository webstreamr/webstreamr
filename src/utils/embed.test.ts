import { unpack } from 'unpacker';
import { cachedFetchText } from './fetch';
import { parsePackedEmbed } from './embed';

jest.mock('unpacker', () => ({
  unpack: jest.fn(),
}));

jest.mock('./fetch', () => ({
  cachedFetchText: jest.fn(),
}));

describe('unpackEmbedUrl', () => {
  test('throw if no embed was found', async () => {
    (cachedFetchText as jest.Mock).mockReturnValue(
      Promise.resolve('<html></html>'),
    );

    await expect(parsePackedEmbed('https://some-url.test')).rejects.toThrow('No p.a.c.k.e.d string found on https://some-url.test');
  });

  test('throw if no link was found', async () => {
    (unpack as jest.Mock).mockReturnValue('some-unexpected-data');
    (cachedFetchText as jest.Mock).mockReturnValue(
      Promise.resolve('<html><script>(eval(function(p,a,c,k,e,d){...}))</script></html>'),
    );

    await expect(parsePackedEmbed('https://some-url.test')).rejects.toThrow('Could not find a stream link on https://some-url.test');
  });

  test('finds link with resolution and size', async () => {
    (unpack as jest.Mock).mockReturnValue('{sources:[{file:"https://streaming-url.mp4"}');
    (cachedFetchText as jest.Mock).mockReturnValue(
      Promise.resolve('<html><body>Something to stream;1280x720, 834.6 MB<script>(eval(function(p,a,c,k,e,d){...}))</script></body></html>'),
    );

    const parsePackedEmbedResult = await parsePackedEmbed('https://some-url.test');
    expect(parsePackedEmbedResult).toStrictEqual({
      url: 'https://streaming-url.mp4',
      resolution: '720p',
      size: '834.6 MB',
    });
  });

  test('resolution and size return undefined if not found', async () => {
    (unpack as jest.Mock).mockReturnValue('{sources:[{file:"https://streaming-url.mp4"}');
    (cachedFetchText as jest.Mock).mockReturnValue(
      Promise.resolve('<html><body>Something to stream<script>(eval(function(p,a,c,k,e,d){...}))</script></body></html>'),
    );

    const parsePackedEmbedResult = await parsePackedEmbed('https://some-url.test');
    expect(parsePackedEmbedResult).toStrictEqual({
      url: 'https://streaming-url.mp4',
      resolution: undefined,
      size: undefined,
    });
  });
});
