const cfg = {
  redis_url: process.env.REDISTOGO_URL || "redis://:@localhost:6379/0",
  socketio_port: process.env.SOCKET_IO_PORT || 4005
};

export default cfg;
