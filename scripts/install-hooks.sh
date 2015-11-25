#!/bin/sh -e

BASEDIR=$(dirname $0)/..
mv $BASEDIR/.git/hooks/pre-push  $BASEDIR/.git/hooks/pre-push.bkp
ln -s ../../githooks/pre-push.sh $BASEDIR/.git/hooks/pre-push
