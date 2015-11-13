import React from 'react';
import {ModelShapes} from '../../Constants';

export default React.createClass({

  displayName: 'DraftStatus',

  propTypes: {
    currentDraftOrder: ModelShapes.DraftOrder.isRequired,
    userLookup: React.PropTypes.objectOf(ModelShapes.User).isRequired
  },

  render() {
    const {currentDraftOrder, userLookup} = this.props;
    const user = userLookup[currentDraftOrder.user_id];
    return (
      <div>
        <p className='draft-status'>
          On the clock with pick #{currentDraftOrder.order + 1}: <b>{user.name}</b>
        </p>
      </div>
    );
  }


});
