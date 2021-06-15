type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type ParsedDatabaseURI = {
  protocol: string;
  username?: string;
  password?: string;
  hosts: { host: string; port?: number }[];
  database?: string;
  options?: Record<string, string>;
};

function encode(urlPart?: string): string {
  if (!urlPart) {
    return '';
  }
  return encodeURIComponent(urlPart);
}
function decode(urlPart?: string): string {
  if (!urlPart) {
    return '';
  }
  return decodeURIComponent(urlPart);
}

const parseRegex =
  /(?<protocol>.+?):\/\/(?:(?<username>.*?):(?<password>.*?)@)?(?<hosts>[^/]+)[/]?(?<database>\/?[^?]*)[?]?(?<options>.*)/;

export function parse(url: string): ParsedDatabaseURI {
  const match = url.match(parseRegex);
  if (!match || !match.groups) {
    throw new Error('Could not parse an url');
  }
  const { groups } = match;
  if (!groups.protocol) {
    throw new Error('Protocol should be set');
  }
  const result: ParsedDatabaseURI = {
    protocol: groups.protocol,
    hosts: groups.hosts.split(',').map((s) => {
      const splitHost = s.split(':');
      const host: ArrayElement<ParsedDatabaseURI['hosts']> = {
        host: splitHost[0],
      };

      if (splitHost.length > 1) {
        host.port = Number.parseInt(splitHost[1], 10);
      }
      return host;
    }),
  };
  if (groups.username) {
    result.username = decode(groups.username);
  }
  if (groups.password) {
    result.password = decode(groups.password);
  }
  if (groups.database) {
    result.database = decode(groups.database);
  }
  if (groups.options) {
    result.options = groups.options
      .split('&')
      .reduce<Record<string, string>>((accum, val) => {
        const [k, v] = val.split('=');
        // eslint-disable-next-line no-param-reassign
        accum[decode(k)] = decode(v);
        return accum;
      }, {});
  }
  return result;
}

function getAuth(username?: string, password?: string): string {
  if (!username && !password) {
    return '';
  }
  if (!password) {
    return `${encode(username)}@`;
  }
  return `${encode(username)}:${encode(password)}@`;
}

export function stringify(dbUrl: ParsedDatabaseURI): string {
  const { protocol, username, password, hosts, database, options } = dbUrl;
  const authString = getAuth(username, password);
  const hostsString = hosts
    .map(({ host, port }) => {
      let result = encode(host);
      if (port) {
        result += `:${port}`;
      }
      return result;
    })
    .join(',');
  const db = database ? `/${database}` : '';
  let optionsString = '';
  if (options) {
    optionsString = `?${Object.entries(options)
      .map(([k, v]) => `${encode(k)}=${encode(v)}`)
      .join('&')}`;
  }
  return `${protocol}://${authString}${hostsString}${db}${optionsString}`;
}
