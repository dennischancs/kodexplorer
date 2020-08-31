#!/bin/bash

set -e

chown -R www-data:www-data /koddata
chmod -R 777 /koddata

exec "$@"