// Css BEFORE all
import 'bootstrap/less/bootstrap.less';

import Route from './routes';
import ReactDOM from 'react-dom';

// Listen for socket io updates
import './socketListeners';

ReactDOM.render(
  Route,
  document.getElementById('appFrame')
);
