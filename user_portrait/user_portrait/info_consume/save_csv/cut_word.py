#-*-coding: utf-8-*-

import os
import jieba
import jieba.posseg as pseg

cx_dict = set(['n','Ng','Vg','v','vd','vn'])

abs_path = os.path.dirname(os.path.abspath(__file__))
ABSOLUTE_DICT_PATH = os.path.abspath(os.path.join(abs_path, './dict'))
CUSTOM_DICT_PATH = os.path.join(ABSOLUTE_DICT_PATH, 'userdic.txt')
EXTRA_STOPWORD_PATH = os.path.join(ABSOLUTE_DICT_PATH, 'stopword.txt')
EXTRA_EMOTIONWORD_PATH = os.path.join(ABSOLUTE_DICT_PATH, 'emotionlist.txt')
EXTRA_ONE_WORD_WHITE_LIST_PATH = os.path.join(ABSOLUTE_DICT_PATH, 'one_word_white_list.txt')
EXTRA_BLACK_LIST_PATH = os.path.join(ABSOLUTE_DICT_PATH, 'black.txt')

def load_one_words():
    one_words = [line.strip('\r\n') for line in file(EXTRA_EMOTIONWORD_PATH)]
    return one_words

def load_black_words():
    one_words = [line.strip('\r\n') for line in file(EXTRA_BLACK_LIST_PATH)]
    return one_words

def load_stop_words():
	stop_words = [line.strip('\r\n').split(" ")[0] for line in file(EXTRA_STOPWORD_PATH)]
	return stop_words

single_word_whitelist = set(load_one_words())
black_word = set(load_black_words())
stop_words = set(load_stop_words())

jieba.load_userdict(CUSTOM_DICT_PATH)

def segment(string):
	"""string: utf-8
	"""
	final_words = []
	words = pseg.cut(string)
	for word, flag in words:
		if flag in cx_dict and (len(word) > 1 or word in single_word_whitelist) and word not in black_word and word not in stop_words:
			final_words.append(word)

	return final_words
