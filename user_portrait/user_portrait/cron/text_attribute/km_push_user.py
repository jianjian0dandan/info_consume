# -*-coding:utf-8-*-

import redis

r = redis.StrictRedis(host="10.128.55.71", port="6379", db=15)

#r.lpush("uid_list", "3229125510")
print r.lpop("uid_list")
