import React from 'react';
import CircularProgress from 'material-ui/lib/circular-progress';

const Loading = React.createClass({

  render: function () {
    return (<CircularProgress mode='indeterminate' />);
  }

});

export default Loading;
