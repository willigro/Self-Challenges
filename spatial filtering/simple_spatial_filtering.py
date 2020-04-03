# -*- coding: utf-8 -*-
"""
Created on Mon Mar 30 00:15:15 2020

@author: willi
"""

from PIL import Image
from numpy import array
import math

class SpatialFiltering:
    def filterImage(self, image, kernel):
        ar = array(image)
        arFiltered = array(image)
        
        imageXSize = ar.shape[0]
        imageYSize = ar.shape[1]
        
        size = kernel.shape[0] * kernel.shape[1]
        dimen = math.sqrt(size)
        distance = math.floor(dimen / 2)
        
        i = 0
        while i < imageXSize:
            j = 0
            while j < imageYSize:
              arFiltered[i, j] = self.calculateMidPixel(i, j, ar, distance)
              j += 1    
            i += 1
        return arFiltered

    def calculateMidPixel(self, x, y, imageArray, distance):
        sumArr = 0
        i = 0
        col = x - distance
        colF = x + distance
        
        while col < colF:
            j = 0
            row = y - distance
            rowF = y + distance
            while row < rowF:
                try:
                    sumArr += imageArray[col, row] * kernel[i][j]
                except:
                    pass
                j += 0
                row += 1
            i += 1
            col += 1
        return sumArr


img = Image.open(r"D:\Cursos\Posgraduação IA\pos-class\visual computing\segmentation\teste.jpg").convert('L')

""" Mask 3x3 1/9 """
#testVal = 1/9
#kernel = array([[testVal, testVal, testVal], [testVal, testVal, testVal], [testVal, testVal, testVal]])

""" Mask 5x5 1/25 """
testVal = 1/25
kernel = array([[testVal, testVal, testVal, testVal, testVal], [testVal, testVal, testVal, testVal, testVal], [testVal, testVal, testVal, testVal, testVal], [testVal, testVal, testVal, testVal, testVal], [testVal, testVal, testVal, testVal, testVal]])

""" Mask 3x3 Low pass average """
#kernel = array([[0, 1/8, 0], [1/8, 2, 1/8], [0, 1/8, 0]])

img = Image.fromarray(SpatialFiltering().filterImage(img, kernel), 'L')
img.save('result.png')
img.show()