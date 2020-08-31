# kodexplorer for all platform

`已经使用github的buildx action实现构建支持多cpu的镜像`

1. 基于kodexplorer 4.40
2. 增加github上所有找得到的插件（街机模拟器除外）
3. 数据与/var/www/html文件夹分离，可挂载到/volume2并设置为工作目录

# 使用方法

```bash
docker run -d \
  --name kodexplorer \
  --hostname kodexplorer \
  -p 5660:9000 \
  -v /mnt:/volume2 \
  --restart unless-stopped \
  dennischancs/kodexplorer
```

# office离线编辑服务的部署

## onlyoffice插件的使用
ONLYOFFICE Document Server is an online office suite comprising viewers and editors for texts, spreadsheets and presentations, fully compatible with Office Open XML formats: .docx, .xlsx, .pptx and enabling collaborative editing in real time.

> kodexplorer_onlyoffice插件：[sit17/kodexplorer_onlyoffice: kodexplorer_onlyoffice](https://github.com/sit17/kodexplorer_onlyoffice)

> ONLYOFFICE/DocumentServer社区版【无arm64版】
* [ONLYOFFICE/DocumentServer](https://github.com/ONLYOFFICE/DocumentServer)
* [ONLYOFFICE/Docker-DocumentServer](https://github.com/ONLYOFFICE/Docker-DocumentServer)

```bash
# onlyoffice/documentserver为社区版镜像
sudo docker run -i -t -d -p 80:80 onlyoffice/documentserver
```

## 毕升office arm api版，实现arm64机器的离线编辑功能

详见：[api-deploy-arm: 毕升office 部署 arm版本](https://gitee.com/ibisheng/api-deploy-arm)

> 通过官方步骤可以安装成功，在s905x2机器上成功运行，几人使用，一点不卡。
> arm版毕升office docker镜像部署的已知问题：
> -  相对路径导致个别组件无法安装。解决方法：修改`*.sh`和`*.yml`文件中的`cd`命令、`相对路径`、`变量引用`等，全部采用绝对路径即可。arm版的docker-compose对相对路径不完善；
> -  nginx镜像为x86_64平台，需要换镜像，改配置
> - 部署完成后，编辑office文档，doc/docx、xls/xlsx支持较好，但编辑ppt/pptx文件会造成文件丢失（只剩下`22B`的空文件）。