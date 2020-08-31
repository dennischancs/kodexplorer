#!/bin/bash

set -e

if [ "$1" = 'php' ] && [ "$(id -u)" = '0' ]; then
    # chown -R www-data:www-data /var/www/html
    # chmod -R 777 /var/www/html
    chown -R www-data:www-data /koddata
    chmod -R 777 /koddata
fi

exec "$@"