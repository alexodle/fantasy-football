##v0 Features##

* Login/User admin
    * Create a user
    * Confirmation email
    * Check against existing users
* Draft
    * See all eligible players and positions
    * See players that have been drafted (and by which team)
    * Be able to draft when it’s my turn (and do not allow when it’s not my turn)
    * Enforce numbers by position (i.e. need 2 RBs, can be hard-coded for now)
    * Know when the draft is over
    * Enforce snake style pick order

##SocketIO messages##

“draft:changed” (player drafted)

##Fantasy Draft API##

###Login###


*GET - /api/auth (get user)*

return: { user_id: <user_id> } || null


*PUT - /api/auth/login (login)*

body: { email: <email>, pass: <pass> }

return: 200 { user_id: <user_id> }


*DELETE - /api/auth/logout (logout)*

return: 200 (for success)


*POST - /api/auth/register (register new user)*

post: { email: <email>, pass: <pass>, pass_repeat: <pass> }

return 200 { user_id: <user_id> }


*[P2] GET - /api/auth/confirm/<confirmation_code> (email confirmation)*

if not expired: return 200 (for success)

else return 498 (token expired), automatically sends another email


###Generic###

*GET - /api/league/member*

Returns all the leagues which I am a member of

{ fantasy_leagues: [ <FantasyLeague>, ... ]}


*GET - /api/league/<league_id>/fantasy_players*

{ fantasy_players: { email: <email>, name: <name>, team: { name: <team_name>, short_name: <team_short_name> } } }


*GET - /api/league/<league_id>/(football_teams|football_conferences|football_players)*

i.e. { football_players: [{ <FootballPlayer> }] }


###Draft###

*GET - /api/league/<league_id>/draft_order*

{ draft_order: { <FantasyDraftOrder> } }


*GET - /api/league/<league_id>/draft_picks*

{ draft_picks: [<DraftPick>, <DraftPick>, etc.] } (draft picks should be ordered)


*POST - /api/league/<league_id>/draft_picks*

body: { football_player_id: <football_player_id>, pick_number: <pick_number> }

side effect: server broadcasts socket.io message “draft:changed”
