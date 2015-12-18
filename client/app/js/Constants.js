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

const FantasyTeamModelShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  short_name: PropTypes.string.isRequired,
  fantasy_league_id: PropTypes.number.isRequired,
  owner_id: PropTypes.number.isRequired
});

export const ModelShapes = {

  FantasyTeam: FantasyTeamModelShape,

  User: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,

    // We always include the team for the current league when passing users via
    // selector
    team: FantasyTeamModelShape
  }),

  FantasyLeague: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    commissioner_id: PropTypes.number.isRequired,
    conference_id: PropTypes.number.isRequired,
    draft_start_date: PropTypes.instanceOf(Date).isRequired,
    rules: PropTypes.shape({
      max_team_size: PropTypes.number.isRequired,
      team_reqs: PropTypes.shape({
        [Positions.QB]: PropTypes.number.isRequired,
        [Positions.RB]: PropTypes.number.isRequired,
        [Positions.WR]: PropTypes.number.isRequired,
        [Positions.TE]: PropTypes.number.isRequired,
        [Positions.FLEX]: PropTypes.number.isRequired,
        [Positions.K]: PropTypes.number.isRequired,
        [Positions['D/ST']]: PropTypes.number.isRequired
      }).isRequired
    }).isRequired
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
    order: PropTypes.number.isRequired
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

export const IS_LOADING = 'IS_LOADING';
export const FAILED_LOADING = 'FAILED_LOADING';

export const LoadStateShape = PropTypes.oneOf([false, IS_LOADING, FAILED_LOADING]);
