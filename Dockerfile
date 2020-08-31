FROM php:7.4.9-fpm-alpine3.12

ENV LANG=C.UTF-8
ENV TZ=Asia/Shanghai

# 官方最新版4.40
ENV KODEXPLORER_VERSION=4.40
ENV KODEXPLORER_URL="http://static.kodcloud.com/update/download/kodexplorer${KODEXPLORER_VERSION}.zip"
ENV KOD_DIR=/var/www/html

# 编译基础环境
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk add --no-cache --update tzdata wget bash \
        p7zip unrar\
		freetype libpng libjpeg-turbo libwebp libxpm \
        freetype-dev libpng-dev libjpeg-turbo-dev libwebp-dev libxpm-dev&& \
    docker-php-ext-configure gd --enable-gd \
		--with-freetype=/usr/include/ \
	    --with-xpm=/usr/include/ \
	    --with-webp=/usr/include/ \
		--with-jpeg=/usr/include/ && \
    docker-php-ext-install -j "$(getconf _NPROCESSORS_ONLN)" gd && \
    docker-php-ext-configure exif --enable-exif && docker-php-ext-install exif && \
    apk del --no-cache freetype-dev libpng-dev libjpeg-turbo-dev libwebp-dev libxpm-dev && \
    # change the TimeZone
    cp /usr/share/zoneinfo/"${TZ}" /etc/localtime && \
    echo "${TZ}" > /etc/timezone

# 安装kodexplorer并添加插件
RUN cd /tmp && \
    wget "$KODEXPLORER_URL" && \
    unzip kodexplorer4.40.zip -d ${KOD_DIR} && \
    echo "<?php define(\"DATA_PATH\",'/koddata/'); " > ${KOD_DIR}/config/define.php  && \
    # Fix bug: `Deprecated: Array and string offset access syntax with curly braces is deprecated in common.function.php on line 1031`
    sed -i 's/ord($text{strlen($text)-1})/ord($text[strlen($text)-1])/' ${KOD_DIR}/app/function/common.function.php && \
    # 下载插件包
    #export all_proxy='socks5://192.168.1.108:7890' http_proxy='http://192.168.1.108:7890' https_proxy='http://192.168.1.108:7890' && \
    wget https://github.com/zhtengw/kodexplorer-plugins/releases/download/v2020.06.01/plugins-pack-2020.06.01-for_kodexplorer.zip && \
    unzip plugins-pack-2020.06.01-for_kodexplorer.zip -d ${KOD_DIR}/plugins/ && \
    # 百度脑图
    wget https://github.com/paulhybryant/kodexplorer-plugins-naotu/archive/v1.2.zip  && \
    unzip v1.2.zip && \
    mv kodexplorer-plugins-naotu-1.2/naotu ${KOD_DIR}/plugins/ && \
    # doc2pdf
    wget https://github.com/paulhybryant/kodexplorer-plugins-doc2pdf/archive/v1.1.zip  && \
    unzip v1.1.zip && \
    mv kodexplorer-plugins-doc2pdf-1.1 ${KOD_DIR}/plugins/doc2pdf && \
    # imageExif modified
    wget -O imageExif.zip https://codeload.github.com/hiteochew/kodexplorer-plugins-imageExif/zip/master   && \
    unzip imageExif.zip  && \
    rm -rf ${KOD_DIR}/plugins/imageExif && \
    mv kodexplorer-plugins-imageExif-master ${KOD_DIR}/plugins/imageExif && \
    # meituxiuxiu
    wget -O meituxiuxiu.zip https://codeload.github.com/hiteochew/kodexplorer-plugins-meituxiuxiu/zip/master && \
    unzip meituxiuxiu.zip  && \
    mv kodexplorer-plugins-meituxiuxiu-master ${KOD_DIR}/plugins/meituxiuxiu && \
    # zoho office
    wget -O zoho.zip https://codeload.github.com/hiteochew/kodexplorer-plugins-zoho/zip/master && \
    unzip zoho.zip  && \
    mv kodexplorer-plugins-zoho-master ${KOD_DIR}/plugins/zoho && \
    # 替换arm64的7z以及rar
    cp -f /usr/lib/p7zip/7za ${KOD_DIR}/app/kod/archiveLib/bin/7z && \
    cp -f /usr/lib/p7zip/7za ${KOD_DIR}/plugins/zipView/lib/bin/7z_mac && \
    cp -f /usr/bin/unrar ${KOD_DIR}/app/kod/archiveLib/bin/rar && \
    cp -f /usr/bin/unrar ${KOD_DIR}/plugins/zipView/lib/bin/rar_mac && \
    rm -rf /tmp/* && \
    #unset all_proxy http_proxy https_proxy && \
    # Fix plugin bug: adminer
    sed -i 's/break;default:continue/break;default:continue 2/g' ${KOD_DIR}/plugins/adminer/adminer/index.php

# 指定工作目录
WORKDIR /koddata

VOLUME /koddata

# 设置启动项
# COPY entrypoint.sh /usr/local/bin/
# RUN chmod a+x /usr/local/bin/entrypoint.sh

# ENTRYPOINT ["entrypoint.sh"]
CMD [ "php", "-S", "0000:9000", "-t", "/var/www/html" ]
