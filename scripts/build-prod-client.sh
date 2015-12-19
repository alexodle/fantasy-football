#!/bin/sh

BASEDIR=$(dirname $0)/..

output_dir=$BASEDIR/server/static/bundle
mkdir -p $output_dir
rm -rf $output_dir/*

pushd client
NODE_ENV=production webpack -p --progress ./app/js/index.jsx ../$output_dir/bundle.js
popd

md5hash=$(md5 -q $output_dir/bundle.js)
filename=bundle.${md5hash}.js
mv $output_dir/bundle.js $output_dir/$filename

sed -i "" "s/\"bundle.js\"/\"static\/bundle\/${filename}\"/" $output_dir/index.html

ls -lah $output_dir
