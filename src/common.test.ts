import { parse } from './index';

const normalUrls = [
  'mongodb://localhost:27017,127.0.0.1:28018/database?lol=kek',
  'jdbc:mysql://192.168.29.20:3306,192.168.29.20:6306/mysql',
];

test('Parses different URLs', () => {
  for (const url of normalUrls) {
    parse(url);
  }
});
