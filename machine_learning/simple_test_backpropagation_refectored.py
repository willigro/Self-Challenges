# -*- coding: utf-8 -*-
"""
Created on Fri Apr  3 10:05:00 2020

Refactor when confirm that it works

@author: willi
"""
import random
import math
import copy

learning = .1
loop_time = 5000
INPUT = 1
HIDDEN = 2
OUTPUT = 3

# always one layar
input_layer = [2, 1]
expected_outputs = [0.1, 0]

weights_from_input = []
weights_hidden_to_hidden = []
weights_to_output = []

def log(t, m):
    print(t, m, end='\n\n')

"""
Activation functions
"""

def sigmoid(x):
  return 1 / (1 + math.exp(-x))

def dsigmoid(x):
    return x * (1 - x)

"""
Create weights from input layer to first hidden layer

Create weights from all hidden layer left (minus the first layer that already been created)

Create weights from last hidden layer to output layer

Example:    quantity_hidden = 4
            nodes = 2
            
            input = [1, 1]
            expected = [1, 1]
            
            input to f hidden = [[?, ?], [?, ?]]
            hiddens           = [[[0, 0], [0, 0]],
                                 [[0, 0], [0, 0]], 
                                 [[0, 0], [0, 0]]]
            output            = [[?, ?], [?, ?]]
"""
def attach_array(list_main, qtd_from, qtd_to):
    f = 0
    while f < qtd_from:
        t = 0
        arr = []
        while t < qtd_to:
            arr.append(random.random())    
            t += 1
        list_main.append(arr)
        f += 1
    return list_main
        
def generate_weights(quantity_hidden, nodes):
    attach_array(weights_from_input, len(input_layer), nodes)
        
    # First hidden created
    quantity_hidden -= 1
    
    # Hidden to Hidden
    i = 0
    while i < quantity_hidden: # Hidden lefts
        weights_hidden_to_hidden.append(attach_array([], nodes, nodes))
        i += 1
    
    # Last hidden to output
    attach_array(weights_to_output, nodes, len(expected_outputs))

def execute_foward(arr, inputs, qtd_to, all_weights):
    t = 0
    while t < qtd_to:
        i = 0
        res = 0
        while i < len(inputs):
            res += all_weights[i][t] * inputs[i]
            i += 1
        arr.append(sigmoid(res))
        t += 1
    return arr
        
            
def feedfoward():
    nodes = len(weights_from_input[0])

    # Input to first hidden layer
    input_to_hidden = []
    execute_foward(input_to_hidden, input_layer, nodes, weights_from_input)
        
#    log("input_to_hidden", input_to_hidden)
    
    # Hidden to hidden
    inp = input_to_hidden
    hidden_to_hidden = []
    for weights in weights_hidden_to_hidden:
        res = execute_foward([], inp, nodes, weights)
        inp = res
        hidden_to_hidden.append(res)
    
    # input -> f hidden -> output
    last_hidden = input_to_hidden
    
    leng = len(hidden_to_hidden)
    if leng > 0:
        last_hidden = hidden_to_hidden[leng - 1]
    
    # Hidden to output
    hidden_to_output = []
    execute_foward(hidden_to_output, last_hidden, len(expected_outputs), weights_to_output)
    
    quadratic_average_error(hidden_to_output)
    return [input_to_hidden, hidden_to_hidden, hidden_to_output]

def quadratic_average_error(outputs):
    output_quadratic_average_error = 0
    i = 0
    sumError = 0
    while i < len(expected_outputs):
        sumError += math.pow(expected_outputs[i] - outputs[i], 2)
        i += 1
    
    output_quadratic_average_error = sumError / len(expected_outputs)
    log("error", output_quadratic_average_error)

def backpropagation(inputs, hiddens, outputs):  
    # Adjust weights from last HIDDEN TO OUTPUT
    last_hidden = inputs
    leng = len(hiddens)
    if leng > 0:
        last_hidden = hiddens[leng - 1]
    
    adjusted_weights_to_output = copy.deepcopy(weights_to_output)
    out = 0
    while out < len(expected_outputs):
        # Total error
        error = outputs[out] - expected_outputs[out]
        
        # Derived from output
        derived = dsigmoid(outputs[out])
    
        # Input from weight that i want adjust
        link = 0
        while link < len(adjusted_weights_to_output):
             r = last_hidden[link] * error * derived * learning
             adjusted_weights_to_output[link][out] -= r
             link += 1
        out += 1
    
    # Adjust weights from HIDDEN TO HIDDEN

generate_weights(3, 3)
result = feedfoward()
backpropagation(result[0], result[1], result[2])
#    """
#    
#    BACKPROPAGATION
#    
#    """
#  
#    
#    w_h_i = 0
#    while w_h_i < len(weights_input_to_hidden[0]):
#        # Actual weight
#        w_h = weights_input_to_hidden[0][w_h_i]
#        
#        error = 0
#        
#        o_i = 0
#        while o_i < len(o):
#             # Total error
#            error += w_h * (o[o_i] - expected_outputs[o_i])
#            o_i += 1
#            
#        # Derived from hidden output
#        derived = dsigmoid(h[0])
#        
#        inp = input_layer[w_h_i]
#        
#        r = inp * error * derived * learning
#        w = w_h - r
#    #    print(w)
#        
#        weights_input_to_hidden[0][w_h_i] = w
#        
#        w_h_i += 1 
#     
#print(weights_input_to_hidden)
#print(weights_hidden_to_output)