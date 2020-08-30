
# ==== 在 arm64 版的docker-compose兼容性不好，无法准确识别“相对路径”和“变量” ===
1. 一定要修改 `*.yml`、`*.sh`文件的路径为绝对路径 ！！！
   `/var/media/emmcDATA/bisheng_data` 为安装路径 (不要用`$basedir`)
2. `*.yml` 内的 `${xxx}` 变量全部改成 字符或数字
   `${tag}` 改 `latest`
   `${basedir}` 改 类似`/var/media/emmcDATA/bisheng_data`的绝对路径


# ![logo](https://bisheng-public.oss-cn-zhangjiakou.aliyuncs.com/resource/favicon.ico)毕升Office api 集成版安装步骤

[毕升Office](https://bishengoffice.com)| onlyoffice中文 |onlyoffice部署

毕升office api 集成版本能够处理word,ppt,excel格式文件的印预览以及**多人协同编辑**，另外还能处理pdf，视频，音频文件的预览以及实现了100多种文本文件带语法高亮的预览 。详细介绍请参考[**毕升Office产品手册**](https://bishengoffice.com)。下面毕升Office的详细部署说明，

你可以通过如下方式联系我们：

毕升Office官方QQ：  [420819940](tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=420819940&website=www.oicqzone.com) ；

毕升Office官方微信号：  bishengoffice；

电话： 18613320502

也可以在微信中搜索毕升Office文档小程序

![扫码_搜索联合传播样式-微信标准绿版](https://bisheng-public.nodoc.cn/resource/扫码_搜索联合传播样式-微信标准绿版.png)

## 

## 安装前必读

安装过程在**centos7**以及**ubuntu 18.04LTS**系统下，硬件配置2核8G以及4核8G服务器均进行过测试。建议使用新安装的系统来安装毕升Office。需要注意的是所有的安装都是root用户执行的。如果您的安装环境不能使用root用户，理论上是不会有问题的，如果碰到权限相关问题请自行搜索资料解决。

1. <span style="color:red;font-weight:bold;">硬件要求</span>

   毕升Office是企业应用系统，主要是考虑在服务器上运行，对硬件资源有一定的要求。在实际测试安装中，cpu<span style="color:red;font-weight:bold;">不应该低于2核，内存4G</span>；实际线上生产运行，根据使用人数，增加硬件配置，比较推荐的配置为：毕升Office完整系统推荐4核8G；如果使用频率不高，2核内存4G/8G也可以。

   另外：毕升Office安装采用的是docker安装,一般用户的docker 镜像是存储在系统目录中，<span style="color:red;font-weight:bold;">建议系统硬盘有15G剩余空间</span>，另外还应该有20G的数据空间（这个根据用户实际使用量来决定。）。在实际过程中，用户在升级时会重新下载新的镜像，在新的安装脚本中，无用的镜像会被删除，如果是以前安装的用户，你可以自行删除无用镜像，或者更新脚本，执行升级（bash upgrade.sh）后会删除镜像

2. 关于vmware虚拟机

   在实际的安装过程中，vmware虚拟机文件较多的情况是在虚拟机外面无法通过 IP来访问毕升Office。此时首先检查毕升office是否安装正确，检查方法是登录到虚拟机，使用命令 curl http://localhost 查看是否有如下输出

   ![image-20190425112838919](https://bisheng-public.nodoc.cn/resource/image-20190425112838919.png)

   如果输出正常，则说明毕升Office安装没有问题。此时，需要检查是否是vmware网络问题。

## 用户协议

在开始安装使用前请阅读毕升Office免费使用用户协议：[协议链接](https://bishengoffice.com/apps/blog/posts/agreement.html)https://bishengoffice.com/apps/blog/posts/agreement.html)

## 系统要求

毕升Office安装完成自带nginx，并且配置好全部全部的路径。**请确保你的系统中的80，443端口没有被占用**

## 步骤

1. 从[github](https://github.com/ibisheng/deploy.git)上clone相关的部署脚本到服务器上

   ```shell
   git clone https://github.com/ibisheng/api-deploy.git
   cd api-deploy
   ```

   或者你也可以从国内代码托管网站[码云](https://gitee.com/ibisheng) 上clone毕升Office部署脚本到服务器上

   ```
   git clone https://gitee.com/ibisheng/api-deploy
   cd api-deploy
   ```

2. 安装docker以及docker-compose

   **这一步是准备毕升Office运行的系统条件，并不是安装毕升Office。**

   毕升Office云平台所有的服务均是基于docker-compose安装的，在进行下一步安装之前，**请确保你的服务器上已经安装了docker和docker-compose。**你可以使用我们准备的脚本安装,也可以自行参考资料进行安装。

   自行安装Docker 参考链接 ：<https://docs.docker.com/install/>；而docker-compose安装则可以执行如下命令：

   ```shell
   curl -L https://get.daocloud.io/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` \
      -o /usr/local/bin/docker-compose
   chmod +x /usr/local/bin/docker-compose
   systemctl start docker
   systemctl enable docker
   ```

   你也可以选择使用我们提供的脚本安装docker：**如果是你的系统是centos**

   ```shell
   bash preinstall.sh
   ```

   **如果你的系统是ubuntu，**则可以执行：

   ```shell
   bash preinstall-ubuntu.sh
   ```

   

   ![image-20190225144902164](https://bisheng-public.oss-cn-zhangjiakou.aliyuncs.com/resource/docker-version.png)

3. 一键安装毕升Office API 版本

   由于一些环境下脚本创建网络会失败，建议在一键安装前建议手动创建docker 网络 bisheng。

   ```shell
   docker network create bisheng
   ```

   如果你的安装脚本是以前下载的，在安装前，请确保是使用的最新脚本，执行git pull 更新最新脚本

   ```shell
   git pull
   ```

   在完成以上步骤之后，可以通过install.sh脚本来安装毕升Office

   ```shell
   bash install.sh /bisheng_data # 请确保/bisheng_data目录没有其他数据
   ```

   注意：** 安装目录的结尾**不要 斜杠 “/”**，否则安装目录最好拼接会出错。**即上面脚本 "/bisheng_data"不要写成“/bisheng_data/”**

   **另外需要强调的是，不要使用有数据的目录作为安装目录，<span style="color: red;">*<u>因为初次安装过程中会清空该目录</u>*</span>**

   该安装命令需要一个参数来指定安装目录，该目录是毕升Office的工作目录，所以的数据都会保存在该目录，需要保证该目录所有在的存储设备上有较大的空间。例如在上面的脚本是我们是使用 /bisheng_data目录作为安装目录

4. 测试

   待上一步骤脚本执行完成之后，先检查所有的docker容易是否全部正常启动。

   ```shell
   docker ps -a
   ```

   ![image-20190402175256521](https://bisheng-public.oss-cn-zhangjiakou.aliyuncs.com/resource/image-20190402175256521.png)

   **其中tools这个容器正常状态是Exit的。**

5. 如何使用

   以上安装完成之后，输入地址 http://192.168.2.108 或者http://hostname  即可进入到毕升Office主页面。其中IP，hostname时安装毕升Office的服务器的IP或者主机名，或者指向该服务器的域名

   ![image-20190402181901296](https://bisheng-public.oss-cn-zhangjiakou.aliyuncs.com/resource/image-20190402181901296.png)




## 配置

完成前面5步操作之后，需要申请免费激活系统即可进行正常使用。参考链接：[免费激活](https://bishengoffice.com/apps/blog/posts/license.html)

毕升Office安装默认是自带ngix配置的，其中nginx的配置文件在安装目录下。如果安装安装目录是 /bisheng_data 具体路径则是： /bisheng_data/service/nginx/config/conf.d/bisheng.conf 。

如果你需要配置nginx 的https，则可以将https证书放在/bisheng_data/service/nginx/keys目录下，该目录在docker中的路径是/keys，**配置时路径应该填写docker的路径**

## 集成毕升以及相关问题

具体参考文档导航：<https://bishengoffice.com/apps/blog/posts/guide.html>

集成参考链接：<https://bishengoffice.com/apps/blog/posts/integrate.html>
