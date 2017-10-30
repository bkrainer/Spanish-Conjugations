#/usr/bin/env python

import csv
import unicodedata

# The original dataset has a bunch of verbs ending in 'se' (e.g. recordarse).
#For now, limit the data to just ar/er/ir verbs.
if __name__ == "__main__":
	with open('../data/original_verbs.csv', 'rb') as csvfile:
		with open('../data/verbs.csv', 'wb') as newfile:
			lineNum = 0
			for line in csvfile:
				split = line.split(',')
				word = split[0].decode('UTF-8') # the infinitive is located at position 0
				wordLen = len(word)

				# the original dataset has quotes, so to find the ending of the infinitive,
				# get the 3rd to last and 2nd to last chars. Also, encode in ascii, because many
				# -ir verbs will have an accented 'i', and we don't want to be removing those verbs.
				ending = unicodedata.normalize('NFKD', word[wordLen-3:wordLen-1:]).encode('ASCII', 'ignore')

				# Also write the first line (which has the column headers).
				if (lineNum == 0 or ending in ['ar', 'er', 'ir']):
					newfile.write(line)

				lineNum += 1
