#!/bin/sh

chown -R www-data:www-data /var/www/html
chmod -R 777 /var/www/html/

mkdir -p /volume2/kodexplorer/data/
chown -R www-data:www-data /volume2/kodexplorer/data/
chmod -R 777 /volume2/kodexplorer/data/
