import Loading from './Loading'
import React from 'react';
import {LoadingStates} from '../Constants';

const AjaxComponent = React.createClass({

  propTypes: {
    children: React.PropTypes.element.isRequired,
    loadingState: React.PropTypes.any
  },

  render() {
    if (this.props.loadingState === LoadingStates.LOADING) {
      return (<Loading />);
    } else {
      return this.props.children;
    }
  }

});

export default AjaxComponent;
