# Testing the API
The server provides two users for testing API Endpoints:

1. **Salim**
  * email: salim@gmail.com
  * username: salim
  * password: password
2. **Alex**
  * email: alex@gmail.com
  * username: aodle56
  * password: password

Curl or [HTTPie](https://github.com/jkbrzt/httpie) can be used to send HTTP
requests to the server to test the Endpoints.  The commands below demonstrate
how to issue commands using [HTTPie](https://github.com/jkbrzt/httpie).
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

1. **Email Address** and **Password** (e.g. `email:password`)
2. **Token** (e.g. `token:`)
3. Nothing (when no credentials are passed the server considers the user "Anonymous")

The API supports token based Authentication to avoid having to pass sensitive
information (e.g., *Email Address* and *Password*) with every request. To obtain
a temporary token (with an expiration of 1 hour), the client can send an
authenticated request using **email address** and **password** to the following endpoint:

* **get_token**
  * Endpoint: `/api/token`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/token`
* **get_current_user**
  * Endpoint: `/api/current_user`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/current_user`

# Resource Endpoints

## User

####GET Requests
* **get_users**
  * Endpoint: `/api/users/`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/users/`
* **get_user**
  * Endpoint: `/api/users/<int:id>`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/users/1`
* **get_user_fantasy_leagues**
  * Endpoint: `/api/users/<int:id>/fantasy_leagues/`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/users/1/fantasy_leagues/`
* **get_user_fantasy_league_draft_picks**
  * Endpoint: `/api/users/<int:id>/fantasy_leagues/<int:id>/draft_picks/`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/users/1/fantasy_leagues/1/draft_picks/`
* **get_user_fantasy_league_draft_orders**
  * Endpoint: `/api/users/<int:id>/fantasy_leagues/<int:id>/draft_orders/`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/users/1/fantasy_leagues/1/draft_orders/`
* **get_user_fantasy_teams**
  * Endpoint: `/api/users/<int:id>/fantasy_teams/`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/users/1/fantasy_teams/`
* **get_user_commissioned_leagues**
  * Endpoint: `/api/users/<int:id>/commissioned_leagues/`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/users/1/commissioned_leagues/`

####POST Requests
* ***post_users***
  * Endpoint: `/api/users/`
  * Required Parameters:
    * `email`
    * `username`
    * `password`
  * HTTPie Request: `http --json POST http://127.0.0.1:5000/api/users/ email=bob@yahoo.com username=bob-1998 password=mypass`


## FantasyTeam

####GET Requests
* **get_fantasy_teams**
  * Endpoint: `/api/fantasy_teams/`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/fantasy_teams/`
* **get_fantasy_team**
  * Endpoint: `/api/fantasy_teams/<int:id>`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/fantasy_teams/1`

## FantasyLeague

####GET Requests
* **get_fantasy_leagues**
  * Endpoint: `/api/fantasy_leagues/`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/fantasy_leagues/`
* **get_fantasy_league**
  * Endpoint: `/api/fantasy_leagues/<int:id>`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/fantasy_leagues/1`
* **get_fantasy_league_users**
  * Endpoint: `api/fantasy_leagues/<int:id>/users/`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/fantasy_leagues/1/users/`
* **get_fantasy_league_fantasy_teams**
  * Endpoint: `api/fantasy_leagues/<int:id>/fantasy_teams/`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/fantasy_leagues/1/fantasy_teams/`
* **get_fantasy_league_football_teams**
  * Endpoint: `api/fantasy_leagues/<int:id>/football_teams/`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/fantasy_leagues/1/football_teams/`
* **get_fantasy_league_football_conferences**
  * Endpoint: `api/fantasy_leagues/<int:id>/football_conferences/`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/fantasy_leagues/1/football_conferences/`
* **get_fantasy_league_football_players**
  * Endpoint: `api/fantasy_leagues/<int:id>/football_players/`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/fantasy_leagues/1/football_players/`
* **get_fantasy_league_draft_picks**
  * Endpoint: `/api/fantasy_leagues/<int:id>/draft_picks/`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/fantasy_leagues/1/draft_picks/`
* **get_fantasy_league_draft_orders**
  * Endpoint: `/api/fantasy_leagues/<int:id>/draft_orders/`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/fantasy_leagues/1/draft_orders/`

####POST Requests
* **post_fantasy_league**
  * Endpoint: `api/fantasy_leagues/`
  * Required Parameters:
    * `name`
    * `draft_start_date` (ISO 8601 date format)
    * `conference_id`
  * HTTPie Request: `http --json --auth salim@gmail.com:password POST http://127.0.0.1:5000/api/fantasy_leagues/ name="My Test League" draft_start_date="2015-12-30" conference_id:=1`
* **post_fantasy_league_draft_pick**
  * Endpoint: `api/fantasy_leagues/<int:id>/draft_picks/`
  * Required Parameters:
    * `order`
    * `football_player_id`
  * HTTPie Request: `http --json --auth salim@gmail.com:password POST http://127.0.0.1:5000/api/fantasy_leagues/1/draft_picks/ football_player_id:=1 order:=1`

## FootballConference

####GET Requests
* **get_football_conferences**
  * Endpoint: `/api/football_conferences/`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/football_conferences/`
* **get_football_conference**
  * Endpoint: `/api/football_conferences/<int:id>`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/football_conferences/1`

## FootballTeam

####GET Requests
* **get_football_teams**
  * Endpoint: `/api/football_teams/`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/football_teams/`
* **get_football_team**
  * Endpoint: `/api/football_teams/<int:id>`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/football_teams/1`
* **get_football_team_football_players**
  * Endpoint: `/api/football_teams/<int:id>/football_players`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/football_teams/1/football_players/`

## FootballPlayer

####GET Requests
* **get_football_players**
  * Endpoint: `/api/football_conferences/`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/football_players/`
* **get_football_player**
  * Endpoint: `/api/football_conferences/<int:id>`
  * HTTPie Request: `http --json --auth salim@gmail.com:password GET http://127.0.0.1:5000/api/football_players/1`
