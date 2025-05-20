import cv2

face_cascade = cv2.CascadeClassifier('./haarcascade_frontalface_default.xml')

video_capture = cv2.VideoCapture(0)
img_counter = 0
while True:
    # Capture frame-by-frame
    ret, frame = video_capture.read()
    # frame = cv2.resize(frame,(360,480))
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray, 1.03, 5)

    # Draw a rectangle around the faces
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

    # Display the resulting frame
    cv2.imshow('Video', frame)

    k = cv2.waitKey(1)

    if k%256 == 27:
        # ESC pressed
        print("Escape hit, closing...")
        break
#    elif k%256 == 32:
#        # SPACE pressed
#        img_name = "left_frame_{}.png".format(img_counter)
#        cv2.imwrite(img_name, frame)
#        print("{} written!".format(img_name))
#        img_counter += 1

# When everything is done, release the capture
video_capture.release()
cv2.destroyAllWindows()
