import React from 'react';
import PlayerChooser from './PlayerChooser';
import Reflux from 'reflux';
import FootballPlayerStore from '../../stores/FootballPlayerStore';
import DraftStore from '../../stores/DraftStore';
import AjaxComponent from '../AjaxComponent';

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
        <AjaxComponent
            loadingState={[footballPlayers, draftPicks, draftOrder]}
            ChildClass={PlayerChooser}
            childClassProps={{ footballPlayers: footballPlayers }}
        />
    );
  }

});

export default Draft;
