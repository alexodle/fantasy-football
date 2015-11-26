#!/bin/sh -e

BASEDIR=$(dirname $0)/..
push_hook=$BASEDIR/.git/hooks/pre-push

# Backup existing push hook
if [ -f $push_hook ]; then
  mv $push_hook ${push_hook}.bkp
fi

ln -s ../../githooks/pre-push.sh $push_hook
