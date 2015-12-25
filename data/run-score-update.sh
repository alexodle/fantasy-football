#!/bin/sh

BOX_SCORE_BASE_URL=http://www.sports-reference.com

BASEDIR=$(dirname $0); pushd $BASEDIR; BASEDIR=$(pwd)


# === TODO: take from args ===
week=1
config=$BASEDIR/node_scripts/data_config.js
stash_dir=/tmp/ffdata
# ===


date=$(date +"%m%d%Y-%H%M%S")

echo "START: ${date}"

# make the file progression clear by placing output files in number-ordered sub-directories
i=0

data_dir=$stash_dir/$date; mkdir -p $data_dir

# Download html file with all the box scores links
((i++)); subdir=$data_dir/$i; mkdir $subdir
box_score_links_html=$subdir/box_score_links.html
echo "wget -O $box_score_links_html http://www.sports-reference.com/cfb/years/2015-schedule.html"
echo ""
wget -O $box_score_links_html http://www.sports-reference.com/cfb/years/2015-schedule.html

pushd $BASEDIR/node_scripts

# box score links html -> box score links json
((i++)); subdir=$data_dir/$i; mkdir $subdir
box_score_links_json=$subdir/box_score_links.json
echo "node ./parseBoxScoreLinksHtml.js -i $box_score_links_html -o $box_score_links_json -b $BOX_SCORE_BASE_URL"
echo ""
node ./parseBoxScoreLinksHtml.js -i $box_score_links_html -o $box_score_links_json -b $BOX_SCORE_BASE_URL

# download box score html files
((i++)); subdir=$data_dir/$i; mkdir $subdir
box_score_html_dir=$subdir
echo "node ./downloadBoxScoresHtml.js -i $box_score_links_json -d $box_score_html_dir -w $week -c $config"
echo ""
node ./downloadBoxScoresHtml.js -i $box_score_links_json -d $box_score_html_dir -w $week -c $config

# parse box scores
((i++)); subdir=$data_dir/$i; mkdir $subdir
fb_player_stats_json=$subdir/fb_player_stats.json
echo "node ./parseBoxScoreHtml.js -d $box_score_html_dir -o $fb_player_stats_json"
echo ""
node ./parseBoxScoreHtml.js -d $box_score_html_dir -o $fb_player_stats_json

popd

# TODO: Push player stats to postgres

popd

echo "DONE: $(date +"%m%d%Y-%H%M%S")"
echo "Contents in: ${data_dir}"
