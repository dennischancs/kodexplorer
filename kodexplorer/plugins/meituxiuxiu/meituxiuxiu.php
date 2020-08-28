<?php
    $http_type = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')) ? 'https://' : 'http://';
    
    $pre = $http_type.$_SERVER['HTTP_HOST'].substr(__DIR__,strlen($_SERVER["DOCUMENT_ROOT"]));

    function uniqidKey(){ // 文件唯一值，用于表示是否同时编辑文件
        echo md5_file($_GET['path']);
    }
    function pathFile(){ // 本地硬盘路径转下载路径
        //echo $GLOBALS["pre"]."/file.php?path=".$_GET['path'];
        echo $_GET['path'];
    }
    function cbUrl(){ // 文件保存回调
        echo $GLOBALS["pre"]."/save.php?path=".$_GET['path'];
    }
    function fileInfo($type){ // 获取文件名，后缀
        echo pathinfo($_GET['path'],$type);
    }
?>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>美图秀秀flash版</title>
    <script src="http://open.web.meitu.com/sources/xiuxiu.js" type="text/javascript"></script>
    <style type="text/css">
    html, body { height:100%; overflow:hidden; }body { margin:0; }#altContent{height:100%;}h1{margin:0;}
    </style>
    <script type="text/javascript">
        window.onload=function(){
            xiuxiu.params.wmode = "transparent";
            if(parent && parent.G && parent.G.userID && '<?php pathFile(); ?>'){
    		    xiuxiu.setLaunchVars("preventBrowseDefault", 1);
    		    xiuxiu.setLaunchVars("preventUploadDefault", 1);
            }
    		xiuxiu.embedSWF("altContent",3,"100%","100%","xiuxiuEditor");
        	xiuxiu.onInit = function() {
			    try {
        			if('<?php pathFile(); ?>'){
        			    if(parent && parent.core && parent.core.path2url){
        			        xiuxiu.loadPhoto(parent.core.path2url("<?php pathFile(); ?>"));
        			    }else{
        			        xiuxiu.loadPhoto("<?php pathFile(); ?>");
        			    }
        			}
				} catch (e) {
				    if(parent && parent.Tips){
        				parent.Tips.tips(String(e),false)
				    }else{
				        alert(e)
				    }
				    xiuxiu.setLaunchVars("preventBrowseDefault", 0);
    		        xiuxiu.setLaunchVars("preventUploadDefault", 0);
    		        xiuxiu.embedSWF("altContent",3,"100%","100%","xiuxiuEditor");
				}
    			if(parent && parent.G && parent.G.userID){
        		    xiuxiu.setUploadURL("<?php cbUrl(); ?>");
        			xiuxiu.setUploadType(1);
        			xiuxiu.setUploadDataFieldName("<?php fileInfo(PATHINFO_BASENAME);?>");
    			}
    		}
    		
    		xiuxiu.onUploadResponse = function(data) {
    		    /*console.log("上传响应" , data); 
    			try {
    				var data1 = eval('(' + data + ')')
    				parent._ico.createIco(data1);
    			} catch(e) {}*/
    		}
    		xiuxiu.onBeforeUpload = function(data, id) {
    			return true;
    		}
        	
        	if(parent && parent.G && parent.G.userID){
    		    xiuxiu.onBrowse = function(channel, multipleSelection, canClose, id) {
        			/*调用桌面文件接口，打开桌面文件*/
        			parent.core.api.pathSelect({title: "打开图像",type:"image",allowExt:"png|jpg|bmp|gif|jpeg|ico|svg|tiff|webp",result:"url", multiple: true},
            		    function(a){
            		        a = parent.core.path2url(a);
            				var images = [];
            				if(!Array.isArray(a)) {
            					images.push(encodeURI(a));
            				} else {
                				for(var i in a) {
                					if(!Array.isArray(i)) {
                						images.push(encodeURI(i));
                					} else {
                						images.push(encodeURI(a[i].dpath));
                					}
                				}
            				}
            				try {
            				    xiuxiu.loadPhoto(images, false, id, { loadImageChannel: channel });
            				} catch (e) {
            				    if(parent && parent.Tips){
            				        parent.Tips.tips(String(e),false)
            				    }else{
            				        alert(e)
            				    }
            				    xiuxiu.setLaunchVars("preventBrowseDefault", 0);
                		        xiuxiu.setLaunchVars("preventUploadDefault", 0);
                		        xiuxiu.embedSWF("altContent",3,"100%","100%","xiuxiuEditor");
            				}
            		    })
        
        			return true;
        		}
        		
        		xiuxiu.onUpload = function(id) {
        			parent.core.api.pathSelect({title: "保存图像",type:"image",allowExt:"png|jpg|bmp|gif|jpeg|ico|svg|tiff|webp",result:"url",name:'meitu.png'},
        			function(a){
        			    try {
        			        xiuxiu.setUploadArgs({ path: encodeURIComponent(a), name: encodeURIComponent('meitu.png')});
        				    xiuxiu.upload();
        				} catch (e) {
        				    if(parent && parent.Tips){
        				        parent.Tips.tips(String(e),false)
        				    }else{
        				        alert(e)
        				    }
        				    xiuxiu.setLaunchVars("preventBrowseDefault", 0);
            		        xiuxiu.setLaunchVars("preventUploadDefault", 0);
            		        xiuxiu.embedSWF("altContent",3,"100%","100%","xiuxiuEditor");
        				}
        			})
    		    }
    		}
        }
    </script>
</head>
<body>
    <div id="altContent"><h1>美图秀秀</h1></div>
</body>
</html>