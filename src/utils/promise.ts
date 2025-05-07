import { logError } from './log';

export const fulfillAllPromises = async <T>(promises: Promise<T>[]) => {
  const resultValues: T[] = [];

  (await Promise.allSettled(promises)).forEach((result) => {
    if (result.status === 'fulfilled') {
      resultValues.push(result.value);
      return;
    }

    logError(`Could not fulfill promise: ${result.reason}`);
  });

  return resultValues;
};
