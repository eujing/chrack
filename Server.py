import socket               # Import socket module
import json
from pprint import pprint
import math
import random
from pymongo import MongoClient
from datetime import datetime as dt

def recvall(s):
    data = b""
    part = None

    while part is None or (len(part) > 0 and part[-1] != ord("\n")):
        part = s.recv(4096)
        data += part
        return data


s = socket.socket()         # Create a socket object
host = socket.gethostname() # Get local machine name
port = 1689                 # Reserve a port for your service.
s.bind((host, port))        # Bind to the port

s.listen(5)                 # Now wait for client connection.
client = MongoClient("localhost", 3001)
db = client.meteor

while True:
    c, addr = s.accept()     # Establish connection with client.
    data = c.recv(1024)
    while data:
        aNg = json.loads(data.decode("utf-8"))
        normalized = {
            "ax": math.fabs((math.fabs(aNg["ax"])) / 16000.0),
            "ay": math.fabs((math.fabs(aNg["ay"]) - 500.0) / 16000.0),
            "az": math.fabs((math.fabs(aNg["az"]) - 16000.0) / 33000.0),
            "gx": math.fabs((math.fabs(aNg["gx"]) - 100.0) / 33000.0),
            "gy": math.fabs((math.fabs(aNg["gy"]) - 400.0) / 33000.0),
            "gz": math.fabs((math.fabs(aNg["gz"]) - 100.0) / 33000.0)
        }
        pprint(normalized)

        # Real data
        db.chairs.update_one({
            "name": aNg["name"]
        }, {
            "$addToSet": {
                "values.0.data": {
                    "x": dt.now(),
                    "y": (normalized["ax"] + normalized["ay"]) / 2.0
                },
                "values.1.data": {
                    "x": dt.now(),
                    "y": normalized["gz"]
                }
            }    
        })

        # Fake Data
        db.chairs.update_one({
            "name": "Chair 2"
        }, {
            "$addToSet": {
                 "values.0.data": {
                    "x": dt.now(),
                    "y": (normalized["ax"] + normalized["ay"]) / 2.0 * random.random()
                },
                "values.1.data": {
                    "x": dt.now(),
                    "y": normalized["gz"] * random.random()
                }
    
            }    
        })

        data = c.recv(1024)
