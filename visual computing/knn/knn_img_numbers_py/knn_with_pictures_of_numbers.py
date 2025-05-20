# -*- coding: utf-8 -*-
#!/usr/bin/python
import math

class Particle:
    def __init__(self, arr, type):
        self.arr = arr
        self.type = type
        
K = 3
population = []
mainParticle = Particle([], 0)
CLASS_NONE = 0
CLASS_A = 1
CLASS_B = 2

def image_to_bytearr(file):
    with open(file, "rb") as image:
        f = image.read()
        return bytearray(f)
    
def distance(arr1, arr2):
    len1 = len(arr1)
    len2 = len(arr2)
    
    if(len1 > len2):
        a = len2
    else:
        a = len1
        
    for i in range(a):
        a += math.pow(arr1[i] - arr2[i], 2)
    return math.sqrt(a)

def insert_and_sort(particle, distance, list):
    leng = len(list)
    if (leng == 0):
        list.append([particle, distance])
    else:
        i = 0
        inserted = False
        while (i < leng):
            if (distance < list[i][1]):
                list.insert(i, [particle, distance])
                inserted = True
                break
            i += 1
        if (not inserted):
            list.append([particle, distance])

def init_KNN(actualParticle):
    ordernedPopulation = []
    littleParticles = []
    for p in population:
        d = distance(actualParticle.arr, p.arr)
        insert_and_sort(p, d, ordernedPopulation)
    
    count = [[0, CLASS_A],[0, CLASS_B]]
    
    for i in range(K):
        if (not ordernedPopulation[i]):
            continue
        if (ordernedPopulation[i][0].type == CLASS_A):
            count[0][0]+= 1
        elif (ordernedPopulation[i][0].type == CLASS_B):
            count[1][0]+= 1
        
        littleParticles.append(ordernedPopulation[i])
    
    high = 0
    for i in range(len(count)):
        if (i == 0):
            high = count[0]
        else:
            if (count[i][0] > count[i - 1][0]):
                high = count[i]

    # print(high[1])
    print(count)
    
base = "D:\Rittmann\Projetos\Self Challenges\Self-Challenges\knn\img_knn_js/"
two1 = image_to_bytearr(base + "two1.jpg")
two2 = image_to_bytearr(base + "two2.jpg")
two3 = image_to_bytearr(base + "two3.jpg")
two4 = image_to_bytearr(base + "two4.jpg")
two5 = image_to_bytearr(base + "two5.jpg")
two6 = image_to_bytearr(base + "two6.jpg")
three1 = image_to_bytearr(base + "three1.jpg")
three2 = image_to_bytearr(base + "three2.jpg")
three3 = image_to_bytearr(base + "three3.jpg")
three4 = image_to_bytearr(base + "three4.jpg")
three5 = image_to_bytearr(base + "three5.jpg")
three6 = image_to_bytearr(base + "three6.jpg")

population = []

# CLASS A
population.append(Particle(two1, CLASS_A))
population.append(Particle(two2, CLASS_A))
population.append(Particle(two3, CLASS_A))
population.append(Particle(two4, CLASS_A))
population.append(Particle(two5, CLASS_A))
population.append(Particle(two6, CLASS_A))

# CLASS B
population.append(Particle(three1, CLASS_B))
population.append(Particle(three2, CLASS_B))
population.append(Particle(three3, CLASS_B))
population.append(Particle(three6, CLASS_B))
population.append(Particle(three6, CLASS_B))
population.append(Particle(three6, CLASS_B))

init_KNN(mainParticle)

mainParticle = Particle(three1, CLASS_NONE)
init_KNN(mainParticle)

mainParticle = Particle(two3, CLASS_NONE)
init_KNN(mainParticle)

mainParticle = Particle(two2, CLASS_NONE)
init_KNN(mainParticle)

mainParticle = Particle(two1, CLASS_NONE)
init_KNN(mainParticle)