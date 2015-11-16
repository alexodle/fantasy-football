import _ from 'lodash';
import PositionChooser from './PositionChooser';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import React, {PropTypes} from 'react';
import {Button} from 'react-bootstrap/lib';
import {createFFSelector} from '../../selectors/selectorUtils';
import {ModelShapes, PositionDisplayOrder, Positions, FlexPositions} from '../../Constants';
import {selectDraftableFootballPlayers, selectIneligibleDraftPositions} from '../../selectors/draftSelectors';

const ALL_POSITION = 'All';
const DEFAULT_POSITION = ALL_POSITION;
const MyPositionDisplayOrder = [ALL_POSITION].concat(PositionDisplayOrder);

export const playerChooserSelector = createFFSelector({
  selectors: [selectDraftableFootballPlayers, selectIneligibleDraftPositions],
  selector: function (draftableFootballPlayers, ineligibleDraftPositions) {
    return {
      footballPlayers: draftableFootballPlayers,
      ineligibleDraftPositions: ineligibleDraftPositions
    };
  }
});

export default React.createClass({

  displayName: 'PlayerChooser',

  mixins: [PureRenderMixin],

  propTypes: {
    footballPlayers: PropTypes.arrayOf(ModelShapes.FootballPlayer).isRequired,
    ineligibleDraftPositions: PropTypes.arrayOf(PropTypes.string),
    onPick: PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      currentPosition: DEFAULT_POSITION,
      selectedPlayerId: null
    };
  },

  componentWillReceiveProps(nextProps) {
    if (_.contains(nextProps.ineligibleDraftPositions, this.state.currentPosition)) {
      this.setState({ currentPosition: DEFAULT_POSITION });
    }
  },

  render() {
    const {footballPlayers, ineligibleDraftPositions} = this.props;
    const {currentPosition, selectedPlayerId} = this.state;

    // Filter players by current position
    let wrappedPositionPlayers = _(footballPlayers);
    if (currentPosition === Positions.FLEX) {
      wrappedPositionPlayers = wrappedPositionPlayers.filter(function (fp) {
        return _.contains(FlexPositions, fp.position);
      });
    } else if (currentPosition !== ALL_POSITION) {
      wrappedPositionPlayers = wrappedPositionPlayers.where({
        position: currentPosition
      });
    }
    const positionPlayers = wrappedPositionPlayers
      .sortBy('name')
      .value();

    return (
      <div>
        <PositionChooser
            onChange={this._onPositionChange}
            positions={MyPositionDisplayOrder}
            value={this.state.currentPosition}
            ineligibleDraftPositions={ineligibleDraftPositions}
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
      this.props.onPick(_.parseInt(selectedPlayerId));
      this.setState({ selectedPlayerId: null });
    }
  }

});
