import { EmbedExtractor } from './types';
import { Dropload } from './Dropload';
import { SuperVideo } from './SuperVideo';

type EmbedExtractorRegistryType = Record<string, EmbedExtractor>;

export const EmbedExtractorRegistry: EmbedExtractorRegistryType = {
  dropload: new Dropload(),
  supervideo: new SuperVideo(),
};
