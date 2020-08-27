/******************************************************************************/      
/* µPlayer Visualization Plugin for µPlayer jQuery JavaScript Library         */
/* http://www.uPlayer.org                                                     */
/*----------------------------------------------------------------------------*/
/* Copyright © 2015 CrazyLabz                                                 */
/* Licensed under the CC license. (Only for non commercial purposes)          */
/*                                                                            */
/*----------------------------------------------------------------------------*/
/*                                                                            */
/* Author (µP): Dr.NCX.Cortex                                                 */ 
/* Version: 0.1.0 beta (under developing)                                     */
/* Date: 17th September 2015                                                  */
/*----------------------------------------------------------------------------*/
/* Requires  jQuery 1.7.0+                                                    */
/******************************************************************************/      



/******************************************************************************/
/**  uPlayer Visualization Autoloader                                        **/
/******************************************************************************/

var _uP_vis = [];
var _uP_cssSelectorAncestors=[];
var _uPlayers=[];
var _uP_visEnabled=[];

function upVis_loader() {

  //check all instances of uPlayer
  $('.uP-uPlayer').each(function(i,e) {
//------------------------------------------------------------------------------
    _uP_cssSelectorAncestors[i]="#"+$(e).parent().parent().parent().attr('id');
    _uPlayers[i]="#"+$(e).parent().find(".uP-uPlayer").attr('id');
    
    if (_uP_cssSelectorAncestors[i]!= "#undefined" && _uPlayers[i]!= "#undefined") {
      //instance recognized
      console.log("uP_vis detected uPlayer instance: " +  _uP_cssSelectorAncestors[i] + " | " + _uPlayers[i] );
    
      //continue when is ready current instance...
      //$(_uPlayers[i]).ready(function(){     
          
        //check if visualizations is enabled on this instance
        _uP_visEnabled[i]=$(_uPlayers[i]).uPlayer("option","useVisualizations"); 
        console.log("_uP_visEnabled: "+ _uP_visEnabled[i]);
        //console.log(_uP_visEnabled[i]);
    
        //continue when is allowed visualizations on this instance...
        if(_uP_visEnabled[i]==true) {

          //--------------------------------------------------------------------
          $(_uPlayers[i]).bind($.uPlayer.event.setmedia, function(event) {
            //connect uPlayer uP_visualization Bridge
            if (typeof _uP_vis[_uP_cssSelectorAncestors[i]] == "undefined") 
              _uP_vis[_uP_cssSelectorAncestors[i]] = new uP_VisBridge(event,$(_uPlayers[i]).data("uPlayer")._getPlaylistObject());
            else 
              _uP_vis[_uP_cssSelectorAncestors[i]].setmedia(event,$(_uPlayers[i]).data("uPlayer")._getPlaylistObject());  
          });
          //--------------------------------------------------------------------
          $(_uPlayers[i]).bind($.uPlayer.event.play, function(event) {
             //connect uPlayer play event
             if (typeof _uP_vis[_uP_cssSelectorAncestors[i]] != "undefined") 
             _uP_vis[_uP_cssSelectorAncestors[i]].play(event,$(_uPlayers[i]).data("uPlayer")._getPlaylistObject());
             else console.log("_uP_Vis play connector failed on: "+_uP_cssSelectorAncestors[i]);
          });
          //--------------------------------------------------------------------
          $(_uPlayers[i]).bind($.uPlayer.event.pause, function(event) {
             //connect uPlayer pause event
             if (typeof _uP_vis[_uP_cssSelectorAncestors[i]] != "undefined") 
            _uP_vis[_uP_cssSelectorAncestors[i]].pause(event,$(_uPlayers[i]).data("uPlayer")._getPlaylistObject());    
          });
          //--------------------------------------------------------------------
          $(_uPlayers[i]).bind($.uPlayer.event.seeked, function(event) {
             //connect uPlayer seek event
             if (typeof _uP_vis[_uP_cssSelectorAncestors[i]] != "undefined") 
            _uP_vis[_uP_cssSelectorAncestors[i]].seeked(event,$(_uPlayers[i]).data("uPlayer")._getPlaylistObject());    
          });
          //--------------------------------------------------------------------
          $(_uPlayers[i]).bind($.uPlayer.event.resize, function(event) {
             //connect resize event for Revolt visualizations
             if (typeof _uP_vis[_uP_cssSelectorAncestors[i]] != "undefined") 
            _uP_vis[_uP_cssSelectorAncestors[i]].resize(event,$(_uPlayers[i]).data("uPlayer")._getPlaylistObject());    
          
          });
          //--------------------------------------------------------------------
          $(_uPlayers[i]).bind($.uPlayer.event.ended, function(event) {
          });
          //--------------------------------------------------------------------
          $(_uPlayers[i]).bind($.uPlayer.event.click, function(event) {
          });
          //--------------------------------------------------------------------
          $(_uPlayers[i]).bind($.uPlayer.event.enterpage, function(event) {
            //event for reseting FPS measured value
            if (typeof _uP_vis[_uP_cssSelectorAncestors[i]] != "undefined")
            _uP_vis[_uP_cssSelectorAncestors[i]].enterpage(event,$(_uPlayers[i]).data("uPlayer")._getPlaylistObject()); 
          });
          
                                                    
          //now... all functions connected...
        } 
     // });
    } else {
       //instance unrecognized, return...
       console.log("uP_vis not detected uPlayer instance.");
    }

//------------------------------------------------------------------------------
  });
}


//execute when is document ready...
$(document).ready(function(){

  //automatical load uPlayer visualization extension...
  upVis_loader();

});




/******************************************************************************/
/**  uPlayer Visualization Bridge                                            **/
/******************************************************************************/

var uP_vis_html_avaliable= true;
var uP_vis_xhr_avaliable= false; 
var uP_vis_flash_avaliable= false;

(function($, undefined) {

	 uP_VisBridge = function(event,playlist,options) {        
      var self = this;
      
      //load visualization solutions if defined...
      if (event.uPlayer.options.visualizerSolution.length) this._options._uP_vis_solutions=event.uPlayer.options.visualizerSolution;
      
      //freeze player until ready...
      playlist.option("freezeModeOn", "#" + $(event.uPlayer.options.cssSelectorAncestor).find(".uP-uPlayer").attr("id")); // Set option

      //hide loading icon
      playlist.option("hideElementLoadIcon", "#" + $(event.uPlayer.options.cssSelectorAncestor).find(".uP-uPlayer").attr("id")); // Set option
      
      //first, we check what is supported by browser
      this.detector(event,playlist);
   }
   
   uP_VisBridge.prototype = {
  		_uPvisualizationID: null,
	  	_cssSelectorAncestor: null,
      _connector: null,
      _options: {

         _uP_vis_solutions: "html, flash, xhr"    //xhr could be unstable (limited by browser memory)
      },
      _uP_solution_num: null,
      _uP_solution: false,
      
      detector: function (event,playlist) {
         var self = this;
         if (detector()==false) {
            setTimeout(function () { self.detector(event,playlist); } ,100);
         } else {
//---Cortex FIX---------------------------------------------------------------//
            //if is used in uPlayer flash solution block html visualization solution
            if (event.uPlayer.flash.used==true ) {              //cortex fix update
               uP_vis_html_avaliable=false;
            }
//----------------------------------------------------------------------------//
            console.log("#uPVis# Detector Test Result: HTML = " + uP_vis_html_avaliable + " XHR = " + uP_vis_xhr_avaliable + " FLASH = " + uP_vis_flash_avaliable );
                 
            this.ready(event,playlist);
         }
      },

      ready: function(event,playlist) {
         var self = this;
         
         console.log("#uPVis# ready event Bridge on: " + event.uPlayer.options.cssSelectorAncestor);

         this._cssSelectorAncestor=event.uPlayer.options.cssSelectorAncestor;

//---Create canvas for visualizations-------------------------------------------
       this._instanceKeyNum=this._cssSelectorAncestor.match(/\d+/);
       
       this._uPvisualizationID="uP_vis_canvas_" + this._instanceKeyNum;

       $(this._cssSelectorAncestor).find(".uP-video-play").append('<canvas id="'+ this._uPvisualizationID +'" class="uP-vis-canvas"></canvas>');
//------------------------------------------------------------------------------
         
         //get ID of visualization element
         this._uPvisualization="#" + $(this._cssSelectorAncestor).find('.uP-video-play canvas.uP-vis-canvas').attr("id");

         //if is useVisualizations false, visualizations is disabled
         if (event.uPlayer.options.useVisualizations==true) {

            //show loading icon if is enabled
            if (event.uPlayer.options.allowLoadingIcon==true) $(this._cssSelectorAncestor).find('.uP-video-play .uP-loading-icon').css({'width':'50px', 'height':'50px', 'position':'absolute', 'z-index':'1010'});
            else $(this._cssSelectorAncestor).find('.uP-video-play .uP-loading-icon').css({'width':'0px', 'height':'0px', 'position':'absolute', 'z-index':'1000'});    

            //if array then join ... later optimize this code...
            if (this._options._uP_vis_solutions.constructor === Array) this._options._uP_vis_solutions=this._options._uP_vis_solutions.join();
            
            //remove space
            this._options._uP_vis_solutions = this._options._uP_vis_solutions.replace(/\s/g, ''); 
            //make string lower
            this._options._uP_vis_solutions = this._options._uP_vis_solutions.toLowerCase();
            //make array...
            this._options._uP_vis_solutions =  this._options._uP_vis_solutions.split(",");

            this._uP_solution_num=0;
            this._uP_solution=false;
         
            while (this._uP_solution==false && this._uP_solution_num<this._options._uP_vis_solutions.length) {
               
  		         switch(this._options._uP_vis_solutions[this._uP_solution_num]) {
				          case "html":
                    //INITIALIZATION OF HTML5
                    if (uP_vis_html_avaliable) { this._connector=new uPlayerVisualizations(event,playlist); this._uP_solution="html" }
					          break;
				        /*  case "xhr":
                    //INITIALIZATION OF XHR
      	 				    if (uP_vis_xhr_avaliable) { this._connector=new uPlayerXHRVis(event,playlist); this._uP_solution="xhr" }
	      	 			    break;
			   	        case "flash":
                    //INITIALIZATION OF FLASH:
				      	    if (uP_vis_flash_avaliable) { this._connector=new uPlayerRevoltVis(event,playlist); this._uP_solution="flash" }
					          break;*/
                  default:
                     //IF NOTHING DEFINED TRY HTML5
                    if (uP_vis_html_avaliable) { this._connector=new uPlayerVisualizations(event,playlist); this._uP_solution="html" }
	    				      break;
               }
               this._uP_solution_num++;
            }
         
            // Visualization is loaded call setmedia function... 
            this.setmedia(event,playlist);

         } else {
            //visualizations are not enabled..so: 
            
            //unfreeze player
            playlist.option("freezeModeOff", "#" + $(event.uPlayer.options.cssSelectorAncestor).find(".uP-uPlayer").attr("id")); // Set option
            
            //no visualizations support :(
         }
         
      },
      setmedia: function(event,playlist) {
         console.log("#uPVis# setmedia event Bridge on: " + event.uPlayer.options.cssSelectorAncestor);

         if (this._connector != null)
         this._connector.setmedia(event,playlist);
      },
      play: function(event,playlist) {
         console.log("#uPVis# play event Bridge on: " + event.uPlayer.options.cssSelectorAncestor);

         if (this._connector != null)
         this._connector.play(event,playlist);

         //hide TV noise on play call
         playlist.option("hideElementTvNoise", "#" + $(this._cssSelectorAncestor).find(".uP-uPlayer").attr("id")); // Set uPlayer to Simulation Mode
      },
      pause: function(event,playlist) {
         console.log("#uPVis# pause event Bridge on: " + event.uPlayer.options.cssSelectorAncestor);

         if (this._connector != null)
         this._connector.pause(event,playlist);
      },
      seeked: function(event,playlist) {
         console.log("#uPVis# seeked event Bridge on: " + event.uPlayer.options.cssSelectorAncestor);

         if (this._connector != null)
         this._connector.seeked(event,playlist);
      },
      resize: function(event,playlist) {
         console.log("#uPVis# resize event Bridge on: " + event.uPlayer.options.cssSelectorAncestor);

         //flash resize require remap size call function
         if (this._connector != null && this._uP_solution=="flash")
         this._connector.resize(event,playlist);
      },
      enterpage: function(event,playlist) {
         if (this._connector != null && (this._uP_solution=="html" || this._uP_solution=="xhr") )
         this._connector._resetFPS(event,playlist);
      },
//this function calling flash when is loaded...###############################//
      readyFlash: function(cssSelectorAncestor) {
         //if (this._connector != null)
         this._connector.readyFlash(cssSelectorAncestor);
      },      
//this function calling XHR loader when is loaded...##########################//
      readyXHR: function(cssSelectorAncestor,bufferList) {
         if (this._connector != null)
         this._connector.readyXHR(cssSelectorAncestor,bufferList);
      }      
//############################################################################//
   }
})(jQuery);
/******************************************************************************/


/******************************************************************************/
/**  Visualization Compatibility tests for uPlayer                           **/
/******************************************************************************/
 

var CMP_animationFrame;
var CMP_testAnalyser;
var CMP_testAudio;
var CMP_testFrames=0;

var vis_html_test_running=false;
var vis_html_avaliable=false;

var sampleAudioPath="../media/samplewhite.mp3";

function __html5ResponseCheck(first) {

   if (typeof first == "undefined") {
      if (vis_html_test_running==true) return null;
      else if (vis_html_avaliable==false) return false;
      else if (vis_html_avaliable==true) return true;
      else return "error";
   } else if (first==true) {
     try {
         CMP_testAudio = new Audio();
    
         //load and play test sample audio file for compatibility check output of createMediaElementSource 
         CMP_testAudio.src = '../media/samplewhite.mp3';

         //sampleAudioPath=event.uPlayer.options.sampleAudioPath;

         CMP_testAudio.src = sampleAudioPath;
         
         CMP_testAudio.controls = false;
         CMP_testAudio.autoplay = true;
         document.body.appendChild(CMP_testAudio);

         var audioContext = window.AudioContext ? new window.AudioContext() :
            window.webkitAudioContext ? new window.webkitAudioContext() :
            window.mozAudioContext ? new window.mozAudioContext() :
            window.oAudioContext ? new window.oAudioContext() :
            window.msAudioContext ? new window.msAudioContext() :
            undefined;    
    
         //var CMP_context = new AudioContext();
         CMP_context=audioContext;
   
         CMP_testAnalyser = CMP_context.createAnalyser();

         var source = CMP_context.createMediaElementSource(CMP_testAudio);
         source.connect(CMP_testAnalyser);
         CMP_testAnalyser.connect(CMP_context.destination);
         vis_html_test_running=true;
         CMP_animationFrame=requestAnimationFrame(___testAnimationFrame);
         return null;


      } catch(e) {
         console.log(e);
         
         vis_html_test_running=false;
         return "error";
      } finally { }
        
   } else if (first==false) {
     
      cancelAnimationFrame(CMP_animationFrame);
      //finalize test
      CMP_testAudio.pause();
      CMP_testAudio.remove();
      
            
   }
}


function ___testAnimationFrame() {
   var checkvisualizationArray = new Uint8Array(CMP_testAnalyser.frequencyBinCount);
   CMP_testAnalyser.getByteFrequencyData(checkvisualizationArray);

   //check if is values present
   $.each(checkvisualizationArray, function(index, value) { 
      if (value>0 && vis_html_avaliable==false) { vis_html_avaliable=true; } 
   });

   console.log(CMP_testFrames);
   
   CMP_testFrames++;
        
   //quit when XHR is not required or when test timeup
   if (CMP_testFrames<32 && vis_html_test_running==true && vis_html_avaliable==false) requestAnimationFrame(___testAnimationFrame);
   else { vis_html_test_running=false; __html5ResponseCheck(false); } 
}
//----------------------------------------------------------------------------//
function __FlashSupport() {
   var hasFlash = false;
   try {
      hasFlash = Boolean(new ActiveXObject('ShockwaveFlash.ShockwaveFlash'));
   } catch(exception) {
      hasFlash = ('undefined' != typeof navigator.mimeTypes['application/x-shockwave-flash']);
   }
   return hasFlash;
}
//----------------------------------------------------------------------------//
function __xhrResponseTypeSupport() {
   var xhr = new XMLHttpRequest;
   xhr.open('get', '/', true);
   if ( 'responseType' in xhr ) {
      xhr.responseType = 'json';
      if ( xhr.responseType == 'json' ) {
         return true;
      }
   }
   return false;
}
//----------------------------------------------------------------------------//
var detector_inited=false;
function detector() {
   /*                                 //DETEKCIA ODSTAVENA
   if (detector_inited==false) { 
      detector_inited=true;
  
      var test_result= __html5ResponseCheck(true);
      
      if (test_result==true || test_result==false || test_result=="error") {
        
        if (test_result==true) uP_vis_html_avaliable=true;
        else uP_vis_html_avaliable=false; 
        if (__xhrResponseTypeSupport()==true) uP_vis_xhr_avaliable=true;
        else uP_vis_xhr_avaliable=false; 
        if (__FlashSupport()==true) uP_vis_flash_avaliable=true;
        else uP_vis_flash_avaliable=false;
        
        return true;  //detector test finished = true
      } else if (test_result==null) return false;  //detector test finished = false
   } else  {
      var test_result= __html5ResponseCheck();

      if (test_result==true || test_result==false || test_result=="error") {
        if (test_result==true) uP_vis_html_avaliable=true;
        else uP_vis_html_avaliable=false; 
        if (__xhrResponseTypeSupport()==true) uP_vis_xhr_avaliable=true;
        else uP_vis_xhr_avaliable=false; 
        if (__FlashSupport()==true) uP_vis_flash_avaliable=true;
        else uP_vis_flash_avaliable=false; 
     
        return true; //detector test finished = true
      }
      return false; //detector test finished = false
   } */
   uP_vis_html_avaliable=true;
   return true; //detector test finished = true
}
/******************************************************************************/



/******************************************************************************/
/**  Revolt flash visualizations support for uPlayer                         **/
/******************************************************************************/
/*############################################################################*/
/*#  function called from REVOLT flash                                       #*/
/*############################################################################*/
  function revoltOnLoaded(check){
     console.log("Flash ID:" + check + " ...was LOADED!");
     var obj=document.getElementById(check); 
     console.log("CSS ANCESTOR ID:" + $(obj).parent().parent().parent().parent().attr("id") + " ...was LOADED!");
     var obj=document.getElementById(check); 
     _uP_vis["#"+$(obj).parent().parent().parent().parent().attr("id")].readyFlash($(obj).parent().parent().parent().parent().attr("id"));
  }
/*############################################################################*/
/*#                                                                          #*/
/*############################################################################*/
//----------------------------------------------------------------------------//
(function($, undefined) {

 	 uPlayerRevoltVis = function(event,playlist) {

      this.init(event,playlist);
   }

   uPlayerRevoltVis.prototype = {
  		_uPvisualization: null,
	  	_cssSelectorAncestor: null,   
      _swfPathRevolt: "../swf/revolt.swf",
      _connector: null,
      _options: {
          FLASH_WIDTH: [],
          FLASH_HEIGHT: []
      },
      _status: {
         flashReady: [],
         flashConnector: [],
         mediaSetting: [],
         mediaReady: [],
         mediaReload: [],
         
         mediaVideo: [],
         
         LASTMEDIASET: []
      },
      __createIeObject: function (url){
         var div = document.createElement("div");
         div.innerHTML = "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'><param name='movie' value='" +url + "'></object>";
         return div.firstChild;
      },          
      init: function(event,playlist) {
         var self=this;

         
         if (event.uPlayer.options.swfPathRevolt.length) this._swfPathRevolt=event.uPlayer.options.swfPathRevolt;
         
         
         this._cssSelectorAncestor=event.uPlayer.options.cssSelectorAncestor;
         this._uPvisualization="#" + $(this._cssSelectorAncestor).find('canvas.uP-vis-canvas').attr("id");
         this.__uPvisualization=$(this._cssSelectorAncestor).find('canvas.uP-vis-canvas').attr("id");
         this._options.FLASH_WIDTH[this.__uPvisualization] = event.uPlayer.status.width.replace('px','');
         this._options.FLASH_HEIGHT[this.__uPvisualization] = event.uPlayer.status.height.replace('px','');

         console.log(this._uPvisualization + " | " + this.__uPvisualization);

         this._status.flashReady[this.__uPvisualization]=false;
         this._status.flashConnector[this.__uPvisualization]=false;
         this._status.mediaSetting[this.__uPvisualization]=false;
         this._status.mediaReady[this.__uPvisualization]=false;
         this._status.mediaReload[this.__uPvisualization]=false;
         
         this._status.mediaVideo[this.__uPvisualization]=false;

     
         //get version of IE
         var ie = (function(){
           var undef,
             v = 3,
             div = document.createElement('div'),
             all = div.getElementsByTagName('i');
           while (
             div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
             all[0]
           );
           return v > 4 ? v : undef;
         }());
        
         try {
//---Rebuild by Cortex----------------------------------------------------------            
        var target_element = document.getElementById(this.__uPvisualization);
				var htmlObj, flashVars = 'jQuery=' + encodeURI(event.uPlayer.options.noConflict) + '&id=' + encodeURI(this.__uPvisualization);


				// Code influenced by SWFObject 2.2: http://code.google.com/p/swfobject/
				// Non IE browsers have an initial Flash size of 1 by 1 otherwise the wmode affected the Flash ready event. 


				if(ie < 9) {
					var objStr = '<object id="' + this.__uPvisualization + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="0" height="0" tabindex="-1"></object>';

					var paramStr = [
						'<param name="movie" value="' + this._swfPathRevolt + '" />',
						'<param name="FlashVars" value="' + flashVars + '" />',
						'<param name="allowScriptAccess" value="always" />',
						'<param name="bgcolor" value="#000000" />',
						'<param name="wmode" value="' + "transparent" + '" />'
					];

					htmlObj = document.createElement(objStr);
  
					for(var i=0; i < paramStr.length; i++) {
						htmlObj.appendChild(document.createElement(paramStr[i]));
					}
				} else {
					var createParam = function(el, n, v) {
						var p = document.createElement("param");
						p.setAttribute("name", n);	
						p.setAttribute("value", v);
						el.appendChild(p);
					};

					htmlObj = document.createElement("object");
					htmlObj.setAttribute("id", this.__uPvisualization);
          
					htmlObj.setAttribute("name", this.__uPvisualization);
					htmlObj.setAttribute("data", this._swfPathRevolt);
					htmlObj.setAttribute("type", "application/x-shockwave-flash");
					htmlObj.setAttribute("width", "1"); // Non-zero
					htmlObj.setAttribute("height", "1"); // Non-zero

					htmlObj.setAttribute("tabindex", "-1");
					createParam(htmlObj, "flashvars", flashVars);
					createParam(htmlObj, "allowscriptaccess", "always");
					createParam(htmlObj, "bgcolor", "#000000");
					createParam(htmlObj, "wmode","transparent");
				}

        target_element.parentNode.replaceChild(htmlObj, target_element);
                                                                                  
//------------------------------------------------------------------------------            
            
         } catch(e) {
           console.log("#uPVis#REVOLT# OBJECT INIT ERROR: " + e);
            
         } finally {
            playlist.option("simulationModeOn", "#" + $(this._cssSelectorAncestor).find(".uP-uPlayer").attr("id")); // Set option
            playlist.option("freezeModeOff", "#" + $(this._cssSelectorAncestor).find(".uP-uPlayer").attr("id")); // Set option

            playlist.option("hideElementLoadIcon", "#" + $(this._cssSelectorAncestor).find(".uP-uPlayer").attr("id")); // Set option


            console.log("#uPVis#REVOLT# OBJECT INIT SUCCESS: " + " (simulationMODE activated, freezeMode deactivated.)");

         }
      },
      readyFlash: function(cssSelectorAncestor){

        console.log("#uPVis#REVOLT# readyFlash EVENT: " + cssSelectorAncestor + " ");
                                                                        
         var self = this;
         var __uPvisualization=$("#" + cssSelectorAncestor).find('.uP-video-play object').attr("id");
         if (typeof __uPvisualization== "undefined") __uPvisualization=$(__cssSelectorAncestor).find('.uP-video-play object embed').attr("id");



         //Security controll comparation of elemental variables
         if (this._uPvisualization=="#" + __uPvisualization) {
         
            if (this._status.flashReady[__uPvisualization]==false) this._status.flashReady[__uPvisualization]=true;
            if (this._status.flashReady[__uPvisualization]==true && this._status.flashConnector[__uPvisualization]==false) {
               this._connector = document.getElementById(this._uPvisualization.replace('#','')); 

            ///console.log("================>"+this._connector+" | on: "+ this._uPvisualization.replace('#',''));

               if (typeof this._connector == "undefined" ) {
                  this._status.flashConnector[__uPvisualization]=false;
                  setTimeout(function(){ self.readyFlash(cssSelectorAncestor); }, 200 );
               } else this._status.flashConnector[__uPvisualization]=true;
            }
         }
      },                                                            
      setmedia: function(event,playlist) {
        console.log("#uPVis#REVOLT# setmedia EVENT: " + event.uPlayer.options.cssSelectorAncestor + " ");
        
        //alert(event.uPlayer.status.__RTMP_solution);
         ///alert("Revolt setmedia");
         
         var self=this;
         var __cssSelectorAncestor=event.uPlayer.options.cssSelectorAncestor;
         var __uPvisualization=$(__cssSelectorAncestor).find('.uP-video-play object').attr("id");
         if (typeof __uPvisualization== "undefined") __uPvisualization=$(__cssSelectorAncestor).find('.uP-video-play object embed').attr("id");

            ///console.log("================>"+this._connector);


         //Security controll comparation of elemental variables
         if (this._uPvisualization=="#" + __uPvisualization) {

            if (event.uPlayer.status.video==true || event.uPlayer.status.__RTMP_solution==true) {
               this._status.mediaReload[__uPvisualization]=false;
               ////this._status.flashConnector[__uPvisualization]=false;
               this._connector.stop()

               
               playlist.option("simulationModeOff", "#" + $(this._cssSelectorAncestor).find(".uP-uPlayer").attr("id")); // Set option
               
               this._status.mediaVideo[__uPvisualization]=true;

               
            } else {     

               playlist.option("simulationModeOn", "#" + $(this._cssSelectorAncestor).find(".uP-uPlayer").attr("id")); // Set option

               this._status.mediaVideo[__uPvisualization]=false;
            
               var media=event.uPlayer.status.actualRelativeUrlMedia;
               
               if (this._status.flashReady[__uPvisualization]==false) {
                  console.log("#uPVis#REVOLT# setmedia SUBEVENT " + this._uPvisualization + " + " + __uPvisualization + ": required flash is not ready...");
                  this._status.mediaSetting[__uPvisualization]=false;
                  setTimeout(function(){ self.setmedia(event,playlist); }, 200 );
               } 
               else if (this._status.flashConnector[__uPvisualization]==false) {
                  console.log("#uPVis#REVOLT# setmedia SUBEVENT " + __uPvisualization + ": required connector is not ready...");

                  setTimeout(function(){ self.setmedia(event,playlist); }, 200 );
               }
               else if (this._status.flashConnector[__uPvisualization]==true ) {
                  //console.log(__uPvisualization + ": TIME TO SET MEDIA...");
                  console.log("#uPVis#REVOLT# setmedia SUBEVENT " + this._uPvisualization + " + " + __uPvisualization + ":  TIME TO SET MEDIA..." + this._status.flashReady[__uPvisualization] + " " + this._status.flashConnector[__uPvisualization] );
               
                  this._connector = document.getElementById(this._uPvisualization.replace('#','')); 
                  if (this._status.mediaReload[__uPvisualization]==true) this._connector.closeMedia();
                  else this._status.mediaReload[__uPvisualization]=true;
                  
                  // update stored sizes by parent size
                  this._options.FLASH_WIDTH[__uPvisualization]=$(this._cssSelectorAncestor).find('.uP-video-play').width();
                  this._options.FLASH_HEIGHT[__uPvisualization]=$(this._cssSelectorAncestor).find('.uP-video-play').height();
                  
                  // Revolt set media and flash width and height
                  this._connector.revoltSetMedia(media,this._options.FLASH_WIDTH[__uPvisualization],this._options.FLASH_HEIGHT[__uPvisualization]);
                  
                  this._connector.stop()
               } 
            }
         } else setTimeout(function(){ self.setmedia(event,playlist); }, 200 ); 
      },
      play: function(event,playlist) {
        console.log("#uPVis#REVOLT# play EVENT: " + event.uPlayer.options.cssSelectorAncestor + " ");
         var self=this;

         // if is Video or RTMP stream present then stop Revolt
         if (event.uPlayer.status.video==true || event.uPlayer.status.__RTMP_solution==true) {
            this._connector.stop();
         } else {
            
            playlist.option("showElementVis", "#" + $(this._cssSelectorAncestor).find(".uP-uPlayer").attr("id"));

            this._connector.play();
         }   
      },
      pause: function(event,playlist) {
        console.log("#uPVis#REVOLT# pause EVENT: " + event.uPlayer.options.cssSelectorAncestor + " ");
         
         if (event.uPlayer.status.video==true || event.uPlayer.status.__RTMP_solution==true) {
             this._connector.stop();
         } else {

            if (event.uPlayer.status.currentTime > 0) this._connector.pause();
            else this._connector.stop();
         }        
      },
      __toMinuteAndSecond: function (sec) {
         mins = Math.floor(sec/60);
         secs = Math.floor(sec%60);
         var calc = ((mins>0) ? ((mins>9) ? mins : '0'+mins) + ":" : "00:"); 
         calc += (secs>9 || mins == 0) ? secs : '0'+secs;
         return calc;
      },
      resize: function(event,playlist) {
        console.log("#uPVis#REVOLT# resize EVENT: " + event.uPlayer.options.cssSelectorAncestor + " ");

        //must reset media for new Revolt visualization size
        this.setmedia(event,playlist);
        this.play(event,playlist);
        this.seeked(event,playlist);
      }, 
      seeked: function(event,playlist) {
        console.log("#uPVis#REVOLT# seeked EVENT: " + event.uPlayer.options.cssSelectorAncestor + " ");
         var self=this;
         
         if (event.uPlayer.status.video==true || event.uPlayer.status.__RTMP_solution==true) {
            //do nothing its RTMP or video
         } else {
            if (event.uPlayer.status.currentTime>0) this._connector.seek(self.__toMinuteAndSecond(event.uPlayer.status.currentTime));
            if (event.uPlayer.status.paused==true) this.pause(event,playlist);
         }        

      }
  
   }
})(jQuery);
  

/******************************************************************************/
/**  XMLHttpRequest Loader Core Solution                                     **/
/******************************************************************************/
(function($, undefined) {

   BufferLoader = function(id, context, urlList, callback) {
      this.id = id;
      this.context = context;
      this.urlList = urlList;
      this.onload = callback;
      this.bufferList = new Array();
      this.loadCount = 0;
   }

/*----------------------------------------------------------------------------*/

   BufferLoader.prototype.loadBuffer = function(url, index) {
     // Load buffer asynchronously
     var request = new XMLHttpRequest();
     request.open("GET", url, true);
     request.responseType = "arraybuffer";

     var loader = this;

     request.onload = function() {
        
       try {  
          // Asynchronously decode the audio file data in request.response
          loader.context.decodeAudioData(
             request.response,
             function(buffer) {
                if (!buffer) {
                    //alert('error decoding file data: ' + url);
                    
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length)
                    loader.onload(loader.bufferList,loader.id);
            }    
        );
      } catch(e) {
        //XHR decodeAudioData error...
        ///alert('decodeAudioData: XHR error');
      } finally {
        //nothing needed now....
      }  
        
    }

    request.onerror = function() {
        //alert('BufferLoader: XHR error');
    }

    request.send();
}

/*----------------------------------------------------------------------------*/

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
}

})(jQuery);
/******************************************************************************/



/******************************************************************************/
/**  XMLHttpRequest support for uPlayer and Visualizations (XHR bridge)      **/
/******************************************************************************/
/*############################################################################*/
/*#  function called from XHR                                                #*/
/*############################################################################*/
  function XHROnLoaded(bufferList,check){
     //var obj=check.replace('#','');
     var obj=check; 
     console.log("XHR ancestor ID:" + obj + " ...was LOADED!");
     ///uP_Vis[obj].readyXHR(obj,bufferList);
     _uP_vis[obj].readyXHR(obj.replace('#',''),bufferList);
  }
/*############################################################################*/
/*#                                                                          #*/
/*############################################################################*/
//----------------------------------------------------------------------------//

(function($, undefined) {

   uPlayerXHRVis = function(event,playlist,options) {
      
      this.init(event,playlist);
     
   }

   uPlayerXHRVis.prototype = {
  		_uPvisualization: null,
	  	_cssSelectorAncestor: null,   
      _XHR_visual: null,
      _XHR_visual_connected: null,
      _XHR_context: null,
      _XHR_bufferLoader: null,
      _XHR_source: null,
      _XHR_bufferList: null,

      _XHR_firstInit: true,
      _visual_connector: null,
      
      _nullAudioPath: "../sample/null.wav",
      
      _playlist: null,
      
      __XHR_build_playlist: function(_playlist,first_Url,first_isAudio) {  //first_url must be relative for Android tablet chrome compatibility
         var XHR_solution_avaliable=new Array();
         var _XHR_playlist=new Array();

         for (var tmp=0;tmp<_playlist.playlist.length;tmp++) {
            if (tmp==0 && first_isAudio==true) {
               _XHR_playlist[tmp]=first_Url;
               XHR_solution_avaliable[tmp]=true;
            } else if (tmp==0 && first_isAudio==false) {
            
               ///_XHR_playlist[tmp]="../sample/null.wav";  //skip this track set null.mp3
               _XHR_playlist[tmp]= this._nullAudioPath;
                XHR_solution_avaliable[tmp]=false;
            } else {       

               if (typeof _playlist.playlist[tmp]["mp3"] !== 'undefined') {
                  _XHR_playlist[tmp]=_playlist.playlist[tmp]["mp3"];
                  XHR_solution_avaliable[tmp]=true;
               } else if (typeof _playlist.playlist[tmp]["m4a"] !== 'undefined') {
                  _XHR_playlist[tmp]=_playlist.playlist[tmp]["m4a"];
                  XHR_solution_avaliable[tmp]=true;
               } else if (typeof _playlist.playlist[tmp]["m3u8a"] !== 'undefined') {
                  _XR_playlist[tmp]=_playlist.playlist[tmp]["m3u8a"];
                  XHR_solution_avaliable[tmp]=true;
               } else if (typeof _playlist.playlist[tmp]["m3ua"] !== 'undefined') {
                  _XHR_playlist[tmp]=_playlist.playlist[tmp]["m3ua"];
                  XHR_solution_avaliable[tmp]=true;
               } else if (typeof _playlist.playlist[tmp]["flac"] !== 'undefined') {
                  _XHR_playlist[tmp]=_playlist.playlist[tmp]["flac"];
                  XHR_solution_avaliable[tmp]=true;
               } else if (typeof _playlist.playlist[tmp]["wav"] !== 'undefined') {
                  _XHR_playlist[tmp]=_playlist.playlist[tmp]["wav"];
                  XHR_solution_avaliable[tmp]=true;
               } else if (typeof _playlist.playlist[tmp]["webma"] !== 'undefined') {
                  _XHR_playlist[tmp]=_playlist.playlist[tmp]["webma"];
                  XHR_solution_avaliable[tmp]=true;
               } else if (typeof _playlist.playlist[tmp]["fla"] !== 'undefined') {
                  _XHR_playlist[tmp]=_playlist.playlist[tmp]["fla"];
                  XHR_solution_avaliable[tmp]=true;
               } else {
                  _XHR_playlist[tmp]=this._nullAudioPath;  //skip this track 
                  XHR_solution_avaliable[tmp]=false;
               }
            }
         } 
         //console.log(_XHR_playlist);
         return(_XHR_playlist);
      },
      init: function(event,playlist) {

         this._playlist=playlist;

         this._cssSelectorAncestor=event.uPlayer.options.cssSelectorAncestor;
         
         // turn on simulation mode
         playlist.option("simulationModeOn", "#" + $(this._cssSelectorAncestor).find(".uP-uPlayer").attr("id")); // Set uPlayer to Simulation Mode

         //show load icon and hide tvnoise if present
         playlist.option("hideElementTvNoise", "#" + $(this._cssSelectorAncestor).find(".uP-uPlayer").attr("id")); // Set option
         playlist.option("showElementLoadIcon", "#" + $(this._cssSelectorAncestor).find(".uP-uPlayer").attr("id")); // Set option

         this._nullAudioPath=event.uPlayer.options.sampleNullAudioPath;

         if (event.uPlayer.status.video==false) var is_firstAudio=true; else var is_firstAudio=false;
     
         this._XHR_playlist = this.__XHR_build_playlist(playlist,event.uPlayer.status.actualRelativeUrlMedia,is_firstAudio);

         var audioContext = window.AudioContext ? new window.AudioContext() :
            window.webkitAudioContext ? new window.webkitAudioContext() :
            window.mozAudioContext ? new window.mozAudioContext() :
            window.oAudioContext ? new window.oAudioContext() :
            window.msAudioContext ? new window.msAudioContext() :
            undefined;    
         this._XHR_context=audioContext;
         this._XHR_bufferLoader = new BufferLoader(
            this._cssSelectorAncestor,
            this._XHR_context,
            this._XHR_playlist,
            XHROnLoaded
         );
         this._XHR_bufferLoader.load();


      },
      //call when XHR loading is successful
      readyXHR: function(check,bufferList) {
         this._XHR_bufferList = bufferList;

         //hide load icon 
         this._playlist.option("hideElementLoadIcon", "#" + $("#" + check).find(".uP-uPlayer").attr("id")); // Set option

         //allow controls and disable playlist remove elements...
         this._playlist.option("freezeModeOff", "#" + $("#" + check).find(".uP-uPlayer").attr("id")); // Set option
         this._playlist.option("enableRemoveControls", false); // Set option
      },
      
      setmedia: function(event,playlist) {
         //nothing to do...
      },
      play: function(event,playlist) {
         var self = this;

         if (this._XHR_firstInit==true) {
         } else {
            if (typeof this._XHR_source !== 'undefined') 
            this._XHR_source.stop(0);
         }

         if (typeof this._XHR_bufferList !== 'undefined') {
            this._XHR_source = this._XHR_context.createBufferSource();
            this._XHR_source.buffer = this._XHR_bufferList[playlist.current];
            this._XHR_source.connect(this._XHR_context.destination);
            this._XHR_source.start(0,event.uPlayer.status.currentTime);
         }

         if (this._XHR_firstInit==true) {
            this._XHR_firstInit=false;
            this._visual_connector = new uPlayerVisualizations(event,playlist); this._visual_connector._XHR_ConnectVis(self._XHR_context,self._XHR_source);
         } else {    
            this._visual_connector._XHR_ReConnectVis(self._XHR_context,self._XHR_source);
         }   
         
      },
      pause: function(event,playlist) {
         if (typeof this._XHR_source !== 'undefined') {
             this._XHR_source.stop(0);
         }
      },
      seeked: function(event,playlist) {
         if (event.uPlayer.status.currentTime>0)  this.play(event,playlist);
         if (event.uPlayer.status.paused==true) this.pause(event,playlist);
      },
      _resetFPS: function(event,playlist) {
         if (this._visual_connector!=null) this._visual_connector._resetFPS();
      }
   }
})(jQuery);
/******************************************************************************/









/******************************************************************************/
/**  CANVAS HTML5 & XHR solutions visualizations support for uPlayer         **/
/******************************************************************************/
   
(function($, undefined) {

  //uPlayer visualizations library
	uPlayerVisualizations = function(event,playlist,options) {
     var self = this;

     this.event = event;
     this.event = $.extend(true, {}, this.event, event); 

     //get options from uPlayer
     this._options.visualizationOptions.SHOW_FPS=event.uPlayer.options.showFpsVisualizations;
     this._options.visualizationOptions.MAX_FPS=event.uPlayer.options.maxFpsVisualizations;
     this._options.visualizationOptions.RANDOMIZE_VIS=event.uPlayer.options.radomizeVisualizations;
     this._options.visualizationOptions.RANDOM_VIS_TIMESWITCH=event.uPlayer.options.radomizeTimeVisualizations;
     this._options.visualizationOptions.DEFAULT_BGCOLOR=event.uPlayer.options.bgColorVisualizations;
     this._options.visualizationOptions.LINE_WIDTH=event.uPlayer.options.lineWidthVisualizations;

     this.MAX_FPS = this._options.visualizationOptions.MAX_FPS;
     this.NOW = 0;
     this.THEN = Date.now();;
     this.INTERVAL = 1000/this.MAX_FPS;
     this.DELTA = 0;
     this.COUNTER = 0;
     this.FIRST = this.THEN;
     this.TIME_EL = (this.THEN - this.FIRST)/1000;
     this.ACTUAL_FPS = Math.round(this.COUNTER/this.TIME_EL * 10) / 10;
     
     var capYPositionArray = [];
     var visualizationArray = [];
     this.capYPositionArray = [];
     this.cssSelectorAncestor = event.uPlayer.options.cssSelectorAncestor;
   

   
     try {

        this._HTML_init(event,playlist);
        this._renderFrame();
        playlist.option("freezeModeOff", "#" + $(event.uPlayer.options.cssSelectorAncestor).find(".uP-uPlayer").attr("id")); // Set option
     
     } catch (e) {
     
        //throw new Error('The Web Audio API is unavailable. Info:' + e);
        // No Web Audio API browser support
        console.log('The Web Audio API is unavailable. Info:  ' + e);

     } finally {

        //hide NO SUPPORT information span 
        //$(self.cssSelectorAncestor).find('.uP-visualization span').hide();  
     
        $(self.cssSelectorAncestor).find('.uP-visualization_switch').click(function() { 
           self._switch();
        });

     }
  }

/******************************************************************************/

  uPlayerVisualizations.prototype = {
     _cssSelectorAncestor: "#uP_container_1",
     _audio: {    //Element Audio Source
        obj: null,
        audioSrc: null
     },
     _canvas: {   //Canvas for Visualizations
        obj:null,
        ctx: null,
        analyser: null,        
        frequencyData: null
     },     
     _buffer: {   //buffer for XHR Solution
        
     },
     _options: {
        visualizationOptions: {
				   CANVAS_WIDTH: 190,
				   CANVAS_HEIGHT: 106,
           LINE_WIDTH: 1,
           MAX_FPS: 20,
           SHOW_FPS: true,
           RANDOMIZE_VIS: true,
           RANDOM_VIS_TIMESWITCH: 20000,
           DEFAULT_BGCOLOR: "rgba(0,0,0,1)"
			  }  	
     },
     _uPvis_mode: 1,
     
     setmedia: function() {
       //nothing to do
     },
     play: function() {
       //nothing to do
       this._randomswitch(); //switch visualisation on play event
     },
     pause: function() {
       //nothing to do
     },
     seeked: function() {
       //nothing to do
     },
/*----------------------------------------------------------------------------*/
     _resetFPS: function () {
       
       //reset values to default
       this.MAX_FPS = this._options.visualizationOptions.MAX_FPS;
       this.NOW = 0;
       this.THEN = Date.now();
       this.INTERVAL = 1000/this.MAX_FPS;
       this.DELTA = 0;
       this.COUNTER = 0;
       this.FIRST = this.THEN;
 
       this.TIME_EL = (this.THEN - this.FIRST)/1000;
       this.ACTUAL_FPS = parseInt(this.COUNTER/this.TIME_EL);
    
     },
/*----------------------------------------------------------------------------*/
     
     _XHR_ReConnectVis: function(context,source) {
        var self = this;

        cancelAnimationFrame(self._renderFrame);

        this._canvas.obj = document.getElementById($(self.cssSelectorAncestor).find('.uP-video-play canvas.uP-vis-canvas').attr("id"));
        
        this._canvas.ctx = context;
        this._audio.audioSrc = source;

        this._canvas.analyser = this._canvas.ctx.createAnalyser();
    
        // we have to connect the MediaElementSource with the analyser 
        this._audio.audioSrc.connect(self._canvas.analyser);
        this._canvas.analyser.connect(self._canvas.ctx.destination);

        this._options.visualizationOptions.CANVAS_WIDTH = this._canvas.obj.width;
        this._options.visualizationOptions.CANVAS_HEIGHT = this._canvas.obj.height;
        this._canvas.ctx = this._canvas.obj.getContext('2d');

        this._canvas.ctx.fillStyle = this._options.visualizationOptions.DEFAULT_BGCOLOR;
        this._canvas.ctx.fillRect(0, 0, this._options.visualizationOptions.CANVAS_WIDTH, this._options.visualizationOptions.CANVAS_HEIGHT);

       // if (this._options.visualizationOptions.RANDOMIZE_VIS==true) setInterval( function() { self._randomswitch(); } , this._options.visualizationOptions.RANDOM_VIS_TIMESWITCH);

		    self.audio = $.extend(true, {}, self._audio, true); // Object: The uPlayer constructor options for this playlist and the playlist options
		    self.canvas = $.extend(true, {}, self._canvas, true); // Object: The uPlayer constructor options for this playlist and the playlist options
        self.uPvis_mode = self._uPvis_mode;
        
        this._renderFrame();
     
     },
     _XHR_ConnectVis: function(context,source) {
        var self = this;

        //get objects of main elements 
        this._canvas.obj = document.getElementById($(self.cssSelectorAncestor).find('.uP-video-play canvas.uP-vis-canvas').attr("id"));

        //..............................................................................    
        this._canvas.ctx = context;
        this._audio.audioSrc = source;

        this._canvas.analyser = this._canvas.ctx.createAnalyser();

        // we have to connect the MediaElementSource with the analyser 
        this._audio.audioSrc.connect(self._canvas.analyser);
        this._canvas.analyser.connect(self._canvas.ctx.destination);
    
        //..............................................................................    
       
        this._options.visualizationOptions.CANVAS_WIDTH = this._canvas.obj.width;
        this._options.visualizationOptions.CANVAS_HEIGHT = this._canvas.obj.height;
        this._canvas.ctx = this._canvas.obj.getContext('2d');

        this._canvas.ctx.fillStyle = this._options.visualizationOptions.DEFAULT_BGCOLOR;
        this._canvas.ctx.fillRect(0, 0, this._options.visualizationOptions.CANVAS_WIDTH, this._options.visualizationOptions.CANVAS_HEIGHT);

        if (this._options.visualizationOptions.RANDOMIZE_VIS==true) setInterval( function() { self._randomswitch(); } , this._options.visualizationOptions.RANDOM_VIS_TIMESWITCH);

		    self.audio = $.extend(true, {}, self._audio, true); // Object: The uPlayer constructor options for this playlist and the playlist options
		    self.canvas = $.extend(true, {}, self._canvas, true); // Object: The uPlayer constructor options for this playlist and the playlist options
        self.uPvis_mode = self._uPvis_mode;

        //render
        this._renderFrame();

     },
     _HTML_init: function(event,playlist) {
        var self = this;

        this._cssSelectorAncestor=event.uPlayer.options.cssSelectorAncestor;
        
        playlist.option("freezeModeOff", "#" + $(event.uPlayer.options.cssSelectorAncestor).find(".uP-uPlayer").attr("id")); // Set option

        //get objects of main elements 
        this._audio.obj = document.getElementById($(self.cssSelectorAncestor).find('audio').attr("id"));
        this._canvas.obj = document.getElementById($(self.cssSelectorAncestor).find('.uP-video-play canvas.uP-vis-canvas').attr("id"));
        
           var audioContext = window.AudioContext ? new window.AudioContext() :
           window.webkitAudioContext ? new window.webkitAudioContext() :
           window.mozAudioContext ? new window.mozAudioContext() :
           window.oAudioContext ? new window.oAudioContext() :
           window.msAudioContext ? new window.msAudioContext() :
           undefined;    
    
        //..............................................................................    
        this._canvas.ctx = audioContext;
        this._canvas.analyser = this._canvas.ctx.createAnalyser();

        
        this._audio.crossOrigin = "anonymous";

        this._audio.audioSrc = this._canvas.ctx.createMediaElementSource(self._audio.obj);

        this._audio.audioSrc.connect(self._canvas.analyser);
        this._canvas.analyser.connect(self._canvas.ctx.destination);
        
        // we have to connect the MediaElementSource with the analyser 
        this._audio.audioSrc.connect(self._canvas.analyser);
        this._canvas.analyser.connect(self._canvas.ctx.destination);
        // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
        ///self._canvas.analyser.fftSize = 64;
        //frequencyBinCount tells you how many values you'll receive from the analyser
    
        //..............................................................................    
       
        this._options.visualizationOptions.CANVAS_WIDTH = this._canvas.obj.width;
        this._options.visualizationOptions.CANVAS_HEIGHT = this._canvas.obj.height;
        this._canvas.ctx = this._canvas.obj.getContext('2d');

        this._canvas.ctx.fillStyle = this._options.visualizationOptions.DEFAULT_BGCOLOR;
        this._canvas.ctx.fillRect(0, 0, this._options.visualizationOptions.CANVAS_WIDTH, this._options.visualizationOptions.CANVAS_HEIGHT);

        if (this._options.visualizationOptions.RANDOMIZE_VIS==true) setInterval( function() { self._randomswitch(); } , this._options.visualizationOptions.RANDOM_VIS_TIMESWITCH);

		    self.audio = $.extend(true, {}, self._audio, true); // Object: The uPlayer constructor options for this playlist and the playlist options
		    self.canvas = $.extend(true, {}, self._canvas, true); // Object: The uPlayer constructor options for this playlist and the playlist options
        self.uPvis_mode = self._uPvis_mode;


        if ($(self.cssSelectorAncestor).find('.uP-visualization-switch').length)
        $(self.cssSelectorAncestor).find('.uP-visualization-switch').click(function() { 
           self._switch();
        });

     },
     __getRandomColor: function() {
        var self = this;
              var letters = '0123456789ABCDEF'.split('');
              var color = '#';
              for (var i = 0; i < 6; i++ ) {
                 color += letters[Math.floor(Math.random() * 16)];
              }
              return color;
           },
     __drawBoard: function( XSPACER , YSPACER , MAXWIDTH , MAXHEIGHT ){
        var self = this;
              for (var i = 0; i <= MAXWIDTH; i += XSPACER) {
                 self.canvas.ctx.moveTo(0.5 + i , 0);
                 self.canvas.ctx.lineTo(0.5 + i , MAXWIDTH );
              }
              for (var i = 0; i <= MAXHEIGHT; i += YSPACER) {
                 self.canvas.ctx.moveTo(0, 0.5 + i );
                 self.canvas.ctx.lineTo(MAXWIDTH , 0.5 + i );
              }
              self.canvas.ctx.stroke();
           },
     __drawPolygonXY: function (_x,_y,Width, NumberOfSides, Size, Shade) {
        var self = this;
	            var Index;
	            self.canvas.ctx.beginPath();
           	 self.canvas.ctx.moveTo((_x) + Size * Math.cos(0), (_y) + Size * Math.sin(0));
           	 for (Index = 1; Index <= NumberOfSides; Index += 1) {
		             self.canvas.ctx.lineTo((_x) + Size * Math.cos(Index * 2 * Math.PI / NumberOfSides),	(_y) + Size * Math.sin(Index * 2 * Math.PI / NumberOfSides));
              }
              self.canvas.ctx.lineWidth = Width;
           
              self.canvas.ctx.strokeStyle = Shade;
              self.canvas.ctx.closePath();
              self.canvas.ctx.stroke();
           },
     __drawPolygon: function (Width, NumberOfSides, Size, Shade ) {
        var self = this;
	            var Index;
	            self.canvas.ctx.beginPath();
	            self.canvas.ctx.moveTo((self._options.visualizationOptions.CANVAS_WIDTH/2) + Size * Math.cos(0), (self._options.visualizationOptions.CANVAS_HEIGHT/2) + Size * Math.sin(0));
	            for (Index = 1; Index <= NumberOfSides; Index += 1) {
		             self.canvas.ctx.lineTo((self._options.visualizationOptions.CANVAS_WIDTH/2) + Size * Math.cos(Index * 2 * Math.PI / NumberOfSides), (self._options.visualizationOptions.CANVAS_HEIGHT/2) + Size * Math.sin(Index * 2 * Math.PI / NumberOfSides));
	            }
	            self.canvas.ctx.lineWidth = Width;
              self.canvas.ctx.strokeStyle = Shade;
	            self.canvas.ctx.closePath();
	            self.canvas.ctx.stroke();
           },
     _cancelRenderFrameReq: false,
     _renderFrameObject: null,
     _renderFrame: function() {
        var self = this;
       
        //console.log("rendering");
       
        this.NOW = Date.now();
        this.DELTA = this.NOW - this.THEN;
     
        if (this.DELTA > this.INTERVAL) {
        // update time stuffs
         
        // Just `then = now` is not enough.
        // Lets say we set fps at 10 which means
        // each frame must take 100ms
        // Now frame executes in 16ms (60fps) so
        // the loop iterates 7 times (16*7 = 112ms) until
        // delta > interval === true
        // Eventually this lowers down the FPS as
        // 112*10 = 1120ms (NOT 1000ms).
        // So we have to get rid of that extra 12ms
        // by subtracting delta (112) % interval (100).
        // Hope that makes sense.
         
        this.THEN = this.NOW - (this.DELTA % this.INTERVAL);
        
        // ... Code for Drawing the Frame ...

        if (self._options.visualizationOptions.SHOW_FPS==true) {
           //show actual fps
           self.canvas.ctx.fillStyle = "#000000";
           self.canvas.ctx.fillRect( self._options.visualizationOptions.CANVAS_WIDTH - 68 , 8 , 64 , 20 );
        }

        this.visualizationArray = new Uint8Array(self.canvas.analyser.frequencyBinCount);
  
        switch (this.uPvis_mode) {
        /***SPECTRUMBARS***************************************************************/
        case 1:

           var METER_WIDTH = self._options.visualizationOptions.CANVAS_WIDTH / 30 / 12 * 10;
           var METER_GAP = self._options.visualizationOptions.CANVAS_WIDTH / 30 / 12 * 2;
           var METER_CAP_HEIGHT = Math.round( self._options.visualizationOptions.CANVAS_HEIGHT / 100 ) + 1;
           var METER_CAP_STYLE = "#ffffff";
           var METER_NUM = self._options.visualizationOptions.CANVAS_WIDTH / ( METER_WIDTH + METER_GAP );

           self.canvas.ctx.fillStyle = this._options.visualizationOptions.DEFAULT_BGCOLOR;
           self.canvas.ctx.fillRect( 0 , 0 , self._options.visualizationOptions.CANVAS_WIDTH , self._options.visualizationOptions.CANVAS_HEIGHT );

           var gradient = self.canvas.ctx.createLinearGradient(0, 0, 0, self._options.visualizationOptions.CANVAS_HEIGHT);
           gradient.addColorStop(1.0, '#00ff00');
           gradient.addColorStop(0.5, '#ffff00');
           gradient.addColorStop(0.0, '#ff0000');
           self.canvas.ctx.fillStyle = gradient;

           self.canvas.analyser.getByteFrequencyData(self.visualizationArray);
           var STEP = Math.round(self.visualizationArray.length / 2 / METER_NUM); //sample limited data from the total array
    
           for (var i = 0; i < METER_NUM; i++) {
              var VALUE = Math.round(self._options.visualizationOptions.CANVAS_HEIGHT/256 * self.visualizationArray[i * STEP]);
              if (self.capYPositionArray.length < Math.round( METER_NUM )) {
                 self.capYPositionArray.push( VALUE );
              };
              self.canvas.ctx.fillStyle = METER_CAP_STYLE;
              //draw the cap, with transition effect
              if ( VALUE < self.capYPositionArray[i]) {
                 self.canvas.ctx.fillRect( i * ( METER_WIDTH + METER_GAP ), self._options.visualizationOptions.CANVAS_HEIGHT - (--self.capYPositionArray[i]), METER_WIDTH , METER_CAP_HEIGHT );
              } else {
                 self.canvas.ctx.fillRect( i * ( METER_WIDTH + METER_GAP ), self._options.visualizationOptions.CANVAS_HEIGHT - VALUE , METER_WIDTH , METER_CAP_HEIGHT );
                 self.capYPositionArray[i] = VALUE;
              };
              self.canvas.ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
              self.canvas.ctx.fillRect( i * ( METER_WIDTH + METER_GAP ) , self._options.visualizationOptions.CANVAS_HEIGHT - VALUE + METER_CAP_HEIGHT , METER_WIDTH , self._options.visualizationOptions.CANVAS_HEIGHT ); //the meter
           }

           break;
        /***OSCILLOSCOPE***************************************************************/
        case 2:
        
        //visualizationArray = this.canvas.frequencyData;
        
           self.canvas.analyser.getByteTimeDomainData(self.visualizationArray);
           var LINE_WIDTH = Math.round( self._options.visualizationOptions.CANVAS_HEIGHT / 100 ) + 1;

           self.canvas.ctx.lineWidth = self._options.visualizationOptions.LINE_WIDTH;
           var bufferLength = self.canvas.analyser.fftSize;

           self.canvas.ctx.fillStyle = self._options.visualizationOptions.DEFAULT_BGCOLOR;
           self.canvas.ctx.fillRect( 0 , 0 , self._options.visualizationOptions.CANVAS_WIDTH , self._options.visualizationOptions.CANVAS_HEIGHT );
                   
           self.canvas.ctx.strokeStyle = 'rgb(0, 255, 0)';
           self.canvas.ctx.beginPath();
           var sliceWidth = Math.round(self._options.visualizationOptions.CANVAS_WIDTH * 1.0 / bufferLength);
           for (var i = 0; i < bufferLength; i++) {
              var VALUE =  Math.round(self._options.visualizationOptions.CANVAS_HEIGHT/128 * self.visualizationArray[i])-self._options.visualizationOptions.CANVAS_HEIGHT/2;
              if (i == 0) {
                 self.canvas.ctx.moveTo(i, VALUE);
              } else {
                 self.canvas.ctx.lineTo(i, VALUE);
              }
              i += sliceWidth;
           }      
           self.canvas.ctx.lineTo( self._options.visualizationOptions.CANVAS_WIDTH , self._options.visualizationOptions.CANVAS_HEIGHT );
           self.canvas.ctx.stroke();    
        
           break;
        /***OSCILLOSCOPE STAR + PULSATING CIRCLE***************************************/
        case 3:
       
           //var LINE_WIDTH = Math.round( self._options.visualizationOptions.CANVAS_HEIGHT / 100 ) + 0;
           var LINE_WIDTH = self._options.visualizationOptions.LINE_WIDTH;        
       
           self.canvas.analyser.getByteTimeDomainData(self.visualizationArray);
           self.canvas.ctx.lineWidth = LINE_WIDTH;
           var bufferLength = self.canvas.analyser.fftSize;
           self.canvas.ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
           self.canvas.ctx.fillRect(0, 0, self._options.visualizationOptions.CANVAS_WIDTH, self._options.visualizationOptions.CANVAS_HEIGHT);
  
           // Move registration point to the center of the canvas
           self.canvas.ctx.translate(self._options.visualizationOptions.CANVAS_WIDTH/2, self._options.visualizationOptions.CANVAS_HEIGHT/2);
           // Rotate 1 degree
           self.canvas.ctx.rotate(Math.PI / Math.floor(Math.random() * 9) + 1);
           // Move registration point back to the top left corner of canvas
           self.canvas.ctx.translate( - self._options.visualizationOptions.CANVAS_WIDTH / 2, - self._options.visualizationOptions.CANVAS_HEIGHT / 2 );
	
           self.canvas.ctx.strokeStyle="#ff0000";

           //---OSC---
        
           self.canvas.ctx.beginPath();
           var sliceWidth = Math.round(self._options.visualizationOptions.CANVAS_WIDTH * 1.0 / bufferLength);
           for (var i = 0; i < bufferLength; i++) {
              var VALUE =  Math.round(self._options.visualizationOptions.CANVAS_HEIGHT/128 * self.visualizationArray[i] * 1.1 )-self._options.visualizationOptions.CANVAS_HEIGHT/2;
              if (i == 0) {
                 self.canvas.ctx.moveTo(i, VALUE);
              } else {
                 self.canvas.ctx.lineTo(i, VALUE);
              }
              i += sliceWidth;
           }      
           self.canvas.ctx.lineTo( self._options.visualizationOptions.CANVAS_WIDTH , self._options.visualizationOptions.CANVAS_HEIGHT );
           self.canvas.ctx.stroke();

           //---PULSATING CIRCLE-----------------------------------------------------------   

           var MAX_CIRCLE_DIAMETER = self._options.visualizationOptions.CANVAS_HEIGHT/3;
           var RADIUS=Math.random()*MAX_CIRCLE_DIAMETER; 

           var imgD1=self.canvas.ctx.getImageData(0,0,self._options.visualizationOptions.CANVAS_WIDTH,self._options.visualizationOptions.CANVAS_HEIGHT);
           var SCALE= + 1.025;
           self.canvas.ctx.putImageData(imgD1,0,0);
           self.canvas.ctx.scale( SCALE , SCALE );
           self.canvas.ctx.globalAlpha=0.1;
           self.canvas.ctx.drawImage(self.canvas.obj,0,0); 
           self.canvas.ctx.globalAlpha=1.0; 
           if((Math.random()*5)>2){ 
              self.canvas.ctx.strokeStyle = "rgb(" + Math.floor( Math.random() * 255 ) + "," + Math.floor( Math.random() * 255 ) + ","+ Math.floor( Math.random()  * 255 ) + ")"; 
           }
           self.canvas.ctx.setTransform(1,0,0,1,0,0); 
           self.canvas.ctx.beginPath(); 
           self.canvas.ctx.arc( self._options.visualizationOptions.CANVAS_WIDTH / 2 , self._options.visualizationOptions.CANVAS_HEIGHT / 2 , RADIUS , 0 , 2 * Math.PI , true ); 
           self.canvas.ctx.stroke(); 
        
        
           break;
        /***REALY COOL TUNNEL :D*******************************************************/	
        case 4:

           self.canvas.analyser.getByteFrequencyData(self.visualizationArray);
           var bufferLength = self.canvas.analyser.fftSize;

           var CIRCLE_RADIUS= self._options.visualizationOptions.CANVAS_HEIGHT/5;
           var CIRCLE_LENGTH= Math.round(Math.PI * 2 * CIRCLE_RADIUS );
           var METER_WIDTH = Math.round(CIRCLE_LENGTH / 40 / 20 * 18);
           var METER_NUM =  Math.round(CIRCLE_LENGTH / ( METER_WIDTH ) );

           //circle bars visualization

           var OFFSET = 20;
       
           self.canvas.ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
           self.canvas.ctx.fillRect(0, 0, self._options.visualizationOptions.CANVAS_WIDTH, self._options.visualizationOptions.CANVAS_HEIGHT);

           var imgD1=self.canvas.ctx.getImageData(0,0,self._options.visualizationOptions.CANVAS_WIDTH,self._options.visualizationOptions.CANVAS_HEIGHT);
           var SCALE=+0.05;
           var SCALEFACTOR=1+SCALE;
           self.canvas.ctx.putImageData(imgD1,0,0);
           self.canvas.ctx.scale(SCALEFACTOR,SCALEFACTOR);
           var sx=self.canvas.obj.width*SCALE/2; 
           var sy=self.canvas.obj.height*SCALE/2; 
           self.canvas.ctx.translate(-sx+0.05,-sy+0.05);
           self.canvas.ctx.drawImage(self.canvas.obj,0,0); 
           self.canvas.ctx.setTransform(1,0,0,1,0,0); 

           var grad = self.canvas.ctx.createRadialGradient(0, 0, CIRCLE_RADIUS, 0, 0, CIRCLE_RADIUS+10);
           grad.addColorStop(0, "#0000ff");
           grad.addColorStop(0.50, "#00ffff");
           grad.addColorStop(1, "#0080ff");

           self.canvas.ctx.lineCap = 'round';
      
           var ANGLE = 2*Math.PI/METER_NUM ; 
           // save context
           self.canvas.ctx.save();
           self.canvas.ctx.fillStyle = grad;
           self.canvas.ctx.translate(self._options.visualizationOptions.CANVAS_WIDTH/2,self._options.visualizationOptions.CANVAS_HEIGHT/2);
        
           for (var i=0; i<METER_NUM; i++) {
              self.canvas.ctx.rotate(ANGLE);
              var VALUE = Math.round(CIRCLE_RADIUS/512 * (self.visualizationArray[i]-128));
              self.canvas.ctx.fillRect( 0, CIRCLE_RADIUS, METER_WIDTH, VALUE );
           }
           self.canvas.ctx.restore();


           break;
        /***POLYGON + OSCILLOSCOPE + FRAME*********************************************/	
        case 5:

           var POLYGON_RADIUS=Math.round( self._options.visualizationOptions.CANVAS_HEIGHT / 2.5 );

           self.canvas.analyser.getByteTimeDomainData(self.visualizationArray);
           self.canvas.ctx.lineWidth = self._options.visualizationOptions.LINE_WIDTH;
           var bufferLength = self.canvas.analyser.fftSize;

           //---RANDOM COLOR OF OSCILLOSCOPE STROKE----------------------------------------

           if((Math.random()*20)>19){ 
              var grad = self.canvas.ctx.createLinearGradient(0,0,self._options.visualizationOptions.CANVAS_WIDTH,0);  //(x0,y0) to (x1,y1)
              grad.addColorStop(0.0, "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ","+ Math.floor(Math.random()*255) + ")"); 
              grad.addColorStop(0.5, "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ","+ Math.floor(Math.random()*255) + ")");
              grad.addColorStop(1.0, "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ","+ Math.floor(Math.random()*255) + ")");
              self.canvas.ctx.strokeStyle = grad;
           }

        //---OSCILLOSCOPE---------------------------------------------------------------

           self.canvas.ctx.beginPath();
           var sliceWidth = Math.round(self._options.visualizationOptions.CANVAS_WIDTH * 1.0 / bufferLength);
           for (var i = 0; i < bufferLength; i++) {
              var VALUE =  Math.round(self._options.visualizationOptions.CANVAS_HEIGHT/128 * self.visualizationArray[i] * 1.0 )-self._options.visualizationOptions.CANVAS_HEIGHT/2;
              if (i == 0) {
                 self.canvas.ctx.moveTo(i, VALUE);
              } else {
                 self.canvas.ctx.lineTo(i, VALUE);
              }
              i += sliceWidth;
           }      
           self.canvas.ctx.lineTo( self._options.visualizationOptions.CANVAS_WIDTH , self._options.visualizationOptions.CANVAS_HEIGHT );
           self.canvas.ctx.stroke();

        //------------------------------------------------------------------------------

           self.canvas.analyser.getByteFrequencyData(self.visualizationArray);
           self.canvas.ctx.strokeRect(0, 0, self._options.visualizationOptions.CANVAS_WIDTH, self._options.visualizationOptions.CANVAS_HEIGHT);
           self.canvas.ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
           self.canvas.ctx.fillRect(0, 0, self._options.visualizationOptions.CANVAS_WIDTH, self._options.visualizationOptions.CANVAS_HEIGHT);


           var imgD1=self.canvas.ctx.getImageData(0,0,self._options.visualizationOptions.CANVAS_WIDTH,self._options.visualizationOptions.CANVAS_HEIGHT);
           var scale=-0.025;
           var scaleFactor=1+scale;
           self.canvas.ctx.putImageData(imgD1,0,0);
           self.canvas.ctx.scale(scaleFactor,scaleFactor);
           var sx=self.canvas.obj.width*scale/2; var sy=self.canvas.obj.height*scale/2; self.canvas.ctx.translate(-sx+0.25,-sy+0.25);
           self.canvas.ctx.drawImage(self.canvas.obj,0,0); 
           self.canvas.ctx.setTransform(1,0,0,1,0,0); 

        //---RANDOM COLOR OF POLYGON STROKE---------------------------------------------

           if((Math.random()*20)>19){ 
              var grad = self.canvas.ctx.createLinearGradient(0,0,self._options.visualizationOptions.CANVAS_WIDTH,0);  //(x0,y0) to (x1,y1)
              grad.addColorStop(0.0, "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ","+ Math.floor(Math.random()*255) + ")"); 
              grad.addColorStop(0.5, "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ","+ Math.floor(Math.random()*255) + ")");
              grad.addColorStop(1.0, "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ","+ Math.floor(Math.random()*255) + ")");
              self.canvas.ctx.strokeStyle = grad;
           }
        
           var VALUE = Math.round(POLYGON_RADIUS/16 * (self.visualizationArray[10]-128));
           self.__drawPolygon( 1 , VALUE % 8 + 4, VALUE % POLYGON_RADIUS , grad );

           break;
        /***3D SPECTRUM BARS***********************************************************/	
        case 6:
        
           self.canvas.ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
           self.canvas.ctx.fillRect(0, 0, self._options.visualizationOptions.CANVAS_WIDTH, self._options.visualizationOptions.CANVAS_HEIGHT);
           self.canvas.ctx.lineWidth = self._options.visualizationOptions.LINE_WIDTH;
 
 
           var imgD1=self.canvas.ctx.getImageData(0,0,self._options.visualizationOptions.CANVAS_WIDTH,self._options.visualizationOptions.CANVAS_HEIGHT);
           var scale=-0.0125;
           var scaleFactor=1+scale;
           self.canvas.ctx.putImageData(imgD1,0,0);
           self.canvas.ctx.scale(scaleFactor,scaleFactor);
           var sx=self.canvas.obj.width*scale/2; var sy=self.canvas.obj.height*scale/2; self.canvas.ctx.translate(-sx+0.0125,-sy+0.0125);
           self.canvas.ctx.drawImage(self.canvas.obj,0,0); 
           self.canvas.ctx.setTransform(1,0,0,1,0,0); 

           var METER_WIDTH = self._options.visualizationOptions.CANVAS_WIDTH / 30 / 12 * 10;
           var METER_GAP = self._options.visualizationOptions.CANVAS_WIDTH / 30 / 12 * 2;
           var METER_CAP_HEIGHT = Math.round( self._options.visualizationOptions.CANVAS_HEIGHT / 100 ) + 1;
           var METER_CAP_STYLE = "#ffffff";
           var METER_NUM = self._options.visualizationOptions.CANVAS_WIDTH / ( METER_WIDTH + METER_GAP );

           gradient = self.canvas.ctx.createLinearGradient(0, 0, 0, self._options.visualizationOptions.CANVAS_HEIGHT);
           gradient.addColorStop(1, '#0f0');
           gradient.addColorStop(0.5, '#ff0');
           gradient.addColorStop(0, '#f00');
           self.canvas.ctx.fillStyle = gradient;

           self.canvas.analyser.getByteFrequencyData(self.visualizationArray);
           var STEP = Math.round(self.visualizationArray.length/2 / METER_NUM); //sample limited data from the total array
    
           for (var i = 0; i < METER_NUM; i++) {
              var VALUE = Math.round(self._options.visualizationOptions.CANVAS_HEIGHT/256 * self.visualizationArray[i * STEP]);
              self.canvas.ctx.fillStyle = METER_CAP_STYLE;
              self.canvas.ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
              self.canvas.ctx.fillRect( i * ( METER_WIDTH + METER_GAP ) , self._options.visualizationOptions.CANVAS_HEIGHT - VALUE + METER_CAP_HEIGHT , METER_WIDTH , self._options.visualizationOptions.CANVAS_HEIGHT ); //the meter
              self.canvas.ctx.strokeStyle = this._options.visualizationOptions.DEFAULT_BGCOLOR; 
              self.canvas.ctx.strokeRect( i * ( METER_WIDTH + METER_GAP ) , self._options.visualizationOptions.CANVAS_HEIGHT - VALUE + METER_CAP_HEIGHT , METER_WIDTH , self._options.visualizationOptions.CANVAS_HEIGHT ); //the outline meter
           }
        
           break;
        /***GRID + SQUARE SCOPE********************************************************/
        case 7:

           var SCOPE_DIV_SIZE = Math.round( self._options.visualizationOptions.CANVAS_HEIGHT / 15 );

           self.canvas.analyser.getByteTimeDomainData(self.visualizationArray);

           self.canvas.ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
           self.canvas.ctx.fillRect(0, 0, self._options.visualizationOptions.CANVAS_WIDTH, self._options.visualizationOptions.CANVAS_HEIGHT);
   

           if((Math.random()*20)>17) self.canvas.ctx.strokeStyle = self.__getRandomColor(); 

           var imgD1=self.canvas.ctx.getImageData(0,0,self._options.visualizationOptions.CANVAS_WIDTH,self._options.visualizationOptions.CANVAS_HEIGHT);
           var scale=+0.0125;
           var scaleFactor=1+scale;
           self.canvas.ctx.putImageData(imgD1,0,0);
           self.canvas.ctx.scale(scaleFactor,scaleFactor);
           var sx=self.canvas.obj.width*scale/2; var sy=self.canvas.obj.height*scale/2; self.canvas.ctx.translate(-sx+0.0125,-sy+0.0125);
           self.canvas.ctx.drawImage(self.canvas.obj,0,0); 
           self.canvas.ctx.setTransform(1,0,0,1,0,0); 


        
           if((Math.random()*20)>19) self.__drawBoard(self.visualizationArray[10] % SCOPE_DIV_SIZE + SCOPE_DIV_SIZE, self.visualizationArray[20]  % SCOPE_DIV_SIZE + SCOPE_DIV_SIZE, self._options.visualizationOptions.CANVAS_WIDTH , self._options.visualizationOptions.CANVAS_HEIGHT);            


        //--square scope----------------------------------------------------------------
        
           self.canvas.analyser.getByteTimeDomainData(self.visualizationArray);
           self.canvas.ctx.lineWidth = self._options.visualizationOptions.LINE_WIDTH;
           var bufferLength = self.canvas.analyser.fftSize;

           if((Math.random()*20)>19){ 
              var grad = self.canvas.ctx.createLinearGradient(0,0,self._options.visualizationOptions.CANVAS_WIDTH,0);  //(x0,y0) to (x1,y1)
              grad.addColorStop(0.0, "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ","+ Math.floor(Math.random()*255) + ")"); 
              grad.addColorStop(0.5, "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ","+ Math.floor(Math.random()*255) + ")");
              grad.addColorStop(1.0, "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ","+ Math.floor(Math.random()*255) + ")");
              self.canvas.ctx.strokeStyle = grad;
           }

           self.canvas.ctx.beginPath();
           var sliceWidth = Math.round(self._options.visualizationOptions.CANVAS_WIDTH * 1.0 / bufferLength);
           for (var i = 0; i < bufferLength; i++) {
              var VALUE =  Math.round(self._options.visualizationOptions.CANVAS_HEIGHT/128 * self.visualizationArray[i] * 1.0 )-self._options.visualizationOptions.CANVAS_HEIGHT/2;
              if (i == 0) {
                 self.canvas.ctx.moveTo(i, VALUE);
              } else {
                //self.canvas.ctx.lineTo(i, VALUE);
                self.canvas.ctx.lineTo( Math.round( i / SCOPE_DIV_SIZE) * SCOPE_DIV_SIZE , Math.round( VALUE / SCOPE_DIV_SIZE) * SCOPE_DIV_SIZE);
              }
              i += sliceWidth;
           }      
           self.canvas.ctx.lineTo( self._options.visualizationOptions.CANVAS_WIDTH , self._options.visualizationOptions.CANVAS_HEIGHT );
           self.canvas.ctx.stroke();


           break;
        /***RANDOM CIRCLES + OSCILLOSCOPE**********************************************/
        case 8:

   
           var CIRCLE_RADIUS = self._options.visualizationOptions.CANVAS_HEIGHT / 2.5;
           
              
           self.canvas.analyser.getByteTimeDomainData(self.visualizationArray);
           self.canvas.ctx.lineWidth = self._options.visualizationOptions.LINE_WIDTH;
           var bufferLength = self.canvas.analyser.fftSize;
           
           self.canvas.ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
           self.canvas.ctx.fillRect(0, 0, self._options.visualizationOptions.CANVAS_WIDTH, self._options.visualizationOptions.CANVAS_HEIGHT);
           
           
           // Clear the canvas
           //self.canvas.ctx.clearRect(0, 0, self._options.visualizationOptions.CANVAS_WIDTH, self._options.visualizationOptions.CANVAS_HEIGHT);
           // Move registration point to the center of the canvas
           self.canvas.ctx.translate(self._options.visualizationOptions.CANVAS_WIDTH/2, self._options.visualizationOptions.CANVAS_HEIGHT/2);
           // Rotate 1 degree
           self.canvas.ctx.rotate(Math.PI / Math.floor(Math.random() * 9) + 1);
           // Move registration point back to the top left corner of canvas
           self.canvas.ctx.translate(-self._options.visualizationOptions.CANVAS_WIDTH/2, -self._options.visualizationOptions.CANVAS_HEIGHT/2);
	          
           self.canvas.ctx.beginPath();
           var sliceWidth = Math.round(self._options.visualizationOptions.CANVAS_WIDTH * 1.0 / bufferLength);
           for (var i = 0; i < bufferLength; i++) {
              var VALUE =  Math.round(self._options.visualizationOptions.CANVAS_HEIGHT/128 * self.visualizationArray[i] * 1.2 )-self._options.visualizationOptions.CANVAS_HEIGHT/2;
              if (i == 0) {
                 self.canvas.ctx.moveTo(i, VALUE);
              } else {
                 self.canvas.ctx.lineTo(i, VALUE);
              }
              i += sliceWidth;
           }      
           self.canvas.ctx.lineTo( self._options.visualizationOptions.CANVAS_WIDTH , self._options.visualizationOptions.CANVAS_HEIGHT );
           self.canvas.ctx.stroke();
                
           
           
           var imgD1=self.canvas.ctx.getImageData(0,0,self._options.visualizationOptions.CANVAS_WIDTH,self._options.visualizationOptions.CANVAS_HEIGHT);
           var scale=0.05;
           var scaleFactor=1+scale;
           self.canvas.ctx.putImageData(imgD1,0,0);
           self.canvas.ctx.scale(scaleFactor,scaleFactor);
           var sx=self.canvas.obj.width*scale/2; var sy=self.canvas.obj.height*scale/2; self.canvas.ctx.translate(-sx+1.6,-sy+1.1);
           self.canvas.ctx.globalAlpha=0.1;
           self.canvas.ctx.drawImage(self.canvas.obj,0,0); 
           self.canvas.ctx.globalAlpha=1.0; 
           if((Math.random()*20)>19) { 
              self.canvas.ctx.lineWidth = self._options.visualizationOptions.LINE_WIDTH*2; 
              var c="rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ","+ Math.floor(Math.random()*255) + ")"; 
              self.canvas.ctx.strokeStyle = c; 
           }
           
           var RADIUS=Math.floor(Math.random()*CIRCLE_RADIUS); 
           
           self.canvas.ctx.setTransform(1,0,0,1,0,0); 
           self.canvas.ctx.beginPath(); 
           self.canvas.ctx.arc(0+ Math.floor(Math.random()*self._options.visualizationOptions.CANVAS_WIDTH),0+ Math.floor(Math.random()*self._options.visualizationOptions.CANVAS_HEIGHT), RADIUS , 0 , 2*Math.PI , true); 
           self.canvas.ctx.stroke(); 
           
           var imgD1=self.canvas.ctx.getImageData(0,0,self._options.visualizationOptions.CANVAS_WIDTH,self._options.visualizationOptions.CANVAS_HEIGHT);
           var scale=+0.00625;
           var scaleFactor=1+scale;
           self.canvas.ctx.putImageData(imgD1,0,0);
           self.canvas.ctx.scale(scaleFactor,scaleFactor);
           var sx=self.canvas.obj.width*scale/2; var sy=self.canvas.obj.height*scale/2; self.canvas.ctx.translate(-sx+1.00625,-sy+1.00625);
           self.canvas.ctx.drawImage(self.canvas.obj,0,0); 
           self.canvas.ctx.setTransform(1,0,0,1,0,0); 
   
   
           break;
        /***3D VOLUMEBARS**************************************************************/
        case 9:
   
           var METER_WIDTH = self._options.visualizationOptions.CANVAS_WIDTH / 30 / 12 * 10;
           var METER_GAP = self._options.visualizationOptions.CANVAS_WIDTH / 30 / 12 * 2;
           var METER_CAP_HEIGHT = Math.round( self._options.visualizationOptions.CANVAS_HEIGHT / 100 ) + 1;
           var METER_CAP_STYLE = "#ffffff";
           var METER_NUM = self._options.visualizationOptions.CANVAS_WIDTH / ( METER_WIDTH + METER_GAP );
           
           //to delete
           var OFFSET = 100;
           
           var imgD1=self.canvas.ctx.getImageData(0,0,self._options.visualizationOptions.CANVAS_WIDTH,self._options.visualizationOptions.CANVAS_HEIGHT);
           var scale=-0.025;
           var scaleFactor=1+scale;
           self.canvas.ctx.putImageData(imgD1,0,0);
           self.canvas.ctx.scale(scaleFactor,scaleFactor);
           var sx=self.canvas.obj.width*scale/2; var sy=self.canvas.obj.height*scale/2; self.canvas.ctx.translate(-sx-0.025,-sy-0.025);
           self.canvas.ctx.drawImage(self.canvas.obj,0,0); 
           self.canvas.ctx.setTransform(1,0,0,1,0,0); 
           
           var grad = self.canvas.ctx.createLinearGradient(0,self._options.visualizationOptions.CANVAS_HEIGHT,self._options.visualizationOptions.CANVAS_WIDTH,self._options.visualizationOptions.CANVAS_HEIGHT);  //(x0,y0) to (x1,y1)
           grad.addColorStop(0, 'rgb(  255, 0, 0)');
           grad.addColorStop(0.25, 'rgb(  255, 255, 0)');
           grad.addColorStop(0.5, 'rgb(  0, 255, 0)');
           grad.addColorStop(0.75, 'rgb(  255, 255, 0)');
           grad.addColorStop(1, 'rgb(  255, 0, 0)');
           self.canvas.ctx.fillStyle = grad;
           self.canvas.ctx.lineCap = 'round';
              
           self.canvas.ctx.strokeStyle = this._options.visualizationOptions.DEFAULT_BGCOLOR;
           self.canvas.ctx.lineWidth = self._options.visualizationOptions.LINE_WIDTH;
           

           self.canvas.analyser.getByteFrequencyData(self.visualizationArray);
           
           for (var j = 0; j < METER_NUM/2 +1; ++j) {
              var magnitude1 = self.visualizationArray[0 + OFFSET];
              var magnitude2 = self.visualizationArray[1 + OFFSET];
              if (Math.round(magnitude1/(METER_NUM/1.5))>j) {
                 self.canvas.ctx.fillRect(-j*( METER_WIDTH + METER_GAP ) + self._options.visualizationOptions.CANVAS_WIDTH/2  , self._options.visualizationOptions.CANVAS_HEIGHT , METER_WIDTH, -j*METER_WIDTH/2);
                 self.canvas.ctx.strokeRect(-j*( METER_WIDTH + METER_GAP ) + self._options.visualizationOptions.CANVAS_WIDTH/2  , self._options.visualizationOptions.CANVAS_HEIGHT , METER_WIDTH, -j*METER_WIDTH/2);
              }         
              if (Math.round(magnitude2/(METER_NUM/1.5))>j) {
                 self.canvas.ctx.fillRect((j-1)*( METER_WIDTH + METER_GAP ) + self._options.visualizationOptions.CANVAS_WIDTH/2 , self._options.visualizationOptions.CANVAS_HEIGHT , METER_WIDTH, -j*METER_WIDTH/2);
                 self.canvas.ctx.strokeRect((j-1)*( METER_WIDTH + METER_GAP ) + self._options.visualizationOptions.CANVAS_WIDTH/2 , self._options.visualizationOptions.CANVAS_HEIGHT , METER_WIDTH, -j*METER_WIDTH/2);
              }  
              if (Math.round(magnitude1/(METER_NUM/1.5)) == j) {
                 self.canvas.ctx.fillRect(-(j-1)*( METER_WIDTH + METER_GAP ) + self._options.visualizationOptions.CANVAS_WIDTH/2 - (( METER_WIDTH + METER_GAP )-METER_WIDTH)  , self._options.visualizationOptions.CANVAS_HEIGHT , -((magnitude1 % METER_NUM)%METER_WIDTH), -j*METER_WIDTH/2);
                 self.canvas.ctx.strokeRect(-(j-1)*( METER_WIDTH + METER_GAP ) + self._options.visualizationOptions.CANVAS_WIDTH/2 - (( METER_WIDTH + METER_GAP )-METER_WIDTH)  , self._options.visualizationOptions.CANVAS_HEIGHT , -((magnitude1 % METER_NUM)%METER_WIDTH), -j*METER_WIDTH/2);
              }   
              if (Math.round(magnitude2/(METER_NUM/1.5)) == j) {
                 self.canvas.ctx.fillRect(+(j-2)*( METER_WIDTH + METER_GAP ) + self._options.visualizationOptions.CANVAS_WIDTH/2 +( METER_WIDTH + METER_GAP )+1  , self._options.visualizationOptions.CANVAS_HEIGHT , ((magnitude2 % METER_NUM)%METER_WIDTH), -j*METER_WIDTH/2);
                 self.canvas.ctx.strokeRect(+(j-2)*( METER_WIDTH + METER_GAP ) + self._options.visualizationOptions.CANVAS_WIDTH/2 +( METER_WIDTH + METER_GAP )+1  , self._options.visualizationOptions.CANVAS_HEIGHT , ((magnitude2 % METER_NUM)%METER_WIDTH), -j*METER_WIDTH/2);
              }
           }               
           
           
           
           break;
        /***RANDOM POLYGONS + OSCILLOSCOPE*********************************************/
        case 10:
           
           var SCOPE_DIV_SIZE = Math.round( self._options.visualizationOptions.CANVAS_HEIGHT / 30 );
           var POLYGON_RADIUS = self._options.visualizationOptions.CANVAS_HEIGHT / 2.5;

           self.canvas.analyser.getByteTimeDomainData(self.visualizationArray);
           self.canvas.ctx.lineWidth = self._options.visualizationOptions.LINE_WIDTH;
           var bufferLength = self.canvas.analyser.fftSize;
           
           self.canvas.ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
           self.canvas.ctx.fillRect(0, 0, self._options.visualizationOptions.CANVAS_WIDTH, self._options.visualizationOptions.CANVAS_HEIGHT);
           
           // Clear the canvas
           //self.canvas.ctx.clearRect(0, 0, self._options.visualizationOptions.CANVAS_WIDTH, self._options.visualizationOptions.CANVAS_HEIGHT);
           // Move registration point to the center of the canvas
           self.canvas.ctx.translate(self._options.visualizationOptions.CANVAS_WIDTH/2, self._options.visualizationOptions.CANVAS_HEIGHT/2);
           // Rotate 1 degree
           self.canvas.ctx.rotate(Math.PI / Math.floor(Math.random() * 9) + 1);
           // Move registration point back to the top left corner of canvas
           self.canvas.ctx.translate(-self._options.visualizationOptions.CANVAS_WIDTH/2, -self._options.visualizationOptions.CANVAS_HEIGHT/2);
           
           self.canvas.ctx.strokeStyle = 'rgb(255,255,255)';
           
           //square oscilloscope
           
           self.canvas.ctx.beginPath();
           var sliceWidth = Math.round(self._options.visualizationOptions.CANVAS_WIDTH * 1.0 / bufferLength);
           for (var i = 0; i < bufferLength; i++) {
              var VALUE =  Math.round(self._options.visualizationOptions.CANVAS_HEIGHT/128 * self.visualizationArray[i] * 1.0 )-self._options.visualizationOptions.CANVAS_HEIGHT/2;
              if (i == 0) {
                 self.canvas.ctx.moveTo(i, VALUE);
              } else {
                //self.canvas.ctx.lineTo(i, VALUE);
                self.canvas.ctx.lineTo( Math.round( i / SCOPE_DIV_SIZE) * SCOPE_DIV_SIZE , Math.round( VALUE / SCOPE_DIV_SIZE) * SCOPE_DIV_SIZE);
              }
              i += sliceWidth;
           }      
           self.canvas.ctx.lineTo( self._options.visualizationOptions.CANVAS_WIDTH , self._options.visualizationOptions.CANVAS_HEIGHT );
           self.canvas.ctx.stroke();
           
           // scale picture
           
           var imgD1=self.canvas.ctx.getImageData(0,0,self._options.visualizationOptions.CANVAS_WIDTH,self._options.visualizationOptions.CANVAS_HEIGHT);
           var scale=0.05;
           var scaleFactor=1+scale;
           self.canvas.ctx.putImageData(imgD1,0,0);
           self.canvas.ctx.scale(scaleFactor,scaleFactor);
           var sx=self.canvas.obj.width*scale/2;
           var sy=self.canvas.obj.height*scale/2;
           self.canvas.ctx.translate(-sx+0.05,-sy+0.05);
           self.canvas.ctx.globalAlpha=0.1;
           self.canvas.ctx.drawImage(self.canvas.obj,0,0); 
           self.canvas.ctx.globalAlpha=1.0; 
           
           // random stroke color
           
           if ((Math.random()*5) > 3 ) { 
              self.canvas.ctx.lineWidth = self._options.visualizationOptions.LINE_WIDTH*2; 
              var c="rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ","+ Math.floor(Math.random()*255) + ")"; 
              self.canvas.ctx.strokeStyle = c; 
           }
           
           var RADIUS=Math.floor(Math.random()*POLYGON_RADIUS); 
           
           self.canvas.ctx.setTransform(1,0,0,1,0,0); 
           self.canvas.ctx.beginPath(); 

           self.__drawPolygonXY (0 + Math.floor( Math.random() * self._options.visualizationOptions.CANVAS_WIDTH ), 0 + Math.floor( Math.random() * self._options.visualizationOptions.CANVAS_HEIGHT ), 1 , 3 + Math.floor( Math.random() * 5 ), RADIUS ,0,2*Math, c);
           
           // second scale picture
           
           var imgD1=self.canvas.ctx.getImageData(0,0,self._options.visualizationOptions.CANVAS_WIDTH,self._options.visualizationOptions.CANVAS_HEIGHT);
           var scale=-0.00625;
           var scaleFactor=1+scale;
           self.canvas.ctx.putImageData(imgD1,0,0);
           self.canvas.ctx.scale(scaleFactor,scaleFactor);
           var sx=self.canvas.obj.width*scale/2; var sy=self.canvas.obj.height*scale/2; self.canvas.ctx.translate(-sx+1.00625,-sy+1.00625);
           self.canvas.ctx.drawImage(self.canvas.obj,0,0); 
           self.canvas.ctx.setTransform(1,0,0,1,0,0);   
           
           break;
        /***SPECTOGRAPH****************************************************************/
/*        case 11:

           self.canvas.analyser.getByteFrequencyData(self.visualizationArray);
          
           self.canvas.ctx.fillStyle = this._options.visualizationOptions.DEFAULT_BGCOLOR;  
           self.canvas.ctx.fillRect(self._options.visualizationOptions.CANVAS_WIDTH - 1, 1, self._options.visualizationOptions.CANVAS_WIDTH - 1 , self._options.visualizationOptions.CANVAS_HEIGHT - 1);
          
           for (var i=0; i < self.visualizationArray.length;i++) {     
              var datacolor = (self.visualizationArray[i]-128)*14;
                
              if (datacolor>511) datacolor=511;
              Red=(datacolor%255);
              Green=datacolor-(datacolor%256);
              if (Green>Red) Red=Green;
                
              self.canvas.ctx.fillStyle = 'rgb('+Red+', ' + Green +  ', 0)';
               
              if (self._options.visualizationOptions.CANVAS_HEIGHT>i) self.canvas.ctx.fillRect( self._options.visualizationOptions.CANVAS_WIDTH - 1, self._options.visualizationOptions.CANVAS_HEIGHT - i , 1 , 1 );
           
           }
           
           var imgD1=self.canvas.ctx.getImageData(0,0,self._options.visualizationOptions.CANVAS_WIDTH,self._options.visualizationOptions.CANVAS_HEIGHT);
          
           self.canvas.ctx.putImageData(imgD1,0,0);
           self.canvas.ctx.translate(-1, 0);
           self.canvas.ctx.drawImage(self.canvas.obj,0,0); 
           self.canvas.ctx.setTransform(1, 0, 0, 1, 0, 0);
          
           break;
        /***COLOR SCOPE****************************************************************/
        case 11:
          
           self.canvas.analyser.getByteTimeDomainData(self.visualizationArray);
           var LINE_WIDTH = Math.round( self._options.visualizationOptions.CANVAS_HEIGHT / 100 ) + 1;
           
           self.canvas.ctx.lineWidth = self._options.visualizationOptions.LINE_WIDTH;
           var bufferLength = self.canvas.analyser.fftSize;
           
           
           var imgD1=self.canvas.ctx.getImageData(0,0,self._options.visualizationOptions.CANVAS_WIDTH,self._options.visualizationOptions.CANVAS_HEIGHT);
           var scale=+0.0125;
           var scaleFactor=1+scale;
           self.canvas.ctx.putImageData(imgD1,0,0);
           self.canvas.ctx.scale(scaleFactor,scaleFactor);
           var sx=self.canvas.obj.width*scale/2; var sy=self.canvas.obj.height*scale/2; self.canvas.ctx.translate(-sx+0.0125,-sy+0.0125);
           self.canvas.ctx.drawImage(self.canvas.obj,0,0); 
           self.canvas.ctx.setTransform(1,0,0,1,0,0); 
           
           
           if((Math.random()*20)>17) self.canvas.ctx.strokeStyle = self.__getRandomColor(); 
                          
           //self.canvas.ctx.strokeStyle = 'rgb(0, 255, 0)';
           self.canvas.ctx.beginPath();
           var sliceWidth = Math.round(self._options.visualizationOptions.CANVAS_WIDTH * 1.0 / bufferLength);
           for (var i = 0; i < bufferLength; i++) {
              var VALUE =  Math.round(self._options.visualizationOptions.CANVAS_HEIGHT/128 * self.visualizationArray[i])-self._options.visualizationOptions.CANVAS_HEIGHT/2;
              if (i == 0) {
                 self.canvas.ctx.moveTo(i, VALUE);
              } else {
                 self.canvas.ctx.lineTo(i, VALUE);
              }
              i += sliceWidth;
           }      
           self.canvas.ctx.lineTo( self._options.visualizationOptions.CANVAS_WIDTH , self._options.visualizationOptions.CANVAS_HEIGHT );
           self.canvas.ctx.stroke();    

           break;
/*        case 13:
           
           self.canvas.ctx.fillStyle = this._options.visualizationOptions.DEFAULT_BGCOLOR;
           self.canvas.ctx.fillRect(0, 0, this._options.visualizationOptions.CANVAS_WIDTH, this._options.visualizationOptions.CANVAS_HEIGHT);
         */  
           break;
        default:
           break;
        }


           this.TIME_EL = (this.THEN - this.FIRST)/1000;
//           this.ACTUAL_FPS = parseInt(this.COUNTER/this.TIME_EL);
           this.ACTUAL_FPS = Math.round(this.COUNTER/this.TIME_EL * 10) / 10;
           ++this.COUNTER;

  
           if (self._options.visualizationOptions.SHOW_FPS==true) {
              //show actual fps
              self.canvas.ctx.fillStyle = "#000000";
              self.canvas.ctx.fillRect( this._options.visualizationOptions.CANVAS_WIDTH - 68 , 8 , 64 , 20 );
              self.canvas.ctx.fillStyle = "#ffffff";
              self.canvas.ctx.font = "bold 16px Arial";
              self.canvas.ctx.fillText( this.ACTUAL_FPS + " fps", this._options.visualizationOptions.CANVAS_WIDTH - 64 , 24);
           }


        }

        if (this._cancelRenderFrameReq==true) {
            cancelAnimationFrame(this._renderFrameObject);
        } else
          this._renderFrameObject = requestAnimationFrame( function() { self._renderFrame(); } );
     
     },
     _switch: function() {
        var self = this;
        if (self.uPvis_mode>10) this.uPvis_mode=0;
        this.uPvis_mode++;
     },
     _randomswitch: function() {
        this.uPvis_mode=Math.floor(Math.random() * 11 + 1 );
     }
      
   }

})(jQuery);

/******************************************************************************/
/*  Copyright © 2015 CrazyLabz                                                */
/******************************************************************************/