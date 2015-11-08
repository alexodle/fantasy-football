import _ from 'lodash';
import PositionChooser from './PositionChooser';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import React, {PropTypes} from 'react';
import {ModelShapes, PositionDisplayOrder, Positions, FlexPositions} from '../../Constants';
import {Button} from 'react-bootstrap/lib';
import DraftActions from '../../actions/DraftActions';

const ALL_POSITION = 'All';
const DEFAULT_POSITION = ALL_POSITION;
const MyPositionDisplayOrder = [ALL_POSITION].concat(PositionDisplayOrder);

const PlayerChooser = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    draftPicks: PropTypes.arrayOf(ModelShapes.DraftPick).isRequired,
    footballPlayers: PropTypes.arrayOf(ModelShapes.FootballPlayer).isRequired
  },

  getInitialState() {
    return {
      currentPosition: DEFAULT_POSITION,
      selectedPlayerId: null
    };
  },

  render() {
    const {footballPlayers, draftPicks} = this.props;
    const {currentPosition, selectedPlayerId} = this.state;

    let positionPlayers;
    if (currentPosition === ALL_POSITION) {
      positionPlayers = footballPlayers;
    } else if (currentPosition === Positions.FLEX) {
      positionPlayers = _.filter(footballPlayers, function (fp) {
        return _.contains(FlexPositions, fp.position);
      });
    } else {
      positionPlayers = _.where(footballPlayers, { position: currentPosition });
    }

    // Filter out picked players and sort
    const draftPicksById = _.indexBy(draftPicks, 'football_player_id');
    positionPlayers = _(positionPlayers)
      .reject(function (fp) {
        return !!draftPicksById[fp.id];
      })
      .sortBy('name')
      .value();

    return (
      <div>
        <PositionChooser
            onChange={this._onPositionChange}
            positions={MyPositionDisplayOrder}
            value={this.state.currentPosition}
        />
        <p>Number of players: <b>{positionPlayers.length}</b></p>
        <div className='form-group'>
          <select
              className='form-control'
              size={20}
              value={selectedPlayerId}
              onChange={this._onSelectedPlayerChange}
          >
            {_.map(positionPlayers, function (fp) {
              return (
                <option key={fp.id} value={fp.id}>
                  {`${fp.name} (${fp.position})`}
                </option>);
            })}
          </select>
        </div>
        <Button type='submit' disabled={!selectedPlayerId} onClick={this._onPick}>
          Draft
        </Button>
      </div>
    );
  },

  _onPositionChange(p) {
    this.setState({ currentPosition: p, selectedPlayerId: null });
  },

  _onSelectedPlayerChange(ev) {
    this.setState({ selectedPlayerId: ev.target.value });
  },

  _onPick() {
    const {selectedPlayerId} = this.state;
    if (selectedPlayerId) {
      DraftActions.draftPlayer(selectedPlayerId);
    }
  }

});

export default PlayerChooser;
