#!/opt/bin/env bash

cd /var/media/emmcDATA/bisheng_data/service
docker-compose restart  mongod redis rabbit minio

sleep 40

cd /var/media/emmcDATA/bisheng_data/workspace
docker-compose restart editor_app editor convert

sleep 20

cd /var/media/emmcDATA/bisheng_data/nginx
docker-compose restart nginx

