const cfg = {
  redis_url: process.env.REDIS_URL,
  socketio_port: process.env.SOCKET_IO_PORT || 4005
};

export default cfg;
