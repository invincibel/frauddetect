import csv
import sys
import json
x = '{"status":"success"}'
y = json.loads(x)

try:
	a = [sys.argv[1], sys.argv[2]]

	ok = 0

	with open('new_database.csv', 'r') as file:
		reader = csv.reader(file)
		for row in reader:
			if row[0] == a[0]:
				ok = 1

	x = '{"status":"success"}'
	y = json.loads(x)

	if ok == 0:
		with open('new_database.csv', 'a', newline='') as file:
			writer=csv.writer(file)
			writer.writerow(a)
		print(y)
	else:
		y["status"]="failed_already_exists"
		print(y)
except:
	y["status"]="failed_already_exists"
	print(y)

