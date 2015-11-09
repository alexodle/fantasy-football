import _ from 'lodash';
import Loading from './Loading';
import Fail from './Fail';
import React from 'react';
import {LoadingStates} from '../Constants';

const AjaxComponent = React.createClass({

  propTypes: {
    ChildClass: React.PropTypes.func.isRequired,
    childClassProps: React.PropTypes.object
  },

  render() {
    const {ChildClass, childClassProps} = this.props;
    const propValues = _.values(childClassProps);
    if (_.contains(propValues, LoadingStates.LOADING)) {
      return (<Loading />);
    } else if (_.contains(propValues, LoadingStates.LOAD_FAILED)) {
      return (<Fail />);
    } else {
      return (<ChildClass {...childClassProps} />);
    }
  }

});

export default AjaxComponent;
