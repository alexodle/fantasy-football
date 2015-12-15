import httpGet from './httpGet';

export default function getUserLeagues(userId, token) {
  return httpGet({ url: `/api/users/${userId}/fantasy_leagues/`, token });
}
