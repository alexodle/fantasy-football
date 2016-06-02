import config from './config';
import createRedisClient from './createRedisClient';
import Server from 'socket.io';

const redisClient = createRedisClient();
const io = Server(config.socketio_port, { serveClient: false });

redisClient.on('message', function (channel, message) {
  console.log('Received redis message!');

  let payload = null;
  try {
    payload = JSON.parse(message);
  } catch (e) {
    console.error(`Unable to parse message: '${message}'`);
    console.error(e.stack);
    return;
  }

  const {league_id} = payload;

  // TODO - when we add more message types we will have to parse the message to
  // determine this. For now, we just assume.
  io.emit(`draft:${league_id}`, '');
});

redisClient.subscribe('draft:updates');

console.log('Listening...');
