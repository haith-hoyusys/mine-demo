var gData = {
    screenWidth: 1024,
    screenHeight: 648,
    zoomRatio: 1
};

var g_zoomRatio = 1;
var $baseContent;
var mTop;

function AutoResize() {
    $(document).ready(function () {
        if (!$baseContent) {
            $baseContent = $('#divBody');
            mTop = parseFloat($baseContent.css('top')) || 0;
        }
        ResizeBody();
        if (typeof fnCalculateSVGRatio === "function") fnCalculateSVGRatio();
    });

    $(window).resize(function () {
        ResizeBody();
        if (typeof fnCalculateSVGRatio === "function") fnCalculateSVGRatio();
    }).trigger('resize');
}

function ResizeBody() {
    console.log('ResizeBody');

    var ratio = gData.screenWidth / gData.screenHeight;
    var w = $(window).width();
    var h = $(window).height();
    var left = 0;
    var nWidth = w;
    var nHeight = h;

    if (w / h < ratio) {
        nHeight = w / ratio;
        mTop = (h - nHeight) / 2;
    } else {
        nWidth = h * ratio;
        mTop = 0;
        left = (w - nWidth) / 2;
    }

    gData.zoomRatio = nWidth / gData.screenWidth;
    g_zoomRatio = gData.zoomRatio;

    // Cập nhật CSS cho các phần tử chính
    $('#divBody, #menu').css({
        position: "absolute",
        left: left,
        top: mTop,
        width: nWidth,
        height: nHeight,
        transform: 'scale(1)'
    });

    $("svg").css({ width: "100%", height: "100%" });
    $('.imgtype').css({ width: nWidth / 4.5, height: nHeight / 4 });

    // Xử lý riêng cho iPhone Safari
    var userAgent = window.navigator.userAgent.toLowerCase();
    var isIphone = userAgent.indexOf("iphone") > -1 && userAgent.indexOf("safari") > -1;

    if (isIphone && (window.innerHeight / $(window).outerHeight()) < 1 && w > h) {
        var scale = Math.min(w / $baseContent[0].clientWidth, h / $baseContent[0].clientHeight);
        var newTop = mTop - ($(window).outerHeight() - window.innerHeight) / 2;
        $baseContent.css({ 'top': newTop + 'px', 'transform': 'scale(' + scale + ')' });
        $(window).scrollTop(0);
    }

    // --- QUAN TRỌNG: Hook cho Three.js ---
    // Mỗi khi ResizeBody chạy xong, nó sẽ gọi hàm này nếu hàm đó tồn tại trong scene
    if (typeof onThreeResize === 'function') {
        onThreeResize(nWidth, nHeight);
    }
}