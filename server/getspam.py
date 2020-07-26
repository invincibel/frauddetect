import csv
import sys
import json
a= sys.argv[1]
arr = {}
cnt = 0
rev_arr={}
x = '{"status":"success","email":"none"}';
y = json.loads(x)
try:
	with open('suspicious.csv', 'r') as file:
	    reader = csv.reader(file)
	    for row in reader:
	        if(len(row) and row[0]==a):
	            cnt=cnt+1
	            arr[cnt]=row

	total = cnt+1
	for i in range(cnt, 0,-1):
	    rev_arr[total-i] = arr[i]




	#print(json.dumps(arr, separators=(',', ':')))
	print(json.dumps(rev_arr))
except:
	y["status"] = "failed"
	print(y)