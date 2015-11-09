import React from 'react';
import PlayerChooser from './PlayerChooser';
import Reflux from 'reflux';
import FootballPlayerStore from '../../stores/FootballPlayerStore';
import DraftStore from '../../stores/DraftStore';
import AjaxComponent from '../AjaxComponent';
import FFPanel from '../FFPanel';
import DraftHistory from './DraftHistory';

const Draft = React.createClass({

  mixins: [
    Reflux.connect(FootballPlayerStore, 'footballPlayersStore'),
    Reflux.connect(DraftStore, 'draftStore')
  ],

  render() {
    const {footballPlayersStore, draftStore} = this.state;
    const {footballPlayers} = footballPlayersStore;
    const {draftPicks, draftOrder} = draftStore;
    return (
      <div>
        <FFPanel title='Pick your player'>
          <AjaxComponent
              ChildClass={PlayerChooser}
              childClassProps={{ footballPlayers: availableFootballPlayers }}
          />
        </FFPanel>
        <FFPanel title='Draft history'>
          <AjaxComponent
              ChildClass={DraftHistory}
              childClassProps={{
                draftPicks: draftPicks,
                userLookup: userStore.userLookup
              }}
          />
        </FFPanel>
      </div>
    );
  }

});

export default Draft;
