# -*- coding: utf-8 -*-
"""
Created on Tue Apr 21 21:39:33 2020

@author: willi
"""

from lib.network import Network

network = Network(True)
network.add(network.INPUT, 1)
network.add(network.HIDDEN, 5, "sigmoid")
network.add(network.HIDDEN, 3, "lrelu")
network.add(network.OUTPUT, 10, "lrelu")
network.println()
