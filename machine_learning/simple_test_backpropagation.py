# -*- coding: utf-8 -*-
"""
Created on Fri Apr  3 10:05:00 2020

Muita coisa foi mocada apenas para entendimento do processo
Ajustarei no próximo script de teste

A lot of things was mocked just to undertand the process
I will adjust in the next script of test

@author: willi
"""
import random
import math

learning = .1
loop_time = 5000

# always one layar
input_layer = [2, 1]

# multiple layers
weights_input_to_hidden = [[random.random(), random.random()]]

# always one layar
weights_hidden_to_output = [random.random(), random.random()]

expected_outputs = [0.1, 0]

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

actual = 0
while actual < loop_time:
    """
    Input to first hidden layer
    """
    
    # Like i am ignoring the matrix (using [0], i can't use the append on loop)
    h = []
    h.append(0)
    for b in weights_input_to_hidden[0]:
        resSum = 0
        for a in input_layer:
            resSum += a * b
        h[0] = sigmoid(resSum)
    
    """
    Last hidden to output layer (only one hidden)
    """
    
    o = []
    for b in weights_hidden_to_output:
        resSum = 0
        for a in h:
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
    
    if(actual == 0 or actual == loop_time - 1):
        print(output_quadratic_average_error)
    
    """
    
    BACKPROPAGATION
    
    """
    
    """
    Adjust weights from last hidden to OUTPUT
    """
    
    new_w_o = []
    o_i = 0
    while o_i < len(expected_outputs):
        i = 0
        while i < len(weights_hidden_to_output):
            # Total error
            error = o[o_i] - expected_outputs[o_i]
            
            # Derived from output
            derived = dsigmoid(o[o_i])
        
            # Input
            inp = h[0]
        
            r = inp * error * derived * learning
            w = weights_hidden_to_output[i] - r
    #        print(w_input_to_out, w, expected_outputs[o_i], o[o_i] , error)
            
            weights_hidden_to_output[i] = w
            
            i += 1
        o_i += 1
    
    w_h_i = 0
    while w_h_i < len(weights_input_to_hidden[0]):
        # Actual weight
        w_h = weights_input_to_hidden[0][w_h_i]
        
        error = 0
        
        o_i = 0
        while o_i < len(o):
             # Total error
            error += w_h * (o[o_i] - expected_outputs[o_i])
            o_i += 1
            
        # Derived from hidden output
        derived = dsigmoid(h[0])
        
        inp = input_layer[w_h_i]
        
        r = inp * error * derived * learning
        w = w_h - r
    #    print(w)
        
        weights_input_to_hidden[0][w_h_i] = w
        
        w_h_i += 1
    
    actual += 1    
     
print(weights_input_to_hidden)
print(weights_hidden_to_output)