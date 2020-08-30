#!/opt/bin/env bash
if [ ! -n "$1" ] ;then
    echo "初始化类型"
    exit
fi
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

bash init.sh $1 $tag $basedir $2
