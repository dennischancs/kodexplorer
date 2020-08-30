#!/opt/bin/env bash
if [ ! -n "$1" ] ;then
    echo "必须指定一个安装目录"
    exit
fi

if [ ! -x "$1" ] ;then
     mkdir "$1"
fi

echo "copy resource data"
basepath=$(cd `dirname $0`; pwd)

export basedir=$1
export tag=latest
echo "$1 $tag" > .config

rm -rf $basedir/*
docker rm nginx minio redis rabbit mongod  editor_app convert editor -f
docker network create bisheng

#sh $basepath/pullImage.sh $tag

mkdir -p $basedir/service
mkdir -p $basedir/workspace
mkdir -p $basedir/resource
mkdir -p $basedir/nginx

cp -r $basepath/service/* $basedir/service
cp -r $basepath/workspace/* $basedir/workspace
cp -r $basepath/resource/* $basedir/resource
cp -r $basepath/nginx/* $basedir/nginx

mkdir -p $basedir/service/mongod/db mongod/log
touch  $basedir/service/mongod/log/mongod.log
mkdir -p $basedir/service/rabbitmq/data
mkdir -p $basedir/service/minio/config minio/data
mkdir -p $basedir/service/nginx/temp nginx/keys
touch  $basedir/service/nginx/temp/error.log
touch  $basedir/service/nginx/temp/access.log

mkdir -p $basedir/workspace/temp
mkdir -p $basedir/workspace/logs

bash $basepath/upNodes.sh

sleep 30

bash $basepath/init.sh 3 $tag $basedir
bash $basepath/initAdminPass.sh bisheng
sleep 30
bash $basepath/fontsService.sh
bash $basepath/restart.sh
bash $basepath/clearImages.sh
echo "你开始使用毕升Office即表示你同意链接 https://ibisheng.cn/apps/blog/posts/agreement.html 中的内容"
echo "在你的浏览器中打开 http://IP 即可访问毕升文档，请参看安装文档激活毕升文档"
