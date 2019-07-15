'use strict';

const Hapi = require('@hapi/hapi')
const Redis = require('ioredis');
const pub = new Redis(process.env.REDIS_URL);

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: '0.0.0.0',
    routes: { cors: true }
  });

  server.route({
    method: 'POST',
    path: '/rooms/{roomID}/messages',
    config: { cors: true },
    handler: (req, h) => {
      var msg = JSON.stringify({
        message: req.payload.message,
        username: req.payload.username,
        room: req.params.roomID
      });
      pub.publish('messages', msg);
      return {
        "status": "OK"
      };
    }
  })

  const options = {
    formats: { onPostStart: ':time :start :level :message'},
    tokens: { start: () => '[start]'},
    indent: 0
  };

  await server.register({
      plugin: require('laabr'),
      options,
  });

  await server.start();
  console.log("Starting chat service on port 3000")
}

init();