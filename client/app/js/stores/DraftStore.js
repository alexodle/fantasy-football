import LoadActions from '../actions/LoadActions';
import DraftActions from '../actions/DraftActions';
import Reflux from 'reflux';
import {LoadingStates} from '../Constants';
import DelayLoadStoreMixin from '../utils/DelayLoadStoreMixin';

let state = {
  draftPicks: LoadingStates.NOT_LOADED,
  draftOrder: LoadingStates.NOT_LOADED,
  isPostingDraftPick: false
};

const DraftStore = Reflux.createStore({

  mixins: [
    DelayLoadStoreMixin.create(state, [{
        stateKey: 'draftPicks',
        action: LoadActions.loadDraftPicks,
        onComplete: 'onLoadDraftPicksCompleted'
      }, {
        stateKey: 'draftOrder',
        action: LoadActions.loadDraftOrder
      }
    ])
  ],

  listenables: [DraftActions],

  onDraftPlayer() {
    state.isPostingDraftPick = true;
    this.trigger(state);
  },

  onLoadDraftPicksCompleted() {
    state.isPostingDraftPick = false;
    this.trigger(state);
  },

  getState() {
    return state;
  }

});

export default DraftStore;
