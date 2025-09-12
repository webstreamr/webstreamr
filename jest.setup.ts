process.env['CACHE_DIR'] = '/dev/null';

jest.mock('randomstring', () => ({
  generate: jest.fn(() => 'mocked-random-string'),
}));

beforeEach(() => {
  jest.spyOn(Date, 'now').mockImplementation(() => 639837296000);
});

console.log = console.warn = console.error = console.info = console.debug = () => { /* disable in favor of logger */ };
