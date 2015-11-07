import Loading from './Loading';
import React from 'react';
import {LoadingStates} from '../Constants';

const AjaxComponent = React.createClass({

  propTypes: {
    ChildClass: React.PropTypes.func.isRequired,
    childClassProps: React.PropTypes.object,
    loadingState: React.PropTypes.any.isRequired
  },

  render() {
    const {ChildClass, childClassProps, loadingState} = this.props;
    if (loadingState === LoadingStates.LOADING) {
      return (<Loading />);
    } else {
      return (<ChildClass {...childClassProps} />);
    }
  }

});

export default AjaxComponent;
