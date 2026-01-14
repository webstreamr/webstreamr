/* istanbul ignore file */
import fs from 'node:fs';
// eslint-disable-next-line import/no-named-as-default
import KeyvSqlite from '@keyv/sqlite';
import * as sqlite3 from 'sqlite3';
import { envIsTest } from './env';

export const scheduleKeyvSqliteCleanup = (keyvSqlite: KeyvSqlite): void => {
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
