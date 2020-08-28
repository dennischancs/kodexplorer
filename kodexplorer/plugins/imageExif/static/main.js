// fileHistoryPlugin
kodReady.push(function(){
    //打开方式关联案例
    kodApp.add({
        name:LNG['imageExif.meta.name'],
        title:LNG['imageExif.meta.title'],
        ext:"{{config.fileExt}}",
        sort:"{{config.fileSort}}",
        icon:'icon-camera',
        callback:function(path,ext){
            var url = '{{pluginApi}}&path='+core.pathCommon(path);
            if('window' == "{{config.openWith}}"){
                window.open(url);
            }else{
                core.openDialog(url,core.icon(ext),htmlEncode(core.pathThis(path)),"image-exif-dialog",{resize:0,width: "362px",ok:1});
            }
        }
    });
    
	var menuOpt = {
		'image-exif':{
			name:LNG['imageExif.meta.name'],
			className:"image-exif",
			icon:" icon-camera",
			callback:function(action,option){
				if(option.selector == '.menu-tree-file'){
					var param = ui.tree.makeParam();
				}else{
					var param = ui.path.makeParam();
				}
				var request = '{{pluginApi}}getExif&path='+urlEncode(param.path);
				//console.log('exif',param.type,param.path);
                
    			var url = '{{pluginApi}}&path='+core.pathCommon(param.path);
    			if('window' == "{{config.openWith}}"){
    				window.open(url);
    			}else{
    				core.openDialog(url,core.icon(param.type),htmlEncode(core.pathThis(param.path)),"image-exif-dialog",{resize:0,width: "362px",ok:1});
    			}
    			
				/*$.ajax({
					url:request,
					dataType:'json',
					beforeSend: function(){
						Tips.loading(LNG.loading);
					},
					error:function(err){
					    //console.log('获取失败',err)
					    //core.ajaxError;
					    Tips.close('获取失败','error')
					},
					success:function(data){
					    console.log('获取成功',data)
						//Tips.close(data);
						if(data.code){
						    Tips.close(data)
							console.log(data.data);
						}else{
						    Tips.close('无exif信息','warning')
						}
					}
				});*/
			}
		}
	}
	$.contextMenu.menuAdd(menuOpt,'.menu-file',false,'.info');
	$.contextMenu.menuAdd(menuOpt,'.menu-tree-file',false,'.info');

	//显示隐藏 [ 只在自己的目录；自己所在的群组目录文件有历史记录权限]
	Hook.bind('rightMenu.show.menu-file',function($menuAt,$theMenu){
		if($('.context-menu-active').hasClass('menu-tree-file') ){
			var param = ui.tree.makeParam();
		}else{
			var param = ui.path.makeParam();
		}
		var ext = core.pathExt(param.path);
		var hideClass = 'hidden';//'disabled' hideClass
		var ext_arr = ['jpg','jpeg','png','bmp'];
		if("{{config.fileExt}}"){
		    ext_arr = "{{config.fileExt}}".split(',')
		}
		if (inArray(ext_arr,ext)){
			$theMenu.find('.image-exif').removeClass(hideClass);
		}else{
			$theMenu.find('.image-exif').addClass(hideClass);
		}
	});
});