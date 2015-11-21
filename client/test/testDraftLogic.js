import _ from 'lodash';
import chai from 'chai';
import {bucketTeam} from '../app/js/logic/draftLogic';
import {Positions} from '../app/js/Constants';

chai.should();

const TEAM_REQS = {
  [Positions.QB]: 1,
  [Positions.RB]: 2,
  [Positions.WR]: 2,
  [Positions.TE]: 1,
  [Positions.FLEX]: 1,
  [Positions.K]: 1,
  [Positions['D/ST']]: 1
};

function newDraftPick({leagueId = 1, userId = 1, fpId, pickNumber}) {
  return {
    fantasy_league_id: leagueId,
    user_id: userId,
    football_player_id: fpId,
    pick_number: pickNumber
  };
}

function newFootballPlayer({name = 'FB Player {{id}}', footballTeamId = 1, id, pos}) {
  name = name.replace('{{id}}', id);
  return {
    id,
    name: name.replace('{{id}}', id),
    position: pos,
    football_team_id: footballTeamId
  };
}

describe('draftLogic', () => {

  describe('bucketTeam', () => {

    it('buckets team by position', () => {
      const picks = [
        newDraftPick({ fpId: 1, pickNumber: 1 }),
        newDraftPick({ fpId: 2, pickNumber: 2 }),
        newDraftPick({ fpId: 3, pickNumber: 10 }),
        newDraftPick({ fpId: 4, pickNumber: 10 })
      ];
      bucketTeam({
        teamReqs: TEAM_REQS,
        userDraftPicks: picks,
        footballPlayerLookup: _.indexBy([
          newFootballPlayer({ id: 1, pos: Positions.QB }),
          newFootballPlayer({ id: 2, pos: Positions.RB }),
          newFootballPlayer({ id: 3, pos: Positions.RB }),
          newFootballPlayer({ id: 4, pos: Positions.WR })
        ], 'id')
      })
      .should.eql({
        picksByPosition: _(Positions)
          .mapValues(() => [])
          .merge({
            [Positions.QB]: [picks[0]],
            [Positions.RB]: [picks[1], picks[2]],
            [Positions.WR]: [picks[3]]
          })
          .value(),
        bench: []
      });
    });

  });

});
