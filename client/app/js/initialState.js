//
// Initial state for the store. In the future, we can bootstrap this with JSON
// data stamped to the page.
//
// SEE: stateShape.json for documentation on how this state is filled out
//

import Immutable from 'immutable';

const META = {
  isFetching: false,
  didInvalidate: true,
  didFailFetching: false,
  lastUpdated: null
};

const initialState = Immutable.fromJS({
  client: {},
  entities: {
    users: {},
    fantasy_leagues: {},
    fantasy_teams: {},
    football_players: {},
    drafts: {}
  },
  meta: {
    current_user: { ...META },
    my_leagues: { ...META, items: null },
    fantasy_leagues: {}
  }
});

// Ensure router state stays raw since we don't own it
initialState.router = null;

export default initialState;
