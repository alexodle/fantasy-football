import _ from 'lodash';
import keyMirror from 'fbjs/lib/keyMirror';
import {PropTypes} from 'react';

export const LoadingStates = {
  LOADING: Symbol('LOADING'),
  NOT_LOADED: Symbol('NOT_LOADED'),
  LOAD_FAILED: Symbol('LOAD_FAILED')
};

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

export const ModelShapes = {
  FootballPlayer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    position: PropTypes.oneOf(_.keys(Positions)).isRequired,
    football_team_id: PropTypes.number.isRequired
  })
};
