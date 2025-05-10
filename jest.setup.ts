import { cachedFetchText } from './src/utils/fetch';
import fs from 'node:fs';
import slugify from 'slugify';

// Mocks cachedFetchText and either returns existing fixtures or creates new ones
jest.mock('./src/utils/fetch', () => ({
  cachedFetchText: jest.fn(),
}));
(cachedFetchText as jest.Mock).mockImplementation(
  async (url: string) => {
    const path = `${__dirname}/fixtures/cachedFetchText/${slugify(url)}`;
    if (fs.existsSync(path)) {
      return fs.readFileSync(path).toString();
    } else {
      const realFetchModule = jest.requireActual('./src/utils/fetch');
      const text = await realFetchModule.cachedFetchText(url);
      fs.writeFileSync(path, text);

      return text;
    }
  },
);
