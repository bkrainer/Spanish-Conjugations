#/usr/bin/env python

import csv
import json

if __name__ == "__main__":
    with open('../public/data/verbs.csv', 'rb') as csvfile:
        reader = csv.reader(csvfile)
        with open('../public/data/verbs_new.csv', 'wb') as writeFile:
            writer = csv.writer(writeFile, quoting=csv.QUOTE_ALL)
            header = reader.next()
            header[0] = "infinitive"
            writer.writerow(header)

            columnMap = {}
            for i in xrange(len(header)):
                columnMap[header[i]] = i

            mood_i = columnMap['mood_english']
            form_3s_i = columnMap['form_3s']
            form_2p_i = columnMap['form_2p']
            nosotros_i = columnMap['form_1p']
            for row in reader:
                if row[mood_i].lower() == 'imperative affirmative':
                    # first issue in the data set: form_3s (el/ella/usted) and form_2p (vosotros)
                    # have their conjugations switched for the imperative affirmative tense
                    row[form_3s_i], row[form_2p_i] = row[form_2p_i], row[form_3s_i]

                    # second issue: nosotros is null for all verbs
                    row[nosotros_i] = row[form_3s_i] + 'mos'
                if row[mood_i].lower() == 'imperative negative':
                    row[form_3s_i], row[form_2p_i] = row[form_2p_i], row[form_3s_i]
                    row[nosotros_i] = row[form_3s_i] + 'mos'

                writer.writerow(row)


