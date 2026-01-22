/* istanbul ignore file */
import fs from 'node:fs';
import * as os from 'node:os';
// eslint-disable-next-line import/no-named-as-default
import KeyvSqlite from '@keyv/sqlite';
import { KeyvCacheableMemory } from 'cacheable';
import { glob } from 'glob';
import { KeyvStoreAdapter } from 'keyv';
import * as sqlite3 from 'sqlite3';
import winston from 'winston';
import { envGet, envIsTest } from './env';

const getCacheDir = (): string => envGet('CACHE_DIR') ?? os.tmpdir();

const scheduleKeyvSqliteCleanup = (keyvSqlite: KeyvSqlite): void => {
  const filename = keyvSqlite.opts.db;
  if (envIsTest() || !filename || !fs.existsSync(filename)) {
    return;
  }

  setInterval(() => {
    const db = new sqlite3.Database(filename);

    db.serialize(() => {
      db.run('DELETE FROM keyv WHERE json_extract(value, \'$.expires\') <= (strftime(\'%s\', \'now\') * 1000)');
    });
    db.close();
  }, 60 * 60 * 1000); // every hour
};

export const createKeyvSqlite = (name: string): KeyvStoreAdapter => {
  const cacheDir = getCacheDir();

  if (envIsTest() || !cacheDir) {
    return new KeyvCacheableMemory();
  }

  const keyvSqlite = new KeyvSqlite(`sqlite://${cacheDir}/webstreamr-${name}.sqlite`);

  scheduleKeyvSqliteCleanup(keyvSqlite);

  return keyvSqlite;
};

export const clearCache = async (logger: winston.Logger): Promise<void> => {
  for (const file of await glob(`${getCacheDir()}/webstreamr*`)) {
    logger.info(`Delete cache file ${file}`);
    fs.rmSync(file);
  }
};
