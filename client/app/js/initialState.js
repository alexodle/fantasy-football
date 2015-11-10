const META = {
  isFetching: false,
  didInvalidate: true,
  didFailFetching: true,
  lastUpdated: null
};

export default {
  client: {},
  entities: {
    current_user: null,
    users: {},
    fantasy_leagues: {
      "1": {
        // ...<FantasyLeague>,
        // teams: [1, 2, 3] // team_ids
      }
    },
    fantasy_teams: {},
    football_players: {},
    drafts: {}
  },
  meta: {
    current_user: { ...META },
    my_leagues: { ...META, items: null },
    leagues: {}
  }
};
