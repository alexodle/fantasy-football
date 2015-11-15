import _ from 'lodash';
import {Positions, FlexPositions} from '../Constants';

const {FLEX} = Positions;

export function bucketTeam({
  userDraftPicks,
  footballPlayerLookup,
  teamReqs
}) {
  const picksByPosition = _.mapValues(Positions, function () { return []; });
  const bench = [];

  _.forEach(userDraftPicks, function (dp) {
    var position = footballPlayerLookup[dp.football_player_id].position;

    if (picksByPosition[position].length < teamReqs[position]) {
      picksByPosition[position].push(dp);
    } else if (picksByPosition[FLEX].length < teamReqs[FLEX] && _.contains(FlexPositions, position)) {
      picksByPosition[FLEX].push(dp);
    } else {
      bench.push(dp);
    }
  });

  return {
    picksByPosition,
    bench
  };
}
