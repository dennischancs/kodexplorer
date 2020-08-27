FROM php:rc-fpm-alpine3.12@sha256:35ee4889d86ad2cd829590d8eb77d8a006cdf75c5c7950bdfcee6303f73b3f21

# 官方最新版4.40
# ENV KODEXPLORER_VERSION=4.40
# ENV KODEXPLORER_URL="http://static.kodcloud.com/update/download/kodexplorer${KODEXPLORER_VERSION}.zip"

# KODEXPLORER 程序部署
COPY app /var/www/html/app
COPY config /var/www/html/config
COPY data /var/www/html/data
COPY plugins /var/www/html/plugins
COPY static /var/www/html/static
COPY index.php /var/www/html/index.php

# 编译基础环境
RUN chmod -R 755 /var/www/html && \
    sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk add --no-cache --update \
        freetype libpng libjpeg-turbo \
        freetype-dev libpng-dev libjpeg-turbo-dev && \
    docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ && \
    docker-php-ext-install -j "$(getconf _NPROCESSORS_ONLN)" gd && \
    apk del --no-cache freetype-dev libpng-dev libjpeg-turbo-dev

# 指定工作目录
WORKDIR /var/www/html

# 设置启动项
# COPY entrypoint.sh /usr/local/bin/
# RUN chmod a+x /usr/local/bin/entrypoint.sh

VOLUME [/data]

EXPOSE 5660

# ENTRYPOINT ["entrypoint.sh"]
# CMD [ "php", "-S", "0.0.0.0:5660", "-t", "/var/www/html" ]
CMD [ "sh", "-c", "php -S 0.0.0.0:5660"]