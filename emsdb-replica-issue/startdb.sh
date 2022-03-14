#!/bin/bash

sudo docker-compose -f mongoreplica.yml up -d

sleep 5

sudo docker exec -it mongo1 mongo 
