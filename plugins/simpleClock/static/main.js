kodReady.push(function(){
    if(!$.supportCss3() || isWap()){//ie8 ie9
        return;
    }
	if(lodash.get(window,'Config.pageApp') != 'desktop'){
		return;
	}
	//加载时钟挂件
	$.artDialog.open("{{pluginApi}}",{
		title:"clock",
		top: 40,
		left:$(window).width() - 210,
		width:'200px',
		height:'200px',
		simple:true
	});
});