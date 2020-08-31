#!/bin/sh
cp -r /var/www/html/data/* /koddata
rm -rf /var/www/html/data
exec php -S "0.0.0.0:9000" -t /var/www/html