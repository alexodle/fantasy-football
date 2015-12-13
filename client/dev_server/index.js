// MUST COME FIRST. Register our ES6 compiler so all components can be written
// in ES6.
require('babel-register');

// ==== EVERYTHING IMPORTED AFTER THIS POINT CAN USE ES6 ====

require('./devServer.js');
