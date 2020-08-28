# kodexplorer for arm64

1、基于kodexplorer 4.40
2、增加github上所有找得到的插件（街机模拟器除外）
3、数据与/var/www/html文件夹分离，可挂载到/volume2并设置为工作目录

# 使用方法

```bash
docker run -d \
  --name kodexplorer \
  --hostname kodexplorer \
  -p 5660:80 \
  -v /mnt:/volume2 \
  --restart unless-stopped \
  dennischancs/kodexplorer:arm64v8-4.40
```

# 其它：onlyoffice插件的使用

[sit17/kodexplorer_onlyoffice: kodexplorer_onlyoffice](https://github.com/sit17/kodexplorer_onlyoffice)