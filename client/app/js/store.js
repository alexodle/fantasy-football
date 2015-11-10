import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';

const middlewares = [thunkMiddleware];

// Great for debugging
if (process.env.NODE_ENV !== 'production') {
  const loggerMiddleware = require('redux-logger')();
  middlewares.push(loggerMiddleware);
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

export default createStoreWithMiddleware(rootReducer);
