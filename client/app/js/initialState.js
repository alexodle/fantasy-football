//
// Initial state for the store. In the future, we can bootstrap this with JSON
// data stamped to the page.
//
// SEE: stateShape.json for documentation on how this state is filled out
//

export const DEFAULT_META = {
  isFetching: false,
  didInvalidate: true,
  didFailFetching: false,
  lastUpdated: null,
  statusCode: null
};

export const DEFAULT_FANTASY_LEAGUE = {
  draft: {
    order: { ...DEFAULT_META },
    picks: { ...DEFAULT_META }
  },
  fantasy_players: { ...DEFAULT_META },
  fantasy_teams: { ...DEFAULT_META },
  football_players: { ...DEFAULT_META }
};

let localStorageAuth = localStorage.getItem('auth');
if (localStorageAuth) {
  try {
    localStorageAuth = JSON.parse(localStorageAuth);
  } catch (e) {
    console.warn(`Could not parse auth: ${localStorageAuth}, ${e}`);
    localStorageAuth = null;
  }
}

const initialAuth = { ...DEFAULT_META, ...(localStorageAuth || {}) };

export default {
  client: {},
  entities: {
    users: {},
    fantasy_leagues: {},
    fantasy_teams: {},
    football_players: {},
    drafts: {}
  },
  meta: {
    auth: initialAuth,
    current_user: { ...DEFAULT_META },
    my_leagues: { ...DEFAULT_META },
    fantasy_leagues: {} // Fill with DEFAULT_FANTASY_LEAGUE
  },
  router: null
};
