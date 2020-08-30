#!/opt/bin/env bash

basepath=$(cd `dirname $0`; pwd)

var=$(cat .config)
arr=()
for element in $var
do
    arr[${#arr[*]}]=$element
done
echo ${arr[0]} ${arr[1]};
data=${arr[0]}
tag=${arr[1]}

export basedir=$data
export tag=$tag

basepath=$(cd `dirname $0`; pwd)

echo "up service"
cd $basedir/service
docker-compose up -d

echo "up apps"
cd $basedir/workspace
docker-compose up -d

echo "up nginx"
cd $basedir/nginx
docker-compose up -d

bash $basepath/restart.sh
