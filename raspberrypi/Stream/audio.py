import argparse
import json
import requests
import pyaudio
import wave
import audioop
import matplotlib.pyplot as plt
from oauth2client.service_account import ServiceAccountCredentials

PROJECT_ID = 'seniorproject-63bee'
BASE_URL = 'https://fcm.googleapis.com'
FCM_ENDPOINT = 'v1/projects/' + PROJECT_ID + '/messages:send'
FCM_URL = BASE_URL + '/' + FCM_ENDPOINT
SCOPES = ['https://www.googleapis.com/auth/firebase.messaging']

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
RECORD_SECONDS = 5
WAVE_OUTPUT_FILENAME = "output.wav"
threshold = 5000

# [START retrieve_access_token]
def _get_access_token():
  credentials = ServiceAccountCredentials.from_json_keyfile_name(
      'service-account.json', SCOPES)
  access_token_info = credentials.get_access_token()
  return access_token_info.access_token
# [END retrieve_access_token]

def _send_fcm_message(fcm_message):
  # [START use_access_token]
  headers = {
    'Authorization': 'Bearer ' + _get_access_token(),
    'Content-Type': 'application/json; UTF-8',
  }
  # [END use_access_token]
  resp = requests.post(FCM_URL, data=json.dumps(fcm_message), headers=headers)

  if resp.status_code == 200:
    print('Message sent to Firebase for delivery, response:')
    print(resp.text)
  else:
    print('Unable to send message to Firebase')
    print(resp.text)

def _build_common_message():
  return {
    'message': {
      'topic': 'motion',
      'notification': {
        'title': 'Noise detected !',
        'body': 'Noise detected from camera'
      }
    }
  }

def main():
    
    p = pyaudio.PyAudio()

    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    print("* recording")

    frames = []

    while True:
        data = stream.read(CHUNK, exception_on_overflow = False)
        frames.append(data)
        rms = audioop.rms(data, 2)
        if rms > threshold:
            print('noise detected')
            common_message = _build_common_message()
            _send_fcm_message(common_message)

    print("* done recording")

    stream.stop_stream()
    stream.close()
    p.terminate()

if __name__ == '__main__':
  main()









