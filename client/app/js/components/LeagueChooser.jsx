import _ from 'lodash';
import FFPanel from './FFPanel';
import Loading from './Loading';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {createFFComponentSelector} from '../selectors/selectorUtils';
import {Link} from 'react-router';
import {loadMyLeagues, loadUser} from '../actions/LoadActions';
import {ModelShapes, LoadStateShape} from '../Constants';
import {selectMyLeagues} from '../selectors/selectors';

const LeagueChooser = React.createClass({

  displayName: 'LeagueChooser',

  propTypes: {
    dispatch: PropTypes.func.isRequired,
    loadState: LoadStateShape,
    myLeagues: PropTypes.objectOf(ModelShapes.FantasyLeague)
  },

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(loadMyLeagues());
    dispatch(loadUser());
  },

  render() {
    const {myLeagues, loadState} = this.props;
    const sortedLeagues = _.sortBy(myLeagues, 'name');

    // TODO: distinguish between failed and loading loadState
    const loaded = !loadState;

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


const selector = createFFComponentSelector({
  myLeagues: selectMyLeagues
});

export default connect(selector)(LeagueChooser);
