import cv2
import time

pre_frame = None
motion_time = 0

class VideoCamera():

    def __init__(self):
        # Open a camera
        self.camera = cv2.VideoCapture(-1)

    def get_frame(self):
        fps = 24 #set frames per second
        global pre_frame
        global motion_time
        while True:
            start = time.time()
            res, cur_frame = self.camera.read()
            if res != True:
                break
            end = time.time()
            seconds = end - start
            # make sure each second has correct no. of frames
            if seconds < 1.0/fps:
                time.sleep(1.0/fps - seconds)

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