import Server from 'socket.io';

const io = Server(4005, { serveClient: false });

io.on('connection', function (socket) {
  console.log('Connection!!');
});

console.log('listening...');
