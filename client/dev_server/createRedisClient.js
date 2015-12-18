import config from './config';
import redis from 'redis';
import url from 'url';

const redisUrl = url.parse(config.redis_url);

export default function createRedisClient() {
  const redisCli = redis.createClient(redisUrl.port, redisUrl.hostname);
  redisCli.auth(redisUrl.auth.split(':')[1]);

  redisCli.on('error', function (err) {
    console.error('REDIS ERROR: ' + err);
  });

  return redisCli;
}
