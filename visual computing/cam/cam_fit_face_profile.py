# -*- coding: utf-8 -*-
"""
Created on Sun Mar  8 20:18:57 2020

@author: willi
"""
import io
from PIL import Image
import numpy as np
import math
from sklearn.linear_model import LinearRegression
import cv2

class Particle:
    def __init__(self, arr, type):
        self.arr = arr
        self.type = type

size = 15
NONE = 0
LEFT = "left"
RIGHT = "right"
lefts = []
rights = []
K = 3
population = []
mainParticle = Particle([], 0)

def image_to_bytearr(file, resize=False):
    image = Image.open(file)
    if resize:
        image = image.resize((100, 150), Image.ANTIALIAS)
    imgByteArr = io.BytesIO()
    if resize:
        image.save(file)
    # JPEG work better than PNG
    image.save(imgByteArr, format='PNG')
    imgByteArr = imgByteArr.getvalue()
    return imgByteArr

def distance(arr1, arr2):
    len1 = len(arr1)
    len2 = len(arr2)
    
    if(len1 > len2):
        a = len2
    else:
        a = len1
    b = 0
    for i in range(a):
        b += math.pow(arr1[i] - arr2[i], 2)
    return math.sqrt(b)

def insert_and_sort(particle, distance, list):
    leng = len(list)
    if (leng == 0):
        list.append([particle, distance])
    else:
        i = 0
        inserted = False
        while (i < leng):
            if (distance < list[i][1]):
                list.insert(i, [particle, distance])
                inserted = True
                break
            i += 1
        if (not inserted):
            list.append([particle, distance])

def init_KNN(actualParticle):
    ordernedPopulation = []
    littleParticles = []
    for p in population:
        d = distance(actualParticle.arr, p.arr)
#        print(d)
        insert_and_sort(p, d, ordernedPopulation)
    
    count = [[0, LEFT],[0, RIGHT]]
    
    for i in range(K):
        if (not ordernedPopulation[i]):
            continue
        if (ordernedPopulation[i][0].type == LEFT):
            count[0][0]+= 1
        elif (ordernedPopulation[i][0].type == RIGHT):
            count[1][0]+= 1
        
        littleParticles.append(ordernedPopulation[i])
    
    high = 0
    for i in range(len(count)):
        if (i == 0):
            high = count[0]
        else:
            if (count[i][0] > count[i - 1][0]):
                high = count[i]

    print(high)

i = 0
while(i < size):
    left = image_to_bytearr("left_frame_" + str(i) + ".png")
    population.append(Particle(left, LEFT))
    i += 1

i = 0
while(i < size):
    right = image_to_bytearr("right_frame_" + str(i) + ".png")
    population.append(Particle(right, RIGHT))
    i += 1

def predict(arr):
    mainParticle.arr = arr
    init_KNN(mainParticle)

cam = cv2.VideoCapture(0)

cv2.namedWindow("test")

while True:
    ret, frame = cam.read()
    
    cv2.imshow("test", frame)
    if not ret:
        break
    k = cv2.waitKey(1)

    if k%256 == 27:
        # ESC pressed
        print("Escape hit, closing...")
        break
#    elif k%256 == 32:
        # SPACE pressed
    img_name = "actual_frame.png"
    cv2.imwrite(img_name, frame)
    predict(image_to_bytearr(img_name, True))

cam.release()

cv2.destroyAllWindows()