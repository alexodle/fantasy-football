import _ from 'lodash';
import React, {PropTypes} from 'react';
import {loadMyLeagues, loadUser} from '../actions/LoadActions';
import {hasLoaded} from '../utils/loadingUtils';
import {connect} from 'react-redux';
import Loading from './Loading';
import FFPanel from './FFPanel';
import {ModelShapes} from '../Constants';
import {Link} from 'react-router';

const LeagueChooser = React.createClass({

  displayName: 'LeagueChooser',

  propTypes: {
    currentUser: ModelShapes.User,
    dispatch: PropTypes.func.isRequired,
    loaded: PropTypes.bool.isRequired,
    myLeagues: PropTypes.objectOf(ModelShapes.FantasyLeague)
  },

  componentWillMount() {
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
  const loaded = (
    hasLoaded(state.meta.current_user) &&
    hasLoaded(state.meta.my_leagues)
  );

  let myLeagues, currentUser;
  if (loaded) {
    myLeagues = _.pick(state.entities.fantasy_leagues, state.meta.my_leagues.items);
    currentUser = state.entities.users[state.meta.current_user];
  }

  return {
    currentUser,
    loaded,
    myLeagues
  };
}

export default connect(selectState)(LeagueChooser);
