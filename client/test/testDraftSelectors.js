import './setupTests';

import _ from 'lodash';
import {
  selectIneligibleDraftPositions,
  selectDraftableFootballPlayers,
  selectDraftableFootballPlayersByPosition
} from '../app/js/selectors/draftSelectors';
import {Positions} from '../app/js/Constants';
import {newDraftPick, newFootballPlayer} from './testUtils';

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
          max_team_size: 10 // MAX_BENCH_SIZE === 1
        }
      }
    },
    football_players: _.indexBy([
      newFootballPlayer({ id: 1, pos: Positions.RB }),
      newFootballPlayer({ id: 2, pos: Positions.RB }),
      newFootballPlayer({ id: 3, pos: Positions.RB }),
      newFootballPlayer({ id: 4, pos: Positions.RB }),
      newFootballPlayer({ id: 5, pos: Positions.TE }),
      newFootballPlayer({ id: 6, pos: Positions.QB }),
      newFootballPlayer({ id: 7, pos: Positions.QB })
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
        football_players: { ...SUCCEEDED_META, items: [1, 2, 3, 4, 5, 6, 7] }
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
      state.entities.drafts[1].picks.push(
        newDraftPick({ fpId: 6, pickNumber: 3 }), // QB
        newDraftPick({ fpId: 7, pickNumber: 4 }) // QB
      );
      selectIneligibleDraftPositions(state).should.eql([Positions.QB]);
    });

    it('removes positions when flex and bench are full', () => {
      state.entities.drafts[1].picks.push(
        newDraftPick({ fpId: 3, pickNumber: 3 }), // RB
        newDraftPick({ fpId: 4, pickNumber: 4 }), // RB
        newDraftPick({ fpId: 5, pickNumber: 5 }) // TE
      );
      selectIneligibleDraftPositions(state).should.eql([
        Positions.RB,
        Positions.TE,
        Positions.FLEX
      ]);
    });

  });

  describe('selectDraftableFootballPlayers', () => {

    it('removes drafted players from the list', () => {
      const fbPlayers = state.entities.football_players;
      selectDraftableFootballPlayers(state).should.eql([
        fbPlayers[3], fbPlayers[4], fbPlayers[5], fbPlayers[6], fbPlayers[7]
      ]);
    });

    it('removes ineligible players from the list', () => {
      const fbPlayers = state.entities.football_players;

      // Force RB, TE, and FLEX to be ineligible
      state.entities.drafts[1].picks.push(
        newDraftPick({ fpId: 3, pickNumber: 3 }), // RB
        newDraftPick({ fpId: 4, pickNumber: 4 }), // RB
        newDraftPick({ fpId: 5, pickNumber: 5 }) // TE
      );

      selectDraftableFootballPlayers(state).should.eql([
        fbPlayers[6], fbPlayers[7]
      ]);
    });

  });

  describe('selectDraftableFootballPlayersByPosition', () => {

    it('buckets players by position', () => {
      const fbPlayers = state.entities.football_players;

      selectDraftableFootballPlayersByPosition(state).should.eql({
        [Positions.QB]: [fbPlayers[6], fbPlayers[7]],
        [Positions.RB]: [fbPlayers[3], fbPlayers[4]],
        [Positions.WR]: [],
        [Positions.TE]: [fbPlayers[5]],
        [Positions.FLEX]: [fbPlayers[3], fbPlayers[4], fbPlayers[5]],
        [Positions.K]: [],
        [Positions['D/ST']]: []
      });
    });

  });

});
