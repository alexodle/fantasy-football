import redis
import os
import json

DRAFT_CHANNEL = 'draft:updates'

redis_cli = redis.StrictRedis.from_url(os.environ['REDIS_URL'])

def publish_draft_pick(league_id):
  redis_cli.publish(DRAFT_CHANNEL, json.dumps({'league_id': league_id}))
