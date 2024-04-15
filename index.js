const http = require('http');

const { v4: uuid } = require('uuid');

const errorHandle = require('./errorHandle');
const todos = [];
const requestListener = (req, res) => {
  const headers = {
    'access-control-allow-headers':
      'Content-type Authorization Content-length X-Request',
    'access-control-allow-methods': 'GET POST PATCH DELETE OPTIONS',
    'access-control-allow-origin': '*',
    'content-type': 'application/json',
  };
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  if (req.url === '/todos' && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos,
      }),
    );
    res.end();
  } else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', () => {
      try {
        const { title } = JSON.parse(body);
        if (title) {
          const newTodo = {
            title,
            id: uuid(),
          };
          todos.push(newTodo);
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: 'success',
              data: newTodo,
            }),
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end', () => {
      try {
        const id = req.url.split('/').pop();
        const index = todos.findIndex((el) => el.id === id);
        const { title } = JSON.parse(body);
        if (index !== -1 && title) {
          todos[index].title = title;
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: 'success',
              data: todos,
            }),
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex((el) => el.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: 'success',
          data: todos,
        }),
      );
      res.end();
    } else {
      errorHandle(res);
    }
  } else if (req.url === '/todos' && req.method === 'DELETE') {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos,
      }),
    );
    res.end();
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: 'false',
        message: '404 route not found',
      }),
    );
    res.end();
  }
};
const server = http.createServer(requestListener);
server.listen(8000);
