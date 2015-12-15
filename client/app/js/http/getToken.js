import httpGet from './httpGet';

export default function getToken(email, password) {
  return httpGet({ url: '/api/token', auth: { u: email, p: password } });
}
