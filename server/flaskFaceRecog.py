from flask import Flask
from flask import request
import sys
import face_recognition
import json
import base64
import numpy as np
from flask_cors import CORS
import cv2, queue, threading, time
import requests, os, re
from PIL import Image
from io import BytesIO
import re, time, base64

app = Flask(__name__)
CORS(app)

# def convert_and_save(b64_string):
#     print(b64_string)
#     with open("./imageToSave.jpeg", "wb") as fh:
#         fh.write(base64.b64decode(str(b64_string)))
#
#
#     # fh.close()

def getI420FromBase64(codec,imgPath):
    base64_data = re.sub('^data:image/.+;base64,', '', codec)
    byte_data = base64.b64decode(base64_data)
    image_data = BytesIO(byte_data)
    img = Image.open(image_data)
    img.save(imgPath + '.jpeg', "JPEG")

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
        getI420FromBase64(img_data1,data['card']+"_11")
        getI420FromBase64(img_data2, data['card'] + "_12")
        getI420FromBase64(img_data3, data['card'] + "_13")
    return("ok");




@app.route('/getName',methods=['GET'])
def getName():
    known_face_encodings = []
    known_face_names = []
    known_faces_filenames = []
    for (dirpath, dirnames, filenames) in os.walk('assets/img/users/'):
        known_faces_filenames.extend(filenames)
        break
    for filename in known_faces_filenames:
        face = face_recognition.load_image_file('assets/img/users/' + filename)
        person_name = filename.split(".")[0]
        face_encoding_arr = face_recognition.face_encodings(face)
        if len(face_encoding_arr) > 0:
            known_face_names.append(person_name)
            known_face_encodings.append(face_recognition.face_encodings(face)[0])
    face_locations = []
    face_encodings = []
    face_names = []
    process_this_frame = True
    # global process_this_frame
    fileName=request.args.get('filename')
    # for i in range(5):
    #     video_capture.grab()
    # Grab a single frame of video
    path = 'cam/' + fileName
    img = cv2.imread(path)
    frame = img
    # # Resize frame of video to 1/4 size for faster face recognition processing
    # small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
    # print(sys.exc_info())
    # # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
    # frame = small_frame[:, :, ::-1]
    best_match_faces = []
    # Process every frame only one time
    face_names = ""
    if process_this_frame:
        # Find all the faces and face encodings in the current frame of video
        face_locations = face_recognition.face_locations(frame)
        face_encodings = face_recognition.face_encodings(frame, face_locations)
        # Initialize an array for the name of the detected users
        # * ---------- Initialyse JSON to EXPORT --------- *
        json_to_export = {}
        for face_encoding in face_encodings:
            # See if the face is a match for the known face(s)
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"
            # # If a match was found in known_face_encodings, just use the first one.
            # if True in matches:
            #     first_match_index = matches.index(True)
            #     name = known_face_names[first_match_index]
            # Or instead, use the known face with the smallest distance to the new face
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            while (face_distances[best_match_index] <= 0.52):
                if (matches[best_match_index]):
                    best_match_faces.append(known_face_names[best_match_index])
                face_distances = np.delete(face_distances, best_match_index)
                known_face_names.pop(best_match_index)
                matches.pop(best_match_index)
                if (len(face_distances)):
                    best_match_index = np.argmin(face_distances)
            # best_match_index = np.argmin(face_distances)
            # print(best_match_indexes)
            # for best_match_index in best_match_indexes:
            #     name = known_face_names[best_match_index]
            #     known_face_names.pop(best_match_index)
            #     known_face_encodings.pop(best_match_index)
            # * ---------- SAVE data to send to the API -------- *
            # json_to_export['name'] = name
            # json_to_export['hour'] = f'{time.localtime().tm_hour}:{time.localtime().tm_min}'
            # json_to_export[
            #     'date'] = f'{time.localtime().tm_year}-{time.localtime().tm_mon}-{time.localtime().tm_mday}'
            # json_to_export['picture_array'] = frame.tolist()
            # * ---------- SEND data to API --------- *
            # print(json_to_export)
            # r = requests.post(url='http://127.0.0.1:5000/receive_data', json=json_to_export)
            # print("Status: ", r.status_code)
            # face_names=(name)
    ans={"arr":best_match_faces}
    return json.dumps(ans)

if __name__ == '__main__':
    app.run(debug = True)