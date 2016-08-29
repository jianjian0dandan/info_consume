# -*- coding: utf-8 -*-
import math
import json
from user_portrait.parameter import UID_TXT_PATH
import datetime
import time

def weibo_get_uid_list(filename):
    uid_list = []
    f = open(UID_TXT_PATH+'/'+filename,'r')
    for line in f.readlines():
        uid_list.append(line.strip('\n\r'))
    return uid_list

def today_time():
	today = datetime.date.today() 
	a = int(time.mktime(today.timetuple()))
	return a

if __name__ == '__main__':
	#all_weibo_count('aoyunhui',1468166400,1468170900)
    test()
