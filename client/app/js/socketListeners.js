import socketio from 'socket.io-client';

/**
 * Start listening for app-wide socket.io updates
 */
function startSocketUpdates() {
  const io = socketio.connect('http://localhost:4005');
  io.on('connect', function () {
    console.log('HIHI we\'re connected!!!');
  });
}

startSocketUpdates();
