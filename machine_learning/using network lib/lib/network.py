# -*- coding: utf-8 -*-
"""
Created on Mon Apr 13 01:54:35 2020

@author: willi
"""

import numpy as np
import math
import random
import copy

class Nodes:
    def __init__(self, f, t):
        self.arr = []
        self.f = f
        self.t = t
        self.activation = None
        self.dactivation = None
        
    def println(self, label_type):
        log(label_type(self.f), label_type(self.t))
        i = 0
        while i < len(self.arr):
            log("node {} {}".format(i, self.activation), self.arr[i])
            i += 1
    
    def println_type(self, label_type):
        log(label_type(self.f), label_type(self.t))
        
class Network:
    def __init__(self, show_error = False):
        self.links = []
        self.input_size = 0
        self.inputs = []
        self.expected_outputs = []
        self.learning = .05
        self.outputs_derivate = []
        self.sum_weights = []
        self.bias = []
        self.show_error = show_error
        
        self.INPUT = 1
        self.HIDDEN = 2
        self.OUTPUT = 3
        
        # temp arrays
        self.nodes = None
        self.weights = []
        self.last_size = 0
#        self.println()
    
    def label_type(self, t):
        if t == self.INPUT:
            return "INPUT"
        if t == self.HIDDEN:
            return "HIDDEN"
        return "OUTPUT"
    
    def add(self, t, size, activation = None):
        if t == self.INPUT:
            self.input_size = size
            
        elif t == self.OUTPUT:
            self.new_layer_weights(self.HIDDEN, self.OUTPUT, self.last_size, size)
            self.attachActivation(activation)
            self.generate_bias(size)
        
        else:
            if len(self.links) == 0:
                self.new_layer_weights(self.INPUT, self.HIDDEN, self.input_size, size)
            else:
                self.new_layer_weights(self.HIDDEN, self.HIDDEN, self.last_size, size)
        
            self.attachActivation(activation)
            self.generate_bias(size)
        
        self.last_size = size
            
    def attachActivation(self, activation):
        if activation == "sigmoid":
            self.nodes.activation = self.sigmoid
            self.nodes.dactivation = self.dsigmoid
        elif activation == "relu":
            self.nodes.activation = self.relu
            self.nodes.dactivation = self.drelu
        elif activation == "lrelu":
            self.nodes.activation = self.lrelu
            self.nodes.dactivation = self.dlrelu
    
    def newNodes(self, f, t):        
        self.nodes = Nodes(f, t)
    
    def newWeights(self):
        self.weights = []
    
    def appendWeight(self, weight):
        self.weights.append(weight)
        
    def appendWeightsToNode(self):
        self.nodes.arr.append(self.weights)
    
    def appendNode(self):
        self.links.append(self.nodes)
    
    def leng_input(self):
        return len(self.inputs[0])
    
    def new_layer_weights(self, fr, t, qtd_from, qtd_to):
        f = 0
        self.newNodes(fr, t)
        while f < qtd_from:
            t = 0
            self.newWeights()
            while t < qtd_to:
                self.appendWeight(random.random())    
                t += 1
            self.appendWeightsToNode()
            f += 1
        self.appendNode()
           
    def generate_bias(self, nodes):
        i = 0
        arr = []
        while i < nodes:
            arr.append(random.random())
            i += 1
        self.bias.append(arr)
        
    def clear_vars(self):
        self.sum_weights = []
        self.outputs_derivate= []
        for inp in self.links:
            self.outputs_derivate.append([])
            self.sum_weights.append(0)
    
    def handle_input(self, inputs):
        init = inputs
        self.inputs.clear()
        self.inputs.append(init)
    
    def handle_expected_output(self, expected_outputs):
        self.expected_outputs = expected_outputs
            
    def train(self, inputs, expected_outputs):
        self.feedfoword(inputs, expected_outputs)
        self.backpropagation()
    
    def predict(self, inputs, expected_outputs):
        self.feedfoword(inputs, expected_outputs)
#        log("Inputs", self.inputs[0])
        log("Output", self.output())
    
    def feedfoword(self, inputs, expected_outputs):
        leng = len(self.links)
        link = 0
        self.clear_vars()
        self.handle_input(inputs)
        self.handle_expected_output(expected_outputs)
        
        while link < leng:
            self.inputs.append([])
            
            if link < leng - 1:
                out_size = len(self.links[link + 1].arr)
            else:
                out_size = len(self.expected_outputs)
                
            out = 0
            while out < out_size:
                inp = 0
                res = 0
                while inp < len(self.inputs[link]):
                    res += self.inputs[link][inp] * self.links[link].arr[inp][out]
                    inp += 1
                
                res = self.links[link].activation(res + self.bias[link][out])
                
                self.inputs[len(self.inputs) - 1].append(res)
                
                out += 1
            link += 1
        
        return self.output()
    
    def backpropagation(self):
        output_cost = 0
        links_copy = copy.deepcopy(self.links)
        bias_copy = copy.deepcopy(self.bias)
        first = True        
        link = len(self.links) - 1
        while link >= 0:
            
            weights_sum = 0
            for w_node in self.links[link].arr:
                for w in w_node:
                    weights_sum += w
            self.sum_weights[link] = weights_sum

            link_out = link + 1
                    
            if first:
                first = False
                
                out = 0
                res = 0
                out_len = len(self.expected_outputs)
                while out < out_len:
                    res += self.inputs[link_out][out] - self.expected_outputs[out]
                    out += 1
                
                output_cost = res * 2
                
                inputs_sum = 0
                for inp in self.inputs[link]:
                    inputs_sum += inp
                
                output = 0
                while output < out_len:
                    output_derivate = self.links[link].dactivation(self.inputs[link_out][output])
                    self.outputs_derivate[link].append(output_derivate)
                    output += 1
                
                node = 0
                while node < len(self.links[link].arr):
                    output = 0
                    while output < out_len:
                        res = output_cost * self.outputs_derivate[link][output] * inputs_sum * self.learning
                        links_copy[link].arr[node][output] -= res
                        bias_copy[link][output] -= output_cost * self.outputs_derivate[link][output] * self.learning
                        output += 1
                    node += 1
            else:
                inputs_sum = 0
                for inp in self.inputs[link]:
                    inputs_sum += inp
                
                out_len = len(self.inputs[link_out])
                output = 0
                while output < out_len:
                    output_derivate = self.links[link].dactivation(self.inputs[link_out][output])
                    self.outputs_derivate[link].append(output_derivate)
                    output += 1
                
                sum_weights = self.multiplication_sum_weights(link)
                outputs_derivate = self.multiplication_outputs_derivate(link)
                
                node = 0
                while node < len(self.links[link].arr):
                    output = 0
                    while output < out_len:
                        res = output_cost * outputs_derivate * sum_weights * self.outputs_derivate[link][output] * inputs_sum * self.learning 
                        links_copy[link].arr[node][output] -= res
                        bias_copy[link][output] -= output_cost * outputs_derivate * sum_weights * self.outputs_derivate[link][output] * self.learning 
                        output += 1
                    node += 1
            link -= 1
            
        self.links = copy.deepcopy(links_copy)
        self.bias = copy.deepcopy(bias_copy)
     
    def output(self):
        if self.show_error:
            e = 0
            i = 0
            while i < len(self.expected_outputs):
                e += self.inputs[len(self.inputs) - 1][i] - self.expected_outputs[i]
                i += 1
                
            log("Error", e)
        return self.inputs[len(self.inputs) - 1]
        
    def multiplication_sum_weights(self, link):
        w = 1
        actual_link = len(self.links) - 1
        while actual_link > link:
            w *= self.sum_weights[actual_link]
            actual_link -= 1
        return w
    
    def multiplication_outputs_derivate(self, link):
        d = 1
        actual_link = len(self.links) - 1
        while actual_link > link:
            for derivate in self.outputs_derivate[actual_link]:
                d *= derivate
            actual_link -= 1
        return d
    
    def sigmoid(self, x):
      return 1 / (1 + math.exp(-x))
    
    def dsigmoid(self, x):
        return x * (1 - x)
        
    def relu(self, x, alpha = 0.01):
       return np.maximum(alpha * x, x)
    
    def drelu(self, x, alpha = 0.01):
        return 1 if x > 0 else 0
    
    def lrelu(self, x):
       return np.tanh(x) 
    
    def dlrelu(self, x):
        return 1 - x**2
    
    def println(self):
        log("INPUTS")
        i = 0
        while i < len(self.inputs):
            log("input {}".format(i), self.inputs[i])
            i += 1
            
        for w in self.links:
            w.println(self.label_type)
        
        log("BIAS")
        while i < len(self.bias):
            log("bias {}".format(i), self.bias[i])
            i += 1
        
        log("EXPECTED OUTPUTS")
        i = 0
        while i < len(self.expected_outputs):
            log("expected {}".format(i), self.expected_outputs[i])
            i += 1
        
def log(t = '', m = ''):
    print(t, m, end='\n\n')