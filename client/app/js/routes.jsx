import App from './App';
import Draft from './components/draft/Draft';
import LeagueChooser from './components/LeagueChooser';
import React from 'react';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import {createHistory} from 'history';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import {reduxReactRouter} from 'redux-router';
import {ReduxRouter} from 'redux-router';
import {Route, IndexRoute} from 'react-router';

const middlewares = [thunkMiddleware];

// Great for debugging
if (process.env.NODE_ENV !== 'production') {
  const loggerMiddleware = require('redux-logger')();
  middlewares.push(loggerMiddleware);
}

const createStoreWithMiddleware = compose(
  applyMiddleware(...middlewares),
  reduxReactRouter({ createHistory })
)(createStore);

const store = createStoreWithMiddleware(rootReducer);

// App Routes
const routes = (
  <Provider store={store}>
    <ReduxRouter>
      <Route path="/" component={App}>
        <IndexRoute component={LeagueChooser} />
        <Route path="draft/:leagueId" component={Draft} />
      </Route>
    </ReduxRouter>
  </Provider>
);

export default routes;
