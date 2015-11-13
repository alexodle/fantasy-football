import React from 'react';
import {Route, Router, IndexRoute} from 'react-router';
import App from './App';
import Draft from './components/draft/Draft';
import LeagueChooser from './components/LeagueChooser';

// App Routes
export default (
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={LeagueChooser} />
      <Route path="draft/:leagueId" component={Draft} />
    </Route>
  </Router>
);
