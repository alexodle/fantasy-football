import thunkMiddleware from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from './reducers';
import routes from './routes';
import {reduxReactRouter} from 'redux-router';
import {createHistory} from 'history';

const middlewares = [thunkMiddleware];

// Great for debugging
if (process.env.NODE_ENV !== 'production') {
  const loggerMiddleware = require('redux-logger')();
  middlewares.push(loggerMiddleware);
}

const createStoreWithMiddleware = compose(
  applyMiddleware(...middlewares),
  reduxReactRouter({
    routes,
    createHistory
  })
)(createStore);

export default createStoreWithMiddleware(rootReducer);
