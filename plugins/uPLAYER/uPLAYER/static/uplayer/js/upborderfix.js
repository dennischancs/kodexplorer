/******************************************************************************/      
/* µPlayer Border Fix Plugin for jQuery JavaScript Library                    */
/* http://www.uPlayer.org                                                     */
/*----------------------------------------------------------------------------*/
/* Copyright © 2015 CrazyLabz                                                 */
/* Licensed under the MIT license.                                            */
/* http://opensource.org/licenses/MIT                                         */
/*----------------------------------------------------------------------------*/
/* Author (µP): Dr.NCX.Cortex                                                 */ 
/* Version: 0.1.0 beta (under developing)                                     */
/* Date: 17th September 2015                                                  */
/*----------------------------------------------------------------------------*/
/* Requires  jQuery 1.7.0+                                                    */
/******************************************************************************/      

  function uPfixBorders () {   
    $('.uP-uPlayer').each(function(i,e) {
      var uPlayerID="#"+$(e).attr('id');
      //$(uPlayerID).ready(function(){     
        var uP__cssSelectorAncestor="#" + $(uPlayerID).parent().parent().parent().attr('id');
        if ($(uP__cssSelectorAncestor).parent().find("div").length) {
          if ($(uP__cssSelectorAncestor).hasClass("uP-dark-green") || $(uP__cssSelectorAncestor).hasClass("uP-dark-red") || $(uP__cssSelectorAncestor).hasClass("uP-dark-blue")
            || $(uP__cssSelectorAncestor).hasClass("uP-dark-yellow") || $(uP__cssSelectorAncestor).hasClass("uP-dark-white") || $(uP__cssSelectorAncestor).hasClass("uP-dark-orange"))
            $(uP__cssSelectorAncestor).parent().attr("class","brd-dark");
          
          if ($(uP__cssSelectorAncestor).hasClass("uP-silver-green") || $(uP__cssSelectorAncestor).hasClass("uP-silver-red") || $(uP__cssSelectorAncestor).hasClass("uP-silver-blue")
            || $(uP__cssSelectorAncestor).hasClass("uP-silver-black") || $(uP__cssSelectorAncestor).hasClass("uP-silver-white") || $(uP__cssSelectorAncestor).hasClass("uP-silver-orange"))
            $(uP__cssSelectorAncestor).parent().attr("class","brd-silver");
  
          if ($(uP__cssSelectorAncestor).hasClass("uP-clear")) $(uP__cssSelectorAncestor).parent().attr("class","brd-clear");
        }
      //});    
    });
    return false;
  }   

  // detect IE -> returns version of IE or false, if browser is not Internet Explorer */
  function detectIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE '); if (msie > 0) { // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10); }
    var trident = ua.indexOf('Trident/');
    if (trident > 0) { // IE 11 => return version number
      var rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10); }
    var edge = ua.indexOf('Edge/'); if (edge > 0) {
    // IE 12 => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10); }
    // other browser
      return false;
  }    

  function fixIEborders() {
    if (detectIE()!=false) {
  
    
      $('div.brd-dark').wrap('<table class="brd-dark-fix"></table>').wrap('<tbody></tbody>').wrap('<tr></tr>').wrap('<td></td>')
      $('table.brd-dark-fix tbody').prepend('<tr>');
      $('table.brd-dark-fix tbody').append('<tr>');
      $('table.brd-dark-fix tbody tr:nth-child(1)').prepend('<td><td><td>');
      $('table.brd-dark-fix tbody tr:nth-child(2)').prepend('<td>');
      $('table.brd-dark-fix tbody tr:nth-child(2)').append('<td>');
      $('table.brd-dark-fix tbody tr:nth-child(3)').append('<td><td><td>');
  
      $('table.brd-dark-fix tbody tr:nth-child(1) td:nth-child(1)').addClass("brd-tl");
      $('table.brd-dark-fix tbody tr:nth-child(1) td:nth-child(2)').addClass("brd-tc");
      $('table.brd-dark-fix tbody tr:nth-child(1) td:nth-child(3)').addClass("brd-tr");
      $('table.brd-dark-fix tbody tr:nth-child(2) td:nth-child(1)').addClass("brd-ml");
      $('table.brd-dark-fix tbody tr:nth-child(2) td:nth-child(2)').addClass("brd-mc");
      $('table.brd-dark-fix tbody tr:nth-child(2) td:nth-child(3)').addClass("brd-mr");
      $('table.brd-dark-fix tbody tr:nth-child(3) td:nth-child(1)').addClass("brd-bl");
      $('table.brd-dark-fix tbody tr:nth-child(3) td:nth-child(2)').addClass("brd-bc");
      $('table.brd-dark-fix tbody tr:nth-child(3) td:nth-child(3)').addClass("brd-br");
  
      $('div.brd-dark').css({'border-style':'none', 'border-width':'0px'});
    
    
      $('div.brd-silver').wrap('<table class="brd-silver-fix"></table>').wrap('<tbody></tbody>').wrap('<tr></tr>').wrap('<td></td>')
      $('table.brd-silver-fix tbody').prepend('<tr>');
      $('table.brd-silver-fix tbody').append('<tr>');
      $('table.brd-silver-fix tbody tr:nth-child(1)').prepend('<td><td><td>');
      $('table.brd-silver-fix tbody tr:nth-child(2)').prepend('<td>');
      $('table.brd-silver-fix tbody tr:nth-child(2)').append('<td>');
      $('table.brd-silver-fix tbody tr:nth-child(3)').append('<td><td><td>');
  
      $('table.brd-silver-fix tbody tr:nth-child(1) td:nth-child(1)').addClass("brd-tl");
      $('table.brd-silver-fix tbody tr:nth-child(1) td:nth-child(2)').addClass("brd-tc");
      $('table.brd-silver-fix tbody tr:nth-child(1) td:nth-child(3)').addClass("brd-tr");
      $('table.brd-silver-fix tbody tr:nth-child(2) td:nth-child(1)').addClass("brd-ml");
      $('table.brd-silver-fix tbody tr:nth-child(2) td:nth-child(2)').addClass("brd-mc");
      $('table.brd-silver-fix tbody tr:nth-child(2) td:nth-child(3)').addClass("brd-mr");
      $('table.brd-silver-fix tbody tr:nth-child(3) td:nth-child(1)').addClass("brd-bl");
      $('table.brd-silver-fix tbody tr:nth-child(3) td:nth-child(2)').addClass("brd-bc");
      $('table.brd-silver-fix tbody tr:nth-child(3) td:nth-child(3)').addClass("brd-br");
  
      $('div.brd-silver').css({'border-style':'none', 'border-width':'0px'});

      $('div.brd-clear').wrap('<table class="brd-clear-fix"></table>').wrap('<tbody></tbody>').wrap('<tr></tr>').wrap('<td></td>')
      $('table.brd-clear-fix tbody').prepend('<tr>');
      $('table.brd-clear-fix tbody').append('<tr>');
      $('table.brd-clear-fix tbody tr:nth-child(1)').prepend('<td><td><td>');
      $('table.brd-clear-fix tbody tr:nth-child(2)').prepend('<td>');
      $('table.brd-clear-fix tbody tr:nth-child(2)').append('<td>');
      $('table.brd-clear-fix tbody tr:nth-child(3)').append('<td><td><td>');
  
      $('table.brd-clear-fix tbody tr:nth-child(1) td:nth-child(1)').addClass("brd-tl");
      $('table.brd-clear-fix tbody tr:nth-child(1) td:nth-child(2)').addClass("brd-tc");
      $('table.brd-clear-fix tbody tr:nth-child(1) td:nth-child(3)').addClass("brd-tr");
      $('table.brd-clear-fix tbody tr:nth-child(2) td:nth-child(1)').addClass("brd-ml");
      $('table.brd-clear-fix tbody tr:nth-child(2) td:nth-child(2)').addClass("brd-mc");
      $('table.brd-clear-fix tbody tr:nth-child(2) td:nth-child(3)').addClass("brd-mr");
      $('table.brd-clear-fix tbody tr:nth-child(3) td:nth-child(1)').addClass("brd-bl");
      $('table.brd-clear-fix tbody tr:nth-child(3) td:nth-child(2)').addClass("brd-bc");
      $('table.brd-clear-fix tbody tr:nth-child(3) td:nth-child(3)').addClass("brd-br");
  
      $('div.brd-clear').css({'border-style':'none', 'border-width':'0px'});    
  
    }
    return true;
  }

   $(document).ready(function(){

      //fix uPlayer borders if is incorrect border on uPlayer skin
      uPfixBorders(); 
 
      //fix uPlayer borders if is IE detected
      fixIEborders();
 
   });
   

/******************************************************************************/
/*  Copyright © 2015 CrazyLabz                                                */
/******************************************************************************/