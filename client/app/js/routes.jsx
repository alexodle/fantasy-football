import App from './App';
import Draft from './components/draft/Draft';
import LeagueChooser from './components/LeagueChooser';
import Login from './components/Login';
import React from 'react';
import requiresAuth from './high-order-components/requiresAuth';
import store from './store';
import {Provider} from 'react-redux';
import {ReduxRouter} from 'redux-router';
import {Route, IndexRoute} from 'react-router';

// App Routes
const routes = (
  <Provider store={store}>
    <ReduxRouter>
      <Route path='/' component={App}>
        <Route path='login' component={Login} />
        <IndexRoute component={requiresAuth(LeagueChooser)} />
        <Route path='draft/:leagueId' component={requiresAuth(Draft)}  />
      </Route>
    </ReduxRouter>
  </Provider>
);

export default routes;
