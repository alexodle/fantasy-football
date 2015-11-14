import React from 'react';
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
        <div>
          {children}
        </div>
      </div>
    );
  }

});

export default App;
