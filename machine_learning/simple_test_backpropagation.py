# -*- coding: utf-8 -*-
"""
Created on Fri Apr  3 10:05:00 2020

@author: willi
"""
import random
import math

# always one layar
input_layer = [1, 1]

# multiple layers
weights_input_to_hidden = [[0.5, 2]]
#weights_input_to_hidden = [random.random(), random.random()]

# always one layar
weights_hidden_to_output = [2]

expected_outputs = [0, 0]

"""

FEEDFORWARD

"""

"""
Activation functions
"""

def sigmoid(x):
  return 1 / (1 + math.exp(-x))

def dsigmoid(x):
    return x * (1 - x)

"""
Input to first hidden layer
"""

h = []
for a in input_layer:
    resSum = 0
    for b in weights_input_to_hidden[0]:
        resSum += a * b
    h.append(sigmoid(resSum))

"""
Last hidden to output layer (only one hidden)
"""
    
o = []
for a in h:
    resSum = 0
    for b in weights_hidden_to_output:
        resSum += a * b
    o.append(sigmoid(resSum))

"""
Quadratic average error
"""

output_quadratic_average_error = 0
i = 0
sumError = 0
while i < len(expected_outputs):
    sumError += math.pow(expected_outputs[i] - o[i], 2)
    i += 1

output_quadratic_average_error = sumError / len(expected_outputs)

"""

BACKPROPAGATION

"""

"""
Adjust weights from last hidden to output
"""
new_w_o = []
i = 0
while i < len(expected_outputs):
    error = expected_outputs[i] - o[i]
    i += 1 
