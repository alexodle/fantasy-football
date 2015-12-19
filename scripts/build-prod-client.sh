#!/bin/sh

BASEDIR=$(dirname $0)/..

# clean output dir
output_dir=$BASEDIR/server/static/bundle
mkdir -p $output_dir
rm -rf $output_dir/*

# build js/css/font bundles
pushd client
NODE_ENV=production webpack -p --progress ./app/js/index.jsx ../$output_dir/bundle.js
popd

# cache-bust using md5 hash of js bundle
md5hash=$(md5 -q $output_dir/bundle.js)
filename=bundle.${md5hash}.js
mv $output_dir/bundle.js $output_dir/$filename

# replace js filename in index.html
sed -i "" "s/\"bundle.js\"/\"static\/bundle\/${filename}\"/" $output_dir/index.html

ls -lah $output_dir
