import _ from 'lodash';
import chai from 'chai';
import {selectIneligibleDraftPositions} from '../app/js/selectors/draftSelectors';
import {Positions} from '../app/js/Constants';
import {newDraftPick, newFootballPlayer} from './testUtils';

chai.should();

const TEAM_REQS = {
  [Positions.QB]: 1,
  [Positions.RB]: 2,
  [Positions.WR]: 2,
  [Positions.TE]: 1,
  [Positions.FLEX]: 1,
  [Positions.K]: 1,
  [Positions['D/ST']]: 1
};

const SUCCEEDED_META = { lastUpdated: 1234 };

// Do not use this directly or the reselector caching will fuck with results
const BASE_STATE_DO_NOT_USE_DIRECTLY = {
  entities: {
    users: {
      1: { id: 1, name: 'Me Ok?' }
    },
    fantasy_leagues: {
      1: {
        teams: [1],
        rules: {
          team_reqs: TEAM_REQS,
          max_team_size: 10
        }
      }
    },
    football_players: _.indexBy([
      newFootballPlayer({ id: 1, pos: Positions.RB }),
      newFootballPlayer({ id: 2, pos: Positions.RB })
    ], 'id'),
    drafts: {
      1: {
        picks: [
          newDraftPick({ fpId: 1, pickNumber: 1 }),
          newDraftPick({ fpId: 2, pickNumber: 2 })
        ]
      }
    }
  },
  meta: {
    current_user: { ...SUCCEEDED_META, id: 1 },
    my_leagues: { ...SUCCEEDED_META, items: [1] },
    fantasy_leagues: {
      1: {
        draft: { order: SUCCEEDED_META, picks: SUCCEEDED_META },
        fantasy_players: { ...SUCCEEDED_META, items: [1] },
        fantasy_teams: { ...SUCCEEDED_META, items: [1] },
        football_players: { ...SUCCEEDED_META, items: [1, 2] }
      }
    }
  },
  router: { params: { leagueId: 1 } }
};

// Use this instead, which will get deep cloned before each test
let state = null;

describe('draftSelectors', () => {

  beforeEach(() => {
    state = _.cloneDeep(BASE_STATE_DO_NOT_USE_DIRECTLY);
  }),

  describe('selectIneligibleDraftPositions', () => {

    it('does not eliminate positions if bench is not full', () => {
      selectIneligibleDraftPositions(state).should.eql([]);
    });

    it('keeps flex positions open when bench is full, if flex is open', () => {
      _.merge(state.entities.football_players, _.indexBy([
        newFootballPlayer({ id: 3, pos: Positions.QB }),
        newFootballPlayer({ id: 4, pos: Positions.QB })
      ], 'id'));
      state.entities.drafts[1].picks.push(
        newDraftPick({ fpId: 3, pickNumber: 3 }),
        newDraftPick({ fpId: 4, pickNumber: 4 })
      );
      state.meta.fantasy_leagues[1].football_players.items.push(3, 4);
      selectIneligibleDraftPositions(state).should.eql([Positions.QB]);
    });

    it('removes positions when flex and bench are full', () => {
      _.merge(state.entities.football_players, _.indexBy([
        newFootballPlayer({ id: 3, pos: Positions.RB }),
        newFootballPlayer({ id: 4, pos: Positions.RB }),
        newFootballPlayer({ id: 5, pos: Positions.TE })
      ], 'id'));
      state.entities.drafts[1].picks.push(
        newDraftPick({ fpId: 3, pickNumber: 3 }),
        newDraftPick({ fpId: 4, pickNumber: 4 }),
        newDraftPick({ fpId: 5, pickNumber: 5 })
      );
      state.meta.fantasy_leagues[1].football_players.items.push(3, 4, 5);
      selectIneligibleDraftPositions(state).should.eql([
        Positions.RB,
        Positions.TE,
        Positions.FLEX
      ]);
    });

  });

});
