#!/bin/sh

set -e

if [ "$1" = 'php' ] && [ "$(id -u)" = '0' ]; then
    chown -R www-data /var/www/html
    chmod -R 755 /var/www/html/
	mkdir -p /volume2/kodexplorer/data
    chmod -R 755 /volume2/kodexplorer/data/
fi

if [ ! -e '/var/www/html/index.php' ]; then
    cp -a /usr/src/kodexplorer/* /var/www/html/
	chmod -R 755 /var/www/html/
fi

chmod -R 755 /var/www/html/
chmod -R 755 /volume2/kodexplorer/data/

exec "$@"