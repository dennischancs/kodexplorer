	<script type="text/javascript">
		var funcNull = function(){return false;}
		// document.oncopy	= funcNull;
		// document.oncontextmenu = funcNull;
		// document.ondragstart = funcNull;
		if(	!window.datas && 
			$('.excel-tab-title').length == 0){//没有目录
			//$('.navbar-inverse').css('opacity',0);
		}
		$(document).ready(function(){
			if($(".nav-collapse").length == 1){
				$('body').addClass("body-excle");
			}
		})
	</script>
	<div class='powerby'>yozo DCS</div>
</html>
