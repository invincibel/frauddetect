import csv
# import sys
import json
x = '{"status":"failed"}'
y = json.loads(x)
try:
    arr = {}
    rev_arr = {}
    cnt = 0
    total = 0
    with open('suspicious.csv', 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            cnt=cnt+1
            arr[cnt]=row

    total = cnt+1
    for i in range(cnt, 0,-1):
        rev_arr[total-i] = arr[i]


    # print(json.dumps(arr, separators=(',', ':')))
    print(json.dumps(rev_arr))
except:
    print(y)
