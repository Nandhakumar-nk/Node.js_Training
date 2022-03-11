#!/bin/bash

sudo docker-compose up node-app

sleep 5

sudo docker exec mongo1 /scripts/rs-init.sh