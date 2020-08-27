<?php
$data = $_POST['memories'];
$url = $_POST['dataurl'];

$tmp=0;
while (file_exists($url."playlist".$tmp.".m3u")) {   
  $tmp++;                     
}

$url=$url."playlist".$tmp.".m3u";

$f = fopen($url, 'w+');
fwrite($f, $data."\n");
fclose($f);
?>
