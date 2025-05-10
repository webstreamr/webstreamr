import { unpack } from 'unpacker';
import { extractUrlFromPacked } from './embed';

jest.mock('unpacker', () => ({
  unpack: jest.fn(),
}));

describe('extractUrlFromPacked', () => {
  test('throw if no embed was found', () => {
    expect(() => {
      extractUrlFromPacked('', [/sources:\[{file:"(.*?)"/]);
    }).toThrow('No p.a.c.k.e.d string found');
  });

  test('throw if no link was found', () => {
    (unpack as jest.Mock).mockReturnValue('some-unexpected-data');

    expect(() => {
      extractUrlFromPacked('eval(function(p,a,c,k,e,d){...}))', [/sources:\[{file:"(.*?)"/]);
    }).toThrow('Could not find a stream link');
  });

  test('finds link', async () => {
    (unpack as jest.Mock).mockReturnValue('{sources:[{file:"https://streaming-url.mp4"}');

    expect(extractUrlFromPacked('eval(function(p,a,c,k,e,d){...}))', [/sources:\[{file:"(.*?)"/])).toBe('https://streaming-url.mp4');
  });
});
