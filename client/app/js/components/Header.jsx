import PureRenderMixin from 'react-addons-pure-render-mixin';
import React, {PropTypes} from 'react';
import {createFFSelector} from '../selectors/selectorUtils';
import {ModelShapes} from '../Constants';
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
    currentUser: ModelShapes.User,
    onLogout: PropTypes.func.isRequired
  },

  render() {
    const {currentUser} = this.props;
    return (
      <div className='page-header'>
        <h1>
          Fantasy Football <small>{currentUser ? currentUser.username : ''}</small>
          {!currentUser ? null : (
            <div className='pull-right'>
              <small><a href='#' onClick={this._onLogout}>Logout</a></small>
            </div>
          )}
        </h1>
      </div>
    );
  },

  _onLogout(e) {
    e.preventDefault();
    this.props.onLogout();
  }

});
