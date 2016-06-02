import request from 'superagent';

export default function httpPost({ url, data, token = null }) {
  let auth = null;
  if (token) {
    auth = { u: token, p: '' };
  }

  return new Promise(function (resolve, reject) {
    let req = request.post(url);
    req = (auth ? req.auth(auth.u, auth.p) : req);
    req
      .set('Accept', 'application/json')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send(data)
      .end(function (err, res) {
        if (err) {
          return reject({
            err,
            res,
            authFailure: res && res.statusCode === 403
          });
        }
        resolve({ res });
      });
  });
}
