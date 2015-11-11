import Draft from './components/draft/Draft';
import React from 'react';
import {Provider} from 'react-redux';
import store from './store';

const App = React.createClass({

  render() {
    return (
      <div className='container'>
        <Provider store={store}>
          <Draft />
        </Provider>
      </div>
    );
  }

});

export default App;
