import React from 'react';
import {ModelShapes} from '../../Constants';
import {createFFSelector} from '../../selectors/selectorUtils';
import {selectCurrentDraftOrder} from '../../selectors/draftSelectors';
import {selectLeagueUsers} from '../../selectors/selectors';

export const draftStatusSelector = createFFSelector({
  selectors: [selectCurrentDraftOrder, selectLeagueUsers],
  selector: function (currentDraftOrder, leagueUsers) {
    return {
      currentDraftOrder: currentDraftOrder,
      userLookup: leagueUsers
    };
  }
});

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
          On the clock with pick #{currentDraftOrder.order + 1}: <b>
            {user.team.name} ({user.username})
          </b>
        </p>
      </div>
    );
  }


});
