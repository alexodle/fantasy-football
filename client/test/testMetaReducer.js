import chai from 'chai';
import metaReducer from '../app/js/reducers/metaReducer';
import {
  LOAD_DRAFT_ORDER,
  LOAD_DRAFT_PICKS,
  LOAD_FANTASY_PLAYERS,
  LOAD_FANTASY_TEAMS,
  LOAD_FOOTBALL_PLAYERS,
  LOAD_MY_LEAGUES,
  LOAD_USER
} from '../app/js/actions/ActionTypes';
import {ACTIVE, SUCCEEDED, FAILED} from '../app/js/actions/AsyncActionStates';
import initialState, {DEFAULT_META, DEFAULT_FANTASY_LEAGUE} from '../app/js/initialState';

const ACTIVE_META = { ...DEFAULT_META, isFetching: true };

const SUCCESS_META = {
  isFetching: false,
  didInvalidate: false,
  didFailFetching: false,
  lastUpdated: 123
};

const FAILED_META = { ...DEFAULT_META, didFailFetching: true, statusCode: 401 };

chai.should();

describe('metaReducer', () => {

  describe('leagues', () => {

    it('should initialize all league state on first league fetch', () => {
      metaReducer(initialState.meta, { type: LOAD_DRAFT_ORDER, state: ACTIVE, league_id: 1 })
      .should.eql({
        ...initialState.meta,
        fantasy_leagues: { 1: {
          ...DEFAULT_FANTASY_LEAGUE,
          draft: {
            order: ACTIVE_META,
            picks: DEFAULT_META
          }
        } }
      });
    });

    describe('draft order', () => {

      // ACTIVE path is covered by other tests

      it('updates draft order SUCCEEDED', () => {
        metaReducer(initialState.meta, {
          type: LOAD_DRAFT_ORDER,
          state: SUCCEEDED,
          league_id: 1,
          lastUpdated: 123
        })
        .should.eql({
          ...initialState.meta,
          fantasy_leagues: { 1: {
            ...DEFAULT_FANTASY_LEAGUE,
            draft: { order: SUCCESS_META, picks: DEFAULT_META }
          } }
        });
      });

      // FAILED path is covered by other tests

    });

    describe('draft picks', () => {

      // ACTIVE path is covered by other tests

      it('updates draft order SUCCEEDED', () => {
        metaReducer(initialState.meta, {
          type: LOAD_DRAFT_PICKS,
          state: SUCCEEDED,
          league_id: 1,
          lastUpdated: 123
        })
        .should.eql({
          ...initialState.meta,
          fantasy_leagues: { 1: {
            ...DEFAULT_FANTASY_LEAGUE,
            draft: { picks: SUCCESS_META, order: DEFAULT_META }
          } }
        });
      });

      // FAILED path is covered by other tests

    });

    describe('fantasy players', () => {

      it('updates fantasy players ACTIVE', () => {
        metaReducer(initialState.meta, {
          type: LOAD_FANTASY_PLAYERS,
          state: ACTIVE,
          league_id: 1
        })
        .should
        .eql({
          ...initialState.meta,
          fantasy_leagues: { 1: {
            ...DEFAULT_FANTASY_LEAGUE,
            fantasy_players: ACTIVE_META
          } }
        });
      });

      it('updates fantasy players SUCCEEDED', () => {
        metaReducer(initialState.meta, {
          type: LOAD_FANTASY_PLAYERS,
          state: SUCCEEDED,
          league_id: 1,
          lastUpdated: 123,
          payload: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 5 }]
        })
        .should
        .eql({
          ...initialState.meta,
          fantasy_leagues: { 1: {
            ...DEFAULT_FANTASY_LEAGUE,
            fantasy_players: { ...SUCCESS_META, items: [1, 2, 3, 5] }
          } }
        });
      });

      // FAILED path is covered by other tests

    });

    describe('fantasy teams', () => {

      // ACTIVE path is covered by other tests

      it('updates fantasy teams SUCCEEDED', () => {
        metaReducer(initialState.meta, {
          type: LOAD_FANTASY_TEAMS,
          state: SUCCEEDED,
          league_id: 1,
          lastUpdated: 123,
          payload: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 5 }]
        })
        .should
        .eql({
          ...initialState.meta,
          fantasy_leagues: { 1: {
            ...DEFAULT_FANTASY_LEAGUE,
            fantasy_teams: { ...SUCCESS_META, items: [1, 2, 3, 5] }
          } }
        });
      });

      // FAILED path is covered by other tests

    });

    describe('football players', () => {

      // ACTIVE path is covered by other tests

      it('updates football players SUCCEEDED', () => {
        metaReducer(initialState.meta, {
          type: LOAD_FOOTBALL_PLAYERS,
          state: SUCCEEDED,
          league_id: 1,
          lastUpdated: 123,
          payload: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 5 }]
        })
        .should
        .eql({
          ...initialState.meta,
          fantasy_leagues: { 1: {
            ...DEFAULT_FANTASY_LEAGUE,
            football_players: { ...SUCCESS_META, items: [1, 2, 3, 5] }
          } }
        });
      });

      // FAILED path is covered by other tests

    });

  });

  describe('current user', () => {

    it('updates current user ACTIVE', () => {
      metaReducer(initialState.meta, { type: LOAD_USER, state: ACTIVE })
      .should
      .eql({ ...initialState.meta, current_user: ACTIVE_META });
    });

    it('updates current user SUCCEEDED', () => {
      metaReducer(initialState.meta, {
        type: LOAD_USER,
        state: SUCCEEDED,
        lastUpdated: 123,
        payload: { id: 1 }
      })
      .should.eql({ ...initialState.meta, current_user: { ...SUCCESS_META, id: 1 } });
    });

    it('updates current user FAILED', () => {
      metaReducer(initialState.meta, { type: LOAD_USER, state: FAILED, statusCode: 401 })
      .should
      .eql({ ...initialState.meta, current_user: FAILED_META });
    });

  });

  describe('my leagues', () => {

    it('updates my leagues ACTIVE', () => {
      metaReducer(initialState.meta, { type: LOAD_MY_LEAGUES, state: ACTIVE })
      .should
      .eql({ ...initialState.meta, my_leagues: ACTIVE_META });
    });

    it('updates my leagues SUCCEEDED', () => {
      metaReducer(initialState.meta, {
        type: LOAD_MY_LEAGUES,
        state: SUCCEEDED,
        lastUpdated: 123,
        payload: [{ id: 1 }, { id: 2 }, { id: 3 }]
      })
      .should.eql({
        ...initialState.meta,
        my_leagues: { ...SUCCESS_META, items: [1, 2, 3] }
      });
    });

    it('updates my leagues FAILED', () => {
      metaReducer(initialState.meta, { type: LOAD_MY_LEAGUES, state: FAILED, statusCode: 401 })
      .should
      .eql({ ...initialState.meta, my_leagues: FAILED_META });
    });

  });

});
