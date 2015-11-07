import AjaxComponent from './components/AjaxComponent';
import FootballPlayerStore from './stores/FootballPlayerStore';
import PlayerChooser from './components/draft/PlayerChooser';
import React from 'react';
import Reflux from 'reflux';

const App = React.createClass({

  mixins: [
    Reflux.connect(FootballPlayerStore, 'footballPlayersStore')
  ],

  render() {
    const {footballPlayersStore} = this.state;
    const footballPlayers = footballPlayersStore.footballPlayers;
    return (
      <div className='container'>
        <AjaxComponent
            loadingState={footballPlayers}
            ChildClass={PlayerChooser}
            childClassProps={{ footballPlayers: footballPlayers }}
        />
      </div>
    );
  }

});

export default App;
