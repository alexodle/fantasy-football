export function newDraftPick({leagueId = 1, userId = 1, fpId, pickNumber}) {
  return {
    fantasy_league_id: leagueId,
    user_id: userId,
    football_player_id: fpId,
    pick_number: pickNumber
  };
}

export function newFootballPlayer({name = 'FB Player {{id}}', footballTeamId = 1, id, pos}) {
  return {
    id,
    name: name.replace('{{id}}', id),
    position: pos,
    football_team_id: footballTeamId
  };
}
