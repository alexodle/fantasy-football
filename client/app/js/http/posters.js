import httpPost from './utils/httpPost';

export function postDraftPick(fantasyLeagueId, token, data) {
  return httpPost({
    url: `/api/fantasy_leagues/${fantasyLeagueId}/draft_picks/`,
    data: data,
    token: token
  });
}
