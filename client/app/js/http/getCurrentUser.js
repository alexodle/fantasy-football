import httpGet from './httpGet';

export default function getCurrentUser(token) {
  return httpGet({ url: '/api/current_user', token });
}
