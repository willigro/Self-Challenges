# -*- coding: utf-8 -*-
"""
Created on Sat Mar 21 20:19:45 2020

@author: willi
"""

def search(arr, item):
    for i in range(len(arr)):
        if arr[i] == item:
            return i
    return -1

arr = [1, 2, 3, 4]

print(search(arr, 5))
print(search(arr, 3))
print(search(arr, 1))