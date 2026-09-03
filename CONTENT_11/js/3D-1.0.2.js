/* eslint-disable no-new */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-case-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-shadow */

/* eslint-disable no-unused-expressions */
/** ******** const.js ************** */
var CONST = {
    SVG: {
        NAMESPACE: "http://www.w3.org/2000/svg",
        TAG: {
            SVG: "svg",
            GROUP: "g",
            PATH: "path",
            TEXT: "tspan",
        },
    },

    AXIS: {
        X: "x",
        Y: "y",
        Z: "z",
    },

    OPENBOX_TYPES: {
        ADD: "ADD",
        KEEP: "KEEP",
    },

    EPSILON: 0.00000001,

    SHAPE_TYPES: {
        CYLINDER: "CYLINDER",
        CONE: "CONE",
        // CUBE: "CUBE",
        TETRAHEDRON: "TETRAHEDRON",
        PRISMATIC: "PRISMATIC",

        S0_CUBE: "S0_CUBE",
        S1_RECTANGULAR: "S1_RECTANGULAR",
        S2_SQUARE_PRISM: "S2_SQUARE_PRISM",
        S3_EQUILATERAL_TRIANGULAR_PRISM: "S3_EQUILATERAL_TRIANGULAR_PRISM",
        S4_TRIANGULAR_PRISM: "S4_TRIANGULAR_PRISM",
        S5_CYLINDER: "S5_CYLINDER",
        S6_SQUARE_PYRAMID: "S6_SQUARE_PYRAMID",
        S7_EQUILATERAL_TRIANGULAR_PYRAMID: "S7_EQUILATERAL_TRIANGULAR_PYRAMID",
        S8_CONE: "S8_CONE",
        S9_SPHERE: "S9_SPHERE",
    },

    CURVE_TEXT_ORIGIN_TYPE: {
        CENTER: "CENTER",
        CIRCUMCIRCLE_CENTER: "CIRCUMCIRCLE_CENTER",
    },
    BROWSER_TYPE: {
        IE10: 1,
        IE11: 2,
        EDGE: 3,
        OTHERS: 0,
    },

    ACTION_OPEN: 1,
    ACTION_CLOSE: -1,
};

/** ******** font.js ************** */
const FONTS = {};

/** ******** utils.js ************** */
/* eslint-disable */
// Create Base64 Object
var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function (e) {
        var t = "";
        var n;
        var r;
        var i;
        var s;
        var o;
        var u;
        var a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = ((n & 3) << 4) | (r >> 4);
            u = ((r & 15) << 2) | (i >> 6);
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64;
            } else if (isNaN(i)) {
                a = 64;
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
        }

        return t;
    },
    decode: function (e) {
        var t = "";
        var n;
        var r;
        var i;
        var s;
        var o;
        var u;
        var a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = (s << 2) | (o >> 4);
            r = ((o & 15) << 4) | (u >> 2);
            i = ((u & 3) << 6) | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r);
            }
            if (a != 64) {
                t = t + String.fromCharCode(i);
            }
        }
        t = Base64._utf8_decode(t);

        return t;
    },
    _utf8_encode: function (e) {
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode((r >> 6) | 192);
                t += String.fromCharCode((r & 63) | 128);
            } else {
                t += String.fromCharCode((r >> 12) | 224);
                t += String.fromCharCode(((r >> 6) & 63) | 128);
                t += String.fromCharCode((r & 63) | 128);
            }
        }

        return t;
    },
    _utf8_decode: function (e) {
        var t = "";
        var n = 0;
        var r = (c1 = c2 = 0);
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++;
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
                n += 2;
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode(((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                n += 3;
            }
        }

        return t;
    },
};

var UTILS = {
    removeInArray: function (arr, item) {
        var tmp = item.slice().sort();
        var id = -1;
        for (var i = 0; i < arr.length; i++) {
            var tmp2 = arr[i].slice().sort();
            if (tmp2.length == tmp.length) {
                var j = 0;
                while (j < tmp.length && tmp[j] == tmp2[j]) j++;
                if (j == tmp.length) {
                    id = i;
                    break;
                }
            }
        }

        return id >= 0 ? arr.splice(id, 1) : arr;
    },
};

function touchHandler(event, ignoreEls) {
    if (ignoreEls && (ignoreEls.indexOf($(event.target).attr("class")) > -1 || ignoreEls.indexOf($(event.target).attr("id")) > -1)) {
        console.log("ignore touch event");
        return;
    }

    event.preventDefault();
    var touch = event.changedTouches[0];

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(
        {
            touchstart: "mousedown",
            touchmove: "mousemove",
            touchend: "mouseup",
        }[event.type],
        true,
        true,
        window,
        1,
        touch.screenX,
        touch.screenY,
        touch.clientX,
        touch.clientY,
        false,
        false,
        false,
        false,
        0,
        null
    );

    touch.target.dispatchEvent(simulatedEvent);
}

function initDragEvent(ignoreEls) {
    console.log("initDragEvent");
    document.addEventListener(
        "touchstart",
        function (e) {
            return touchHandler(e, ignoreEls);
        },
        true
    );
    document.addEventListener(
        "touchmove",
        function (e) {
            return touchHandler(e, ignoreEls);
        },
        true
    );
    document.addEventListener(
        "touchend",
        function (e) {
            return touchHandler(e, ignoreEls);
        },
        true
    );
    document.addEventListener(
        "touchcancel",
        function (e) {
            return touchHandler(e, ignoreEls);
        },
        true
    );
}

function roundDecimal2(x) {
    var p = Math.pow(10, 2);

    return Math.round(x * p) / p;
}

// https://www.geeksforgeeks.org/how-to-check-the-user-is-using-internet-explorer-in-javascript/
function getBrowserType() {
    var ua = window.navigator.userAgent;

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    if (msie > 0) {
        // IE 10 or older => return version number
        return CONST.BROWSER_TYPE.IE10; // parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf("Trident/");
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf("rv:");

        return CONST.BROWSER_TYPE.IE11; // parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf("Edge/");
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return CONST.BROWSER_TYPE.EDGE; // parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    return CONST.BROWSER_TYPE.OTHERS;
}

function getIPadVersion() {
    window.ondevicemotion = function (event) {
        if (navigator.platform.indexOf("iPad") != -1) {
            var version = 1;
            if (event.acceleration) version += window.devicePixelRatio;

            return version;
        }
        window.ondevicemotion = null;
    };

    return 0;
}

function getFrameRate() {
    var browserType = getBrowserType();
    var ipadVersion = getIPadVersion();
    var frameRate;

    switch (browserType) {
        case CONST.BROWSER_TYPE.IE10:
            g_browserLog = "Browser: < IE 10 " + ipadVersion;
            frameRate = 20;
            break;

        case CONST.BROWSER_TYPE.IE11:
            g_browserLog = "Browser: IE 11 " + ipadVersion;
            frameRate = 20;
            break;

        case CONST.BROWSER_TYPE.EDGE:
            g_browserLog = "Browser: Edge " + ipadVersion;
            frameRate = 30;
            break;

        case CONST.BROWSER_TYPE.OTHERS:
            g_browserLog = "Browser: Others " + ipadVersion;
            frameRate = 40;
            break;
    }

    g_msgLog = g_browserLog;
    writeLog();

    return frameRate;
}

function getNumberOfFrames() {
    var browserType = getBrowserType();

    switch (browserType) {
        case CONST.BROWSER_TYPE.IE10:
            return 60;

        case CONST.BROWSER_TYPE.IE11:
            return 70;

        case CONST.BROWSER_TYPE.EDGE:
            return 80;

        case CONST.BROWSER_TYPE.OTHERS:
            return 150;
    }
}

function translateDxDy(selector, dx, dy) {
    var els = $(selector);
    for (var i = 0; i < els.length; i++) {
        var el = els[i];
        var matrix = $(el).attr("transform");
        if (!matrix || matrix === "none") {
            matrix = $(el).css("transform");
        }
        matrix = matrix
            .replace(/[^0-9\s\-.,]/g, "")
            .split(/[\s,]/)
            .filter((x) => x !== "")
            .map(function (m) {
                return Number(m);
            });

        if (matrix.length === 1) {
            matrix = [1, 0, 0, 1, 0, 0];
        }

        var x = matrix[12] || matrix[4] || matrix[0];
        var y = matrix[13] || matrix[5] || matrix[1];

        // cache origin transform x, y
        if ($(el).attr("origin-matrix-x") === undefined) {
            $(el).attr("origin-matrix-x", x);
        }
        if ($(el).attr("origin-matrix-y") === undefined) {
            $(el).attr("origin-matrix-y", y);
        }

        // update transform x
        [12, 4].forEach(function (m) {
            if (matrix[m] !== undefined) {
                matrix[m] += dx || 0;
            }
        });

        // update transform y
        [13, 5].forEach(function (m) {
            if (matrix[m] !== undefined) {
                matrix[m] += dy || 0;
            }
        });

        $(el).css("transform", "matrix(" + matrix.join(",") + ")");
        $(el).attr("transform", "matrix(" + matrix.join(",") + ")");
    }
}

function resetTranslateOrigin(selector) {
    var els = $(selector);
    for (var i = 0; i < els.length; i++) {
        var el = els[i];

        var matrix = $(el).attr("transform");

        if (!matrix || matrix === "none") {
            matrix = $(el).css("transform");
        }

        matrix = matrix
            .replace(/[^0-9\s\-.,]/g, "")
            .split(/[\s,]/)
            .filter((x) => x !== "")
            .map(function (m) {
                return Number(m);
            });

        if (matrix.length === 1) {
            matrix = [1, 0, 0, 1, 0, 0];
        } else if (matrix.length === 2) {
            matrix = [1, 0, 0, 1, ...matrix];
        }

        var x = matrix[12] || matrix[4] || matrix[0];
        var y = matrix[13] || matrix[5] || matrix[1];

        // get origin transform x, y
        if ($(el).attr("origin-matrix-x") !== undefined) {
            var dx = Number($(el).attr("origin-matrix-x"));
            [12, 4].forEach(function (m) {
                if (matrix[m] !== undefined) {
                    matrix[m] = Number(dx);
                }
            });
        }
        if ($(el).attr("origin-matrix-y") !== undefined) {
            var dy = Number($(el).attr("origin-matrix-y"));
            [13, 5].forEach(function (m) {
                if (matrix[m] !== undefined) {
                    matrix[m] = Number(dy);
                }
            });
        }

        var matrixText = "matrix(" + matrix.join(",") + ")";

        $(el).css("transform", matrixText).attr("transform", matrixText);
    }
}
/********** autoResize.js ***************/
// var gData = {
//     screenWidth: 1480,
//     screenHeight: 1000,
// };

// AutoResize();

// function AutoResize() {
//     //= === Auto resize ====
//     $(window).on("load", function () {
//         ResizeBody();
//         if (g_state && g_state.is_init_canvas && onWindowResizeCanvas) onWindowResizeCanvas();
//         if (fnCalculateSVGRatio) fnCalculateSVGRatio();
//     });
//     $(window)
//         .resize(function () {
//             setTimeout(function () {
//                 ResizeBody();
//                 if (fnCalculateSVGRatio) fnCalculateSVGRatio();
//                 if (g_state && g_state.is_init_canvas && onWindowResizeCanvas) onWindowResizeCanvas();
//             }, 200);
//         })
//         .trigger("resize");
// }

// var $baseContent;
// var mTop;

// if (!$baseContent) {
//     $baseContent = $("#divBody");
//     mTop = parseFloat($baseContent.css("top"));
// }

// function ResizeBody() {
//     var ratio = gData.screenWidth / gData.screenHeight;
//     var w = $(window).width();
//     var h = $(window).height();
//     var left = 0;
//     var nWidth = w;
//     var nHeight = h;

//     if (w / h < ratio) {
//         nHeight = w / ratio;
//         mTop = (h - nHeight) / 2;
//     } else {
//         nWidth = h * ratio;
//         mTop = 0;
//         left = (w - nWidth) / 2;
//     }

//     $("svg:first").css({
//         width: "100%",
//         height: "100%",
//     });
//     $("#divBody").css({
//         position: "relative",
//         left: left,
//         top: mTop,
//         width: nWidth,
//         height: nHeight,
//         transform: "scale(1)",
//     });

//     var contentWidth = $baseContent[0].clientWidth;
//     var contentHeight = $baseContent[0].clientHeight;
//     var windowOuterHeight = $(window).outerHeight();

//     var outerRate = window.innerHeight / windowOuterHeight;

//     var windowWidth = window.innerWidth;
//     var windowHeight = window.innerHeight;

//     var userAgent = window.navigator.userAgent.toLowerCase();
//     var isIphone = !!(userAgent.indexOf("iphone") > -1 && userAgent.indexOf("safari") > -1);

//     var scale = Math.min(windowWidth / contentWidth, windowHeight / contentHeight);

//     var newTop = 0;
//     if (isIphone && outerRate < 1 && windowWidth > windowHeight) {
//         newTop = mTop - (windowOuterHeight - window.innerHeight) / 2;
//         $baseContent.css("top", `${newTop}px`);
//         $baseContent.css({ transform: `scale(${scale})` });
//         $(window).scrollTop(0);
//     }
// }
const checkMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function () {
        return !!(this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
    },
};
/********** point3D.js ***************/
function Point3D(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

Point3D.prototype.plot2D = function () {
    return new Point2D(this.x, this.y);
};

Point3D.prototype.toArray = function () {
    return [this.x, this.y, this.z];
};

Point3D.prototype.sub = function (p) {
    return new Point3D(this.x - p.x, this.y - p.y, this.z - p.z);
};

Point3D.prototype.add = function (p) {
    return new Point3D(this.x + p.x, this.y + p.y, this.z + p.z);
};

Point3D.prototype.multiple = function (t) {
    return new Point3D(this.x * t, this.y * t, this.z * t);
};

Point3D.prototype.dot = function (p) {
    return this.x * p.x + this.y * p.y + this.z * p.z;
};

Point3D.prototype.dotXY = function (p) {
    return this.x * p.x + this.y * p.y;
};

Point3D.prototype.vectorLengthXY = function (p) {
    return Math.sqrt(this.dotXY(this));
};

Point3D.prototype.vectorLength = function (p) {
    return Math.sqrt(this.dot(this));
};

Point3D.prototype.copy = function () {
    return new Point3D(this.x, this.y, this.z);
};
Point3D.prototype.toVector3 = function () {
    return new THREE.Vector3(this.x, this.y, this.z);
};

// https://math.stackexchange.com/questions/137538/calculate-the-vector-normal-to-the-plane-by-given-points
Point3D.prototype.crossProduct = function (p) {
    var x = this.y * p.z - this.z * p.y;
    var y = this.z * p.x - this.x * p.z;
    var z = this.x * p.y - this.y * p.x;

    return new Point3D(x, y, z);
};

const getShapeFaceGeometry = (vertices, faces) => {
    let geo = new THREE.BufferGeometry();

    geo.setIndex(_.flatMapDeep(faces));
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(_.flattenDeep(vertices.map((p) => [p.x, p.y, p.z]))), 3));

    return geo;
};

const getLineGeomery = (vertices) => {
    const geo = new THREE.LineGeometry();
    geo.setPositions(_.flattenDeep(vertices.map((p) => [p.x, p.y, p.z])));

    return geo;
};

/********** control.js ***************/
/* eslint-disable prefer-destructuring */
class Control {
    constructor({
        name,
        type,
        id,
        class_name,
        mark,
        value,
        value1,
        value2,
        mouseup,
        mouseup_immediately,
        ignore_event_tracking,
        ignore_mouseup,
        mousedown,
        mousemove,
        mouseover,
        mouseout,
        render,
        render2,
        group,
        scroll_point,
        scope,
        x_scope,
        y_scope,
        minimum,
        snap_text,
        snap_point,
        fn_drag,
        fn_mouseup,
        allow_press,
        mouse_press_delay,
        is_skip_check_reload,
        is_group,
        flow_member,
        event_for_active_state,
        info,
        is_dynamic,
    }) {
        this.name = name;
        this.type = type;
        this.id = id;
        this.class = class_name;
        this.mark = mark;
        this.value = value;
        this.value1 = value1;
        this.value2 = value2;

        this.group = group;
        this.scroll_point = scroll_point;
        this.scope = scope;
        this.x_scope = x_scope;
        this.y_scope = y_scope;

        this.is_group = is_group;
        this.flow_member = flow_member;

        this.minimum = minimum;
        this.ignore_event_tracking = ignore_event_tracking;
        this.ignore_mouseup = ignore_mouseup;
        this.snap_text = snap_text;
        this.snap_point = snap_point;
        this.allow_press = allow_press;
        this.mouse_press_delay = mouse_press_delay;
        this.is_skip_check_reload = is_skip_check_reload;
        this.event_for_active_state = event_for_active_state;
        this.info = info;
        this.is_dynamic = is_dynamic;

        if (mouseup) this.mouseup = mouseup;
        if (mouseup_immediately) this.mouseup_immediately = mouseup_immediately;

        if (mousedown) this.mousedown = mousedown;
        if (mousemove) this.mousemove = mousemove;
        if (mouseover) this.mouseover = mouseover;
        if (mouseout) this.mouseout = mouseout;

        if (fn_mouseup) this.fn_mouseup = fn_mouseup;

        if (render) this.render = render;
        if (render2) this.render2 = render2;
        if (fn_drag) this.fn_drag = fn_drag;
    }
}

let elMaps = {};
const getEl = (idOrClass) => {
    if (!elMaps[idOrClass]) elMaps[idOrClass] = $(idOrClass);

    return elMaps[idOrClass];
};
const getControl = (name) => {
    if (_.isArray(g_state.controls)) {
        return g_state.controls.find((x) => x.name == name);
    }
    return g_state.controls[name];
};

const setValueControl = (name, value) => {
    let ctrl = getControl(name);
    ctrl.value = value;

    return ctrl;
};

/********** mathLib.js ***************/
// --------------------------- MATRIX 3 ---------------------------
function Matrix3(m) {
    this.m = m;
}

Matrix3.prototype.multipleVector = function (vector) {
    var u = vector.toArray();
    var v = new Array(3).fill(0);

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            v[i] += this.m[i][j] * u[j];
        }
    }

    return new Point3D(v[0], v[1], v[2]);
}; // --------------------------- MATRIX 4 ---------------------------

function Matrix4(m) {
    this.m = m;
}

Matrix4.prototype.multipleVector = function (u) {
    var v = new Array(4).fill(0);

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            v[i] += this.m[i][j] * u[j];
        }
    }

    return v;
};

Matrix4.prototype.multipleMatrix = function (matrix2) {
    var degree = 4;
    var m = [];

    for (var i = 0; i < degree; i++) {
        m.push([]);
    }

    for (var i = 0; i < degree; i++) {
        for (var j = 0; j < degree; j++) {
            m[i].push(0);

            for (var k = 0; k < degree; k++) {
                m[i][j] += this.m[i][k] * matrix2.m[k][j];
            }
        }
    }

    return new Matrix4(m);
}; // Returns the inverse of matrix `M`.

function matrix_invert(matrix) {
    var M = matrix.m; // I use Guassian Elimination to calculate the inverse:
    // (1) 'augment' the matrix (left) by the identity (on the right)
    // (2) Turn the matrix on the left into the identity by elemetry row ops
    // (3) The matrix on the right is the inverse (was the identity matrix)
    // There are 3 elemtary row ops: (I combine b and c in my code)
    // (a) Swap 2 rows
    // (b) Multiply a row by a scalar
    // (c) Add 2 rows
    //if the matrix isn't square: exit (error)

    if (M.length !== M[0].length) {
        return;
    } //create the identity matrix (I), and a copy (C) of the original

    var i = 0,
        ii = 0,
        j = 0,
        dim = M.length,
        e = 0,
        t = 0;
    var I = [],
        C = [];

    for (i = 0; i < dim; i += 1) {
        // Create the row
        I[I.length] = [];
        C[C.length] = [];

        for (j = 0; j < dim; j += 1) {
            //if we're on the diagonal, put a 1 (for identity)
            if (i == j) {
                I[i][j] = 1;
            } else {
                I[i][j] = 0;
            } // Also, make the copy of the original

            C[i][j] = M[i][j];
        }
    } // Perform elementary row operations

    for (i = 0; i < dim; i += 1) {
        // get the element e on the diagonal
        e = C[i][i]; // if we have a 0 on the diagonal (we'll need to swap with a lower row)

        if (e == 0) {
            //look through every row below the i'th row
            for (ii = i + 1; ii < dim; ii += 1) {
                //if the ii'th row has a non-0 in the i'th col
                if (C[ii][i] != 0) {
                    //it would make the diagonal have a non-0 so swap it
                    for (j = 0; j < dim; j++) {
                        e = C[i][j]; //temp store i'th row

                        C[i][j] = C[ii][j]; //replace i'th row by ii'th

                        C[ii][j] = e; //repace ii'th by temp

                        e = I[i][j]; //temp store i'th row

                        I[i][j] = I[ii][j]; //replace i'th row by ii'th

                        I[ii][j] = e; //repace ii'th by temp
                    } //don't bother checking other rows since we've swapped

                    break;
                }
            } //get the new diagonal

            e = C[i][i]; //if it's still 0, not invertable (error)

            if (e == 0) {
                return;
            }
        } // Scale this row down by e (so we have a 1 on the diagonal)

        for (j = 0; j < dim; j++) {
            C[i][j] = C[i][j] / e; //apply to original matrix

            I[i][j] = I[i][j] / e; //apply to identity
        } // Subtract this row (scaled appropriately for each row) from ALL of
        // the other rows so that there will be 0's in this column in the
        // rows above and below this one

        for (ii = 0; ii < dim; ii++) {
            // Only apply to other rows (we want a 1 on the diagonal)
            if (ii == i) {
                continue;
            } // We want to change this element to 0

            e = C[ii][i]; // Subtract (the row above(or below) scaled by e) from (the
            // current row) but start at the i'th column and assume all the
            // stuff left of diagonal is 0 (which it should be if we made this
            // algorithm correctly)

            for (j = 0; j < dim; j++) {
                C[ii][j] -= e * C[i][j]; //apply to original matrix

                I[ii][j] -= e * I[i][j]; //apply to identity
            }
        }
    } //we've done all operations, C should be the identity
    //matrix I should be the inverse:

    return I;
}

function multipleMatrixes(matrixes) {
    var M = matrixes[0];

    for (var i = 1; i < matrixes.length; i++) {
        M = M.multipleMatrix(matrixes[i]);
    }

    return M;
} // --------------------------- MATRIX 3 ---------------------------

var MathLib = {
    rotatePoint: function rotatePoint(type, origin, P, alpha) {
        var theta = (alpha * Math.PI) / 180;
        var sin = Math.sin(theta);
        var cos = Math.cos(theta);
        var rotateMatrix;

        if (type == CONST.AXIS.X) {
            rotateMatrix = new Matrix3([
                [1, 0, 0],
                [0, cos, -sin],
                [0, sin, cos],
            ]);
        } else if (type == CONST.AXIS.Y) {
            rotateMatrix = new Matrix3([
                [cos, 0, sin],
                [0, 1, 0],
                [-sin, 0, cos],
            ]);
        } else if (type == CONST.AXIS.Z) {
            rotateMatrix = new Matrix3([
                [cos, -sin, 0],
                [sin, cos, 0],
                [0, 0, 1],
            ]);
        }

        var v = P.sub(origin);
        return rotateMatrix.multipleVector(v).add(origin);
    },
    // https://en.wikipedia.org/wiki/Rotation_matrix
    rotate: function rotate(shape, type, alpha, origin, isSkipCoordinate, targetVertice0) {
        var theta = (alpha * Math.PI) / 180;
        var sin = Math.sin(theta);
        var cos = Math.cos(theta);
        var rotateMatrix;

        if (type == CONST.AXIS.X) {
            rotateMatrix = new Matrix3([
                [1, 0, 0],
                [0, cos, -sin],
                [0, sin, cos],
            ]);
        } else if (type == CONST.AXIS.Y) {
            rotateMatrix = new Matrix3([
                [cos, 0, sin],
                [0, 1, 0],
                [-sin, 0, cos],
            ]);
        } else if (type == CONST.AXIS.Z) {
            rotateMatrix = new Matrix3([
                [cos, -sin, 0],
                [sin, cos, 0],
                [0, 0, 1],
            ]);
        }

        // console.log('MathLib.rotate', type, alpha, origin, rotateMatrix)

        var o = origin ? origin : new Point3D(0, 0, 0);

        if (!targetVertice0) {
            shape.vertices = shape.vertices.map((v) => rotateMatrix.multipleVector(v.sub(o)));
            if (shape.vertices1) shape.vertices1 = shape.vertices1.map((v) => rotateMatrix.multipleVector(v.sub(o)));
            if (shape.vertices2) shape.vertices2 = shape.vertices2.map((v) => rotateMatrix.multipleVector(v.sub(o)));

            if (shape.coordinates && !isSkipCoordinate) {
                shape.coordinates = shape.coordinates.map((v) => rotateMatrix.multipleVector(v.sub(o)));
            }
        } else {
            if (shape.vertices0) shape.vertices0 = shape.vertices0.map((v) => rotateMatrix.multipleVector(v.sub(o)));
            // if (shape.vertices01) shape.vertices01 = shape.vertices01.map((v) => rotateMatrix.multipleVector(v.sub(o)));
            // if (shape.vertices02) shape.vertices02 = shape.vertices02.map((v) => rotateMatrix.multipleVector(v.sub(o)));
        }
    },
    rotate2: function rotate2(shape, P1, P2, alpha, origin, isSkipCoordinate, targetVertice0) {
        var o = origin || new Point3D(0, 0, 0);

        if (isSkipCoordinate) {
            if (!targetVertice0) {
                shape.vertices = shape.vertices.map((v, idx) => (idx > shape.originVerticesIdx ? v : this.customRotate(v, P1, P2, alpha)));
                if (shape.vertices1)
                    shape.vertices1 = shape.vertices1.map((v, idx) => (idx > shape.originVerticesIdx ? v : this.customRotate(v, P1, P2, alpha)));
                if (shape.vertices2)
                    shape.vertices2 = shape.vertices2.map((v, idx) => (idx > shape.originVerticesIdx ? v : this.customRotate(v, P1, P2, alpha)));
            } else {
                if (shape.vertices0)
                    shape.vertices0 = shape.vertices0.map((v, idx) => (idx > shape.originVerticesIdx ? v : this.customRotate(v, P1, P2, alpha)));

                // if (shape.vertices01)
                //     shape.vertices01 = shape.vertices01.map((v, idx) => (idx > shape.originVerticesIdx ? v : this.customRotate(v, P1, P2, alpha)));
                // if (shape.vertices02)
                //     shape.vertices02 = shape.vertices02.map((v, idx) => (idx > shape.originVerticesIdx ? v : this.customRotate(v, P1, P2, alpha)));
            }
        } else {
            if (!targetVertice0) {
                shape.vertices = shape.vertices.map((v) => this.customRotate(v, P1, P2, alpha));
                if (shape.vertices1) shape.vertices1 = shape.vertices1.map((v) => this.customRotate(v, P1, P2, alpha));
                if (shape.vertices2) shape.vertices2 = shape.vertices2.map((v) => this.customRotate(v, P1, P2, alpha));

                if (shape.coordinates && !isSkipCoordinate) {
                    shape.coordinates = shape.coordinates.map((v) => this.customRotate(v, P1, P2, alpha));
                }
            } else {
                if (shape.vertices0) shape.vertices0 = shape.vertices0.map((v) => this.customRotate(v, P1, P2, alpha));
                // if (shape.vertices01) shape.vertices01 = shape.vertices01.map((v) => this.customRotate(v, P1, P2, alpha));
                // if (shape.vertices02) shape.vertices02 = shape.vertices02.map((v) => this.customRotate(v, P1, P2, alpha));
            }
        }

        // if (shape.coordinates0 && !isSkipCoordinate) {
        //     shape.coordinates0 = shape.coordinates0.map((v) => this.customRotate(v, P1, P2, alpha));
        // }

        if (shape.translateVector) {
            shape.translateVector = this.customRotate(shape.translateVector, P1, P2, alpha);
        }
    },
    // https://robotics.stackexchange.com/questions/12782/how-rotate-a-point-around-an-arbitrary-line-in-3d
    customRotate: function customRotate(P, P1, P2, alpha) {
        var theta = (alpha * Math.PI) / 180; // var AC = C.sub(A);
        // var AB = B.sub(A);
        // var t = AC.dot(AB) / Math.pow(AB.length(), 2);
        // var D = A.add(AB.muliple(t));

        var V = P2.sub(P1);
        var l = V.vectorLength();
        var U = V.multiple(1 / l);
        if (Math.abs(U.y) < CONST.EPSILON && Math.abs(U.z) < CONST.EPSILON) {
            U.y = 0.00001;
            U.z = 0.00001;
        }
        var a = U.x;
        var b = U.y;
        var c = U.z;
        var d = Math.sqrt(b * b + c * c); // rotate

        var x = [P.x, P.y, P.z, 1];
        var T = new Matrix4([
            [1, 0, 0, -P1.x],
            [0, 1, 0, -P1.y],
            [0, 0, 1, -P1.z],
            [0, 0, 0, 1],
        ]);
        var Rx = new Matrix4([
            [1, 0, 0, 0],
            [0, c / d, -b / d, 0],
            [0, b / d, c / d, 0],
            [0, 0, 0, 1],
        ]);
        var Ry = new Matrix4([
            [d, 0, -a, 0],
            [0, 1, 0, 0],
            [a, 0, d, 0],
            [0, 0, 0, 1],
        ]);
        var cos = Math.cos(theta);
        var sin = Math.sin(theta);
        var Rz = new Matrix4([
            [cos, -sin, 0, 0],
            [sin, cos, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]);
        var T_1 = new Matrix4(matrix_invert(T));
        var Rx_1 = new Matrix4(matrix_invert(Rx));
        var Ry_1 = new Matrix4(matrix_invert(Ry));
        var output = multipleMatrixes([T_1, Rx_1, Ry_1, Rz, Ry, Rx, T]).multipleVector(x);
        return new Point3D(output[0], output[1], output[2]);
    },

    customRotate2: function (P, P1, P2, alpha) {
        var theta = (alpha * Math.PI) / 180;
        var V = P2.sub(P1);
        var l = V.vectorLength();
        var U = V.multiple(1 / l);

        var cos = Math.cos(theta);
        var sin = Math.sin(theta);

        let rotateMatrix = new Matrix4([
            [cos + U.x * U.x * (1 - cos), U.x * U.y * (1 - cos) - U.z * sin, U.x * U.z * (1 - cos) + U.y * sin, 0], //
            [U.y * U.x * (1 - cos) + U.z * sin, cos + U.y * U.y * (1 - cos), U.y * U.z * (1 - cos) - U.x * sin, 0],
            [U.z * U.x * (1 - cos) - U.y * sin, U.z * U.y * (1 - cos) + U.x * sin, cos + U.z * U.z * (1 - cos), 0],
            [0, 0, 0, 1],
        ]);
        var T = new Matrix4([
            [1, 0, 0, -P1.x],
            [0, 1, 0, -P1.y],
            [0, 0, 1, -P1.z],
            [0, 0, 0, 1],
        ]);
        var T_1 = new Matrix4(matrix_invert(T));

        var x = [P.x, P.y, P.z, 1];

        let output = multipleMatrixes([T_1, rotateMatrix, T]).multipleVector(x);

        return new Point3D(output[0], output[1], output[2]);
    },
    getPointByRatio: function getPointByRatio(p1, p2, r) {
        return new Point3D(p1.x + (p2.x - p1.x) * r, p1.y + (p2.y - p1.y) * r, p1.z + (p2.z - p1.z) * r);
    },
    getPointByLength: function getPointByLength(p1, p2, d) {
        var r = d / MathLib.length3D(p1, p2);
        return this.getPointByRatio(p1, p2, r);
    },
    getPointByLengthXY: function getPointByLengthXY(p1, p2, d) {
        var r = d / MathLib.lengthXY(p1, p2);
        return this.getPointByRatio(p1, p2, r);
    },
    length3D: function length3D(p1, p2) {
        return p1.sub(p2).vectorLength();
    },
    lengthXY: function lengthXY(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    },
    angleBetweenVectors: function angleBetweenVectors(p, p1, p2) {
        var u = p1.sub(p);
        var v = p2.sub(p);
        var cos = u.dot(v) / (u.vectorLength() * v.vectorLength());
        return (Math.acos(cos) * 180) / Math.PI;
    },
    angleBetweenVectors2: function (p, p1, p2) {
        let dAngle = MathLib.angleBetweenVectors(p, p1, p2) || 0;
        let v1 = p1.sub(p);
        let v2 = p2.sub(p);
        let n = v1.crossProduct(v2);

        return (dAngle = dAngle * Math.sign(n.z));
    },
    angleBetweenVectorsXY: function angleBetweenVectorsXY(_p, _p1, _p2) {
        var p = _p.copy();

        var p1 = _p1.copy();

        var p2 = _p2.copy();

        p.z = 0;
        p1.z = 0;
        p2.z = 0;
        var u = p1.sub(p);
        var v = p2.sub(p);
        var cos = u.dot(v) / (u.vectorLength() * v.vectorLength());
        return (Math.acos(cos) * 180) / Math.PI;
    },
    pointInsidePolygon: function pointInsidePolygon(p, vs) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
        var x = p.x,
            y = p.y;
        var inside = false;

        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i].x,
                yi = vs[i].y;
            var xj = vs[j].x,
                yj = vs[j].y;
            var intersect = yi > y + CONST.EPSILON != yj > y + CONST.EPSILON && x + CONST.EPSILON < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) inside = !inside;
        }

        return inside;
    },
    lineIntersectLine: function lineIntersectLine(_P1, _P2, _Q1, _Q2) {
        var P1 = new Point3D(_P1.x, _P1.y, 0);
        var P2 = new Point3D(_P2.x, _P2.y, 0);
        var Q1 = new Point3D(_Q1.x, _Q1.y, 0);
        var Q2 = new Point3D(_Q2.x, _Q2.y, 0); // P = P1 + s * (P2 - P1)

        var u = P2.sub(P1);
        var v = Q2.sub(Q1);
        var ut = new Point3D(u.y, -u.x, 0);
        var vt = new Point3D(v.y, -v.x, 0);
        var w = P1.sub(Q1);
        if (Math.abs(ut.x / (vt.x + CONST.EPSILON) - ut.y / (vt.y + CONST.EPSILON)) < CONST.EPSILON)
            return {
                intersect: false,
            };
        var t1 = -vt.dot(w) / vt.dot(u);
        var P = P1.add(u.multiple(t1)); // P = Q1 + t2 * (Q2 - Q1)

        var t2 = ut.dot(w) / ut.dot(v);
        return {
            intersect: true,
            ratio: t1,
            ratio2: t2,
            intersectPoint: P,
        };
    },

    // http://geomalgorithms.com/a05-_intersect-1.html
    lineIntersectPlan: function lineIntersectPlan(P1, P2, planePoints) {
        var A = planePoints[1];
        var B = planePoints[0];
        var C = planePoints[2]; // P = P1 + t * u

        var AB = B.sub(A);
        var AC = C.sub(A);
        var n = AB.crossProduct(AC);
        var u = P2.sub(P1);
        var v = P1.sub(A);
        var s = n.dot(u);
        if (Math.abs(s) < CONST.EPSILON)
            return {
                isIntersect: false,
            };
        var t = -n.dot(v) / n.dot(u);
        var P = P1.add(u.multiple(t)); // check point P inside plane

        var isInsideRay = t > CONST.EPSILON && t < 1 - CONST.EPSILON;
        var isInsidePolygon = this.pointInsidePolygon(P, planePoints);
        return {
            isIntersect: true,
            intersectPoint: P,
            isInsideRay: isInsideRay,
            isInsidePolygon: isInsidePolygon,
            ratio: t,
        };
    },
    centerPoint: function centerPoint(points) {
        var n = points.length;
        var G = new Point3D(0, 0, 0);

        for (var i = 0; i < n; i++) {
            G = G.add(points[i].multiple(1 / n));
        }

        return G;
    },
    circumcircleCenterY: function circumcircleCenterY(A, B, C) {
        var M = this.getPointByRatio(A, B, 0.5);
        var B1 = this.rotatePoint(CONST.AXIS.Y, M, B, 90);
        var N = this.getPointByRatio(A, C, 0.5);
        var C1 = this.rotatePoint(CONST.AXIS.Y, N, C, 90);

        var _M = new Point3D(M.x, M.z, 0);

        var _B1 = new Point3D(B1.x, B1.z, 0);

        var _N = new Point3D(N.x, N.z, 0);

        var _C1 = new Point3D(C1.x, C1.z, 0);

        var O = this.lineIntersectLine(_M, _B1, _N, _C1).intersectPoint;
        return new Point3D(O.x, 0, O.y);
    },
};

/********** SVGLib ***************/

var SVGLib = {
    createTag: function (tag, attrs) {
        var obj = document.createElementNS(CONST.SVG.NAMESPACE, tag);
        $.map(Object.keys(attrs), function (key) {
            $(obj).attr(key, attrs[key]);
        });

        if (attrs.text && tag == "text") obj.textContent = attrs.text;

        return obj;
    },

    getStrMatrix: function (a, b, c, d, e, f) {
        return `matrix(${[a, b, c, d, e, f].join(",")})`;
    },

    getLinePath: function (o, p1, p2, grid) {
        var d = [
            "M",
            roundDecimal2((o.x + p1.x) * grid),
            roundDecimal2((o.y + p1.y) * grid),
            "L",
            roundDecimal2((o.x + p2.x) * grid),
            roundDecimal2((o.y + p2.y) * grid),
        ].join(" ");

        return d;
    },

    drawLine: function (o, p1, p2, grid, lineStyle, id, strClass) {
        var attrs = Object.assign(lineStyle, {
            d: this.getLinePath(o, p1, p2, grid),
            id: id,
            class: strClass,
        });

        var line = this.createTag("path", attrs);

        return line;
    },

    makeSpiral: (centerX, centerY, startAngle, startRadius, rAngle, dArrow) => {
        // console.log('makeSpiral', centerX, centerY, startAngle, startRadius, rAngle, dArrow)
        var pointsPerQuarter = 70;

        var points = [];

        // let dArrow = rAngle > 0 ? -0.08 : -0.08;
        let isReverse = rAngle < 0;
        // if (Math.abs(rAngle) < 0.25) dArrow = 0;
        // console.log("isReverse", isReverse);

        // let quarterTurns = Math.abs(rAngle / (2 * Math.PI)) * 4 + dArrow;
        let quarterTurns = Math.abs(rAngle / (2 * Math.PI)) * 4;

        let endRadius = quarterTurns > 4 ? startRadius - 7 : startRadius;

        var radiusStep = (endRadius - startRadius) / 4 / pointsPerQuarter;
        // console.log("radiusStep", radiusStep);

        const ignoreStep = Math.abs(dArrow) * pointsPerQuarter;

        var dAngle = 0;
        if (quarterTurns < 6) {
            dAngle = ((6 - quarterTurns) * Math.PI) / 2;
        } else if (quarterTurns > 6) {
            dAngle = ((quarterTurns % 6 ? 4 - (quarterTurns % 6) : 0) * Math.PI) / 2;
        }

        for (var i = 0; i < quarterTurns * pointsPerQuarter; i++) {
            var radius = (radiusStep < 0 ? -endRadius : -startRadius) + radiusStep * i;
            // console.log(i, startRadius, "radius", radius);
            var angle = (isReverse ? -1 : 1) * (dAngle + startAngle + (i * Math.PI) / 2 / pointsPerQuarter);

            if (dArrow && i < ignoreStep) continue;
            points.push([centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle)]);
        }

        points.reverse()

        points.push([centerX, centerY])

        return {
            // points: points.map((ps) => ps.map((x) => _.round(x, 2)).join(",")).join(","),
            d: points
                .map((ps) => ps.map((x) => _.round(x, 2)))
                .map((p, idx) => [idx == 0 ? "M" : "L", p[0], p[1]].join(" "))
                .join(" "),
            show_arrow: dArrow != 0,
        };
    },

    getPointPos: function (o, p, grid) {
        var cx = roundDecimal2((o.x + p.x) * grid);
        var cy = roundDecimal2((o.y + p.y) * grid);

        return {
            cx: cx,
            cy: cy,
        };
    },

    drawPoint: function (o, p, grid, pointStyle, id) {
        var pointPos = this.getPointPos(o, p, grid);
        var attrs = Object.assign(pointStyle, {
            cx: pointPos.cx,
            cy: pointPos.cy,
            id: id,
        });

        var point = this.createTag("circle", attrs);

        return point;
    },

    getFacePath: function (o, faceVertices, grid) {
        var d = `${$.map(faceVertices, function (v, id) {
            return [id == 0 ? "M" : "L", roundDecimal2((o.x + v.x) * grid), roundDecimal2((o.y + v.y) * grid)].join(" ");
        }).join(" ")}z`;

        return d;
    },

    getPath: function (o, verticePairs, grid) {
        var d = verticePairs
            .map((p) =>
                p
                    .map((v, idx) =>
                        [idx == 0 && p.length > 1 ? "M" : "L", roundDecimal2((o.x + v.x) * grid), roundDecimal2((o.y + v.y) * grid)].join(" ")
                    )
                    .join(" ")
            )
            .join(" ");

        // var d = `${$.map(verticePairs, function (v, id) {
        //     return [id == 0 ? "M" : "L", roundDecimal2((o.x + v.x) * grid), roundDecimal2((o.y + v.y) * grid)].join(" ");
        // }).join(" ")}`;

        return d;
    },

    getFaceStyle: function getFaceStyle(faceVertices) {
        var fill, opacity;
        var minOpacity = 0.4;
        var middleOpacity = 0.8;
        var maxOpacity = 1;
        var u = faceVertices[0].sub(faceVertices[1]);
        var v = faceVertices[0].sub(faceVertices[2]);
        var normVector = u.crossProduct(v); // if (isReverse) {
        //     normVector = normVector.multiple(-1);
        // }

        var w = new Point3D(0, 0, 1); // 0 to 180

        var alpha = MathLib.angleBetweenVectors(new Point3D(0, 0, 0), normVector, w); // alpha = 180 - alpha;
        // if (alpha > 90)
        //     alpha = 180 - alpha;
        // if (isReverse) alpha = 180 - alpha;

        var isInside = false;

        if (alpha <= 90) {
            // [middle, max]
            fill = CONFIG.FACE_COLOR || "#FADCB4"; //"#67bab2";

            opacity = 0.9; // middleOpacity + (maxOpacity - middleOpacity) * (1 - alpha / 90);
        } else {
            // [min, middle]
            isInside = true;
            // var minOpacity = 0.65;
            // var middleOpacity = 1;

            fill = CONFIG.FACE_COLOR_INSIDE || "#FADCB4";
            // opacity = middleOpacity - (alpha / 90 - 1) * (middleOpacity - minOpacity);
            opacity = 0.9;
        }

        return {
            fill: fill,
            opacity: roundDecimal2(opacity),
            isInside: isInside,
        };
    },

    drawFace: function (o, faceVertices, grid, faceStyle, id) {
        var attrs = Object.assign(faceStyle, {
            d: this.getFacePath(o, faceVertices, grid),
            id: id,
        });

        var face = this.createTag("path", attrs);

        return face;
    },

    drawText: function (o, x, y, text, grid, textStyle, id) {
        var attrs = Object.assign(textStyle, {
            x: roundDecimal2((o.x + x) * grid),
            y: roundDecimal2((o.y + y) * grid),
            id: id,
        });

        var svgText = this.createTag("text", attrs);
        svgText.textContent = text;

        return svgText;
    },

    updateStyle: function (el, styles) {
        $.map(Object.keys(styles), function (key) {
            $(el).attr(key, styles[key]);
        });
    },

    getTranslate: function (el) {
        var matrix = $(el).attr("transform");
        if (matrix === "none") {
            matrix = $(el).css("transform");
        }

        matrix = (matrix || "")
            .replace(/[^0-9\s\-.,]/g, "")
            .split(/[\s,]/)
            .map(function (m) {
                return Number(m);
            });
        if (matrix.length === 1) {
            return { top: 0, left: 0 };
        }
        var x = matrix[12] || matrix[4] || matrix[0];
        var y = matrix[13] || matrix[5] || matrix[1];

        return {
            left: x,
            top: y,
        };
    },
};

// template

var g_isAnimatingButton = {};
var g_latestMousePress = "";

// ===== state =====

let g_state;
let g_state_controls;
let g_default_state;
let g_eventId = 0;
let g_isRenderingGraph = false;

// ===== Template  =====

window.addEventListener("mousemove", function (ev) {
    ev.preventDefault ? ev.preventDefault() : (ev.returnValue = false);
});

window.addEventListener(
    "touchmove",
    function (e) {
        e.preventDefault();
    },
    {
        passive: false,
    }
);

function showElement(element, visible) {
    return $(element).css("visibility", visible ? "visible" : "hidden");
}
const animateDraw = async (totalStep, delayTime, fn, fnCheckIsPause, fnCheckDetroy) => {
    var eventId = g_eventId;
    for (let i = 0; i < totalStep; i++) {
        // if (eventId != g_eventId) return;
        // if (fnCheckDetroy && fnCheckDetroy()) {
        //     return;
        // }
        // while (fnCheckIsPause && fnCheckIsPause()) {
        //     // eslint-disable-next-line no-await-in-loop
        //     await delay(200);
        // }

        // if (eventId != g_eventId) return;
        if (fnCheckDetroy && fnCheckDetroy()) {
            return;
        }

        fn(i, totalStep, (i + 1) / totalStep);

        while (fnCheckIsPause && fnCheckIsPause()) {
            // eslint-disable-next-line no-await-in-loop
            await delay(200);
        }
        await delay(delayTime);

        if (i == totalStep) i = 0;
    }
};
async function animateButtonEffect(id, isDown, cb, dy) {
    if (g_isAnimatingButton[id] && isDown) return;
    // while (g_isAnimatingButton[id]) {
    //     await delay(50);
    // }

    g_isAnimatingButton[id] = true;

    let defaultDy = 4;
    var self = $(id);
    var duration = 50;
    var nFrame = 5;
    var dy1 = isDown ? 0 : dy || defaultDy;
    var dy2 = isDown ? dy || defaultDy : 0;
    var ddy = (dy2 - dy1) / nFrame;

    let count = 0;

    if (!dy) {
        if (cb) cb();
    } else {
        var itv = setInterval(() => {
            count += 1;
            dy1 += ddy;

            self.attr("transform", SVGLib.getStrMatrix(1, 0, 0, 1, 0, dy1));

            if (count >= nFrame) {
                clearInterval(itv);
                delete g_isAnimatingButton[id];
                if (cb) cb();
            }
        }, duration / nFrame);
    }
}
let g_isMouseDown = false;

var itvKeepSVGNotMove;
function keepDraggableSvgNotMove() {
    if (g_dragablePosition.top == undefined || g_dragablePosition.top === null) {
        g_dragablePosition.top = parseInt($(".draggable-zone").css("top"), 10) || 0;
        g_dragablePosition.left = parseInt($(".draggable-zone").css("left"), 10) || 0;
    } else {
        setTimeout(function () {
            $(".draggable-zone").css("top", g_dragablePosition.top);
            $(".draggable-zone").css("left", g_dragablePosition.left);
        }, 50);
    }

    if (!itvKeepSVGNotMove)
        itvKeepSVGNotMove = setInterval(() => {
            keepDraggableSvgNotMove();
        }, 200);
}

function keepScrollBarNotMove(el) {
    setTimeout(function () {
        $(el).css("top", 0);
        $(el).css("left", 0);
    }, 50);
}

// ---------------------------------------------------------
var Draw = {
    setting: {
        svgDom: function svgDom() {
            return $("#svg");
        },
        grid: 45,
        lineStyle: {
            stroke: "black",
            "stroke-width": "2.5px",
        },
    },
    init: function init() {
        var svgShape = SVGLib.createTag(CONST.SVG.TAG.GROUP, {
            id: "svg_shape",
            transform: SVGLib.getStrMatrix(1, 0, 0, 1, 390, 280),
        });
        this.setting.svgDom().append(svgShape);

        this.shapeGroup = function () {
            return $("#svg_shape");
        };
    },

    appendToShapeGroup: function (childElement) {
        this.shapeGroup().append(childElement);
        return childElement;
    },
    prependToShapeGroup: function (childElement) {
        this.shapeGroup().prepend(childElement);
        return childElement;
    },
    appendToFloatingShapeGroup: function (childElement) {
        this.floatingShapeGroup.append(childElement);
    },
};

const getBoundingClientRect = (el) => {
    return $(el)[0].getBoundingClientRect();
};

const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const getCenterOfCircle = (el) => {
    const bbox = getBoundingClientRect(el);

    return {
        x: bbox.x + bbox.width / 2,
        y: bbox.y + bbox.height / 2,
    };
};

const checkifEventValid = (currentEventId) => {
    return currentEventId == g_eventId;
};

let g_isPressMouse = false;
let g_svgRatio = 1;

let fnCalculateSVGRatio = () => {
    g_svgRatio = getBoundingClientRect(getEl("#rect-bg")).width / Number(getEl("#rect-bg").attr("width"));
    // console.log("g_svgRatio", g_svgRatio);
};
const getSVGRect = (el) => {
    fnCalculateSVGRatio();
    let rect = getBoundingClientRect(el);

    return {
        ...cursorPoint(rect),
        width: rect.width / g_svgRatio,
        height: rect.height / g_svgRatio,
    };
};

function getMousePosition(e) {
    let evt = e;
    var CTM = svg.getScreenCTM();
    if (evt.touches) {
        evt = evt.touches[0];
    }

    return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d,
    };
}

$(document).ready(function () {
    setTimeout(async () => {
        let dZoom = 0.1;
        let isPinch = false;
        let isMouseDownZoomArea = false;

        let prevPos = {
            x: 0,
            y: 0,
        };

        var svg = document.querySelector("svg");
        // Create an SVGPoint for future math
        var pt = svg.createSVGPoint();

        function cursorPoint(evt) {
            var c = /Edge/.test(window.navigator.userAgent) ? document.getElementById("svg") : svg;
            pt.x = evt.clientX || evt.x || 0;
            pt.y = evt.clientY || evt.y || 0;
            var ctm = c.getScreenCTM();
            var inverse = ctm.inverse();
            var p = pt.matrixTransform(inverse);

            let ratio = 1;
            let isChrome = !!navigator.userAgent.match(/Chrome/i) || window.chrome;

            if (getEl("#stage_1").length && !isChrome) {
                let stg1El = getEl("#stage_1")[0];
                let scale = stg1El.getBoundingClientRect().width / stg1El.offsetWidth;
                if (scale) {
                    ratio = 1 / scale;

                    // console.log("scale", scale);
                }
            }

            return new Point3D(_.round(p.x * ratio, 2), _.round(p.y * ratio, 2), 0);
        }

        window.cursorPoint = cursorPoint;

        const fnControlScrollbar = (ctrl) => {
            console.log("fnControlScrollbar initial", ctrl.name);
            let elSelector = ctrl.id ? `#${ctrl.id}` : `.${ctrl.class}`;
            let el = $(elSelector);
            const scrollPoint = $(ctrl.scroll_point);
            let isDrag = false;
            let prevValue = null;

            let fnDrag = (event, isSnap, eventName) => {
                g_latestMousePress = ctrl.id || ctrl.class || ctrl.name;
                // console.log("fnDrag", ctrl.name, isSnap, eventName);
                //  event.stopPropagation();

                const [x0, x1] = ctrl.x_scope || [];
                const [y0, y1] = ctrl.y_scope || [];

                var layoutLoc = SVGLib.getTranslate(el);
                // console.log("layoutLoc", layoutLoc);
                var curPos = cursorPoint(event);

                var x = curPos.x - layoutLoc.left;
                var y = -(curPos.y - layoutLoc.top);

                ctrl.curPos = curPos;

                let percent = (x - x0) / (x1 - x0);
                let percentY = 0;
                let isHavePercentY = false;
                if (ctrl.y_scope) {
                    if (!_.get(ctrl, ["x_scope", "length"])) {
                        percent = (y1 - Math.abs(y)) / (y1 - y0);
                    } else {
                        percentY = (y1 - Math.abs(y)) / (y1 - y0);
                        isHavePercentY = true;
                    }
                }

                if (percent < 0) percent = 0;
                if (percent > 1) percent = 1;

                if (percentY < 0) percentY = 0;
                if (percentY > 1) percentY = 1;

                let roundLength = _.get(ctrl.minimum.toString().split(".")[1], "length", 0);

                ctrl.value = _.round(percent * (ctrl.scope[1] - ctrl.scope[0]) + ctrl.scope[0], roundLength);

                if (ctrl.value < ctrl.scope[0]) ctrl.value = ctrl.scope[0];
                if (ctrl.value > ctrl.scope[1]) ctrl.value = ctrl.scope[1];

                if (isHavePercentY) {
                    ctrl.valueY = _.round(percentY * (ctrl.scope[1] - ctrl.scope[0]) + ctrl.scope[0], roundLength);

                    if (ctrl.valueY < ctrl.scope[0]) ctrl.valueY = ctrl.scope[0];
                    if (ctrl.valueY > ctrl.scope[1]) ctrl.valueY = ctrl.scope[1];
                }

                const stopPoints = ctrl.snap_point || [];
                const stopValue = stopPoints.find((x) => Math.abs(ctrl.value - x) < 1.2 * ctrl.minimum);
                if (stopValue != undefined) {
                    ctrl.value = stopValue;
                    // console.log("found stop value", stopValue);
                } else if (isSnap) {
                    ctrl.value = _.round(_.round(ctrl.value / ctrl.minimum) * ctrl.minimum, roundLength);
                }

                if (eventName == "mousedown") {
                    prevValue = ctrl.value;
                }

                ctrl.render();

                if (ctrl.fn_drag)
                    ctrl.fn_drag({
                        prevValue,
                        eventName,
                    });

                if (eventName == "mousemove") {
                    prevValue = ctrl.value;
                }

                // console.log("prevValue", prevValue, eventName);

                keepScrollBarNotMove(el);
            };

            if (ctrl.is_dynamic) {
                $(document)
                    .on("mousedown", elSelector, function (event) {
                        ctrl.el = this;
                        ctrl.is_drag = false;
                        isDrag = true;
                        prevValue = null;
                        fnDrag(event, true, "mousedown");
                    })
                    .css("position", "absolute");
            } else {
                $(el)
                    .on("mousedown", function (event) {
                        ctrl.el = this;
                        ctrl.is_drag = false;
                        isDrag = true;
                        prevValue = null;
                        fnDrag(event, true, "mousedown");
                    })
                    .css("position", "absolute");
            }

            $(document).on("mousemove", function (event) {
                if (isDrag) {
                    ctrl.is_drag = true;
                    fnDrag(event, false, "mousemove");
                    keepScrollBarNotMove(el);
                } else if (ctrl.mousemove) {
                    let dx = event.clientX - prevMove.x;
                    let dy = event.clientY - prevMove.y;
                    if (Math.pow(dx, 2) + Math.pow(dy, 2) < 1) return;
                    ctrl.mousemove(event);

                    prevMove = {
                        x: event.clientX,
                        y: event.clientY,
                    };
                }
            });

            $(document).on("mouseup", function (event) {
                if (isDrag) {
                    fnDrag(event, true, "mouseup");
                    keepScrollBarNotMove(el);
                    isDrag = false;
                    prevValue = null;
                    ctrl.is_drag = false;
                    delete ctrl.el;
                }
            });

            if (ctrl.mouseover) {
                $(el).on("mouseover", function (event) {
                    ctrl.mouseover(event);
                    ctrl.is_hover = true;
                });
            }
            if (ctrl.mouseout) {
                $(el).on("mouseout", function (event) {
                    ctrl.mouseout(event);
                    ctrl.is_hover = false;
                });
            }
        };

        const fnControlDrag = (ctrl) => {
            console.log("fnControlDrag initial", ctrl.name);
            let elSelector = ctrl.id ? `#${ctrl.id}` : `.${ctrl.class}`;
            let el = $(elSelector);
            let isDrag = false;
            let prevValue = null;

            ctrl.init_el = el;

            let prev = { x: 0, y: 0 };
            let fnDrag = (event, isSnap, eventName, isKeepCheckDist) => {
                g_latestMousePress = ctrl.id || ctrl.class;
                console.log("fnDrag", ctrl.name);
                // event.stopPropagation();

                const [x0, x1] = ctrl.x_scope || [];
                const [y0, y1] = ctrl.y_scope || [];

                // var layoutLoc = SVGLib.getTranslate(el);
                let layoutLoc = { left: 0, top: 0 };
                // console.log("layoutLoc", layoutLoc);
                var curPos = cursorPoint(event);

                var x = curPos.x - layoutLoc.left;
                var y = curPos.y - layoutLoc.top;

                if (ctrl.curPos) ctrl.prevCurPos = ctrl.curPos;

                ctrl.curPos = curPos;

                let dx = event.clientX - prev.x;
                let dy = event.clientY - prev.y;
                if (!isKeepCheckDist && Math.pow(dx, 2) + Math.pow(dy, 2) < 1) return;

                prev = {
                    x: event.clientX,
                    y: event.clientY,
                };

                if (x < x0) x = x0;
                else if (x > x1) x = x1;

                if (y < y0) y = y0;
                else if (y > y1) y = y1;

                ctrl.value = { x, y };

                if (eventName == "mousedown") {
                    prevValue = ctrl.value;
                }

                // console.log(ctrl.name, ctrl.value);

                // ctrl.render();

                if (ctrl.fn_drag)
                    ctrl.fn_drag({
                        prevValue,
                        eventName,
                        event,
                    });

                if (eventName == "mousemove") {
                    prevValue = ctrl.value;
                }

                // console.log("prevValue", prevValue, eventName);

                keepScrollBarNotMove(el);
            };

            if (ctrl.is_dynamic) {
                $(document).on("mousedown", elSelector, function (event) {
                    ctrl.id = $(this).attr("id");
                    ctrl.el = this;

                    isDrag = true;
                    prevValue = null;
                    ctrl.is_drag = false;
                    ctrl.is_drag_real = false;

                    fnDrag(event, true, "mousedown", true);
                    prev = { x: 0, y: 0 };
                });
            } else {
                $(el)
                    .on("mousedown", function (event) {
                        ctrl.id = $(this).attr("id");
                        ctrl.el = this;

                        isDrag = true;
                        prevValue = null;
                        ctrl.is_drag = false;
                        ctrl.is_drag_real = false;

                        fnDrag(event, true, "mousedown", true);
                        prev = { x: 0, y: 0 };
                    })
                    .css("position", "absolute");
            }

            let prevMove = { x: 0, y: 0 };
            $(document).on("mousemove", function (event) {
                if (isDrag) {
                    let dx = event.clientX - prevMove.x;
                    let dy = event.clientY - prevMove.y;
                    if (Math.pow(dx, 2) + Math.pow(dy, 2) < 1) return;

                    ctrl.is_drag = true;
                    ctrl.is_drag_real = true;

                    fnDrag(event, false, "mousemove");
                    keepScrollBarNotMove(el);
                    prevMove = {
                        x: event.clientX,
                        y: event.clientY,
                    };
                } else if (ctrl.mousemove) {
                    let dx = event.clientX - prevMove.x;
                    let dy = event.clientY - prevMove.y;
                    if (Math.pow(dx, 2) + Math.pow(dy, 2) < 1) return;
                    ctrl.mousemove(event);

                    prevMove = {
                        x: event.clientX,
                        y: event.clientY,
                    };
                }
            });

            $(document).on("mouseup", function (event) {
                if (isDrag) {
                    fnDrag(event, true, "mouseup", true);
                    keepScrollBarNotMove(el);
                    isDrag = false;
                    prevValue = null;
                    ctrl.is_drag = false;
                    delete ctrl.el;
                }
            });
            if (ctrl.mouseover) {
                $(el).on("mouseenter", function (event) {
                    ctrl.id = $(this).attr("id");
                    ctrl.mouseover(event);
                    ctrl.is_hover = true;
                });
            }
            if (ctrl.mouseout) {
                $(el).on("mouseleave", function (event) {
                    ctrl.mouseout(event);
                    ctrl.is_hover = false;
                });
            }
        };

        const fnControlRadio = (ctrl) => {
            console.log("fnControlRatio initial", ctrl.name);
            let el = $(`#${ctrl.id}`);
            $(el).on("mousedown", function (event) {
                event.preventDefault();
                if (!ctrl.ignore_event_tracking) g_eventId += 1;
                g_latestMousePress = ctrl.id;

                if (ctrl.mousedown) ctrl.mousedown();
            });
        };

        const fnControlClickable = (ctrl) => {
            console.log("fnControlClickable initial", ctrl.name);
            let el = $(ctrl.id ? `#${ctrl.id}` : `.${ctrl.class}`);
            $(el).on("mousedown", function (event) {
                ctrl.id = $(this).attr("id");
                ctrl.el = $(this);
                event.preventDefault();
                if (!ctrl.ignore_event_tracking) g_eventId += 1;
                g_latestMousePress = ctrl.id || ctrl.class;

                if (ctrl.mousedown) ctrl.mousedown();
            });
        };

        const fnControlCheckbox = (ctrl) => {
            console.log("fnControlCheckbox initial", ctrl.name);
            let el = $(`#${ctrl.id}`);
            $(el).on("mousedown", function (event) {
                event.preventDefault();
                if (!ctrl.ignore_event_tracking) g_eventId += 1;
                g_latestMousePress = ctrl.id;

                if (ctrl.mousedown) ctrl.mousedown();
            });
        };
        const fnControlButton = (ctrl) => {
            console.log(
                "fnControlButton initial",
                ctrl.is_group
                    ? Object.keys(ctrl.flow_member)
                          .map((x) => `${ctrl.name}-${x}`)
                          .join(", ")
                    : ctrl.name
            );

            let buttons = [];
            if (ctrl.is_group) {
                buttons = [
                    ...Object.keys(ctrl.flow_member).map((x) => `#${ctrl.id}-${x}-inactive`), // inactive state
                    ...(ctrl.event_for_active_state ? Object.keys(ctrl.flow_member).map((x) => `#${ctrl.id}-${x}-active`) : []), // active state
                ].filter((x) => x);
            } else {
                buttons = [`#${ctrl.id}-inactive`];
                if (ctrl.event_for_active_state) {
                    buttons.push(`#${ctrl.id}-active`);
                }
            }

            let els = $(buttons.join(", "));

            els.on("mousedown", function (e) {
                if (!ctrl.ignore_event_tracking) g_eventId += 1;
                let currentEventId = g_eventId;
                g_latestMousePress = ctrl.id;
                ctrl.from_state = ctrl.value;
                // ctrl.value = "active";
                ctrl.render();

                // if (ctrl.type == "button" && ctrl.from_state == "active" && ctrl.event_for_active_state) {
                //     // do nothing
                // } else {
                //     animateButtonEffect(`#${ctrl.id}-group`, true, null, 0);
                // }

                if (ctrl.allow_press) {
                    let { mouse_press_delay } = ctrl;
                    let itvPress;
                    let count = 0;
                    let fn = () => {
                        count += 1;
                        if (currentEventId != g_eventId) {
                            clearInterval(itvPress);

                            return;
                        }
                        ctrl.fn_mouseup({ isKeyPress: true, count });
                    };

                    setTimeout(() => {
                        if (currentEventId == g_eventId) {
                            g_isPressMouse = true;
                            fn();
                            itvPress = setInterval(fn, mouse_press_delay);
                        }
                    }, 1000);
                }

                if (ctrl.mousedown) ctrl.mousedown();
            });
        };

        console.log(+new Date(), "document ready 3D-1.0.2.js");
        while (!window.initState) await delay(20);

        initState();
        loadConfigAndStaticSVG();
        // if (g_state.c_is_init_canvas) initCanvas();

        $(window).resize(function () {
            fnCalculateSVGRatio();
        });
        fnCalculateSVGRatio();

        g_state_controls.forEach((ctrl) => {
            switch (ctrl.type) {
                case "scrollbar":
                    fnControlScrollbar(ctrl);
                    break;

                case "drag":
                    fnControlDrag(ctrl);
                    break;

                case "radio":
                    fnControlRadio(ctrl);

                    break;

                case "checkbox":
                    fnControlCheckbox(ctrl);
                    break;

                case "button":
                    fnControlButton(ctrl);
                    break;

                case "clickable":
                    fnControlClickable(ctrl);
                    break;

                default:
                    break;
            }

            if (ctrl.render) ctrl.render();
        });

        $(document).on("mouseup", async function (e) {
            g_isMouseDown = false;
            console.log("g_latestMousePress mouseup", g_latestMousePress);

            let fn = () => {
                let ctrl = g_state_controls.find((c) => c.id == g_latestMousePress || c.class == g_latestMousePress);
                if (ctrl) {
                    if (!ctrl.ignore_event_tracking) g_eventId += 1;
                    if (!ctrl.ignore_mouseup) {
                        if (ctrl.type == "button") {
                            if (ctrl.is_group) {
                                ctrl.value = "inactive";
                                ctrl.value1 = ctrl.flow_member[ctrl.value1];
                                ctrl.render();
                            } else {
                                ctrl.value = "disabled";
                                ctrl.render();
                            }

                            if (ctrl.mouseup_immediately) ctrl.mouseup_immediately();

                            // animateButtonEffect(
                            //     `#${ctrl.id}-group`,
                            //     false,
                            //     function () {
                            //         ctrl.value = "inactive";
                            //         ctrl.render();

                            //         if (ctrl.mouseup) ctrl.mouseup(e);
                            //     },
                            //     0
                            // );
                            if (ctrl.mouseup) ctrl.mouseup(e);
                        } else if (ctrl.mouseup) ctrl.mouseup(e);
                    } else if (ctrl.type == "button" && ctrl.event_for_active_state) {
                        ctrl.mouseup(e);
                    }
                }

                if (!g_latestMousePress && g_state.mouseup_nothing) g_state.mouseup_nothing();

                g_latestMousePress = "";
                g_isPressMouse = false;
            };

            if (
                (!g_latestMousePress ||
                    (g_latestMousePress && g_latestMousePress != "btn-show-popup" && g_latestMousePress.indexOf("drag-popup") == -1)) &&
                g_state.show_popup
            ) {
                g_state.show_popup = false;
                let ctrlShowPopup = getControl("ctrl_show_popup");
                ctrlShowPopup.value = "inactive";
                ctrlShowPopup.render();
            }

            fn();
        });
    }, 10);
});
