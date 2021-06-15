import { ParsedDatabaseURI, stringify } from './index';

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
  expect(stringifiedURI).toEqual(
    'rethinkdb://atassis:%25!%40%23%24!%40%24@localhost:27017/test?lol=kek&kek=cheburek',
  );
});

test('Parses double host URI', () => {
  const data: ParsedDatabaseURI = {
    protocol: 'rethinkdb',
    database: 'test',
    hosts: [{ host: 'localhost', port: 27017 }, { host: '127.0.0.1' }],
    options: {
      lol: 'kek',
      kek: 'cheburek',
    },

    password: '%!@#$!@$',
    username: 'atassis',
  };
  const stringifiedURI = stringify(data);
  expect(stringifiedURI).toEqual(
    'rethinkdb://atassis:%25!%40%23%24!%40%24@localhost:27017,127.0.0.1/test?lol=kek&kek=cheburek',
  );
});

test('Parses reserved characters', () => {
  const data: ParsedDatabaseURI = {
    protocol: 'short',
    database: 'test',
    hosts: [{ host: 'localhost', port: 27017 }],
    options: {
      lol: '!#$&()*+,/:;=?@[]',
    },
  };
  const stringifiedURI = stringify(data);
  expect(stringifiedURI).toEqual(
    'short://localhost:27017/test?lol=!%23%24%26()*%2B%2C%2F%3A%3B%3D%3F%40%5B%5D',
  );
});

test('Parses without username', () => {
  const data: ParsedDatabaseURI = {
    protocol: 'short',
    hosts: [{ host: 'localhost', port: 27017 }],
    password: 'abc',
  };
  const stringifiedURI = stringify(data);
  expect(stringifiedURI).toEqual('short://:abc@localhost:27017');
});

test('Parses without password', () => {
  const data: ParsedDatabaseURI = {
    protocol: 'short',
    hosts: [{ host: 'localhost', port: 27017 }],
    username: 'abc',
  };
  const stringifiedURI = stringify(data);
  expect(stringifiedURI).toEqual('short://abc@localhost:27017');
});
