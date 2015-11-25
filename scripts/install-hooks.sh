#!/bin/sh -e

BASEDIR=$(dirname $0)/..
ln -sf $BASEDIR/pre-push.sh $BASEDIR/.git/hooks/pre-push
