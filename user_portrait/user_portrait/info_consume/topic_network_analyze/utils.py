# -*- coding: utf-8 -*-
from user_portrait.global_config import db,es_user_profile,profile_index_name,profile_index_type
from user_portrait.info_consume.model import PropagateCount, PropagateWeibos,PropagateTimeWeibos
import math
import json
from sqlalchemy import func

Minute = 60
Fifteenminutes = 15 * Minute
Hour = 3600
SixHour = Hour * 6
Day = Hour * 24
MinInterval = Fifteenminutes

def get_gexf():
	pass