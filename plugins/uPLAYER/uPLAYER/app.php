<?php

class uPLAYERPlugin extends PluginBase{
	function __construct(){
		parent::__construct();
	}
	public function regiest(){
		$this->hookRegiest(array(
			'user.commonJs.insert' => 'uPLAYERPlugin.echoJs'
		));
	}
	public function echoJs($st,$act){
    $this->echoFile('static/main.js');        
	}
  
  public function playlist_saver(){
     $path = isset($_POST['path']) ? $_POST['path'] : '';
     $playlistdata = isset($_POST['playlistdata']) ? $_POST['playlistdata'] : '';
     $tmp=0;
     while (file_exists($path."Playlist".$tmp.".m3u")) {
       $tmp++;
     }
     file_put_contents($path."Playlist".$tmp.".m3u",$playlistdata);
	}  
	public function index(){
		include($this->pluginPath.'static/page.html');
	} 
}