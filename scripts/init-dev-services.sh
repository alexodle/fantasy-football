#!/bin/sh

BASEDIR=$(dirname $0)/..

# redis
redis-server $BASEDIR/node_server/redis.conf
