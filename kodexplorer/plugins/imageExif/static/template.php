<!doctype html>
<head>
	<meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1, user-scalable=no" />
	<meta charset="utf-8">
	<link rel="stylesheet" href="<?php echo STATIC_PATH;?>style/skin/base/app_explorer.css?ver=<?php echo KOD_VERSION;?>"/>
	<title><?php echo $fileName;?></title>
	<style type="text/css">
	html{overflow:auto;}
	a{color:red;}
	ol{margin: 0;padding: 0 0 0 15px;}
	.pathinfo{width: 100%;}
	.pathinfo .p {line-height: 1.5;}
	.pathinfo .p .title {width: 100px;font-weight: bold;margin-left: 1rem;}
	.pathinfo .p .content {width: 60%;}
	</style>
</head>
<body>
<div class="pathinfo">
    <?php if($data){ ?>
	<?php foreach ($data as $key => $resp) {?>
	<div class="p info-item-<?=$key?>">
		<div class="title"><?php $lowerstr = strtolower($key);echo (LNG("imageExif.exif.{$lowerstr}")!="imageExif.exif.{$lowerstr}"&&!empty(LNG("imageExif.exif.{$lowerstr}"))?LNG("imageExif.exif.{$lowerstr}"):$key); ?>:</div>
		<div class="content">
            <?php if (!is_array($resp)) {
                echo $resp;
            }else{
                echo "<ol>";
				foreach ($resp as $vkey => $value) {
					echo "<li>".$vkey. " <small>(" .$value.")</small></li>";
				}
				echo "</ol>";
            } ?>
		</div>
		<div style="clear:both"></div>
	</div>
    <?php if (is_array($resp)) {echo '<div class="line"></div>';}
    }}else{ ?>
	<div class="p info-item">
		<div style="text-align:center;"><?php echo LNG('imageExif.exif.none'); ?></div>
		<div style="clear:both"></div>
	</div>
		<script type="text/javascript">parent.Tips.close('<?php echo LNG('imageExif.exif.none'); ?>','warning');</script>
	<?php  } ?>
</div>
<script type="text/javascript" src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
<script type="text/javascript" src="<?php echo $this->pluginHost;?>static/jquery.zclip.js"></script>
<script type="text/javascript">
$(function(){
  $("ol").each(function(){
    var olhandle = $(this);
    var max=10;//设置最多显示li
    var linum = olhandle.find("li");
    var hidden;
    if(linum.length > max){
    	hidden = olhandle.find("li:eq(" + max + ")").nextAll().clone();
    	olhandle.find("li:eq(" + max + ")").nextAll().remove();
      olhandle.append("<li><a href='###'>点击展开</a></li>");
    };
    $(this).find("a").click(function(){
    	olhandle.find("li:last").remove();
      olhandle.append(hidden);
    })
  });
  $(".btnCopy").zclip({
  	path: "<?php echo $this->pluginHost;?>static/ZeroClipboard.swf",
    copy: function(){
   		return $(this).attr("data-url");
　　	},
		afterCopy: function(){
		}
  });
});
</script>
</body>
</html>