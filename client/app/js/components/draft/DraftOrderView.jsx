import _ from 'lodash';
import React, {PropTypes} from 'react';
import {ModelShapes} from '../../Constants';

export default React.createClass({

  displayName: 'DraftOrderView',

  propTypes: {
    currentDraftOrder: ModelShapes.DraftOrder.isRequired,
    draftOrder: PropTypes.arrayOf(ModelShapes.DraftOrder).isRequired,
    userLookup: PropTypes.objectOf(ModelShapes.User).isRequired
  },

  render() {
    const {currentDraftOrder, draftOrder, userLookup} = this.props;
    return (
      <ul className='list-inline list-group'>
        {_.map(draftOrder, function (o) {
          return (
            <li
                key={o.order}
                className={
                  'list-group-item' +
                  (currentDraftOrder.order === o.order ? ' active' : '')
                }
            >
              (#{o.order + 1}) {userLookup[o.user_id].name}
            </li>
          );
        })}
      </ul>
    );
  }

});
