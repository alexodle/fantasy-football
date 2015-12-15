// Css BEFORE all
import 'bootstrap/less/bootstrap.less';

// Include polyfills for everyone
import 'babel-polyfill';

import Route from './routes';
import ReactDOM from 'react-dom';

ReactDOM.render(
  Route,
  document.getElementById('appFrame')
);
