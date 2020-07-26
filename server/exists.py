import csv
import sys
import json
ok=0
x = '{"status":"success","email":"none"}';
y = json.loads(x)
try:
	a = sys.argv[1]

	email = "none"
	with open('new_database.csv', 'r') as file:
		reader = csv.reader(file)
		for row in reader:
			#print(row[1])
			if row[0]==a:
				ok=1
				email = row[1]

	if ok==1:
		y["email"]=email
		print(y)
	else:
		y["status"] = "failed"
		print(y)
except:
	y["status"] = "failed"
	print(y)

