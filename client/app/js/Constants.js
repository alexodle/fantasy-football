import _ from 'lodash';
import keyMirror from 'fbjs/lib/keyMirror';
import {PropTypes} from 'react';

export const Positions = keyMirror({
  QB: null,
  RB: null,
  WR: null,
  TE: null,
  FLEX: null,
  K: null,
  'D/ST': null
});

export const PositionDisplayOrder = [
  'QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'D/ST'
];

export const FlexPositions = [
  'RB', 'WR', 'TE'
];

export const MetaShape = PropTypes.shape({
  isFetching: PropTypes.bool.isRequired,
  didInvalidate: PropTypes.bool.isRequired,
  didFailFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number
});

export const ModelShapes = {

  User: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }),

  FantasyLeague: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    commissioner_id: PropTypes.number.isRequired,
    conference_id: PropTypes.number.isRequired,
    draft_start_date: PropTypes.instanceOf(Date).isRequired
  }),

  FootballPlayer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    position: PropTypes.oneOf(_.keys(Positions)).isRequired,
    football_team_id: PropTypes.number.isRequired
  }),

  DraftPick: PropTypes.shape({
    fantasy_league_id: PropTypes.number.isRequired,
    user_id: PropTypes.number.isRequired,
    football_player_id: PropTypes.number.isRequired,
    pick_number: PropTypes.number.isRequired
  }),

  DraftOrder: PropTypes.shape({
    fantasy_league_id: PropTypes.number.isRequired,
    user_id: PropTypes.number.isRequired,
    order: PropTypes.number.isRequired
  })

};

export const ChildrenPropType = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node
]);
