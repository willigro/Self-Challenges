# -*- coding: utf-8 -*-
"""
Created on Mon Apr 13 01:54:35 2020

@author: willi
"""

from PIL import Image
import numpy as np
import math
import random
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
    def __init__(self, input_size, output_size, hidden_nodes_size):
        self.links = []
        self.inputs = []
        self.expected_outputs = []
        self.learning = .1
        self.outputs_derivate = []
        self.sum_weights = []
        self.bias = []
        
        self.generate_weights(input_size, output_size, hidden_nodes_size)
        self.generate_bias(output_size, hidden_nodes_size)
        
        # temp arrays
        self.nodes = []
        self.weights = []
#        self.println()
    
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
           
    def generate_bias(self, output_size, nodes = []):
        i = 1
        while i < len(self.links):
            arr = []
            for n in self.links[i].arr:
                arr.append(random.random())
            self.bias.append(arr)
            i += 1
        
        i = 0
        arr = []
        while i < output_size:
            arr.append(random.random())
            i += 1
        self.bias.append(arr)
        
    def generate_weights(self, input_size, output_size, nodes = []):
        quantity_hidden = len(nodes) - 1
        
        self.new_layer_weights(INPUT, HIDDEN, input_size, nodes[0])
        
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
        
        self.new_layer_weights(HIDDEN, OUTPUT, nodes[leng - 1], output_size)
        
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
        log("Inputs", self.inputs[0])
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
                
                self.inputs[len(self.inputs) - 1].append(sigmoid(res + self.bias[link][out]))
                
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
                    output_derivate = dsigmoid(self.inputs[link_out][output])
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
                    output_derivate = dsigmoid(self.inputs[link_out][output])
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

#def sigmoid(x):
#  return 1 / (1 + math.exp(-x))
#
#def dsigmoid(x):
#    return x * (1 - x)
    
#def sigmoid(x, alpha = 0.01):
#   # Return the activation signal
#   return np.maximum(alpha * x, x)
#
#def dsigmoid(x, alpha = 0.01):
#    return 1 if x > 0 else 0

def sigmoid(x):
   # Return the activation signal
   return np.tanh(x) 

def dsigmoid(x):
    return 1 - x**2
    
class SpatialFiltering:
    def filterImage(self, image, kernel, imageSize):
        ar = self.image_to_bytearr(image, imageSize)
        arFiltered = self.image_to_bytearr(image, imageSize)
        
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

    def image_to_bytearr(self, image, imageSize):
        return np.array(image.resize((imageSize, imageSize), Image.ANTIALIAS))

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

# ARTICLES
#https://www.researchgate.net/publication/327479716_Learning_based_Image_Transformation_using_Convolutional_Neural_Networks
#https://medium.com/tensorflow/neural-style-transfer-creating-art-with-deep-learning-using-tf-keras-and-eager-execution-7d541ac31398
#https://www.nature.com/articles/s41598-019-47765-6
#https://www.cs.toronto.edu/~hinton/absps/cvpr07.pdf
#https://arxiv.org/pdf/1701.01077.pdf

# These explain how create the input
#https://medium.com/@ageitgey/machine-learning-is-fun-part-3-deep-learning-and-convolutional-neural-networks-f40359318721

""" Mask 3x3 1/9 """
testVal = 1/9
kernel = np.array([[testVal, testVal, testVal], [testVal, testVal, testVal], [testVal, testVal, testVal]])

inputs = []
outputs = []

INPUT_SIZE = 18 # x * x

def to_simple_array(matrix):
    arr = []
    i = 0
    while i < INPUT_SIZE:
        j = 0
        while j < INPUT_SIZE:
          arr.append(matrix[i, j])
          j += 1    
        i += 1
    return arr

def input_and_output(inputF, output, i):
    img = Image.open(r"D:\Rittmann\Projetos\Self Challenges\Files\knn\knn_img_numbers_py\{}.jpg".format(inputF + str(i))).convert('L')
#    filtered = SpatialFiltering().filterImage(img, kernel, INPUT_SIZE)
    filtered = SpatialFiltering().image_to_bytearr(img, INPUT_SIZE)
    inputs.append(to_simple_array(filtered))
    outputs.append([output])

i = 1
while i <= 6:
    input_and_output("two", 1, i)
    i += 1
    
i = 1
while i <= 6:
    input_and_output("three", 0, i)
    i += 1

"""
Posso fazer mais teste, mas agora nao
Funcionou com o two e black
15, 1, 3 / 15, 1, 2 / 3, 1, 3
usando o leaky relu
""" 
"""
Proxima etapa agora é pegar construir os nodes com funçoes de ativacao diferente
ou seja, vou ter de refazer a inicializacao e chamada das ativacoes
"""

network = Network(INPUT_SIZE * INPUT_SIZE, 1, [5, 10])

#log(inputs)
#log(outputs)

#network.println()

def test():
    network.predict(inputs[0], outputs[0])
    network.predict(inputs[9], outputs[9])
    pass

def input_valid():
    return network.feedfoword(inputs[0], outputs[0])[0] > .9

def output_valid():
    return network.feedfoword(inputs[7], outputs[7])[0] < .1

train = True
t = 0
maxIndex = len(inputs) - 1
while train:
    i = 0
    while i < 10:
        index = random.randint(0, maxIndex)
        network.train(inputs[index], outputs[index])
#        log("teste", index)
#        log(i, network.output())
        i += 1
    
    
    if input_valid() and output_valid():
        train = False
        print("Treino completo, executando teste")
        test()
        break
#    else:
#        test()
    
    t += 1
    
    log("Treinamentos {}".format(i * t))
    
    if t * i >= 100:
        train = False
        log("Treino incompleto")
        test()