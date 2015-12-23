#!/bin/sh

# For to read csv files
export IFS=","

# TODO: take from args
week=1

BASEDIR=$(dirname $0)
pushd $BASEDIR
BASEDIR=$(pwd)

STASH_DIR=${BASEDIR}/temp_stash
date=$(date +"%m%d%Y-%H%M%S")

data_dir=$STASH_DIR/$date
mkdir -p $data_dir

all_games_file=$data_dir/all_games.html
wget -O $data_dir/all_games.html http://www.sports-reference.com/cfb/years/2015-schedule.html

box_score_urls_file=$data_dir/1_box_score_urls.csv
touch $box_score_urls_file
node ${BASEDIR}/index.js parseAllGames $all_games_file $box_score_urls_file http://www.sports-reference.com $week

box_scores_dir=$data_dir/boxes_scores
mkdir -p $box_scores_dir

box_scores_files_file=$data_dir/2_box_scores_files.csv
touch $box_scores_files_file

i=1
tail -n +2 $box_score_urls_file | while read week is_complete url; do
  file=$box_scores_dir/${i}.html

  wget -O $box_scores_dir/${i}.html $url
  echo "${week},${is_complete},${url},${file}" >> $box_scores_files_file

  let "i+=1"
done

# wait
FAIL=0
for job in `jobs -p`; do
  echo $job
  wait $job || let "FAIL+=1"
done

popd
