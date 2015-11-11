import React from 'react';

const Fail = React.createClass({

  render: function () {
    return (
      <div>
        <div className='alert alert-danger' role='alert'>
          <p>Something went wrong... Reload this page!</p>
          <img src='/img/fail.png' width='542px' height='233px' />
        </div>
      </div>);
  }

});

export default Fail;
