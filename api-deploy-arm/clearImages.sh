#!/opt/bin/env bash
docker rmi -f $(docker image ls | grep 'none' | awk '{print $3}')