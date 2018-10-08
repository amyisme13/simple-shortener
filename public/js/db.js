/**
 * Configs
 */
const TOKEN =
  'e62e33ae36a4c22a538eda34adfedcbd57d767e07cb2a47636ad2cf2d2ba3004';

/**
 * Helps
 */
const JSON_STORE_ENDPOINT = `https://www.jsonstore.io/${TOKEN}/urls`;

class HTTPError extends Error {
  constructor(response) {
    super(response.statusText);
    this.name = 'HTTPError';
    this.response = response;
  }
}

class NotFoundError extends Error {
  constructor(id) {
    super(`Original URL of id '${id}' not found`);
    this.name = 'NotFoundError';
    this.id = id;
  }
}

/**
 * Find
 */

const findByIdLocal = id => {
  const urlsString = localStorage.getItem('urls');
  if (!urlsString) return undefined;

  const urls = JSON.parse(urlsString);
  return urls[id];
};

const findByIdJsonStore = async id => {
  if (!navigator.onLine) {
    throw new HTTPError({ statusText: 'Offline' });
  }

  const res = await fetch(`${JSON_STORE_ENDPOINT}/${id}`);
  if (!res.ok) {
    throw new HTTPError(res);
  }

  const { result } = await res.json();

  if (result && result.original) {
    return {
      id,
      ...result,
    };
  }
  return undefined;
};

const findById = async id => {
  let url;
  url = findByIdLocal(id);

  if (!url) {
    url = await findByIdJsonStore(id);
  }

  if (!url) {
    throw new NotFoundError(id);
  }

  return url;
};

/**
 * Store
 */

const storeLocal = async url => {
  const urlsString = localStorage.getItem('urls');

  let urls;
  if (!urlsString) {
    urls = {};
  } else {
    urls = JSON.parse(urlsString);
  }
  if (!urls[url.id]) {
    urls[url.id] = url;
  }

  localStorage.setItem('urls', JSON.stringify(urls));
};

const storeJsonStore = async url => {
  await fetch(`${JSON_STORE_ENDPOINT}/${url.id}`, {
    method: 'POST',
    body: JSON.stringify({
      original: url.original,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const store = async url => {
  if (!url.id || !url.original) {
    throw new Error('Invalid URL Object');
  }

  await storeLocal(url);
  await storeJsonStore(url);
};
