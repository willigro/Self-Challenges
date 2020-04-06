# -*- coding: utf-8 -*-
"""
Created on Fri Apr  3 10:05:00 2020

Refactor when confirm that it works

@author: willi
"""
import random
import math

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
def generate_array(qtd_from, qtd_to):
    list_main = []
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
    weights_from_input = generate_array(len(input_layer), nodes)
    print("weights_from_input", weights_from_input)
        
    # First hidden created
    quantity_hidden -= 1
    
    # Hidden to Hidden
    i = 0
    while i < quantity_hidden: # Hidden lefts
        n_to = 0
        arr_layer = []
        while n_to < nodes:
            arr = []
            n = 0
            #Link all input node to all hidden node
            while n < nodes:
                arr.append(random.random())
                n += 1
            n_to += 1
            arr_layer.append(arr)
        weights_hidden_to_hidden.append(arr_layer)
        i += 1
     
    # Last hidden to output
    weights_to_output = generate_array(nodes, len(expected_outputs))
    print("weights_to_output", weights_to_output)

def feedfoward():
    nodes = len(weights_from_input[0])
    
    print("weights_from_input", weights_from_input)
    
    # Input to first hidden layer
    input_to_hidden = []
    n = 0
    for inp in input_layer:
        while n < nodes:
            res = 0
            for weights in weights_from_input:
                res += weights[n] * inp
            input_to_hidden.append(sigmoid(res))
            n += 1
        
    print("input_to_hidden", input_to_hidden)
    
    # Hidden to hidden
    hidden_to_hidden = []
    for layer in weights_hidden_to_hidden:
        n = 0
        arr = []
        for inp in input_to_hidden:
            while n < nodes:
                res = 0
                for weights in layer:
                    res += weights[n] * inp
                arr.append(sigmoid(res))
                n += 1
        hidden_to_hidden.append(arr)
        
    print("hidden_to_hidden", hidden_to_hidden)
    
    # input -> f hidden -> output
    last_hidden = input_to_hidden
    
    leng = len(hidden_to_hidden)
    if leng > 0:
        last_hidden = hidden_to_hidden[leng - 1]
    
    # Hidden to output
    hidden_to_output = []
    n = 0
    for inp in last_hidden:
        while n < nodes:
            res = 0
            for weights in weights_to_output:
                res += weights[n] * inp
            hidden_to_output.append(sigmoid(res))
            n += 1
    
    print("hidden_to_output", hidden_to_output)
    
generate_weights(3, 3)
#feedfoward()
    
#    
#    """
#    Quadratic average error
#    """
#    
#    output_quadratic_average_error = 0
#    i = 0
#    sumError = 0
#    while i < len(expected_outputs):
#        sumError += math.pow(expected_outputs[i] - o[i], 2)
#        i += 1
#    
#    output_quadratic_average_error = sumError / len(expected_outputs)
#    
#    if(actual == 0 or actual == loop_time - 1):
#        print(output_quadratic_average_error)
#    
#    """
#    
#    BACKPROPAGATION
#    
#    """
#    
#    """
#    Adjust weights from last hidden to OUTPUT
#    """
#    
#    new_w_o = []
#    o_i = 0
#    while o_i < len(expected_outputs):
#        i = 0
#        while i < len(weights_hidden_to_output):
#            # Total error
#            error = o[o_i] - expected_outputs[o_i]
#            
#            # Derived from output
#            derived = dsigmoid(o[o_i])
#        
#            # Input
#            inp = h[0]
#        
#            r = inp * error * derived * learning
#            w = weights_hidden_to_output[i] - r
#    #        print(w_input_to_out, w, expected_outputs[o_i], o[o_i] , error)
#            
#            weights_hidden_to_output[i] = w
#            
#            i += 1
#        o_i += 1
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