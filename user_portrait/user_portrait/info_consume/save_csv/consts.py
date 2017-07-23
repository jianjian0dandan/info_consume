#-*-coding: utf-8-*-

LABEL_LIST = ['hostile_force', 'natural_disaster','public_safety','rights_petition','industrial_enterprise','Information_industry',\
'network_security','information_security','health_food','education','technology','sport','culture','macroeconomic',\
'finance','commercial_trade','environmental_protection','travel_services','land_resources','energy','traffic', \
'agricultural_rural_areas', 'housing_construction', 'Population_family_planning','employment_social_security', 'party_affair', \
'integrated_party','national_government_affair','diplomatic','Political_legal_supervision','military_defense','HongKong_Taiwan']

yiji_label = ['safe_and_stable', 'industrial_information', 'politics', 'culture_health', 'social_livelihood', 'science_and_education', 'economic_and_financial', 'military']

classify_dict = {
    'hostile_force':0 ,
    'natural_disaster': 0, 
    'public_safety': 0,
    'rights_petition': 0,
    'industrial_enterprise':1,
    'Information_industry':1 ,
    'network_security':1,
    'information_security':1 ,
    'health_food':3,
    'education':4,
    'technology':4,
    'sport':3,
    'culture':3,
    'macroeconomic':6,
    'finance':6,
    'commercial_trade':6,
    'environmental_protection':4,
    'travel_services':3,
    'land_resources': 0,
    'energy':4,
    'traffic':0,
    'agricultural_rural_areas':4,
    'housing_construction':4,
    'Population_family_planning': 4,
    'employment_social_security':4, 
    'party_affair':2,
    'integrated_party':2,
    'national_government_affair':2,
    'diplomatic':2,
    'Political_legal_supervision':2,
    'military_defense':0,
    'HongKong_Taiwan':2
}
