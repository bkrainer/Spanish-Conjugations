#/usr/bin/env python

import csv
import json

# This script serializes the csv data so that processing doesn't need
# to be done by the client.
if __name__ == "__main__":
    with open('../public/data/verbs.csv', 'rb') as csvfile:
        reader = csv.reader(csvfile)
        header = reader.next()
        # There's some weird encoding going on that's causing the quotes for
        # the 'infinitive' column to be double quoted in the output. A quick/simple 
        # fix is to just set the string manually here since we know the first column
        # is always the infinitive
        header[0] = "infinitive"

        columnMap = {}
        for i in xrange(len(header)):
            columnMap[i] = header[i]

        words = []
        for row in reader:
            word = {}
            for i in xrange(len(row)):
                word[columnMap[i]] = row[i]

            words.append(word)

        json = json.dumps(words, ensure_ascii=False, sort_keys=True)
        with open('../public/data/verbs.json', 'wb') as jsonFile:
            jsonFile.write(json)
