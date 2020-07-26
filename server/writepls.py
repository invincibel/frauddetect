import csv
import datetime
import json
import sys
req_org  = int(sys.argv[1])
req_des = int(sys.argv[2])
ammount =int(sys.argv[3])
time  = datetime.datetime.now()
x = '{"status":"failed","email":"none"}'
y = json.loads(x)
try:
    with open('database.csv', 'r') as file:
        reader = csv.reader(file)
        i=0
        ok  = 0
        
        for row in reader:
            i+=1
            if i==1:
                continue
            #row[3] = datetime.datetime.strptime(row[3], '%Y-%m-%d %H:%M:%S.%f')
            row[0] = int(row[0])
            #row[1] = int(row[1])
            row[2] = int(row[2])
            #row[4]  =int(row[4])
           # print(type(row[0]),type(req_org))
            if row[0]==req_org:
                last_amt = row[2]
    update = int(last_amt)-int(ammount);
    if update<=0:
        update=0
    a = [req_org,req_des,update,time,ammount]
    with open('database.csv', 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(a)
    
except:
    print(y)