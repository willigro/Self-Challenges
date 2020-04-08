# -*- coding: utf-8 -*-
"""
Created on Fri Apr  3 10:05:00 2020

Using OO to see better the flow

@author: willi
"""
import random
import math
import copy

INPUT = 1
HIDDEN = 2
OUTPUT = 3

def label_type(t):
    if t == INPUT:
        return "INPUT"
    if t == HIDDEN:
        return "HIDDEN"
    return "OUTPUT"

class Nodes:
    def __init__(self, f, t):
        self.arr = []
        self.f = f
        self.t = t
        
    def println(self):
        log(label_type(self.f), label_type(self.t))
        i = 0
        while i < len(self.arr):
            log("node {}".format(i), self.arr[i])
            i += 1
    
    def println_type(self):
        log(label_type(self.f), label_type(self.t))

class Network:
    def __init__(self, inputs, expected_outputs):
        self.links = []
        self.inputs = []
        self.inputs.append(inputs)
        self.expected_outputs = expected_outputs
        self.learning = .1
        self.loop_time = 5000
        
        # temp arrays
        self.nodes = []
        self.weights = []
    
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
           
    def generate_weights(self, quantity_hidden, nodes = []):
        # input to first hidden
        self.new_layer_weights(INPUT, HIDDEN, self.leng_input(), nodes[0])
        quantity_hidden -= 1
        
        leng = len(nodes)
        if leng == 1:
            i = 0
            while i < quantity_hidden:
                self.new_layer_weights(HIDDEN, HIDDEN, nodes[0], nodes[0])
                i += 1
        else:
            if quantity_hidden + 1 != leng:
                raise ValueError('Hidden quantity must be equals to nodes size.')
            
            i = 0
            while i < quantity_hidden:
                self.new_layer_weights(HIDDEN, HIDDEN, nodes[i], nodes[i + 1])
                i += 1
        
        self.new_layer_weights(HIDDEN, OUTPUT, nodes[leng - 1], len(self.expected_outputs))
            
        self.println()
    
    def feedfoword(self):
        leng = len(self.links)
        link = 0
        
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
                
                self.inputs[len(self.inputs) - 1].append(sigmoid(res))
                
                out += 1
            link += 1
            
        log(self.inputs)
    
    def println(self):
        log("INPUTS")
        i = 0
        while i < len(self.inputs):
            log("input {}".format(i), self.inputs[i])
            i += 1
            
        for w in self.links:
            w.println()
            
        log("EXPECTED OUTPUTS")
        i = 0
        while i < len(self.expected_outputs):
            log("expected {}".format(i), self.expected_outputs[i])
            i += 1
        
def log(t = '', m = ''):
    print(t, m, end='\n\n')

def sigmoid(x):
  return 1 / (1 + math.exp(-x))

def dsigmoid(x):
    return x * (1 - x)

network = Network([2, 1], [0.1, 0])
network.generate_weights(3, [1, 2, 3])
network.feedfoword()