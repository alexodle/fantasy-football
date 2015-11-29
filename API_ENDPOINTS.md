# Testing the API
The server provides two users for testing API Endpoints:
1. Salim
  * email: salim@gmail.com
  * username: salim
  * password: password
2. Alex
  * email: alex@gmail.com
  * username: aodle56
  * password: password

Curl or HTTPie can be used to send HTTP requests to the server to test the
Endpoints.  The commands below demonstrate how to issue commands using HTTPie.
```
# general format for authenticated request to api using HTTPie
http --json --auth <email>:<password> GET <api_endpoint>

# get request for authentication token
http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/token
http --json --auth alex@gmail.com:password GET http://127.0.0.1:5000/api/token

# get request for fantasy leagues
http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/fantasy_leagues/
http --json --auth alex@gmail.com:password GET http://127.0.0.1:5000/api/fantasy_leagues/
```

# Authentication
[Basic HTTPAuth](https://en.wikipedia.org/wiki/Basic_access_authentication) is
used to authenticate requests to the API. The Flask extenstion
[flask-HTTPAuth](https://flask-httpauth.readthedocs.org/en/latest/) is used to
implement Basic HTTPAuth.

In order to keep the RESTful API stateless, every request is authenticated
(i.e., there's no notion of a User "session" using cookies). To authenticate with
the API, the client must send one of the following:
1. *Email Address* and *Password* (e.g. `email:password`)
2. *Token* (e.g. `token:`)
3. Nothing (when no credentials are passed the server considers the user "Anonymous")

# Resource Endpoints

## Users
* `/api/users/`
* `/api/users/<int:id>`
* `/api/users/<int:id>/fantasy_leagues/`
