#!/bin/sh
cp -r /var/www/html/data/* /koddata
exec php -S "0.0.0.0:9000" -t /var/www/html