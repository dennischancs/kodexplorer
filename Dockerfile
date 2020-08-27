FROM php:rc-fpm-alpine3.12@sha256:35ee4889d86ad2cd829590d8eb77d8a006cdf75c5c7950bdfcee6303f73b3f21

# 官方最新版4.40
ENV KODEXPLORER_VERSION=4.40
ENV KODEXPLORER_URL="http://static.kodcloud.com/update/download/kodexplorer${KODEXPLORER_VERSION}.zip"

# base镜像内核升级和程序部署
RUN set -x \
  && mkdir -p /var/www/html \
  && apk --update --no-cache add wget bash \
  && cd /var/www/html \
  && wget "$KODEXPLORER_URL" \
  && unzip kodexplorer4.40.zip && rm kodexplorer4.40.zip

# 编译基础环境
RUN set -x \
  && apk add --no-cache --update \
        freetype libpng libjpeg-turbo \
        freetype-dev libpng-dev libjpeg-turbo-dev \
  && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
  && docker-php-ext-install -j "$(getconf _NPROCESSORS_ONLN)" gd \
  && apk del --no-cache freetype-dev libpng-dev libjpeg-turbo-dev

# 指定工作目录
WORKDIR /var/www/html

# 设置启动项
# COPY entrypoint.sh /usr/local/bin/
# RUN chmod a+x /usr/local/bin/entrypoint.sh

EXPOSE 5660

# ENTRYPOINT ["entrypoint.sh"]
# CMD [ "php", "-S", "0.0.0.0:5660", "-t", "/var/www/html" ]
CMD [ "sh", "-c", "php -S 0.0.0.0:5660"]