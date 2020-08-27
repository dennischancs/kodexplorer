<?php
/*
* @link http://kodcloud.com/
* @author warlee | e-mail:kodcloud@qq.com
* @copyright warlee 2014.(Shanghai)Co.,Ltd
* @license http://kodcloud.com/tools/license/license.txt
*/

if(!isset($config['appStartTime'])){
	$config['appStartTime'] = mtime();
}

function myAutoloader($name) {
	$find = array(
		CLASS_DIR.$name.'.class.php',
		CORER_DIR.$name.'.class.php',
		SDK_DIR.$name.'.class.php',
		CORER_DIR.'/Driver/Cache/'.$name.'.class.php',
		CORER_DIR.'/Driver/DB/'.$name.'.class.php',
		CORER_DIR.'/IO/'.$name.'.class.php',

		MODEL_DIR.$name.'.class.php',
		CONTROLLER_DIR.$name.'.class.php',
		PLUGIN_DIR.substr($name,0,strrpos($name,'Plugin')).'/app.php',
	);
	foreach ($find as $file) {
		if($file == PLUGIN_DIR.'//app.php'){
			continue;
		}
		if(is_file($file)){
			include_once($file);
			return true;
		}
	}
	return false;
}
if (version_compare(PHP_VERSION, '5.3', '<')) {
	spl_autoload_register('myAutoloader');
} else {
	spl_autoload_register('myAutoloader', true, true);
}


/**
 * 生产model对象
 */
function init_model($modelName){
	if (!class_exists($modelName.'Model')) {
		$modelFile = MODEL_DIR.$modelName.'Model.class.php';
		if(!is_file($modelFile)){
			return false;
		}
		include_once($modelFile);
	}
	$reflectionObj = new ReflectionClass($modelName.'Model');
	$args = func_get_args();
	array_shift($args);
	return $reflectionObj -> newInstanceArgs($args);
}
/**
 * 生产controller对象
 */
function init_controller($controllerName){
	if (!class_exists($controllerName)) {
		$modelFile = CONTROLLER_DIR.$controllerName.'.class.php';
		if(!is_file($modelFile)){
			return false;
		}
		include_once($modelFile);
	}
	$reflectionObj = new ReflectionClass($controllerName);
	$args = func_get_args();
	array_shift($args);
	return $reflectionObj -> newInstanceArgs($args);
}

/**
 * 文本字符串转换
 */
function mystr($str){
	$from = array("\r\n", " ");
	$to = array("<br/>", "&nbsp");
	return str_replace($from, $to, $str);
} 

// 清除多余空格和回车字符
function strip($str){
	return preg_replace('!\s+!', '', $str);
} 

// 删除字符串两端的字符串
function str_trim($str,$remove){
	return str_rtrim(str_ltrim($str,$remove),$remove);
}
function str_ltrim($str,$remove){
	if(!$str || !$remove) return $str;
	while(substr($str,0,strlen($remove)) == $remove){
		$str = substr($str,strlen($remove));
	}
	return $str;
}
function str_rtrim($str,$remove){
	if(!$str || !$remove) return $str;
	while(substr($str,-strlen($remove)) == $remove){
		$str = substr($str,0,-strlen($remove));
		echo $str;
	}
	return $str;
}

/**
 * 获取精确时间
 */
function mtime(){
	$t= explode(' ',microtime());
	$time = $t[0]+$t[1];
	return $time;
}
/**
 * 过滤HTML
 */
function clear_html($HTML, $br = true){
	$HTML = htmlspecialchars(trim($HTML));
	$HTML = str_replace("\t", ' ', $HTML);
	if ($br) {
		return nl2br($HTML);
	} else {
		return str_replace("\n", '', $HTML);
	} 
}

/**
 * 过滤js、css等 
 */
function filter_html($html){
	$find = array(
		"/<(\/?)(script|i?frame|style|html|body|title|link|meta|\?|\%)([^>]*?)>/isU",
		"/(<[^>]*)on[a-zA-Z]+\s*=([^>]*>)/isU",
		"/javascript\s*:/isU",
	);
	$replace = array("＜\\1\\2\\3＞","\\1\\2","");
	return preg_replace($find,$replace,$html);
}


function in_array_not_case($needle, $haystack) {
	return in_array(strtolower($needle),array_map('strtolower',$haystack));
}

/**
 * 将obj深度转化成array
 * 
 * @param  $obj 要转换的数据 可能是数组 也可能是个对象 还可能是一般数据类型
 * @return array || 一般数据类型
 */
function obj2array($obj){
	if (is_array($obj)) {
		foreach($obj as &$value) {
			$value = obj2array($value);
		} 
		return $obj;
	} elseif (is_object($obj)) {
		$obj = get_object_vars($obj);
		return obj2array($obj);
	} else {
		return $obj;
	} 
}

function ignore_timeout(){
	@ignore_user_abort(true);
	@ini_set("max_execution_time",48 * 60 * 60);
	@set_time_limit(48 * 60 * 60);//set_time_limit(0)  2day
	@ini_set('memory_limit', '4000M');//4G;
}


function check_code($code){
	ob_clean();
	header("Content-type: image/png");
	$width = 70;$height=27;
	$fontsize = 18;$len = strlen($code);
	$im = @imagecreatetruecolor($width, $height) or die("create image error!");
	$background_color = imagecolorallocate($im,255, 255, 255);
	imagefill($im, 0, 0, $background_color);  
	for ($i = 0; $i < 2000; $i++) {//获取随机淡色            
		$line_color = imagecolorallocate($im, mt_rand(180,255),mt_rand(160, 255),mt_rand(100, 255));
		imageline($im,mt_rand(0,$width),mt_rand(0,$height), //画直线
			mt_rand(0,$width), mt_rand(0,$height),$line_color);
		imagearc($im,mt_rand(0,$width),mt_rand(0,$height), //画弧线
			mt_rand(0,$width), mt_rand(0,$height), $height, $width,$line_color);
	}
	$border_color = imagecolorallocate($im, 160, 160, 160);   
	imagerectangle($im, 0, 0, $width-1, $height-1, $border_color);//画矩形，边框颜色200,200,200
	for ($i = 0; $i < $len; $i++) {//写入随机字串
		$text_color = imagecolorallocate($im,mt_rand(30, 140),mt_rand(30,140),mt_rand(30,140));
		imagechar($im,10,$i*$fontsize+6,rand(1,$height/3),$code[$i],$text_color);
	}
	imagejpeg($im);//显示图
	imagedestroy($im);//销毁图片
}


/**
 * 计算N次方根
 * @param  $num 
 * @param  $root 
 */
function croot($num, $root = 3){
	$root = intval($root);
	if (!$root) {
		return $num;
	} 
	return exp(log($num) / $root);
} 

function add_magic_quotes($array){
	foreach ((array) $array as $k => $v) {
		if (is_array($v)) {
			$array[$k] = add_magic_quotes($v);
		} else {
			$array[$k] = addslashes($v);
		} 
	} 
	return $array;
} 
// 字符串加转义
function add_slashes($string){
	if (!$GLOBALS['magic_quotes_gpc']) {
		if (is_array($string)) {
			foreach($string as $key => $val) {
				$string[$key] = add_slashes($val);
			} 
		} else {
			$string = addslashes($string);
		} 
	} 
	return $string;
} 


function setcookie_header($name,$value='',$maxage=0,$path='',$domain='',$secure=false,$HTTPOnly=false){ 
	if ( !empty($domain) ){ 
		if ( strtolower( substr($domain, 0, 4) ) == 'www.' ) $domain = substr($domain, 4); 
		if ( substr($domain, 0, 1) != '.' ) $domain = '.'.$domain; 
		if ( strpos($domain, ':') ) $domain = substr($domain, 0, strpos($domain, ':')); 
	}
	header('Set-Cookie: '.rawurlencode($name).'='.rawurlencode($value) 
						 .(empty($domain) ? '' : '; Domain='.$domain) 
						 .(empty($maxage) ? '' : '; Max-Age='.$maxage) 
						 .(empty($path) ? '' : '; Path='.$path) 
						 .(!$secure ? '' : '; Secure') 
						 .(!$HTTPOnly ? '' : '; HttpOnly').'; ', false); 
	return true; 
}

/**
 * hex to binary
 */
if (!function_exists('hex2bin')) {
	function hex2bin($hexdata)	{
		return pack('H*', $hexdata);
	}
}

if (!function_exists('gzdecode')) {
	function gzdecode($data){
		return gzinflate(substr($data,10,-8));
	}
}

function xml2json($decodeXml){
	$data = simplexml_load_string($decodeXml,'SimpleXMLElement', LIBXML_NOCDATA);
	return json_decode(json_encode($data),true);
}

/**
 * 二维数组按照指定的键值进行排序，
 * 
 * @param  $keys 根据键值
 * @param  $type 升序降序
 * @return array 
 * $array = array(
 * 		array('name'=>'手机','brand'=>'诺基亚','price'=>1050),
 * 		array('name'=>'手表','brand'=>'卡西欧','price'=>960)
 * );
 * $out = array_sort_by($array,'price');
 */
function array_sort_by($records, $field, $reverse=false){
	$reverse = $reverse?SORT_DESC:SORT_ASC;
	array_multisort(array_column($records,$field),$reverse,$records);
	return $records;
}

if (!function_exists('array_column')) {
    function array_column($array, $column_key, $index_key = null) {
        $column_key_isNumber = (is_numeric($column_key)) ? true : false;
        $index_key_isNumber  = (is_numeric($index_key)) ? true : false;
        $index_key_isNull    = (is_null($index_key)) ? true : false;
         
        $result = array();
        foreach((array)$array as $key=>$val){
            if($column_key_isNumber){
                $tmp = array_slice($val, $column_key, 1);
                $tmp = (is_array($tmp) && !empty($tmp)) ? current($tmp) : null;
            } else {
                $tmp = isset($val[$column_key]) ? $val[$column_key] : null;
            }
            if(!$index_key_isNull){
                if($index_key_isNumber){
                    $key = array_slice($val, $index_key, 1);
                    $key = (is_array($key) && !empty($key)) ? current($key) : null;
                    $key = is_null($key) ? 0 : $key;
                }else{
                    $key = isset($val[$index_key]) ? $val[$index_key] : 0;
                }
            }
            $result[$key] = $tmp;
        }
        return $result;
    }
}

/**
 * 遍历数组，对每个元素调用 $callback，假如返回值不为假值，则直接返回该返回值；
 * 假如每次 $callback 都返回假值，最终返回 false
 * 
 * @param  $array 
 * @param  $callback 
 * @return mixed 
 */
function array_try($array, $callback){
	if (!$array || !$callback) {
		return false;
	} 
	$args = func_get_args();
	array_shift($args);
	array_shift($args);
	if (!$args) {
		$args = array();
	} 
	foreach($array as $v) {
		$params = $args;
		array_unshift($params, $v);
		$x = call_user_func_array($callback, $params);
		if ($x) {
			return $x;
		} 
	} 
	return false;
} 
// 求多个数组的并集
function array_union(){
	$argsCount = func_num_args();
	if ($argsCount < 2) {
		return false;
	} else if (2 === $argsCount) {
		list($arr1, $arr2) = func_get_args();

		while ((list($k, $v) = each($arr2))) {
			if (!in_array($v, $arr1)) $arr1[] = $v;
		} 
		return $arr1;
	} else { // 三个以上的数组合并
		$arg_list = func_get_args();
		$all = call_user_func_array('array_union', $arg_list);
		return array_union($arg_list[0], $all);
	} 
}
// 取出数组中第n项
function array_get_index($arr,$index){
   foreach($arr as $k=>$v){
	   $index--;
	   if($index<0) return array($k,$v);
   }
}

function array_field_values($arr,$field){
   $result = array();
	foreach ($arr as $val) {
		if(is_array($val) && isset($val[$field])){
			$result[] = $val[$field];
		}		
	}
	return $result;
}

// 删除数组某个值
function array_remove_value($array, $value){
	$isNumericArray = true;
	foreach ($array as $key => $item) {
		if ($item === $value) {
			if (!is_int($key)) {
				$isNumericArray = false;
			}
			unset($array[$key]);
		}
	}
	if ($isNumericArray) {
		$array = array_values($array);
	}
	return $array;
}

// 获取数组key最大的值
function array_key_max($array){
	if(count($array)==0){
		return 1;
	}
	$idArr = array_keys($array);
	rsort($idArr,SORT_NUMERIC);//id从高到底
	return intval($idArr[0]);
}

//set_error_handler('errorHandler',E_ERROR|E_PARSE|E_CORE_ERROR|E_COMPILE_ERROR|E_USER_ERROR);
register_shutdown_function('fatalErrorHandler');
function errorHandler($err_type,$errstr,$errfile,$errline){
	if (($err_type & E_WARNING) === 0 && ($err_type & E_NOTICE) === 0) {
		return false;
	}
	$arr = array(
		$err_type,
		$errstr,
		//" in [".$errfile.']',
		" in [".get_path_this(get_path_father($errfile)).'/'.get_path_this($errfile).']',
		'line:'.$errline,
	);
	$str = implode("  ",$arr)."<br/>";
	show_tips($str);
}

//捕获fatalError
function fatalErrorHandler(){
	$e = error_get_last();
	switch($e['type']){
		case E_ERROR:
		case E_PARSE:
		case E_CORE_ERROR:
		case E_COMPILE_ERROR:
		case E_USER_ERROR:
			errorHandler($e['type'],$e['message'],$e['file'],$e['line']);
			break;
		case E_NOTICE:break;
		default:break;
	}
}

function show_tips($message,$url= '', $time = 3,$title = '',$exit = true){
	ob_get_clean();
	header('Content-Type: text/html; charset=utf-8');
	$goto = "content='$time;url=$url'";
	$info = "{$time}s 后自动跳转, <a href='$url'>立即跳转</a>";
	if ($url == "") {
		$goto = "";
		$info = "";
	} //是否自动跳转

	if($title == ''){
		$title = "出错了！";
	}
	//移动端；报错输出
	if(isset($_REQUEST['HTTP_X_PLATFORM'])){
		show_json($message,false);
	}
	
	if(is_array($message) || is_object($message)){
		$message = json_encode_force($message);
		$message = htmlspecialchars($message);
		$message = "<pre>".$message.'</pre>';
	}else{
		$message = filter_html(nl2br($message));
	}
	if(file_exists(TEMPLATE.'common/showTips.html')){
		include(TEMPLATE.'common/showTips.html');
		if($exit){exit;}
	}
	echo<<<END
<html>
	<meta http-equiv='refresh' $goto charset="utf-8">
	<style>
	#msgbox{border: 1px solid #ddd;border: 1px solid #eee;padding: 20px 40px 40px 40px;border-radius: 5px;background: #f6f6f6;
	font-family: 'Helvetica Neue', "Microsoft Yahei", "微软雅黑", "STXihei", "WenQuanYi Micro Hei", sans-serif;
	color:888;margin:0 auto;margin-top:10%;width:400px;font-size:14px;color:#666;word-wrap: break-word;word-break: break-all;}
	#msgbox #info{margin-top: 10px;color:#aaa;font-size: 12px;}
	#msgbox #title{color: #888;border-bottom: 1px solid #ddd;padding: 10px 0;margin: 0 0 15px;font-size:18px;}
	#msgbox #info a{color: #64b8fb;text-decoration: none;padding: 2px 0px;border-bottom: 1px solid;}
	#msgbox a{text-decoration:none;color:#2196F3;}#msgbox a:hover{color:#f60;border-bottom:1px solid}
	#msgbox pre{word-break: break-all;word-wrap: break-word;white-space: pre-wrap;
		background: #002b36;padding:1em;color: #839496;border-left: 6px solid #8e8e8e;border-radius: 3px;}
	</style>
	<body>
	<div id="msgbox">
		<div id="title">$title</div>
		<div id="message">$message</div>
		<div id="info">$info</div>
	</div>
	</body>
</html>
END;
	if($exit){exit;}
}
function get_caller_info() {
	$trace = debug_backtrace();
	foreach($trace as $i=>$call){
		if (isset($call['object']) && is_object($call['object'])) { 
			$call['object'] = "  ".get_class($call['object']); 
		}
		if (is_array($call['args'])) {
			foreach ($call['args'] as &$arg) {
				if (is_object($arg)) {
					$arg = "  ".get_class($arg);
				}
			}
		}
		$traceText[$i] = "#".$i." ".basename($call['file']).'【'.$call['line'].'】 ';
		$traceText[$i].= (!empty($call['object'])?$call['object'].$call['type']:'');
		if($call['function']=='show_json'){
			$traceText[$i].= $call['function'].'(args)';
		}else{
			if( $call['function'] == 'call_user_func_array' &&
				isset($call['args'][0][0]) && 
				is_object($call['args'][0][0])){
				unset($call['args'][0][0]);
			}
			$traceText[$i].= $call['function'].'('.json_encode($call['args'],true).')';
		}		
	}
	unset($traceText[0]);
	$traceText = array_reverse($traceText);
	return $traceText;
}



// 去除json中注释部分; json允许注释
// 支持 // 和 /*...*/注释 
function json_comment_clear($str){
	$result = '';
	$inComment = false;
	$commentType = '//';// /*,//
	$quoteCount  = 0;
	$str = str_replace(array('\"',"\r"),array("\\\0","\n"),$str);

	for ($i=0; $i < strlen($str); $i++) {
		$char = $str[$i];
		if($inComment){
			if($commentType == '//' && $char == "\n"){
				$result .= "\n";
				$inComment = false;
			}else if($commentType == '/*' && $char == '*' && $str[$i+1] == '/'){
				$i++;
				$inComment = false;
			}
		}else{
			if($str[$i] == '/'){
				if($quoteCount % 2 != 0){//成对匹配，则当前不在字符串内
					$result .= $char;
					continue;
				}	
				if($str[$i+1] == '*'){
					$inComment = true;
					$commentType = '/*';
					$i++;
					continue;
				}else if($str[$i+1] == '/'){
					$inComment = true;
					$commentType = '//';
					$i++;
					continue;
				}
			}else if($str[$i] == '"'){
				$quoteCount++;
			}
			$result .= $char;
		}
	}
	$result = str_replace("\\\0",'\"',$result);
	$result = str_replace("\n\n","\n",$result);
	return $result;
}
function json_space_clear($str){
	$result = '';
	$quoteCount  = 0;
	$str = str_replace(array('\"',"\r"),array("\\\0","\n"),$str);
	for ($i=0; $i < strlen($str); $i++) {
		$char = $str[$i];
		//忽略不在字符串中的空格 tab 和换行
		if( $quoteCount % 2 == 0 &&
			($char == ' ' || $char == '	' || $char == "\n") ){
			continue;
		}
		if($char == '"'){
			$quoteCount ++;
		}
		$result .= $char;
	}
	$result = str_replace("\\\0",'\"',$result);
	return $result;
}

function json_decode_force($str){
	$str = trim($str,'﻿');
	$str = json_comment_clear($str);
	$str = json_space_clear($str);

	//允许最后一个多余逗号(todo:字符串内)
	$str = str_replace(array(',}',',]',"\n","\t"),array('}',']','',' '),$str);
	$result = json_decode($str,true);
	if(!$result){
		//show_json($result,false);
	}
	return $result;
}
function json_encode_force($json){
	if(defined('JSON_PRETTY_PRINT')){
		$jsonStr = json_encode($json,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
	}else{
		$jsonStr = json_encode($json);
	}
	if($jsonStr === false){
		include_once(dirname(__FILE__)."/others/JSON.php");
		$parse = new Services_JSON();
		$jsonStr =  $parse->encode($json);
	}
	return $jsonStr;
}

/**
 * 打包返回AJAX请求的数据
 * @params {int} 返回状态码， 通常0表示正常
 * @params {array} 返回的数据集合
 */
function show_json($data,$code = true,$info=''){
	if($GLOBALS['SHOW_JSON_RETURN']){
		return;
	}
	$useTime = mtime() - $GLOBALS['config']['appStartTime'];
	$result = array('code'=>$code,'use_time'=>$useTime,'data'=>$data);
	if(defined("GLOBAL_DEBUG") && GLOBAL_DEBUG==1){
		$result['call'] = get_caller_info();
	}
	if ($info != '') {
		$result['info'] = $info;
	}
	ob_end_clean();
	if(!headers_sent()){
		header("X-Powered-By: kodExplorer.");
		header('Content-Type: application/json; charset=utf-8'); 
	}
	if(class_exists('Hook')){
		$temp = Hook::trigger("show_json",$result);
		if(is_array($temp)){
			$result = $temp;
		}
	}
	$json = json_encode_force($result);
	if(isset($_GET['callback'])){
		if(!preg_match("/^[0-9a-zA-Z_.]+$/",$_GET['callback'])){
			die("calllback error!");
		}
		echo $_GET['callback'].'('.$json.');';
	}else{
		echo $json;
	}
	if(!isset($GLOBALS['SHOW_JSON_EXIT']) || !$GLOBALS['SHOW_JSON_EXIT']){
		exit;
	}
}

function show_trace(){
	echo '<pre>';
	var_dump(func_get_args());
	echo '<hr/>';
	echo get_caller_info();
	echo '</pre>';
	exit;
}

function file_sub_str($file,$start=0,$len=0){
	$size = filesize($file);
	if($start < 0 ){
		$start = $size + $start;
		$len = $size - $start;
	}
    $fp = fopen($file,'r');
    fseek($fp,$start);
    $res = fread($fp,$len);
    fclose($fp);
    return $res;
}
function str2hex($string){
	$hex='';
	for($i=0;$i<strlen($string);$i++){
		$hex .= sprintf('%02s ',dechex(ord($string[$i])));
	}
	$hex = strtoupper($hex);
	return $hex;
}

function hex2str($hex){
	$hex = str_replace(" ",'',$hex);
	$string='';
	for ($i=0; $i < strlen($hex)-1; $i+=2){
		$string .= chr(hexdec($hex[$i].$hex[$i+1]));
	}
	return $string;
}

if(!function_exists('json_encode')){
	include_once(dirname(__FILE__)."/others/JSON.php");
	function json_encode($data){
		$json = new Services_JSON();
		return $json->encode($data);
	}
	function json_decode($json_data,$toarray =false) {
		$json = new Services_JSON();
		$array = $json->decode($json_data);
		if ($toarray) {
			$array = obj2array($array);
		}
		return $array;
	}
}

/**
 * 去掉HTML代码中的HTML标签，返回纯文本
 * @param string $document 待处理的字符串
 * @return string 
 */
function html2txt($document){
	$search = array ("'<script[^>]*?>.*?</script>'si", // 去掉 javascript
		"'<[\/\!]*?[^<>]*?>'si", // 去掉 HTML 标记
		"'([\r\n])[\s]+'", // 去掉空白字符
		"'&(quot|#34);'i", // 替换 HTML 实体
		"'&(amp|#38);'i",
		"'&(lt|#60);'i",
		"'&(gt|#62);'i",
		"'&(nbsp|#160);'i",
		"'&(iexcl|#161);'i",
		"'&(cent|#162);'i",
		"'&(pound|#163);'i",
		"'&(copy|#169);'i",
		"'&#(\d+);'e"); // 作为 PHP 代码运行
	$replace = array ("",
		"",
		"",
		"\"",
		"&",
		"<",
		">",
		" ",
		chr(161),
		chr(162),
		chr(163),
		chr(169),
		"chr(\\1)");
	$text = preg_replace ($search, $replace, $document);
	return $text;
} 

// 获取内容第一条
function match($content, $preg){
	$preg = "/" . $preg . "/isU";
	preg_match($preg, $content, $result);
	return $result[1];
} 
// 获取内容,获取一个页面若干信息.结果在 1,2,3……中
function match_all($content, $preg){
	$preg = "/" . $preg . "/isU";
	preg_match_all($preg, $content, $result);
	return $result;
} 

/**
 * 获取指定长度的 utf8 字符串
 * 
 * @param string $string 
 * @param int $length 
 * @param string $dot 
 * @return string 
 */
function get_utf8_str($string, $length, $dot = '...'){
	if (strlen($string) <= $length) return $string;

	$strcut = '';
	$n = $tn = $noc = 0;

	while ($n < strlen($string)) {
		$t = ord($string[$n]);
		if ($t == 9 || $t == 10 || (32 <= $t && $t <= 126)) {
			$tn = 1;
			$n++;
			$noc++;
		} elseif (194 <= $t && $t <= 223) {
			$tn = 2;
			$n += 2;
			$noc += 2;
		} elseif (224 <= $t && $t <= 239) {
			$tn = 3;
			$n += 3;
			$noc += 2;
		} elseif (240 <= $t && $t <= 247) {
			$tn = 4;
			$n += 4;
			$noc += 2;
		} elseif (248 <= $t && $t <= 251) {
			$tn = 5;
			$n += 5;
			$noc += 2;
		} elseif ($t == 252 || $t == 253) {
			$tn = 6;
			$n += 6;
			$noc += 2;
		} else {
			$n++;
		} 
		if ($noc >= $length) break;
	} 
	if ($noc > $length) {
		$n -= $tn;
	} 
	if ($n < strlen($string)) {
		$strcut = substr($string, 0, $n);
		return $strcut . $dot;
	} else {
		return $string ;
	} 
} 

/**
 * 字符串截取，支持中文和其他编码
 * 
 * @param string $str 需要转换的字符串
 * @param string $start 开始位置
 * @param string $length 截取长度
 * @param string $charset 编码格式
 * @param string $suffix 截断显示字符
 * @return string 
 */
function msubstr($str, $start = 0, $length, $charset = "utf-8", $suffix = true){
	if (function_exists("mb_substr")) {
		$i_str_len = mb_strlen($str);
		$s_sub_str = mb_substr($str, $start, $length, $charset);
		if ($length >= $i_str_len) {
			return $s_sub_str;
		} 
		return $s_sub_str . '...';
	} elseif (function_exists('iconv_substr')) {
		return iconv_substr($str, $start, $length, $charset);
	} 
	$re['utf-8'] = "/[\x01-\x7f]|[\xc2-\xdf][\x80-\xbf]|[\xe0-\xef][\x80-\xbf]{2}|[\xf0-\xff][\x80-\xbf]{3}/";
	$re['gb2312'] = "/[\x01-\x7f]|[\xb0-\xf7][\xa0-\xfe]/";
	$re['gbk'] = "/[\x01-\x7f]|[\x81-\xfe][\x40-\xfe]/";
	$re['big5'] = "/[\x01-\x7f]|[\x81-\xfe]([\x40-\x7e]|\xa1-\xfe])/";
	preg_match_all($re[$charset], $str, $match);
	$slice = join("", array_slice($match[0], $start, $length));
	if ($suffix) return $slice . "…";
	return $slice;
}

// -----------------变量调试-------------------
/**
 * 格式化输出变量，或者对象
 * 
 * @param args; 
 * 默认自动退出；最后一个参数为false时不退出
 */

function pr_replace_callback($matches){
	return "\n".str_repeat(" ",strlen($matches[1])*2).$matches[2];
}
function pr(){
	ob_start();
	$style = '<style>
	pre#debug{margin:10px;font-size:14px;color:#222;font-family:Consolas ;line-height:1.2em;background:#f6f6f6;
		border-left:5px solid #444;padding:10px;width:95%;word-break:break-all;white-space:pre-wrap;word-wrap: break-word;}
	pre#debug b{font-weight:400;}
	#debug #debug_keywords{font-weight:200;color:#888;}
	#debug #debug_tag{color:#222 !important;}
	#debug #debug_var{color:#f60;}
	#debug #debug_var_str,#debug #debug_var_str #debug_keywords{color:#f44336;}
	#debug #debug_set{color:#0C9CAE;}</style>';

	ob_start();
	$arg = func_get_args();
	$num = func_num_args();
	$exit = true;
	for ($i=0; $i < $num; $i++) {
		if($i == $num-1 && $arg[$i] == true){
			$exit = false;
		}
		var_dump($arg[$i]);
	}
	$out = ob_get_clean(); //缓冲输出给$out 变量
	$out = preg_replace('/=\>\n\s+/',' => ',$out); //高亮=>后面的值
	$out = preg_replace_callback('/\n(\s*)([\}\[])/','pr_replace_callback',$out); //高亮=>后面的值

	$out = preg_replace('/"(.*)"/','<b id="debug_var_str">"\\1"</b>', $out); //高亮字符串变量
	$out = preg_replace('/\[(.*)\]/','<b id="debug_tag">[</b><b id="debug_var">\\1</b><b id="debug_tag">]</b>', $out); //高亮变量
	$out = preg_replace('/\((.*)\)/','<b id="debug_tag">(</b><b id="debug_var">\\1</b><b id="debug_tag">)</b>', $out); //高亮变量
	$out = str_replace(array('=>',"\n\n"), array('<b id="debug_set">=></b>',"\n"), $out);
	$keywords = array('array','int','string','class','object','null','float','bool'); //关键字高亮
	$keywords_to = $keywords;
	foreach($keywords as $key => $val) {
		$keywords_to[$key] = '<b id="debug_keywords">' . $val . '</b>';
	}
	$out = str_replace($keywords, $keywords_to, $out);
	echo $style.'<pre id="debug">'.$out.'</pre>';
	if ($exit) exit; //为真则退出
}
function dump(){call_user_func('pr',func_get_args());}
function debug_out(){call_user_func('pr',func_get_args());}

/**
 * 取$from~$to范围内的随机数
 * 
 * @param  $from 下限
 * @param  $to 上限
 * @return unknown_type 
 */
function rand_from_to($from, $to){
	$size = $to - $from; //数值区间
	$max = 30000; //最大
	if ($size < $max) {
		return $from + mt_rand(0, $size);
	} else {
		if ($size % $max) {
			return $from + random_from_to(0, $size / $max) * $max + mt_rand(0, $size % $max);
		} else {
			return $from + random_from_to(0, $size / $max) * $max + mt_rand(0, $max);
		} 
	} 
} 

/**
 * 产生随机字串，可用来自动生成密码 默认长度6位 字母和数字混合
 * 
 * @param string $len 长度
 * @param string $type 字串类型：0 字母 1 数字 2 大写字母 3 小写字母  4 中文  
 * 其他为数字字母混合(去掉了 容易混淆的字符oOLl和数字01，)
 * @param string $addChars 额外字符
 * @return string 
 */
function rand_string($len = 4, $type='checkCode'){
	$str = '';
	switch ($type) {
		case 1://数字
			$chars = str_repeat('0123456789', 3);
			break;
		case 2://大写字母
			$chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			break;
		case 3://小写字母
			$chars = 'abcdefghijklmnopqrstuvwxyz';
			break;
		case 4://大小写中英文
			$chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
			break;
		default: 
			// 默认去掉了容易混淆的字符oOLl和数字01，要添加请使用addChars参数
			$chars = 'ABCDEFGHIJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
			break;
	}
	if ($len > 10) { // 位数过长重复字符串一定次数
		$chars = $type == 1 ? str_repeat($chars, $len) : str_repeat($chars, 5);
	} 
	if ($type != 4) {
		$chars = str_shuffle($chars);
		$str = substr($chars, 0, $len);
	} else {
		// 中文随机字
		for($i = 0; $i < $len; $i ++) {
			$str .= msubstr($chars, floor(mt_rand(0, mb_strlen($chars, 'utf-8') - 1)), 1);
		} 
	} 
	return $str;
} 

/**
 * 生成自动密码
 */
function make_password(){
	$temp = '0123456789abcdefghijklmnopqrstuvwxyz'.
			'ABCDEFGHIJKMNPQRSTUVWXYZ~!@#$^*)_+}{}[]|":;,.'.time();
	for($i=0;$i<10;$i++){
		$temp = str_shuffle($temp.substr($temp,-5));
	}
	return md5($temp);
}


/**
 * php DES解密函数
 * 
 * @param string $key 密钥
 * @param string $encrypted 加密字符串
 * @return string 
 */
function des_decode($key, $encrypted){
	$encrypted = base64_decode($encrypted);
	$td = mcrypt_module_open(MCRYPT_DES, '', MCRYPT_MODE_CBC, ''); //使用MCRYPT_DES算法,cbc模式
	$iv = mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
	$ks = mcrypt_enc_get_key_size($td);

	mcrypt_generic_init($td, $key, $key); //初始处理
	$decrypted = mdecrypt_generic($td, $encrypted); //解密
	
	mcrypt_generic_deinit($td); //结束
	mcrypt_module_close($td);
	return pkcs5_unpad($decrypted);
} 
/**
 * php DES加密函数
 * 
 * @param string $key 密钥
 * @param string $text 字符串
 * @return string 
 */
function des_encode($key, $text){
	$y = pkcs5_pad($text);
	$td = mcrypt_module_open(MCRYPT_DES, '', MCRYPT_MODE_CBC, ''); //使用MCRYPT_DES算法,cbc模式
	$ks = mcrypt_enc_get_key_size($td);

	mcrypt_generic_init($td, $key, $key); //初始处理
	$encrypted = mcrypt_generic($td, $y); //解密
	mcrypt_generic_deinit($td); //结束
	mcrypt_module_close($td);
	return base64_encode($encrypted);
} 
function pkcs5_unpad($text){
	$pad = ord($text{strlen($text)-1});
	if ($pad > strlen($text)) return $text;
	if (strspn($text, chr($pad), strlen($text) - $pad) != $pad) return $text;
	return substr($text, 0, -1 * $pad);
} 
function pkcs5_pad($text, $block = 8){
	$pad = $block - (strlen($text) % $block);
	return $text . str_repeat(chr($pad), $pad);
}