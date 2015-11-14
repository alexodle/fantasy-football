import _ from 'lodash';
import React, {PropTypes} from 'react';
import {loadMyLeagues, loadUser} from '../actions/LoadActions';
import {connect} from 'react-redux';
import Loading from './Loading';
import FFPanel from './FFPanel';
import {ModelShapes} from '../Constants';
import {Link} from 'react-router';
import {selectCurrentUser, selectMyLeagues} from '../selectors/selectors';
import {reduceEntityLoadState} from '../selectors/selectorUtils';

const LeagueChooser = React.createClass({

  displayName: 'LeagueChooser',

  propTypes: {
    currentUser: ModelShapes.User,
    dispatch: PropTypes.func.isRequired,
    loaded: PropTypes.bool.isRequired,
    myLeagues: PropTypes.objectOf(ModelShapes.FantasyLeague)
  },

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(loadMyLeagues());
    dispatch(loadUser());
  },

  render() {
    const {loaded, myLeagues} = this.props;
    const sortedLeagues = _.sortBy(myLeagues, 'name');
    return (
      <FFPanel title='My leagues'>
        {!loaded ? <Loading /> :
          <ul>
            {_.map(sortedLeagues, function (league) {
              return (
                <li key={league.id}>
                  <Link to={`/draft/${league.id}`}>{league.name}</Link>
                </li>
              );
            })}
          </ul>
        }
      </FFPanel>
    );
  }

});

function selectState(state) {
  const selection = {
    currentUser: selectCurrentUser(state),
    myLeagues: selectMyLeagues(state),
    loaded: true
  };
  if (reduceEntityLoadState(selection)) {
    return { loaded: false };
  }
  return selection;
}

export default connect(selectState)(LeagueChooser);
