#!/bin/sh

BOX_SCORE_BASE_URL=http://www.sports-reference.com

BASEDIR=$(dirname $0)/..; pushd $BASEDIR; BASEDIR=$(pwd)


# === TODO: take from args ===
week=1
config=$BASEDIR/data_config.js
stash_dir=$BASEDIR/temp_stash
# ===


date=$(date +"%m%d%Y-%H%M%S")

echo "START: ${date}"

data_dir=$stash_dir/$date
mkdir -p $data_dir

# Download html file with all the box scores links
box_score_links_html=$data_dir/box_score_links.html
wget -O $box_score_links_html http://www.sports-reference.com/cfb/years/2015-schedule.html

# box score links html -> box score links json
box_score_links_json=$data_dir/box_score_links.json
node ./parseBoxScoreLinksHtml.js -i $box_score_links_html -o $box_score_links_json -b $BOX_SCORE_BASE_URL

# download box score html files
box_score_html_dir=$data_dir/box_score_html
node ./downloadBoxScoresHtml.js -i $box_score_links_json -d $box_score_html_dir -w $week -c $config

# parse box scores
fb_player_stats_json=$data_dir/fb_player_stats.json
node ./parseBoxScoreHtml.js -d $box_score_html_dir -o $fb_player_stats_json

# TODO: Push player stats to postgres

popd

echo "DONE: $(date +"%m%d%Y-%H%M%S")"
