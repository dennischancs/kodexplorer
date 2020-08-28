<?php
/*
* @link http://kodcloud.com/
* @author warlee | e-mail:kodcloud@qq.com
* @copyright warlee 2014.(Shanghai)Co.,Ltd
* @license http://kodcloud.com/tools/license/license.txt
*/

//配置数据,可在setting_user.php中添加变量覆盖,升级后不会被替换
$config['settings'] = array(
	'downloadUrlTime'	=> 0,			 //下载地址生效时间，按秒计算，0代表不限制
	'apiLoginTonken'	=> '',			 //设定则认为开启服务端api通信登陆，同时作为加密密匙
	'updloadChunkSize'	=> 1024*1024*0.4,//0.4M;分片上传大小设定;需要小于php.ini上传限制的大小
	'updloadThreads'	=> 10,			 //上传并发数;部分低配服务器上传失败则将此设置为1
	'updloadBindary'	=> 0,			 //1:以二进制方式上传;后端服务器以php://input接收;0则为传统方式上传
	'uploadCheckChunk'	=> true,		 //开关断点续传，一个文件上传一半时中断，同一个文件再次上传到同一个位置时会接着之前的进度上传。
	'paramRewrite'		=> false,		 //开启url 去除? 直接跟参数
	'httpSendFile'		=> false,		 //调用webserver下载 http://www.laruence.com/2012/05/02/2613.html; 
										 //https://www.lovelucy.info/x-sendfile-in-nginx.html
	
	'pluginServer'		=> "http://api.kodcloud.com/?",
	'staticPath'		=> "./static/",	//静态文件目录,可以配置到cdn;
	'pluginHost'		=> PLUGIN_HOST  //静态文件目录
);
// windows upload threads;兼容不支持并发的服务器
if($config['systemOS'] == 'windows'){
	$config['settings']['updloadThreads'] = 1;
}
// windows iis bin上传有限制
if(strstr($_SERVER['SERVER_SOFTWARE'],'-IIS')){
	$config['settings']['updloadBindary'] = 0;
}
//自适应https
if(substr(APP_HOST,0,8) == 'https://'){
    $config['settings']['pluginServer'] = str_replace("http://",'https://',$config['settings']['pluginServer']);
}

$config['settings']['appType'] = array(
	array('type' => 'tools','name' => 'app_group_tools','class' => 'icon-suitcase'),
	array('type' => 'game','name' => 'app_group_game','class' => 'icon-dashboard'),
	array('type' => 'movie','name' => 'app_group_movie','class' => 'icon-film'),
	array('type' => 'music','name' => 'app_group_music','class' => 'icon-music'),
	array('type' => 'life','name' => 'app_group_life','class' => 'icon-map-marker'),
	array('type' => 'others','name' => 'app_group_others','class' => 'icon-ellipsis-horizontal'),
);
$config['defaultPlugins'] = array(
	'adminer','DPlayer','imageExif','jPlayer','officeLive','photoSwipe','picasa',//'pdfjs',
	'simpleClock','toolsCommon','VLCPlayer','webodf','yzOffice','zipView'
);


//初始化系统配置
$config['settingSystemDefault'] = array(
	'systemPassword'	=> rand_string(20),
	'systemName'		=> "KodExplorer",
	'systemDesc'		=> "——可道云.资源管理器",
	'pathHidden'		=> "Thumb.db,.DS_Store,.gitignore,.git",//目录列表隐藏的项
	'autoLogin'			=> "0",			// 是否自动登录；登录用户为guest
	'needCheckCode'		=> "0",			// 登陆是否开启验证码；默认关闭
	'firstIn'			=> "explorer",	// 登录后默认进入[explorer desktop,editor]

	'newUserApp'		=> "trello,一起写office,微信,365日历,石墨文档,ProcessOn,计算器,icloud,OfficeConverter",
	'newUserFolder'		=> "document,desktop,pictures,music",
	'newGroupFolder'	=> "share,doc,pictures",	//新建分组默认建立文件夹
	'groupShareFolder'	=> "share",
	
	'desktopFolder'		=> 'desktop',	// 桌面文件夹别名
	'versionType'		=> "A",			// 版本
	'rootListUser'		=> 0,			// 组织架构根节点展示群组内用户
	'rootListGroup'		=> 0,			// 组织架构根节点展示子群组
	'csrfProtect'		=> 0, 		 	// 开启csrf保护
	'currentVersion'	=> KOD_VERSION,

	'wallpageDesktop'	=> "1,2,3,4,5,6,7,8,9,10,11,12,13",
	'wallpageLogin'		=> "2,3,6,8,9,11,12",
);
//初始化默认菜单配置
$config['settingSystemDefault']['menu'] = array(
	array('name'=>'desktop','type'=>'system','url'=>'index.php?desktop','target'=>'_self','use'=>'1'),
	array('name'=>'explorer','type'=>'system','url'=>'index.php?explorer','target'=>'_self','use'=>'1'),
	array('name'=>'editor','type'=>'system','url'=>'index.php?editor','target'=>'_self','use'=>'1')
);
if( strstr(I18n::defaultLang(),'zh') || strstr(I18n::getType(),'zh') ){
	$config['settingSystemDefault']['newGroupFolder'] = "share,文档,图片资料,视频资料";
	$config['settingSystemDefault']['newUserFolder'] = "我的文档,图片,视频,音乐";
}

//新用户初始化默认配置
$config['settingDefault'] = array(
	'listType'			=> "icon",		// list||icon||split
	'listSortField'		=> "name",		// name||size||ext||mtime
	'listSortOrder'		=> "up",		// asc||desc
	'fileIconSize'		=> "80",		// 图标大小
	'animateOpen'		=> "1",			// dialog动画
	'soundOpen'			=> "0",			// 操作音效
	'theme'				=> "win10",		// app theme [mac,win7,win10,metro,metro_green,alpha]
	'wall'				=> "8",			// wall picture
	"fileRepeat"		=> "replace",	// rename,replace,skip
	"recycleOpen"		=> "1",			// 1 | 0 代表是否开启
	'resizeConfig'		=> 
		'{"filename":250,"filetype":80,"filesize":80,"filetime":215,"editorTreeWidth":200,"explorerTreeWidth":200}'
);
$config['editorDefault'] = array(
	'fontSize'		=> '14px',
	'theme'			=> 'tomorrow',
	'autoWrap'		=> 1,		//自适应宽度换行
	'autoComplete'	=> 1,
	'functionList' 	=> 1,
	"tabSize"		=> 4,
	"softTab"		=> 1,
	"displayChar"	=> 0,		//是否显示特殊字符
	"fontFamily"	=> "Menlo",	//字体
	"keyboardType"	=> "ace",	//ace vim emacs
	"autoSave"		=> 0,		//自动保存
);


// 多选项总配置	
// http://blog.sina.com.cn/s/blog_7981f91f01012wm7.html
// http://monsoongale.iteye.com/blog/1044431
$config['settingAll'] = array(
	'language' => array(
		"en"	=>	array("English","英语","English"),
		"zh-CN"	=>	array("简体中文","简体中文","Simplified Chinese"),
		"zh-TW"	=>	array("繁體中文","繁體中文","Traditional Chinese"),
		"ar"	=>	array("العربية","'阿拉伯语","Arabic"),
		"bg"	=>	array("Български","保加利亚语","Bulgarian"),
		"bn"	=>	array("বাংলা","孟加拉语","Bengali"),
		"ca"	=>	array("Català","加泰罗尼亚语","Catalan"),
		"cs"	=>	array("Čeština","捷克语","Czech"),
		"da"	=>	array("Dansk","丹麦语","Danish"),
		"de"	=>	array("Deutsch","德语","German"),
		"el"	=>	array("Ελληνικά","希腊语","Greek"),
		"es"	=>	array("Español","西班牙语","Spanish"),
		"et"	=>	array("Eesti","爱沙尼亚语","Estonian"),
		"fa"	=>	array("فارسی","波斯语","Persian"),
		"fi"	=>	array("suomen","芬兰语","Finnish"),
		"fr"	=>	array("Français","法语","French"),
		"gl"	=>	array("Galego","加利西亚语","Galician"),
		"hi"	=>	array("हिन्दी","印地语","Hindi"),
		"hr"	=>	array("Hrvatski","克罗地亚语","Croatian"),
		"hu"	=>	array("Magyar","匈牙利语","Hungarian"),
		"id"	=>	array("Bahasa Indonesia","印尼语","Indonesian"),
		"it"	=>	array("Italiano","意大利语","Italian"),
		"ja"	=>	array("日本語","日语","Japanese"),
		"ko"	=>	array("한국어","韩语","Korean"),
		"lt"	=>	array("Lietuvių","立陶宛语","Lithuanian"),
		"nl"	=>	array("Nederlands","荷兰语","Dutch"),
		"no"	=>	array("Norsk","挪威语","Norwegian"),
		"pl"	=>	array("Polski","波兰语","Polish"),
		"pt"	=>	array("Português","葡萄牙语","Portuguese"),
		"ro"	=>	array("Limba Română","罗马尼亚语","Romanian"),
		"ru"	=>	array("Русский язык","俄语","Russian"),
		"si"	=>	array("සිංහල","僧伽罗语","Sinhala"),
		"sk"	=>	array("Slovenčina","捷克斯洛伐克语","Czechoslovakia"),
		"sl"	=>	array("Slovenski","斯洛文尼亚语'","Slovenian"),
		"sr"	=>	array("Српски","塞尔维亚语","Serbian"),
		"sv"	=>	array("Svenska","瑞典语","Swedish"),
		"ta"	=>	array("த‌மிழ்","泰米尔语","Tamil"),
		"th"	=>	array("ภาษาไทย","泰语","Thai"),
		"tr"	=>	array("Türkçe","土耳其语","Turkish"),
		"uk"	=>	array("Українська","乌克兰语","Ukrainian"),
		"uz"	=>	array("O'zbekiston","乌兹别克语","Uzbek-cyrillic"),
		"vi"	=>	array("Tiếng Việt","越南语","Vietnamese"),
	),//de el fi fr nl pt	d/m/Y H:i
	
	'themeall'		=> "mac,win10,win7,metro,metro_green,metro_purple,metro_pink,metro_orange,alpha_image,alpha_image_sun,alpha_image_sky,diy",
	'codethemeall'	=> "chrome,clouds,crimson_editor,eclipse,github,kuroir,solarized_light,tomorrow,xcode,ambiance,monokai,idle_fingers,pastel_on_dark,solarized_dark,twilight,tomorrow_night_blue,tomorrow_night_eighties",
	'codefontall'	=> 'Source Code Pro,Consolas,Courier,DejaVu Sans Mono,Liberation Mono,Menlo,Monaco,Monospace'
);


//权限配置；精确到需要做权限控制的控制器和方法
//需要权限认证的Action;root组无视权限
$config['roleSetting'] = array(
	'explorer'	=> array(
		'pathInfo','pathList','treeList','pathChmod',
		'mkdir','mkfile','pathRname','pathDelete','zip','unzip','unzipList',
		'pathCopy','pathCute','pathCuteDrag','pathCopyDrag','clipboard','pathPast',
		'serverDownload','fileUpload','search','pathDeleteRecycle',
		'fileDownload','zipDownload','fileDownloadRemove','fileProxy','fileSave','officeView','officeSave'),
	'app'		=> array('userApp','initApp','add','edit','del'),//
	'editor'	=> array('fileGet','fileSave'),

	'user'		=> array('changePassword','commonJs'),//可以设立公用账户
	'userShare' => array('set','del'),
	'setting'	=> array('set','systemSetting','phpInfo','systemTools'),
	'fav'		=> array('add','del','edit'),

	'systemMember'	=> array('get','add','edit','doAction','getByName'),
	'systemGroup'	=> array('get','add','del','edit'),
	'systemRole'	=> array('add','del','edit','roleGroupAction'),
	//不开放此功能【避免扩展名修改，导致系统安全问题】
	'pluginApp'		=> array('index','appList','changeStatus','setConfig','install','unInstall')
);

$config['pathRoleDefine'] = array(
	'read'	=> array(
		'list'	=> array('explorer.index','explorer.pathList','explorer.treeList','editor.index','pluginApp.to'),
		'info'	=> array('explorer.pathInfo','explorer.search'),
		'copy'	=> array('explorer.pathCopy'),
		'preview'=>array('explorer.image','explorer.unzipList','explorer.fileProxy','explorer.officeView','editor.fileGet'),
		'download'=>array('explorer.fileDownload','explorer.zipDownload','explorer.fileDownloadRemove'),
	),
	'write' => array(
		'add'	=> array('explorer.mkdir','explorer.mkfile','explorer.zip','explorer.unzip','app.userApp'),
		'edit'	=> array('explorer.officeSave','explorer.imageRotate','editor.fileSave','explorer.fileSave'),
		'change'=> array('explorer.pathRname','explorer.pathPast','explorer.pathCopyDrag','explorer.pathCuteDrag'),
		'upload'=> array('explorer.fileUpload','explorer.serverDownload'),
		'remove'=> array('explorer.pathDelete','explorer.pathCute'),
	)
);

$config['pathRoleGroupDefault'] = array(
	'1'	=> array(
		"name"		=> "read",
		"style"		=> "blue-light",
		"display"	=> 1,
		"actions"	=> array(
			"read:list" 	=> 1,
			"read:info" 	=> 1,
			"read:copy" 	=> 1,
			"read:preview"	=> 1,
			"read:download" => 1,
		)
	),
	'2'	=> array(
		"name"		=> "write",
		'style'		=> "blue-deep",
		"display"	=> 1,
		"actions"	=> array(
			"read:list" 	=> 1,
			"read:info" 	=> 1,
			"read:copy" 	=> 1,
			"read:preview"	=> 1,
			"read:download" => 1,

			"write:add"		=> 1,
			"write:edit"	=> 1,
			"write:change"	=> 1,
			"write:upload"	=> 1,
			"write:remove"	=> 1,
		)
	),
);

