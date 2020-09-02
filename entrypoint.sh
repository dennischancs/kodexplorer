#!/bin/sh
# busybox的cp 没有-n，改成 -u 复制新文件，-p保留原目录权属
cp -rup /var/www/html/data/* /koddata
rm -rf /var/www/html/data
exec darkhttpd /var/www/html/static/ariang/ --port 5218 &
exec php -S "0.0.0.0:5210" -t /var/www/html