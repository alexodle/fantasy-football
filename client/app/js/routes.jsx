import App from './App';
import Draft from './components/draft/Draft';
import LeagueChooser from './components/LeagueChooser';
import Login from './components/auth/Login';
import React from 'react';
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
        <IndexRoute component={LeagueChooser} />
        <Route path='draft/:leagueId' component={Draft}  />
      </Route>
    </ReduxRouter>
  </Provider>
);

export default routes;
