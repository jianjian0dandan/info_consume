# -*- coding: utf-8 -*-
__author__ = 'zxy'
import sys
import os
import jieba
import re
import csv

thisFilePath = os.path.dirname(__file__)
sys.path.append(os.path.abspath(os.path.join(thisFilePath,"../cron/util/")))
from svm import svmutil


DATA_PATH = os.path.abspath(os.path.join(thisFilePath,"../cron/trainData/adsClassify"))
TRAIN_FEATURE_FILE = os.path.abspath(os.path.join(DATA_PATH,"./new_train.txt"))
WORD_FEATURE_MAP_FILE = os.path.abspath(os.path.join(DATA_PATH,"./new_feature.csv"))
SAVED_MODEL = os.path.abspath(os.path.join(DATA_PATH,"./ads_classify_svm.model"))

# 在用户字典中添加了new_feature中的词语，确保分词准确
USER_DICT_FILE = os.path.abspath(os.path.join(DATA_PATH,"./userdic.txt"))

'''
广告识别，使用词袋模型+SVM
'''
class adsClassify:
    def __init__(self,train_feature_file = TRAIN_FEATURE_FILE):
        if os.path.exists(SAVED_MODEL):
            self.model = svmutil.svm_load_model(SAVED_MODEL)
        else:
            y, x = svmutil.svm_read_problem(train_feature_file)
            self.model = svmutil.svm_train(y, x, '-c 4')
            svmutil.svm_save_model(SAVED_MODEL,self.model)

    def adsPredict(self,weiboList):
        jieba.load_userdict(USER_DICT_FILE)
        feature_word_dict = self.loadfeature_word_dict()
        ads_mid = []
        for weiboInfo in weiboList:
            if self.makePredict(weiboInfo[1],feature_word_dict):
                ads_mid.append(weiboInfo[0])

        return ads_mid




    def loadfeature_word_dict(self):
        with open(WORD_FEATURE_MAP_FILE) as f:
            reader = csv.reader(f)
            word_dict = dict()
            for line in reader:
                word_dict[line[0]] = line[1]
            return word_dict

    def makePredict(self,text,feature_word_dict):
        if str(text).count('@') >= 5:
            return False
        text = cut_filter(text)
        if len(text) == 0 or text == '转发微博':
            return False

        wordsList = jieba.cut(text)
        wordCount = dict()
        for word in wordsList:
            if word in feature_word_dict.keys():
                if word in wordCount.keys():
                    wordCount[word] += + 1
                else:
                    wordCount[word] = 0

        label, _, __  = svmutil.svm_predict([1], [wordCount], self.model)
        print label, _, __

        return True if label>1 else False



def cut_filter(text):
    pattern_list = [r'\（分享自 .*\）', r'http://\w*']
    for i in pattern_list:
        p = re.compile(i)
        text = p.sub('', text)
    return text


if __name__ == '__main__':
    a = adsClassify()
    weiboList = [[0,"爽啊玛雅，开学我抽奖，地址是"],[1,"你好我是谁"]]
    a.adsPredict(weiboList)