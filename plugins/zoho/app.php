<?php

class zohoPlugin extends PluginBase {
    function __construct() {
        parent::__construct();
    }
    public function regiest() {
        $this->hookRegiest(array(
            'user.commonJs.insert' => 'zohoPlugin.echoJs'
        ));
    }
    public function echoJs($st,$act) {
        if ($this->isFileExtence($st,$act)) {
            $this->echoFile('static/main.js');
        }
    }
    public function index() {
        if (substr($this->in['path'],0,4) == 'http') {
            $path = $fileUrl = $this->in['path'];
        } else {
            $path = _DIR($this->in['path']);
            $fileUrl = _make_file_proxy($path);
            if (!file_exists($path)) {
                show_tips(LNG('not_exists'));
            }
        }
        $fileName = get_path_this($path);
        $fileExt = get_path_ext($path);
        $serverUrl = $this->getServerUrl($fileExt);
        $saveUrl = $this->pluginHost.'php/save.php?path='.rawurlencode($path);
        
        $config = $this->getConfig();
        
        $post_data = array(
            'url' => $fileUrl, 
            'apikey' => $config['zohoApiKey'],
            /*''editor_settings' => '{ "unit": "in", "language": "en", "view": "pageview" }',
            permissions' => '{ "document.export": true, "document.print": true, "document.edit": true, "review.changes.resolve": false, "review.comment": true, "collab.chat": true }',
            'callback_settings' => '{"save_format":"'.$fileExt.'","save_url":"'.$saveUrl.'","context_info":"User"}',
            'document_info' => '{"document_name":"'.$fileName.'","document_id":"'.md5($path).'"}',
            'user_info' => '{"user_id":"guest","display_name":"guest"}',
            'document_defaults' => '{ "orientation": "portrait", "paper_size": "Letter", "font_name": "Lato", "font_size": 12, "track_changes": "disabled" }',, 'username' => 'guest' */
            
            'saveurl' => $saveUrl, 
            'output' => 'url', 
            'mode' => 'collabedit', 
            'filename' => $fileName, 
            'lang' => 'zh', 
            'id' => md5($path), 
            'format' => $fileExt
        );
        
	    $r = url_request($serverUrl,'POST',$post_data,false,false,true);
	    $arr = preg_split("/\n/", $r['data']);
	    $ret = array();
    	foreach ($arr as $value) {
    		if ($value) {
    			$temp = explode('=', $value);
    			$key = $temp[0];
    			unset($temp[0]);
    			$ret[$key] = implode('=', $temp);
    		}
    	}
	    if($r['code']==200||$r['status']==1){
	        return include($this->pluginPath.'/php/index.php');
	    }else{
	        return show_tips($ret['ERROR_CODE'].':'.$ret['WARNING']);
	    }
    }
    
    function getServerUrl($ext){
        $ExtsDoc = array("doc", "docm", "docx", "dot", "dotm", "dotx", "epub", "fodt", "htm", "html", "mht", "odt", "pdf", "rtf", "txt", "djvu", "xps");
        $ExtsPre = array("fodp", "odp", "pot", "potm", "potx", "pps", "ppsm", "ppsx", "ppt", "pptm", "pptx", 'sxi');
        $ExtsSheet = array("csv", "fods", "ods", "xls", "xlsm", "xlsx", "xlt", "xltm", "xltx", 'sxc', 'tsv');
        if (in_array($ext,$ExtsDoc)) {
            return  'https://writer.zoho.com.cn/remotedoc.im';
        } elseif (in_array($ext,$ExtsPre)){
            return 'https://show.zoho.com.cn/remotedoc.im';
        } elseif (in_array($ext,$ExtsSheet)){
            return 'https://sheet.zoho.com.cn/remotedoc.im';
        } else {
            return "";
        }
    }
}