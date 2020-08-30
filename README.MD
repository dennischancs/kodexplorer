# kodexplorer not only for arm64

`已经使用github的buildx action实现构建支持多cpu的镜像`

1. 基于kodexplorer 4.40
2. 增加github上所有找得到的插件（街机模拟器除外）
3. 数据与/var/www/html文件夹分离，可挂载到/volume2并设置为工作目录

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
ONLYOFFICE Document Server is an online office suite comprising viewers and editors for texts, spreadsheets and presentations, fully compatible with Office Open XML formats: .docx, .xlsx, .pptx and enabling collaborative editing in real time.

> kodexplorer_onlyoffice插件：[sit17/kodexplorer_onlyoffice: kodexplorer_onlyoffice](https://github.com/sit17/kodexplorer_onlyoffice)

> ONLYOFFICE/DocumentServer社区版【无arm64版】
* [ONLYOFFICE/DocumentServer](https://github.com/ONLYOFFICE/DocumentServer)
* [ONLYOFFICE/Docker-DocumentServer](https://github.com/ONLYOFFICE/Docker-DocumentServer)

```bash
# onlyoffice/documentserver为社区版镜像
sudo docker run -i -t -d -p 80:80 onlyoffice/documentserver
```