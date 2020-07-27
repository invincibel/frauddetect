from flask import Flask
from flask import request
import sys
import face_recognition
import json
import csv
import base64
import numpy as np
from flask_cors import CORS
import cv2, queue, threading, time
import requests, os, re
from PIL import Image
from io import BytesIO
import re, time, base64
from numpy import asarray
from numpy import savetxt

app = Flask(__name__)
CORS(app)


# known_face_encodings = []
# known_face_names = []
# known_faces_filenames = []
# for (dirpath, dirnames, filenames) in os.walk('assets/img/users/'):
#     known_faces_filenames.extend(filenames)
#     break
# for filename in known_faces_filenames:
#     face = face_recognition.load_image_file('assets/img/users/' + filename)
#     person_name = filename.split(".")[0]
#     face_encoding_arr = face_recognition.face_encodings(face)
#     if len(face_encoding_arr) > 0:
#         known_face_names.append(person_name)
#         known_face_encodings.append(face_recognition.face_encodings(face)[0])
# face_locations = []
# face_encodings = []
# face_names = []
process_this_frame = True

def ReadEncodingAll():
    face_encodings = []
    face_names = []
    with open('encodings.csv', 'r') as file:
        reader = csv.reader(file)
        for row in reader:
            if(row[0]!="name"):
                name=row[0].split(".")
                face_names.append(name[0])
                face_encodings.append(json.loads(row[1]))
    return face_names,face_encodings


def writeToCsv(filename,data):
    with open(filename, 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(data)

def getGetEncodding(name):
    face = face_recognition.load_image_file('assets/img/users/' + name)
    face_encoding_arr = face_recognition.face_encodings(face)
    if(len(face_encoding_arr)>0):
        face_encoding_arr_list=face_encoding_arr[0].tolist()
        ans=[name,face_encoding_arr_list]
        return ans
    else:
        return ["No face"]


def getName(fileName):
    global process_this_frame
    # fileName=request.args.get('filename')
    known_face_names,known_face_encodings=ReadEncodingAll()
    # print(known_face_names,known_face_encodings)
    path = './flaskCam/' + fileName
    img = cv2.imread(path)
    frame = img
    best_match_faces = []
    face_names = ""
    if process_this_frame:
        face_locations = face_recognition.face_locations(frame)
        face_encodings = face_recognition.face_encodings(frame, face_locations)
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            print(face_distances)
            best_match_index = np.argmin(face_distances)
            print(best_match_index,face_distances[best_match_index],matches[best_match_index])
            while (face_distances[best_match_index] <= 0.52):
                if (matches[best_match_index]):
                    best_match_faces.append(known_face_names[best_match_index])
                face_distances = np.delete(face_distances, best_match_index)
                known_face_names.pop(best_match_index)
                matches.pop(best_match_index)
                if (len(face_distances)):
                    best_match_index = np.argmin(face_distances)
                else:
                    break
    if(len(best_match_faces)==0):
        best_match_faces.append("null_null")
    ans={"arr":best_match_faces}
    return json.dumps(ans)

def getI420FromBase64(codec,imgPath):
    base64_data = re.sub('^data:image/.+;base64,', '', codec)
    byte_data = base64.b64decode(base64_data)
    image_data = BytesIO(byte_data)
    img = Image.open(image_data)
    img.save(imgPath + '.jpeg', "JPEG")

@app.route('/gf', methods=['GET'])
def fn():
    fileName = request.args.get('filename')
    arr=getGetEncodding(fileName)
    writeToCsv("encodings.csv", arr)
    return("Done")


@app.route('/imgUpload', methods=['POST'])
def upload_base64_file():
    data=request.json
    if data is None:
        print("No valid request body, json missing!")
        return json.dumps({'error': 'No valid request body, json missing!'})
    else:
        img_data1 = data['img1']
        img_data2=data['img2']
        img_data3=data['img3']
         # this method convert and save the base64 string to image
        getI420FromBase64(img_data1,"./flaskUsers/"+data['card']+"_11")
        getI420FromBase64(img_data2, "./flaskUsers/"+data['card'] + "_12")
        getI420FromBase64(img_data3, "./flaskUsers/"+data['card'] + "_13")
        for i in range(1,4):
            arr = getGetEncodding(data['card']+"_1"+str(i)+".jpeg")
            if(arr[0]=="No face"):
                error={"status":"No face"}
                return json.dumps(error)
            writeToCsv("encodings.csv", arr)
    success={"status":"ok"}
    return json.dumps(success)

@app.route('/getName',methods=['GET'])
def func():
    return getName()

@app.route('/recognizeFace',methods=['POST'])
def recognizeFace():
    data = request.json
    if data is None:
        print("No valid request body, json missing!")
        return json.dumps({'error': 'No valid request body, json missing!'})
    else:
        name=data['name']
        img_data = data['img']
        getI420FromBase64(img_data, "./flaskCam/"+name)
        return getName(name)

if __name__ == '__main__':
    app.run(debug = True)