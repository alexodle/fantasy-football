#!/bin/sh

BASEDIR=$(dirname $0); pushd $BASEDIR; BASEDIR=$(pwd)

#
# TODO: Solution for downloading roster html (doesn't have to be pretty since it
# should be a once-per-season deal)
#
# For now I manually downloaded pac-12 roster html and checked them into
# ./roster_html
#


# === TODO: take from args ===
config=$BASEDIR/node_scripts/data_config.js
stash_dir=$BASEDIR/temp_roster_stash
roster_html_dir=$BASEDIR/roster_html
# ===


date=$(date +"%m%d%Y-%H%M%S")

echo "START: ${date}"

# Parse roster html
pushd $BASEDIR/node_scripts
roster_json=$data_dir/roster-$date.json
node ./parseRosterHtml.js -d $roster_html_dir -o $roster_json -c $config
popd

# TODO: Push to postgres

popd

echo "DONE: $(date +"%m%d%Y-%H%M%S")"
