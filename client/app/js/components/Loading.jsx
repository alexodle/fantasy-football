import '../../less/loading.less';

import React from 'react';

export default React.createClass({

  displayName: 'Loading',

  render: function () {
    return (
      <div className='spinner'>
        <div className='double-bounce1'></div>
        <div className='double-bounce2'></div>
      </div>
    );
  }

});
