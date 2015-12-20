#!/bin/sh

BASEDIR=$(dirname $0)/..

# clean output dir
output_dir=$BASEDIR/server/static/bundle
mkdir -p $output_dir
rm -rf $output_dir/*

# build js/css/font bundles
pushd $BASEDIR/client
NODE_ENV=production webpack -p --progress --config webpack.config.prod.js
popd

ls -lah $output_dir
