import _ from 'lodash';
import chai from 'chai';
import {bucketTeam} from '../app/js/logic/draftLogic';
import {newDraftPick, newFootballPlayer} from './testUtils';
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

const EMPTY_BUCKETS = _.mapValues(Positions, () => []);

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
        picksByPosition: {
          ...EMPTY_BUCKETS,
          [Positions.QB]: [picks[0]],
          [Positions.RB]: [picks[1], picks[2]],
          [Positions.WR]: [picks[3]]
        },
        bench: []
      });
    });

    it('pushes players onto the bench', () => {
      const picks = [
        newDraftPick({ fpId: 1, pickNumber: 1 }),
        newDraftPick({ fpId: 2, pickNumber: 2 })
      ];
      bucketTeam({
        teamReqs: TEAM_REQS,
        userDraftPicks: picks,
        footballPlayerLookup: _.indexBy([
          newFootballPlayer({ id: 1, pos: Positions.QB }),
          newFootballPlayer({ id: 2, pos: Positions.QB })
        ], 'id')
      })
      .should.eql({
        picksByPosition: { ...EMPTY_BUCKETS, [Positions.QB]: [picks[0]] },
        bench: [picks[1]]
      });
    });

    it('pushes players onto FLEX before the bench', () => {
      const picks = [
        newDraftPick({ fpId: 1, pickNumber: 1 }),
        newDraftPick({ fpId: 2, pickNumber: 2 }),
        newDraftPick({ fpId: 3, pickNumber: 10 }),
        newDraftPick({ fpId: 4, pickNumber: 11 }),
        newDraftPick({ fpId: 5, pickNumber: 20 })
      ];
      bucketTeam({
        teamReqs: TEAM_REQS,
        userDraftPicks: picks,
        footballPlayerLookup: _.indexBy([
          newFootballPlayer({ id: 1, pos: Positions.TE }),
          newFootballPlayer({ id: 2, pos: Positions.TE }),
          newFootballPlayer({ id: 3, pos: Positions.RB }),
          newFootballPlayer({ id: 4, pos: Positions.RB }),
          newFootballPlayer({ id: 5, pos: Positions.RB })
        ], 'id')
      })
      .should.eql({
        picksByPosition: {
          ...EMPTY_BUCKETS,
          [Positions.TE]: [picks[0]],
          [Positions.FLEX]: [picks[1]],
          [Positions.RB]: [picks[2], picks[3]]
        },
        bench: [picks[4]]
      });
    });

  });

});
