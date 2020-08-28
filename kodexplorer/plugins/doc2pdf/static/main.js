kodReady.push(function(){
    kodApp.add({
        name:"doc2pdf",
        title:"{{LNG.doc2pdf.meta.title}}",
        ext:"{{config.fileExt}}",
        sort:"{{config.fileSort}}",
        icon:'{{pluginHost}}static/images/doc2pdf.jpg',
        callback:function(path,ext){
            var request= "{{pluginApi}}doc2pdf&path="+urlEncode(core.pathCommon(path));
            $.ajax({
              url:request,
              beforeSend: function(){
                Tips.loading(LNG.loading);
              },
              error:core.ajaxError,
              success:function(data){
                Tips.close('转换完成!');
                ui.f5();
              }
            });
        }
    });
});
