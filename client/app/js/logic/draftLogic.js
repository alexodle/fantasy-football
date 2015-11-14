import _ from 'lodash';

export function bucketTeam({
  userDraftPicks,
  footballPlayerLookup,
  teamReqs
}) {
    let bench = [];
    const picksByPosition = _(userDraftPicks)
      .groupBy(function (dp) {
        return footballPlayerLookup[dp.football_player_id].position;
      })

      // Shove excess players onto the bench
      .mapValues(function (picks, p) {
        const nAllowed = teamReqs[p];
        bench.push.apply(bench, _.drop(picks, nAllowed));
        return _.take(picks, nAllowed);
      })
      .value();

    // We like our benches sorted
    bench = _.sortBy(bench, 'pick_number');

    return {
      picksByPosition,
      bench
    };
}
