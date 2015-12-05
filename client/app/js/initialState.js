//
// Initial state for the store. In the future, we can bootstrap this with JSON
// data stamped to the page.
//
// SEE: stateShape.json for documentation on how this state is filled out
//
// IMPORTANT: initialState should NEVER contain any pre-loaded data. This is
// important because we want to re-use it when we log out, which means it always
// needs to be free of any actual data. For example, instead of looking for
// saved auth information in localStorage and using it here, we have a separate
// ACTION that does that for us, loadFromLocalStorage(). loadFromLocalStorage()
// is called before rendering the App component, so it is awlays initialized
// BEFORE rendering the app.
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
    auth: { ...DEFAULT_META },
    current_user: { ...DEFAULT_META },
    my_leagues: { ...DEFAULT_META },
    fantasy_leagues: {} // Fill with DEFAULT_FANTASY_LEAGUE
  },
  router: null
};
