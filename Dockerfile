FROM php:7.4.9-fpm-alpine3.12

# 官方最新版4.40
# ENV KODEXPLORER_VERSION=4.40
# ENV KODEXPLORER_URL="http://static.kodcloud.com/update/download/kodexplorer${KODEXPLORER_VERSION}.zip"

# 编译基础环境
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk add --no-cache --update \
        p7zip unrar\
		freetype libpng libjpeg-turbo libwebp libxpm \
        freetype-dev libpng-dev libjpeg-turbo-dev libwebp-dev libxpm-dev&& \
    docker-php-ext-configure gd --enable-gd \
		--with-freetype=/usr/include/ \
	    --with-xpm=/usr/include/ \
	    --with-webp=/usr/include/ \
		--with-jpeg=/usr/include/ && \
    docker-php-ext-install -j "$(getconf _NPROCESSORS_ONLN)" gd && \
    apk del --no-cache freetype-dev libpng-dev libjpeg-turbo-dev libwebp-dev libxpm-dev

# KODEXPLORER 程序部署
COPY app /var/www/html/app
COPY config /var/www/html/config
COPY data /var/www/html/data
COPY plugins /var/www/html/plugins
COPY static /var/www/html/static
COPY index.php /var/www/html/index.php
RUN chmod -R 755 /var/www/html

# 指定工作目录
WORKDIR /var/www/html

VOLUME /data

EXPOSE 5660

CMD [ "sh", "-c", "php -S 0.0.0.0:5660", "-t", "/var/www/html"]