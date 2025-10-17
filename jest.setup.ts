process.env['CACHE_DIR'] = '/dev/null';

if (!process.env['TMDB_ACCESS_TOKEN']) {
  process.env['TMDB_ACCESS_TOKEN'] = 'some access token';
}

jest.mock('randomstring', () => ({
  generate: jest.fn(() => 'mocked-random-string'),
}));

beforeEach(() => {
  jest.spyOn(Date, 'now').mockImplementation(() => 639837296000);
});

console.log = console.warn = console.error = console.info = console.debug = () => { /* disable in favor of logger */ };
