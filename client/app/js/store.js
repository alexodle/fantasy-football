import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import {createHistory} from 'history';
import {createStore, applyMiddleware, compose} from 'redux';
import {reduxReactRouter} from 'redux-router';

const middlewares = [thunkMiddleware];

// Great for debugging
if (__DEV__) {
  const loggerMiddleware = require('redux-logger')();
  middlewares.push(loggerMiddleware);
}

const createStoreWithMiddleware = compose(
  applyMiddleware(...middlewares),
  reduxReactRouter({ createHistory })
)(createStore);

export default createStoreWithMiddleware(rootReducer);
