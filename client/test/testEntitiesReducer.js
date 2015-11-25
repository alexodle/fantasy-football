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
  order: 1
};

const LOADED_ENTITIES = { ...initialState.entities, ...{
  drafts: { 1: { picks: [FIRST_PICK] } } }
};

describe('entitiesReducer', () => {

  describe('draft player', () => {

    it('should pre-emptively update when active', () => {
      const pick = {
        fantasy_league_id: 1,
        football_player_id: 2,
        order: 2
      };
      entitiesReducer(LOADED_ENTITIES, {
        type: DRAFT_PLAYER,
        state: ACTIVE,
        league_id: 1,
        data: pick
      })
      .should
      .eql({ ...LOADED_ENTITIES, drafts: { 1: { picks: [FIRST_PICK, pick] } } });
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
        entitiesReducer(LOADED_ENTITIES, {
          type: actionType,
          state: SUCCEEDED,
          result: result
        })
        .should
        .eql({ ...LOADED_ENTITIES, [entityName]: _.indexBy(result, 'id') });
      });
    });

    it('loads draft entities on SUCCESS', () => {
      _.each([
        [LOAD_DRAFT_ORDER, 'order'],
        [LOAD_DRAFT_PICKS, 'picks']
      ], ([actionType, entityName]) => {
        const result = [{ order: 4 }, { order: 3 }, { order: 5 }, { order: 1 }];
        entitiesReducer(initialState.entities, {
          type: actionType,
          state: SUCCEEDED,
          result: result,
          league_id: 1
        })
        .should
        .eql({ ...initialState.entities, drafts: {
          1: { [entityName]: _.sortBy(result, 'order')  }
        } });
      });
    });

  });

});
