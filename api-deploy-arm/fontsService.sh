#!/opt/bin/env bash

if [  -n "$1" ] ;then
    echo "你指定了字体目录，请确保该目录下有字体文件，同时请确保你对这些字体拥有版权"
    if [ ! -d userFonts  ];then
        mkdir userFonts
    fi
	export fontdir=$1
    cp $fontdir/* userFonts
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

rm -rf $basedir/workspace/fonts/*

cp -r workspace/fonts/* $basedir/workspace/fonts
if [ -d userFonts  ];then
    if [ "`ls -A userFonts`" = "" ]; then
        echo "userFonts is indeed empty"
    else
        echo "userFonts is not empty"
        cp -r userFonts/* $basedir/workspace/fonts
    fi
fi


bash init.sh 64 $tag $basedir

sed -i 's/workspace\/workspace/workspace/g' $basedir/workspace/fonts/nutrition.js
