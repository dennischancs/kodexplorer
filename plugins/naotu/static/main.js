kodReady.push(function(){
    kodApp.add({
        name:"naotu",
        title:"{{LNG.naotu.meta.title}}",
        ext:"{{config.fileExt}}",
        sort:"{{config.fileSort}}",
        icon:'{{pluginHost}}static/images/icon.png',
        callback:function(path,ext){
            var timestamp = new Date().getTime();
            var url = '{{pluginHost}}static/kityminder-editor/dist/index.html?url='+core.path2url(path)+'&apphost='+G.appHost+'&path='+urlEncode(path)+"&timestamp="+timestamp;
            if('window' == "{{config.openWith}}"){
                window.open(url);
            }else{
                core.openDialog(url,core.icon(ext),htmlEncode(core.pathThis(path)));
            }
        }
    });
});
