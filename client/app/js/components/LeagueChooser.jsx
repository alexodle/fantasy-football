import FFPanel from './FFPanel';
import Loading from './Loading';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {createFFComponentSelector} from '../selectors/selectorUtils';
import {Link} from 'react-router';
import {loadMyLeagues, loadUser} from '../actions/LoadActions';
import {ModelShapes, LoadStateShape} from '../Constants';
import {selectCurrentUser, selectMyLeagues} from '../selectors/selectors';

const LeagueChooser = React.createClass({

  displayName: 'LeagueChooser',

  propTypes: {
    currentUser: ModelShapes.User,
    dispatch: PropTypes.func.isRequired,
    loadState: LoadStateShape,
    myLeagues: PropTypes.objectOf(ModelShapes.FantasyLeague)
  },

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(loadMyLeagues());
    dispatch(loadUser());
  },

  render() {
    const {myLeagues, loadState} = this.props;

    // TODO: distinguish between failed and loading loadState
    const loaded = !loadState;

    return (
      <FFPanel title='My leagues'>
        {!loaded ? <Loading /> :
          <ul>
            {myLeagues.toSeq()
              .sortBy(l => l.get('name'))
              .map(function (league) {
                return (
                  <li key={league.get('id')}>
                    <Link to={`/draft/${league.get('id')}`}>{league.get('name')}</Link>
                  </li>
                );
              })
              .toArray()}
          </ul>
        }
      </FFPanel>
    );
  }

});


const selector = createFFComponentSelector({
  currentUser: selectCurrentUser,
  myLeagues: selectMyLeagues
});

export default connect(selector)(LeagueChooser);
