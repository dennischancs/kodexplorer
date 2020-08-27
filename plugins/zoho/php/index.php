<!DOCTYPE html>
<html style="height: 100%;">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title><?php echo $fileName; ?></title>
    <style>
    html,body {height: 100%;overflow: hidden;    background: #eaeaea;}
    #load_img {width: 100%;height: 100%;position: absolute;text-align: center;}
    .load_logo img{max-height: 200px;max-width: 60%;}
    .load_center {position: absolute;left: 0;right: 0;}
    .load_header {font-family: calibri, tahoma, verdana, arial, sans serif;font-size: 18pt;color: #444444;line-height: 150%;}
    .load_text {font-family: calibri, tahoma, verdana, arial, sans serif;font-size: 10pt;color: #444444;}
    #load_img img {position: relative;}
    .load_center img {margin: 5px;}
    </style>
</head>
<body style="height: 100%; margin: 0;">
<div id="load_img">
    <div class="load_center">
    	<div class="load_logo"><img src="<?=$this->pluginHost?>/static/images/icon.png" /></div>
    	<div class="load_header"><?php echo LNG('zoho.Config.your_file_extracted');?></div>
    	<div class="load_text"><?php echo LNG('zoho.internet_file_extracted');?></div>
    	<img align="absmiddle" style="margin-top: 2rem;" src="data:image/gif;base64,R0lGODlhGAAYAIABAJmZmf///yH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgABACwAAAAAGAAYAAACHYyPCZDtt9abMNIrr968+w+G4kiW5omm6sq27lYAACH5BAUKAAEALBQABgAEAAQAAAIFDGCnl1EAIfkEBQoAAQAsFAAOAAQABAAAAgUMYKeXUQAh+QQFCgABACwOABQABAAEAAACBQxgp5dRACH5BAUKAAEALAYAFAAEAAQAAAIFDGCnl1EAIfkEBQoAAQAsAAAOAAQABAAAAgUMYKeXUQAh+QQFCgABACwAAAYABAAEAAACBQxgp5dRACH5BAkKAAEALAYAAAAMAAQAAAILDBCperfb0GNyhgIAIfkECQoAAQAsAAAAABgAGAAAAh2MHwDI3aqcZHDNmyzevPsPhuJIluaJpurKtu47FgAh+QQJCgABACwAAAAAGAAYAAACMowfAMjdqpxkcM2bLN687+hRUIhUZKmd6sq2HhhG5luNtJx2sMs/ecaZGYQTIrH42x0KACH5BAkKAAEALAAAAAAYABgAAAIwjB8AyN2qnGRwzZss3rzv6FFQiFRkqZ3qyrYeqJrxuMLujWdPOsmG36P9hBfb0FEAACH5BAkKAAEALAAAAAAYABgAAAIqjB8AyN2qnGRwzZss3rzv6FFQiFRkqZ3qyrYeqJrxuMLujWesfPJ9iikAACH5BAkKAAEALAAAAAAYABgAAAImjB8AyN2qnGRwzZss3rzv6FFQiFRkqZ3qyrYeqJrxuMLujef6PhUAIfkECQoAAQAsAAAAABgAGAAAAiOMHwDI3aqcZHDNmyzevO/oUVCIVGSpnerKtu4Lx/JM1zZWAAAh+QQJCgABACwAAAAAGAAYAAACHYwfAMjdqpxkcM2bLN68+w+G4kiW5omm6sq27jsWADs=">
    </div>
</div>
<iframe id="hideframe" name="hideframe" src="<?=$ret['URL']?>" frameborder="0" marginheight="0" marginwidth="0" width="100%" height="100%" allowtransparency="true" onload="document.getElementById('load_img').style='display:none'"></iframe>

</body>
</html>