"use strict";

var gData = {
  screenWidth: 1024,
  screenHeight: 648
};
var g_resizeInterval;

AutoResize();

function AutoResize() {
  $(window).on("load", function () {
    ResizeBody();
    if (window.UpdateThreeJS) window.UpdateThreeJS();
  });

  $(window)
    .resize(function () {
      ResizeBody();
      if (window.UpdateThreeJS) {
        window.UpdateThreeJS();
      }
    })
    .trigger("resize");
}

var $baseContent;
var mTop;

if (!$baseContent) {
  $baseContent = $("#divBody");
  mTop = parseFloat($baseContent.css("top"));
}

function ResizeBody() {
  if (!$baseContent || $baseContent.length === 0) {
    $baseContent = $("#divBody");
    if ($baseContent.length === 0) return;
  }

  var ratio = gData.screenWidth / gData.screenHeight;

  var w = $(window).width();
  var h = $(window).height();

  var left = 0;
  var nWidth = w;
  var nHeight = h;
  var mTop = 0;

  if (w / h < ratio) {
    nHeight = w / ratio;
    mTop = (h - nHeight) / 2;
  } else {
    nWidth = h * ratio;
    mTop = 0;
    left = (w - nWidth) / 2;
  }

  gData.zoomRatio = nWidth / gData.screenWidth;
  $("svg:first").css({
    width: "100%",
    height: "100%"
  });
  $("#divBody").css({
    position: "absolute",
    left: left,
    top: mTop,
    width: nWidth,
    height: nHeight,
    transform: "scale(1)"
  });
  var contentWidth = $baseContent[0].clientWidth;
  var contentHeight = $baseContent[0].clientHeight;
  var windowOuterHeight = $(window).outerHeight();
  var outerRate = window.innerHeight / windowOuterHeight;
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var userAgent = window.navigator.userAgent.toLowerCase();
  var isIphone = userAgent.indexOf("iphone") > -1 && userAgent.indexOf("safari") > -1 ? true : false;
  var scale = Math.min(windowWidth / contentWidth, windowHeight / contentHeight);
  var newTop = 0;

  if (isIphone && outerRate < 1 && windowWidth > windowHeight) {
    newTop = mTop - (windowOuterHeight - window.innerHeight) / 2;
    $baseContent.css("top", newTop + "px");
    $baseContent.css({
      transform: "scale(" + scale + ")"
    });
    $(window).scrollTop(0);
  }

  // $.notify(
  //   `ResizeBody v2025-12-15-3 w: ${w}, h: ${h}, cw: ${$("#container").width()}, ch: ${$("#container").height()}, sw: ${$("#svg_root").width()}, sh: ${$("#svg_root").height()}`,
  //   { autoHideDelay: 1500 }
  // );

  // $("#txt-log").text(
  //   `w: ${w}, h: ${h}, cw: ${$("#container").width()}, ch: ${$("#container").height()}, sw: ${$("#svg_root").width()}, sh: ${$("#svg_root").height()}`
  // );
}
