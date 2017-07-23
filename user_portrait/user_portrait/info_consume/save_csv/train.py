#-*-coding: utf-8-*-

import os
from consts import yiji_label, classify_dict
from tgrocery import Grocery
from cut_word import segment
from sklearn.metrics import precision_recall_fscore_support, average_precision_score, accuracy_score, confusion_matrix
from gensim import corpora, models, similarities
from consts import LABEL_LIST, yiji_label, classify_dict
from cut_word import segment

def tfidf_feature_selection(train_filepath, feature_path, TOPK=500):
    label_text = dict()
    with open(train_filepath) as f:
        for line in f:
            label, text = line.strip().split("|text|")
            words = segment(text)
            try:
                label_text[label].extend(words)
            except KeyError:
                label_text[label] = words

    dictionary_p = corpora.Dictionary([])

    for label, words in label_text.iteritems():
        dictionary_p.add_documents([words])

    corpus_data = []
    labels = []
    for label, words in label_text.iteritems():
        labels.append(label)
        corpus_data.append(dictionary_p.doc2bow(words))

    tfidf = models.TfidfModel(corpus_data)
    for idx, doc in enumerate(corpus_data):
        label = labels[idx]
        tfidfvalue = tfidf[doc]
        results = sorted(tfidfvalue, key=lambda (k, v): v, reverse=True)[:TOPK]
        res = "\n".join([",".join([dictionary_p[k].encode("utf-8"), str(v)]) for k, v in results])
        tfidfwords = set()
        for k, v in results:
            tfidfwords.add(dictionary_p[k].encode("utf-8"))

        fw = open(feature_path.format(label=label), "w")
        for word in tfidfwords:
            fw.write("%s\n" % word)
        fw.close()


def train(train_origin_path, fold):
    grocery = Grocery('cv_' + str(fold) + '_model')#, custom_tokenize=segment)

    train_src = []
    with open(train_origin_path) as f:
        for line in f:
            label, text = line.strip().split("|text|")
            label = yiji_label[classify_dict[label]]
            train_src.append((label, text))

    grocery.train(train_src)
    grocery.save()

def test(test_path):
    new_grocery = Grocery('cv_' + str(fold) + '_model')#, custom_tokenize=segment)
    new_grocery.load()
    test_src = []
    with open(test_path) as f:
        for line in f:
            label, text = line.strip().split("|text|")
            label = yiji_label[classify_dict[label]]
            test_src.append((label, text))
    test_result = new_grocery.test(test_src)
    #print test_result
    #print test_result.accuracy_overall
    #accs = test_result.accuracy_labels
    recalls = test_result.recall_labels
    #print "Recall for each class: ", recalls
    predictlabels = test_result.predicted_y
    truelabels = test_result.true_y
    acc = accuracy_score(truelabels, predictlabels)
    macro_precision, macro_recall, macro_fscore, _ = precision_recall_fscore_support(truelabels, predictlabels, average='macro')
    print "Accuracy: ", acc, "Macro-average Precision:", macro_precision, "Macro-average Recall:", macro_recall, "Macro-average Fscore:", macro_fscore
    labellist = ['safe_and_stable', 'industrial_information', 'politics', 'culture_health', 'social_livelihood', 'economic_and_financial']
    precision, recall, fscore, _ = precision_recall_fscore_support(truelabels, predictlabels, average=None, labels=labellist)
    precisions = dict()
    recalls = dict()
    for idx, p in enumerate(precision):
        precisions[labellist[idx]] = p
    for idx, c in enumerate(recall):
        recalls[labellist[idx]] = c
    #print "Precision for each class: ", precisions
    #print "Recall for each class: ", recalls

def load_first_classifier(model_path):
    new_grocery = Grocery(model_path)
    new_grocery.load()
    return new_grocery

def text_first_classifier(text, clf):
    """text: utf-8
    """
    return str(clf.predict(text))

def load_second_classifier(model_path):
    files = os.listdir(model_path)
    label_features = dict()
    for fname in files:
        if fname.startswith("features_"):
            label = fname.replace("features_", "").replace(".txt", "")
            with open(os.path.join(model_path, fname)) as f:
                features = [line.strip() for line in f]
            label_features[label] = features

    return label_features

fsdict = dict()
for secondl, firstlidx in classify_dict.iteritems():
    try:
        fsdict[yiji_label[firstlidx]].append(secondl)
    except KeyError:
        fsdict[yiji_label[firstlidx]] = [secondl]

def text_second_classifier(text, firstlabel, lfeatures):
    secondlabels = fsdict[firstlabel]
    sldict = dict()
    for sl in secondlabels:
        feas = lfeatures[sl]
        count = sum([text.count(fea) for fea in feas])
        sldict[sl] = count
    results = sorted(sldict.iteritems(), key=lambda (k, v): v, reverse=True)

    return results[0][0]


if __name__ == '__main__':
    #folds = 10
    # for fold in range(3, 4):
    #    tfidf_feature_selection("./cv_%s/train.txt" % fold, "./cv_%s/features_{label}.txt" % fold)
        # train("./cv_%s/train.txt" % fold, fold)
        # test("./cv_%s/test.txt" % fold)

    fold = 3
    clf = load_first_classifier("cv_%s_model" % fold)
    lfeatures = load_second_classifier("cv_%s" % fold)
    truesecondlabels = []
    predictsecondlabels = []
    with open("./cv_%s/test.txt" % fold) as f:
        for line in f:
            truesecondlabel, text = line.strip().split("|text|")
            predictfirstlabel = text_first_classifier(text, clf)
            predictsecondlabel = text_second_classifier(text, predictfirstlabel, lfeatures)
            #print truesecondlabel, predictfirstlabel, predictsecondlabel
            truesecondlabels.append(truesecondlabel)
            predictsecondlabels.append(predictsecondlabel)

    predictlabels = predictsecondlabels
    truelabels = truesecondlabels
    acc = accuracy_score(truelabels, predictlabels)
    macro_precision, macro_recall, macro_fscore, _ = precision_recall_fscore_support(truelabels, predictlabels, average='macro')
    print "Accuracy: ", acc, "Macro-average Precision:", macro_precision, "Macro-average Recall:", macro_recall, "Macro-average Fscore:", macro_fscore

