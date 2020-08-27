<?php

class meituxiuxiuPlugin extends PluginBase{
	function __construct(){
		parent::__construct();
	}
	public function regiest(){
		$this->hookRegiest(array(
			'user.commonJs.insert'	=> 'meituxiuxiuPlugin.echoJs'
		));
	}
	public function echoJs($st,$act){
		if($this->isFileExtence($st,$act)){
			$this->echoFile('static/main.js');
		}
	}
	public function index(){
		if(substr($this->in['path'],0,4) == 'http'){
			$path = $fileUrl = $this->in['path'];
		}else{
			$path = _DIR($this->in['path']);
			$fileUrl  = _make_file_proxy($path);
			/*if (!file_exists($path)) {
				show_tips(LNG('not_exists'));
			}*/
		}
		$http_type = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')) ? 'https://' : 'http://';
		$pre = $http_type.$_SERVER['HTTP_HOST'].substr(__DIR__,strlen($_SERVER["DOCUMENT_ROOT"]));
		$config = $this->getConfig();
        header('Location:'.$pre.'/meituxiuxiu.php?path='.rawurlencode($path));

	}
}