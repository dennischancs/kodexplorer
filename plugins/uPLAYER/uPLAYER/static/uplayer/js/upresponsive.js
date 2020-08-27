/******************************************************************************/      
/* µPlayer Responsive Autoloader Plugin for µPlayer jQuery JavaScript Library */
/* http://www.uPlayer.org                                                     */
/*----------------------------------------------------------------------------*/
/* Copyright © 2015 CrazyLabz                                                 */
/* Licensed under the MIT license. (Only for non commercial purposes)         */
/*                                                                            */
/*----------------------------------------------------------------------------*/
/*                                                                            */
/* Author (µP): Dr.NCX.Cortex                                                 */ 
/* Version: 0.1.0 beta (under developing)                                     */
/* Date: 17th September 2015                                                  */
/*----------------------------------------------------------------------------*/
/* Requires  jQuery 1.7.0+                                                    */
/******************************************************************************/ 

  function findStringBetween(elem,bbTagStart,bbTagClose){
    var tag = bbTagStart;

    function impliedEndTag(tag){
        var impliedEnd = tag.replace(tag.substring(0,1),tag.substring(0,1) + '/');
        return impliedEnd;
    }

    var endTag = bbTagClose || impliedEndTag(tag);
    var divString = $(elem).text().trim();

    if (divString.indexOf(tag) != -1){
        var elemInfo = [];
        elemInfo.imgString = divString.substring(divString.indexOf(tag) + tag.length,divString.indexOf(endTag));
        elemInfo.text = divString.replace(tag + elemInfo.imgString + endTag, '');
        return elemInfo;
    }
    else {
        return false;
    }
  }

  function responsive_players(){
    var responsive_uPlayers=[];
    var tmp=0;
    var theInstructions=[];        
    var bodyText = $("body").html();

    //load uPlayer JS source from HTML and replace by HTML schema
    $('.up-responsive').each(
      function(){

        // BASE HTML SCHEMA OF uPlayer
        var uP_html_schema = '<div><div id="uP_container_'+tmp+'" class="uP-video uP-dark-green" role="application" aria-label="media player"><div class="uP-type-playlist"><div class="uP-media-wrapper">'+
          '<div class="uP-video-play"><div class="uP-title" aria-label="title">Core</div><span class="uP-centerer"></span><button class="uP-video-play-icon" role="button" tabindex="0">play</button>'+
          '<div class="uP-loading-icon"></div><div class="uP-volume-bar"><div class="uP-volume-bar-value"></div></div></div><div id="jquery_uPlayer_'+tmp+'" class="uP-uPlayer"><canvas class="uP_canvas_'+tmp+'"></canvas>'+
          '<img id="uP_poster_'+tmp+'" style=""><audio id="uP_audio_'+tmp+'" preload="metadata" title=""></audio><video id="uP_video_'+tmp+'" preload="metadata" style="" src="" title=""></video></div></div><div class="uP-gui">'+
          '<div class="uP-interface"><div class="uP-progress"><div class="uP-seek-bar"><div class="uP-play-bar"></div></div><div class="uP-current-time" role="timer" aria-label="time"></div>'+
          '<div class="uP-extratitle" aria-label="title"></div><div class="uP-duration" role="timer" aria-label="duration"></div></div><div class="uP-controls-holder"><div class="uP-controls"></div></div></div></div>'+
          '<div class="uP-playlist"><ul><li></li></ul></div></div></div></div>';


        var elemString = findStringBetween(this,"{{{","}}}");
        responsive_uPlayers[tmp]=elemString["imgString"];

        bodyText=bodyText.replace(responsive_uPlayers[tmp],"");
        bodyText=bodyText.replace("{{{}}}",uP_html_schema);
        
        tmp++;

      });

    $("body").html(bodyText);

    //execute uPlayer JS source from variable
    $(responsive_uPlayers).each(function(key, val){
      eval(val);
    });
  
  }

/******************************************************************************/
/*  Copyright © 2015 CrazyLabz                                                */
/******************************************************************************/