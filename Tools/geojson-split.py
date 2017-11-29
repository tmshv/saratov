import sys
import os
import json
from copy import copy
from glob import glob

def run(filename, parts):
	data = json.load(open(filename))

	features = data['features']
	features_per_part = round(len(features) / parts)
	cursor = 0

	buffers = []

	while(True):
		current_features = features[cursor:cursor+features_per_part]

		buffers.append(current_features)

		cursor += features_per_part
		if cursor > len(features):
			break

	i = 1
	for fs in buffers:
		j = copy(data)
		j['features'] = fs
		f, ext = os.path.splitext(filename)

		new_filename = f'{f}-Part{i}{ext}'

		i += 1

		out = json.dumps(j, indent=4, ensure_ascii=False)
		with open(new_filename, 'w') as f:
			f.write(out)

		print(new_filename)

parts = int(sys.argv[1])
filenames = sys.argv[2:]

for f in filenames:
	run(f, parts)