import cv2
import time

pre_time = time.time()
camera = cv2.VideoCapture(-1)

if camera is None:
    print('No Camera')
    exit()

fps = 24 # frame per second
pre_frame = None  # use previous frame as comparison

motion_time = 0

while True:
    cur_time = time.time()
    res, cur_frame = camera.read()
    if res != True:
        break
    

    cv2.imshow('img', cur_frame)
    # press esc to exit
    key = cv2.waitKey(30) & 0xff
    if key == 27:
        break
    if cur_time - pre_time >= 0:
        pre_time = cur_time
        gray_img = cv2.cvtColor(cur_frame, cv2.COLOR_BGR2GRAY)
        gray_img = cv2.resize(gray_img, (500, 500))
        gray_img = cv2.GaussianBlur(gray_img, (15, 15), 0)

        if pre_frame is None:
            pre_frame = gray_img
        else:
            img_delta = cv2.absdiff(pre_frame, gray_img)
            thresh = cv2.threshold(img_delta, 25, 255, cv2.THRESH_BINARY)[1]
            thresh = cv2.dilate(thresh, None, iterations=2)
            image, contours, hierarchy = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            for c in contours:
                if cv2.contourArea(c) < 1500: # sensitivity
                    continue
                else:
                    if time.time() - motion_time < 2:
                        continue
                    else:
                        #print(cv2.contourArea(c))
                        if time.time() - motion_time < 5:
                            continue
                        else:
                            #print(cv2.contourArea(c))
                            print("Motion detected")
                            motion_time = time.time()
                            break

            pre_frame = gray_img

camera.release()
cv2.destroyAllWindows()
