#!/bin/sh
chown -R www-data /koddata
chmod -R 755 /koddata
cp -r /var/www/html/data/* /koddata
