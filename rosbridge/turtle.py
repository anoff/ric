#!/usr/bin/env python
# -*- coding: utf-8 -*-

from json import dumps, loads
from ws4py.client.threadedclient import WebSocketClient
from time import sleep

class RosBridgeClient(WebSocketClient):

    def opened(self): 
        print("Connection opened...")

    def advertise_topic(self):
        msg = {'op': 'advertise', 'topic': '/move_base_simple/goal',
            'type': 'geometry_msgs/PoseStamped'}
        self.send(dumps(msg))

    def closed(self, code, reason=None):
        print(code, reason)

    def received_message(self, m):
        """
        Just print(out the message)
        """
        print(m        )

    
    def move_turtle(self, x):
        """
        Move the turle in a circle
        """
        msg = {
            'op': 'publish',
            'topic': '/turtle1/cmd_vel',
            'msg':
            {
                'linear': 
                {
                    'x' : x,
                    'y' : 5.0,
                    'z' : 5.0,
                },
                'angular': 
                {
                    'x' : 5.0,
                    'y' : 5.0,
                    'z' : 5.0,
                },
            }
        }
        self.send(dumps(msg))

    def get_turtle_pose(self):
        msg = {
            'op' : 'subscribe',
            'topic' : '/turtle1/pose'
        }
        self.send(dumps(msg))

if __name__=="__main__":
    try:
        client = RosBridgeClient('ws://192.168.56.101:9090/')
        client.connect()
        
        client.get_turtle_pose()
        
        x_value = 1

        while (True):
            client.move_turtle(x_value)
            sleep(1)  
            x_value += 1
        
    except KeyboardInterrupt:
        client.close()
