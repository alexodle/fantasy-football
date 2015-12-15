import request from 'superagent';

export default function httpGet({ url, auth = null }) {
  return new Promise(function (resolve, reject) {
    let req = request.get(url);
    req = (auth ? req.auth(auth.u, auth.p) : req);
    req
      .set('Accept', 'application/json')
      .set('X-Requested-With', 'XMLHttpRequest')
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
