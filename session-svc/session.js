'use strict';

const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);
const io = require('socket.io')(4000);

const init = async () => {
  redis.subscribe("messages", (error, count) => {
    if (error) {
      throw new Error(error);
    }
  })

  io.on('connection', (socket) => {
    socket.on('joinRoom', (s) => {
      socket.join(s.room)
    })
  });

  redis.on('message', (channel, message) => {
    var msg = JSON.parse(message)
    console.log(`Sending message from ${msg.username} to room: '${msg.room}'`)
    io.to(msg.room).emit('message', message)
  });

  console.log("Starting session service on port 4000")
}

init();
