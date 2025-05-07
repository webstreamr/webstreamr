export const logError = (message: string) => {
  console.error(`${new Date().toISOString()}, Error: ${message}`);
};

export const logInfo = (message: string) => {
  console.info(`${new Date().toISOString()}, Info: ${message}`);
};
