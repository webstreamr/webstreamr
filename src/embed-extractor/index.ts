import { Dropload } from './Dropload';
import { SuperVideo } from './SuperVideo';
import { EmbedExtractor } from './types';

type EmbedExtractorRegistryType = Record<string, EmbedExtractor>;

export const EmbedExtractorRegistry: EmbedExtractorRegistryType = {
  dropload: new Dropload(),
  supervideo: new SuperVideo(),
};
