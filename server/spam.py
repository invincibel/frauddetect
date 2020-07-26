import csv
import sys
import json

x = '{"status":"success"}'
y = json.loads(x)

try:
	a = [sys.argv[1],sys.argv[2],sys.argv[3]]
	ok = 0



	with open('suspicious.csv', 'a', newline='') as file:
		writer=csv.writer(file)
		writer.writerow(a)
		print(y)
except:
	y["status"] = "failed"
	print(y)
