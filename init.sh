#!/bin/sh -e

# This script should init the entire project, client, server, githooks, etc.

BASEDIR=$(dirname $0)

## client ##
echo "Preparing client..."
echo
pushd $BASEDIR/client
npm install
npm install -g mocha # js test framework
npm install -g webpack
popd

## git hooks ##
echo "Preparing git hooks..."
echo
$BASEDIR/scripts/install-hooks.sh

## data ingestion ##
pushd $BASEDIR/data/node_scripts
npm install
popd

## server ##
echo "Preparing server..."
echo
pushd $BASEDIR/server
virtualenv venv
source venv/bin/active
pip install -r requirements
popd

echo "DONE! You're all set. See README for more instructions."
echo
