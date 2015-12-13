import io from 'socket.io-client';

const socket = io.connect('http://localhost:4005');
export default socket;
