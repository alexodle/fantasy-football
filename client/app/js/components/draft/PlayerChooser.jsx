import _ from 'lodash';
import PositionChooser from './PositionChooser';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import React, {PropTypes} from 'react';
import {Button} from 'react-bootstrap/lib';
import {createFFSelector} from '../../selectors/selectorUtils';
import {ModelShapes, PositionDisplayOrder, Positions} from '../../Constants';
import {selectDraftableFootballPlayersByPosition} from '../../selectors/draftSelectors';

const ALL_POSITION = 'All';
const DEFAULT_POSITION = ALL_POSITION;
const MyPositionDisplayOrder = [ALL_POSITION].concat(PositionDisplayOrder);

const POSITIONS_WITHOUT_FLEX = _(Positions)
  .values()
  .without(Positions.FLEX)
  .value();

export const playerChooserSelector = createFFSelector({
  selectors: [selectDraftableFootballPlayersByPosition],
  selector: function (draftableFootballPlayersByPosition) {
    return { draftableFootballPlayersByPosition };
  }
});

export default React.createClass({

  displayName: 'PlayerChooser',

  mixins: [PureRenderMixin],

  propTypes: {
    draftableFootballPlayersByPosition: PropTypes.objectOf(PropTypes.arrayOf(ModelShapes.FootballPlayer)),
    onPick: PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      currentPosition: DEFAULT_POSITION,
      selectedPlayerId: null
    };
  },

  componentWillReceiveProps(nextProps) {
    const {draftableFootballPlayersByPosition} = nextProps;
    const {currentPosition} = this.state;
    if (_.isEmpty(draftableFootballPlayersByPosition[currentPosition])) {
      this.setState({ currentPosition: DEFAULT_POSITION });
    }
  },

  render() {
    const {draftableFootballPlayersByPosition} = this.props;
    const {currentPosition, selectedPlayerId} = this.state;

    // Filter players by current position
    let positionPlayers = null;
    if (currentPosition === ALL_POSITION) {
      positionPlayers = _(draftableFootballPlayersByPosition)
        .pick(POSITIONS_WITHOUT_FLEX)
        .values()
        .flatten()
        .sortBy('name')
        .value();
    } else {
      positionPlayers = _.sortBy(draftableFootballPlayersByPosition[currentPosition], 'name');
    }

    const ineligibleDraftPositions = _(draftableFootballPlayersByPosition)
      .pick(_.isEmpty)
      .keys()
      .value();

    return (
      <div>
        <PositionChooser
            onChange={this._onPositionChange}
            positions={MyPositionDisplayOrder}
            value={currentPosition}
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
