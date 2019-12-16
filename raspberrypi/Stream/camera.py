import cv2
import time
import argparse
import json
import requests

from oauth2client.service_account import ServiceAccountCredentials

PROJECT_ID = 'seniorproject-63bee'
BASE_URL = 'https://fcm.googleapis.com'
FCM_ENDPOINT = 'v1/projects/' + PROJECT_ID + '/messages:send'
FCM_URL = BASE_URL + '/' + FCM_ENDPOINT
SCOPES = ['https://www.googleapis.com/auth/firebase.messaging']

pre_frame = None
motion_time = 0

class VideoCamera():

    def __init__(self):
        # Open a camera
        self.camera = cv2.VideoCapture(-1)
        

    def _get_access_token(self):
     
      credentials = ServiceAccountCredentials.from_json_keyfile_name(
          'service-account.json', SCOPES)
      access_token_info = credentials.get_access_token()
      return access_token_info.access_token

    def _send_fcm_message(self, fcm_message):
      # [START use_access_token]
      headers = {
        'Authorization': 'Bearer ' + self._get_access_token(),
        'Content-Type': 'application/json; UTF-8',
      }
      # [END use_access_token]
      resp = requests.post(FCM_URL, data=json.dumps(fcm_message), headers=headers)

    def _build_common_message(self):
      
      return {
        'message': {
          'topic': 'motion',
          'notification': {
            'title': 'Motion detected !',
            'body': 'motion detected from camera'
          }
        }
      }
    
    def get_frame(self):
        fps = 24 #set frames per second
        global pre_frame
        global motion_time

        while True:
            res, cur_frame = self.camera.read()
            if res != True:
                break
            
            # RGB to Gray
            gray_img = cv2.cvtColor(cur_frame, cv2.COLOR_BGR2GRAY)
            gray_img = cv2.resize(gray_img, (500, 500))
            gray_img = cv2.GaussianBlur(gray_img, (21, 21), 0)

            # motion detection
            if pre_frame is None:
                pre_frame = gray_img
            else:
                img_delta = cv2.absdiff(pre_frame, gray_img)
                thresh = cv2.threshold(img_delta, 25, 255, cv2.THRESH_BINARY)[1]
                thresh = cv2.dilate(thresh, None, iterations=2)
                _,contours, hierarchy = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                for c in contours:
                    if cv2.contourArea(c) < 1500: # sensitivity
                        continue
                    else:
                        # set cooldown time to 2 sec
                        if time.time() - motion_time < 2:
                            continue
                        else:
                            # print when motion detected
                            # add output here if needed
                            common_message = self._build_common_message()
                            self._send_fcm_message(common_message)
                            print("Motion detected")
                            motion_time = time.time()
                            break

                pre_frame = gray_img

            # prepare frame for stream
            if res:
                res, jpeg = cv2.imencode('.jpg', cur_frame)
                return jpeg.tobytes()
            else:
                return None

