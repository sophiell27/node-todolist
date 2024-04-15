const errorHandle = (res) => {
  const headers = {
    'access-control-allow-headers':
      'Content-type Authorization Content-length X-Request',
    'access-control-allow-methods': 'GET POST PATCH DELETE OPTIONS',
    'access-control-allow-origin': '*',
    'content-type': 'application/json',
  };
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      status: 'false',
      message: 'data or id is incorrect',
    }),
  );
  res.end();
};

module.exports = errorHandle;
