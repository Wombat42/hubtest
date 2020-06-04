function responseProcessor(response) {
  return response.json().then((json) => {
    const result = {
      ok: response.ok,
      status: response.status,
      data: json || null,
    };
    return result;
  });
}

async function makeRequest(sessionID, url, method, payload) {
  const options = {
    method,
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(url, options);
  return responseProcessor(response);
}

export async function postReq(sessionID, url, payload) {
  return makeRequest(sessionID, url, 'POST', payload);
}

export async function getReq(sessionID, url) {
  return makeRequest(sessionID, url, 'GET');
}
