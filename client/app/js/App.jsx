import React from 'react';
import {Provider} from 'react-redux';
import store from './store';
import {ChildrenPropType} from './Constants';

const App = React.createClass({

  propTypes: {
    children: ChildrenPropType
  },

  render() {
    const {children} = this.props;
    return (
      <div className='container'>
        <div className='page-header'>
          <h1>Fantasy Football <small></small></h1>
        </div>
        <div className='row'>
          {!children ? null :
            <Provider store={store}>
              {this.props.children}
            </Provider>
          }
        </div>
      </div>
    );
  }

});

export default App;
