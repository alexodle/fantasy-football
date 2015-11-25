import _ from 'lodash';
import chai from 'chai';
import entitiesReducer from '../app/js/reducers/entitiesReducer';
import {
  DRAFT_PLAYER,
  LOAD_DRAFT_ORDER,
  LOAD_DRAFT_PICKS,
  LOAD_FANTASY_PLAYERS,
  LOAD_FANTASY_TEAMS,
  LOAD_FOOTBALL_PLAYERS,
  LOAD_MY_LEAGUES,
  LOAD_USER
} from '../app/js/actions/ActionTypes';
import {ACTIVE, SUCCEEDED, FAILED} from '../app/js/actions/AsyncActionStates';
import initialState from '../app/js/initialState';

chai.should();

const FIRST_PICK = {
  fantasy_league_id: 1,
  football_player_id: 1,
  pick_number: 1
};

const INITIAL_ENTITIES = { ...initialState.entities, ...{
  drafts: { 1: { picks: [FIRST_PICK] } } }
};

describe('entitiesReducer', () => {

  describe('draft player', () => {

    it('should pre-emptively update when active', () => {
      const pick = {
        fantasy_league_id: 1,
        football_player_id: 2,
        pick_number: 2
      };
      entitiesReducer(INITIAL_ENTITIES, {
        type: DRAFT_PLAYER,
        state: ACTIVE,
        league_id: 1,
        data: pick
      })
      .should
      .eql({ ...INITIAL_ENTITIES, drafts: { 1: { picks: [FIRST_PICK, pick] } } });
    });

    // TODO - what to do if this fails?

  });

  describe('load entities', () => {

    it('loads basic entities on SUCCESS', () => {
      _.each([
        [LOAD_FANTASY_PLAYERS, 'users'],
        [LOAD_FANTASY_TEAMS, 'fantasy_teams'],
        [LOAD_FOOTBALL_PLAYERS, 'football_players'],
        [LOAD_MY_LEAGUES, 'fantasy_leagues']
      ], ([actionType, entityName]) => {
        const result = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 5 }];
        entitiesReducer(INITIAL_ENTITIES, {
          type: actionType,
          state: SUCCEEDED,
          result: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 5 }]
        })
        .should
        .eql({ ...INITIAL_ENTITIES, [entityName]: _.indexBy(result, 'id') });
      });
    });

  });

});
