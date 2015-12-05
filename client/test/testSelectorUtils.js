import './setupTests';

import _ from 'lodash';
import {createFFSelector, createFFComponentSelector} from '../app/js/selectors/selectorUtils';
import {IS_LOADING, FAILED_LOADING} from '../app/js/Constants';

// Tests can use this as the "state" objects. This kills two birds with one
// stone, as it allows us to test that state is being passed through to our
// selectors AND it makes it easy to return the states we want.
const LOADING_STATES = {
  loadingStates: {
    loading: IS_LOADING,
    failed: FAILED_LOADING,
    succeeded: { anthing: 'works here' }
  },
  metas: {
    metaNull: null,
    metaFailed: { didFailFetching: true },
    metaNotLoaded: { lastUpdated: null },
    metaLoaded: { lastUpdated: 1234 }
  }
};

const loadingEntitySelector = (state) => state.loadingStates.loading;
const failedEntitySelector = (state) => state.loadingStates.failed;
const succeededEntitySelector = (state) => state.loadingStates.succeeded;

const nullMetaSelector = (state) => state.metas.metaNull;
const failedMetaSelector = (state) => state.metas.metaFailed;
const notLoadedMetaSelector = (state) => state.metas.metaNotLoaded;
const loadedMetaSelector = (state) => state.metas.metaLoaded;

function createLoadedMetaSelectorWith(props) {
  return function (state) {
    return { ...props, ...loadedMetaSelector(state) };
  };
}

function failIfReached() {
  throw new Error("Should not have gotten here!");
}

describe('draftLogic', () => {

  describe('createFFComponentSelector', () => {

    it('evaluates any functions included in spec', () => {
      createFFComponentSelector({
        f1: failedMetaSelector,
        f2: notLoadedMetaSelector,
        nonF1: 'wassup tho'
      })(LOADING_STATES)
      .should.eql({
        f1: failedMetaSelector(LOADING_STATES),
        f2: notLoadedMetaSelector(LOADING_STATES),
        nonF1: 'wassup tho',
        loadState: false
      });
    });

    it('sets loadState to IS_LOADING if any values are loading', () => {
      createFFComponentSelector({
        f1: loadingEntitySelector,
        f2: succeededEntitySelector
      })(LOADING_STATES)
      .should.eql({
        loadState: IS_LOADING,
        f2: succeededEntitySelector(LOADING_STATES)
      });
    });

    it('sets loadState to FAILED_LOADING if any values have failed', () => {
      createFFComponentSelector({
        f1: loadingEntitySelector,
        f2: succeededEntitySelector,
        f3: failedEntitySelector
      })(LOADING_STATES)
      .should.eql({
        loadState: FAILED_LOADING,
        f2: succeededEntitySelector(LOADING_STATES)
      });
    });

  });

  describe('createFFSelector', () => {

    it('not loaded if meta does not exist', () => {
      createFFSelector({
        metaSelectors: [nullMetaSelector, loadedMetaSelector],
        selector: failIfReached
      })(LOADING_STATES)
      .should.eql(IS_LOADING);
    });

    it('not loaded if lastUpdated is null', () => {
      createFFSelector({
        metaSelectors: [notLoadedMetaSelector, loadedMetaSelector],
        selector: failIfReached
      })(LOADING_STATES)
      .should.eql(IS_LOADING);
    });

    it('failed if didFailFetching', () => {
      createFFSelector({
        metaSelectors: [notLoadedMetaSelector, failedMetaSelector, loadedMetaSelector],
        selector: failIfReached
      })(LOADING_STATES)
      .should.eql(FAILED_LOADING);
    });

    it('returns selector value if loaded', () => {
      createFFSelector({
        metaSelectors: [loadedMetaSelector],
        selector: (loadedMeta) => loadedMeta.lastUpdated
      })(LOADING_STATES)
      .should.eql(1234);
    });

    it('returns selector no meta selectors exist', () => {
      createFFSelector({ selector: () => 'Hey there' })(LOADING_STATES)
      .should.eql('Hey there');
    });

    it('returns loading if an entity selector is loading', () => {
      createFFSelector({
        selectors: [loadingEntitySelector],
        selector: failIfReached
      })(LOADING_STATES)
      .should.eql(IS_LOADING);
    });

    it('returns failed if any entity selector is failed', () => {
      createFFSelector({
        selectors: [loadingEntitySelector, failedEntitySelector],
        selector: failIfReached
      })(LOADING_STATES)
      .should.eql(FAILED_LOADING);
    });

    it('returns selector value if nothing failed and everything still loaded', () => {
      // Arbitrarily return 'loadingStates' from LOADING_STATES and ensure we
      // get it from our ffSelector
      createFFSelector({
        selectors: [_.identity],
        selector: (state) => state.loadingStates
      })(LOADING_STATES)
      .should.eql(LOADING_STATES.loadingStates);
    });

    it('passes in selector values in the order they are asked for', () => {
      createFFSelector({
        metaSelectors: [
          createLoadedMetaSelectorWith({ data: 'meta hi' }),
          createLoadedMetaSelectorWith({ value: 'meta hello' })
        ],
        selectors: [_.constant('hi'), _.constant('hello')],
        selector: (...params) => params
      })(LOADING_STATES)
      .should.eql([
        { data: 'meta hi', ...LOADING_STATES.metas.metaLoaded },
        { value: 'meta hello', ...LOADING_STATES.metas.metaLoaded },
        'hi',
        'hello'
      ]);
    });

  });

});
