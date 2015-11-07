import PositionChooser from './PositionChooser';
import React, {PropTypes} from 'react';
import {ModelShapes, PositionDisplayOrder} from '../../Constants';

const MyPositionDisplayOrder = ['All'].concat(PositionDisplayOrder);
const DefaultPosition = 'All';

const PlayerChooser = React.createClass({

  propTypes: {
    footballPlayers: PropTypes.arrayOf(ModelShapes.FootballPlayer).isRequired
  },

  getInitialState() {
    return { currentPosition: DefaultPosition };
  },

  render() {
    /*
    const {footballPlayers} = this.props;
    const playersByPosition = _.groupBy(footballPlayers, 'position');

          let footballPlayers = playersByPosition[p];
          if (p === Positions.FLEX) {
            footballPlayers = _(playersByPosition)
              .pick(FlexPositions)
              .values()
              .concat()
              .value();
          }
          */
    return (
      <PositionChooser
          onChange={this._onPositionChange}
          positions={MyPositionDisplayOrder}
          value={this.state.currentPosition}
      />);
  },

  _onPositionChange(p) {
    this.setState({ currentPosition: p });
  }

});

export default PlayerChooser;
