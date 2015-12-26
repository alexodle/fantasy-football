#!/bin/sh

BASEDIR=$(dirname $0)/..

# clean output dirs
output_dir=$BASEDIR/server/app/static/bundle # also hardcoded in webpack.config.prod.js
index_html_dir=$BASEDIR/server/app/templates
mkdir -p $output_dir; mkdir -p $index_html_dir
rm -rf $output_dir/*; rm -rf $index_html_dir/*;

# build js/css/font bundles
pushd $BASEDIR/client
NODE_ENV=production webpack -p --progress --config webpack.config.prod.js
popd

# Move index.html out of bundle dir and into index_html_dir
mv $output_dir/index.html $index_html_dir/

ls -lah $output_dir
ls -lah $index_html_dir
