import { parse, ParsedDatabaseURI, stringify } from './index';

test('Parses single host URI', () => {
  const data: ParsedDatabaseURI = {
    protocol: 'rethinkdb',
    database: 'test',
    hosts: [{ host: 'localhost', port: 27017 }],
    options: {
      lol: 'kek',
      kek: 'cheburek',
    },

    password: '%!@#$!@$',
    username: 'atassis',
  };
  const stringifiedURI = stringify(data);
  expect(data).toStrictEqual(parse(stringifiedURI));
});

test('Parses double host URI', () => {
  const data: ParsedDatabaseURI = {
    protocol: 'rethinkdb',
    database: 'test',
    hosts: [
      { host: 'localhost', port: 27017 },
      { host: '127.0.0.1', port: 27017 },
    ],
    options: {
      lol: 'kek',
      kek: 'cheburek',
    },

    password: '%!@#$!@$',
    username: 'atassis',
  };
  const stringifiedURI = stringify(data);
  expect(data).toStrictEqual(parse(stringifiedURI));
});

test('Parses reserved characters', () => {
  const data: ParsedDatabaseURI = {
    protocol: 'rethinkdb',
    database: 'test',
    hosts: [{ host: 'localhost', port: 27017 }],
    options: {
      lol: '!#$&*+,/:;=?@[]',
      kek: 'cheburek',
    },

    password: '%!@#$!@$',
    username: 'atassis',
  };
  const stringifiedURI = stringify(data);
  expect(data).toStrictEqual(parse(stringifiedURI));
});
