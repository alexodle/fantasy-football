import _ from 'lodash';
import {Positions, FlexPositions} from '../Constants';
import Immutable from 'immutable';

const {FLEX} = Positions;

/**
 * During drafting, buckets your players into positions, making it easy to
 * tell which positions are elgigible to be drafted.
 */
export function bucketTeam({
  userDraftPicks,
  footballPlayerLookup,
  teamReqs
}) {
  const picksByPosition = _.mapValues(Positions, () => []);
  let bench = [];

  userDraftPicks.forEach(function (dp) {
    var position = footballPlayerLookup.get(dp.get('football_player_id')).get('position');

    if (picksByPosition[position].length() < teamReqs.get('position')) {
      picksByPosition[position].push(dp);
    } else if (picksByPosition[FLEX].length < teamReqs.get(FLEX) && _.contains(FlexPositions, position)) {
      picksByPosition[FLEX].push(dp);
    } else {
      bench.push(dp);
    }
  });

  return Immutable.toJS({
    picksByPosition,
    bench
  });
}
