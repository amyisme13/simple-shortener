const TOKEN =
  'e62e33ae36a4c22a538eda34adfedcbd57d767e07cb2a47636ad2cf2d2ba3004';
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

const findByIdLocal = id => {
  const urls = localStorage.getItem('urls');
  if (!urls) return undefined;
  return urls.find(url => url.id === id);
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
