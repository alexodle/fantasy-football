import React from 'react';
import {ModelShapes} from '../Constants';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {createFFSelector} from '../selectors/selectorUtils';
import {selectCurrentUser} from '../selectors/selectors';

export const headerSelector = createFFSelector({
  selectors: [selectCurrentUser],
  selector: function (currentUser) {
    return { currentUser };
  }
});

export default React.createClass({

  displayName: 'Header',

  mixins: [PureRenderMixin],

  propTypes: {
    currentUser: ModelShapes.User
  },

  render() {
    const {currentUser} = this.props;
    return (
      <div className='page-header'>
        <h1>Fantasy Football <small>{currentUser ? currentUser.name : ''}</small></h1>
      </div>
    );
  }

});
