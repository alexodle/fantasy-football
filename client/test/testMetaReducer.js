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
import initialState, {DEFAULT_META} from '../app/js/initialState';

chai.should();

describe('metaReducer', () => {

  describe('current user', () => {

    it('updates current user ACTIVE', () => {
      metaReducer(initialState.meta, { type: LOAD_USER, state: ACTIVE })
      .should.eql({
        ...initialState.meta,
        current_user: { ...DEFAULT_META, isFetching: true }
      });
    });

    it('updates current user SUCCEEDED', () => {
      metaReducer(initialState.meta, {
        type: LOAD_USER,
        state: SUCCEEDED,
        lastUpdated: 123,
        result: { id: 1 }
      })
      .should.eql({
        ...initialState.meta,
        current_user: {
          isFetching: false,
          didInvalidate: false,
          didFailFetching: false,
          lastUpdated: 123,
          id: 1
        }
      });
    });

  });

});
