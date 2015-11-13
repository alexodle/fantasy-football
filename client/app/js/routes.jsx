import React from 'react';
import {Route, Router} from 'react-router';
import App from './App';
import Draft from './components/draft/Draft';

// App Routes
export default (
  <Router>
    <Route path="/" component={App}>
      <Route path="draft" component={Draft} />
    </Route>
  </Router>
);
