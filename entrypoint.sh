#!/bin/bash

set -e

if [ ! -e '/kodhtml/index.php' ]; then
    cp -a /usr/src/kodexplorer/* /kodhtml
fi

if [ "$1" = 'php' ] && [ "$(id -u)" = '0' ]; then
    chown -R www-data:www-data /kodhtml
    chmod -R 777 /kodhtml
    chown -R www-data:www-data /koddata
    chmod -R 777 /koddata
fi

exec "$@"