import _ from 'lodash';
import PositionChooser from './PositionChooser';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import React, {PropTypes} from 'react';
import {ModelShapes, PositionDisplayOrder, Positions, FlexPositions} from '../../Constants';

const ALL_POSITION = 'All';
const DEFAULT_POSITION = ALL_POSITION;
const MyPositionDisplayOrder = [ALL_POSITION].concat(PositionDisplayOrder);

const PlayerChooser = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    footballPlayers: PropTypes.arrayOf(ModelShapes.FootballPlayer).isRequired
  },

  getInitialState() {
    return {
      currentPosition: DEFAULT_POSITION
    };
  },

  render() {
    const {footballPlayers} = this.props;
    const {currentPosition} = this.state;

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
    positionPlayers = _.sortBy(positionPlayers, 'name');

    return (
      <div>
        <PositionChooser
            onChange={this._onPositionChange}
            positions={MyPositionDisplayOrder}
            value={this.state.currentPosition}
        />
        <p>Number of players: <b>{positionPlayers.length}</b></p>
        <div className='form-group'>
          <select className='form-control' size={20}>
            {_.map(positionPlayers, function (fp) {
              return (<option key={fp.id} value={fp.id}>{fp.name}</option>);
            })}
          </select>
        </div>
      </div>
    );
  },

  _onPositionChange(p) {
    this.setState({ currentPosition: p });
  }

});

export default PlayerChooser;