# -*- coding: utf-8 -*-
"""
Created on Sat Mar 14 06:53:47 2020

@author: willi
"""

from PIL import Image
from numpy import array
from matplotlib import pyplot as plt

class Histogram:
    def gray_scale_array(self):
        g = 0
        arr = []
        while g <= 255:
            arr.append(0)
            g += 1
        return arr
    
    def plot_histogram(self, img):
        ar = array(img)    
        #print(ar.shape)
        x = ar.shape[0]
        y = ar.shape[1]
        
        hist = self.gray_scale_array()
        
        i = 0
        while i < x:
            j = 0
            while j < y:
                hist[ar[i, j]] += 1
                j += 1
            i += 1
            
        plt.plot(hist, color = [0, 0, 0])
    #    plt.xlim([0, 256])
        plt.ylim([0, x * y])
        plt.show()

"""
show 3 values when was RGB, they are the calors, with the convert('L') return only 
one value that represent the gray scale
"""

img = Image.open(r"D:\Rittmann\Projetos\Self Challenges\Files\histogram\gray_scale_rect_18x18_1.jpg").convert('L')
Histogram().plot_histogram(img)