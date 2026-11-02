/* eslint-disable no-new */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-case-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-shadow */

/* eslint-disable no-unused-expressions */
var g_buttonAnimateInterval = {};
var g_actionState;
var g_selectedButton;
var g_isPlaying = false;
var g_stepCount;
var g_isChanged = false;
var g_isDisabledBtn1 = true;
var g_isDisabledBtn2 = false;
var g_isDisabledBtn3 = true;
var g_isAnimatingButton = {};
var g_checkboxActive = true;
var g_latestMousePress = "";
var g_interval;
var g_interval2;
var g_isRunning = false;
var duration = 10000;
var nFrame = 300;
var intialP = -624;
var intialQ = 760;
var middleP;
var middleQ;
var stepP = intialP / nFrame;
var stepQ = intialQ / nFrame;
var g_currentPosition = "middle";

// ===== state =====

let g_state;

const initState = () => {
    g_state = {
        version: "20261026",
        is_show_log: (typeof CONFIG !== "undefined" && typeof CONFIG.show_log !== "undefined") ? CONFIG.show_log : true,
        is_init_canvas: true,
        meta_project: "suken-2026-5 C10",

        controls: [
            new Control({
                name: "reload",
                type: "button",
                id: "btn-reload",
                value: "disabled",
                is_skip_check_reload: true,
                mouseup: function () {
                    const ctrl = this;

                    if (ctrl.value === "disabled") return;

                    if (typeof updateP === "function") {
                        updateP(0.5);
                    }

                    const scrollBar = getControl("scrollbar");
                    if (scrollBar) {
                        scrollBar.value = 50;
                        scrollBar.render();
                    }

                    if (camera && controls) {
                        camera.position.copy(defaultCameraPos);
                        controls.target.copy(defaultTarget);
                        controls.update();
                    }

                    ctrl.value = "disabled";
                    ctrl.render();
                },
                mousedown: function () {
                    const ctrl = this;
                    if (ctrl.value === "inactive") {
                        ctrl.value = "active";
                        ctrl.render();
                    }
                },
                render: function () {
                    const ctrl = this;
                    showElement(`.${ctrl.id}`, false);
                    showElement(`#${ctrl.id}-${ctrl.value}`, true);
                },
            }),

            new Control({
                name: "scrollbar",
                type: "scrollbar",
                id: "scroll-bar",
                x_scope: [511.16, 851.16],
                y_scope: [0, 0],
                scope: [0, 100],
                minimum: 0.1,
                snap_point: [0, 25, 50, 75, 100],
                value: 50,
                activeTouchId: null,

                mousedown: function (evt) {
                    const touches = evt?.touches || evt?.originalEvent?.touches;
                    if (touches && touches.length > 0) {
                        this.activeTouchId = touches[0].identifier;
                    }

                    if (touches && touches.length > 1) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        return false;
                    }
                },

                fn_drag: function (evt) {
                    let ctrl = this;

                    // --- TOUCH FILTER (GIỮ NGUYÊN) ---
                    const touches = evt?.touches || evt?.originalEvent?.touches ||
                        evt?.changedTouches || evt?.originalEvent?.changedTouches;

                    if (touches) {
                        if (touches.length > 1) return false;

                        if (ctrl.activeTouchId !== null && touches[0].identifier !== ctrl.activeTouchId) {
                            return false;
                        }
                    }
                    const reloadBtn = getControl("reload");
                    if (reloadBtn && reloadBtn.value !== "inactive") {
                        reloadBtn.value = "inactive";
                        reloadBtn.render();
                    }
                    const e = evt.originalEvent || evt;
                    let clientX = touches?.[0]?.clientX ?? e.clientX;

                    if (!Number.isFinite(clientX)) return;

                    const svg = document.querySelector("svg");
                    const pt = svg.createSVGPoint();
                    pt.x = clientX;
                    pt.y = 0;

                    const svgP = pt.matrixTransform(
                        document.querySelector("#scroll-bar").getScreenCTM().inverse()
                    );

                    let percent = (svgP.x - ctrl.x_scope[0]) / (ctrl.x_scope[1] - ctrl.x_scope[0]);
                    percent = Math.max(0, Math.min(1, percent));
                    ctrl.value = percent * 100;
                    ctrl.render();
                },

                render: function () {
                    let ctrl = this;

                    let percent = (ctrl.value - ctrl.scope[0]) / (ctrl.scope[1] - ctrl.scope[0]);
                    let dragRange = ctrl.x_scope[1] - ctrl.x_scope[0];

                    let handleX = ctrl.x_scope[0] + percent * dragRange;

                    let handle = document.querySelector("#scroll-point");

                    let k = ctrl.value / 100;
                    if (typeof updateP === "function") {
                        updateP(k);
                    }

                    if (handle) {
                        const bbox = handle.getBBox();
                        const centerX = bbox.x + bbox.width / 2;

                        const y = 0;

                        handle.setAttribute(
                            "transform",
                            `translate(${handleX - centerX}, ${y})`
                        );

                        document.querySelector("#my-slider-filled")
                            ?.setAttribute("x", ctrl.x_scope[0]);

                        document.querySelector("#my-slider-filled")
                            ?.setAttribute("width", percent * dragRange);

                        let kDisplay = (ctrl.value / 100).toFixed(2);
                        $("#my-slider-text").text(kDisplay);

                        $("#kval").text(kDisplay);
                    }
                }
            }),

            new Control({
                type: "button",
                id: "overlay",

                mousedown: function (e) {

                    if (e) {
                        e.stopPropagation?.();
                        e.preventDefault?.();
                    }


                },
                mouseup: function (e) {
                    if (e) {
                        e.stopPropagation?.();
                        e.preventDefault?.();
                    }
                },
                render: function () {
                    let ctrl = this;

                }
            }),
            new Control({
                type: "button",
                id: "rect-overlay",

                mousedown: function (e) {
                    if (e) {
                        e.stopPropagation?.();
                        e.preventDefault?.();
                    }

                },
                mouseup: function (e) {
                    if (e) {
                        e.stopPropagation?.();
                        e.preventDefault?.();
                    }

                },
                render: function () {
                    let ctrl = this;

                }
            }),

        ],
    };
};

const loadConfigAndStaticSVG = () => {

    g_default_state = JSON.parse(JSON.stringify(g_state));

    if (!console._log) {
        console._log = console.log;
    }
    console.log = function () {
        const isShow = (typeof CONFIG !== "undefined" && typeof CONFIG.show_log !== "undefined")
            ? CONFIG.show_log
            : (g_state && g_state.is_show_log);
        // eslint-disable-next-line prefer-rest-params
        if (isShow) console._log(...arguments);
    };

    console.log("version", g_state.version);
};

let g_default_state;
let g_eventId = 0;
let g_isRenderingGraph = false;
// ===== end =====

// ===== Template  =====

window.addEventListener("mousemove", function (ev) {
    if (ev.cancelable) {
        ev.preventDefault ? ev.preventDefault() : (ev.returnValue = false);
    }
}, { passive: false });

window.addEventListener(
    "touchmove",
    function (e) {
        e.preventDefault();
    },
    {
        passive: false,
    }
);

function init() {
    initCanvas();
    animate();
    showElement("#divBody", true);
}

$(document).on("mousedown", function (e) {
    let targetId = $(e.target).attr("id");

    if (targetId === "rect-overlay") {
        return;
    }
    if (targetId === "pinch-shape") {
        return;
    }
    $("#rect-overlay").css("pointer-events", "all");
    showElement("#rect-overlay", true);
});

$(document).on("mouseup", function () {
    $("#rect-overlay").css("pointer-events", "none");

    showElement("#rect-overlay", false);
});

function showElement(element, visible) {
    return $(element).css("visibility", visible ? "visible" : "hidden");
}
// Biến toàn cục để theo dõi ID của ngón tay hợp lệ
let g_activeTouchId = null;

function touchHandler(event, ignoreEls) {
    if (ignoreEls && (ignoreEls.indexOf($(event.target).attr("class")) > -1 || ignoreEls.indexOf($(event.target).attr("id")) > -1)) {
        return;
    }

    if (event.touches && event.touches.length > 1) {
        if (event.cancelable) event.preventDefault();
        event.stopImmediatePropagation();
        return;
    }

    let touch;

    // 2. LOGIC KHÓA MỤC TIÊU (CHỐNG GIẬT)
    if (event.type === "touchstart") {
        g_activeTouchId = event.changedTouches[0].identifier;
        touch = event.changedTouches[0];
    } else {
        for (let i = 0; i < event.changedTouches.length; i++) {
            if (event.changedTouches[i].identifier === g_activeTouchId) {
                touch = event.changedTouches[i];
                break;
            }
        }

        if (!touch) return;
    }

    if (event.type === "touchend" || event.type === "touchcancel") {
        g_activeTouchId = null;
    }

    if (event.cancelable) event.preventDefault();

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(
        {
            touchstart: "mousedown",
            touchmove: "mousemove",
            touchend: "mouseup",
            touchcancel: "mouseup"
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

async function animateButtonEffect(id, isDown, cb, dy) {
    if (g_isAnimatingButton[id] && isDown) return;
    // while (g_isAnimatingButton[id]) {
    //     await delay(50);
    // }

    g_isAnimatingButton[id] = true;

    var self = $(id);
    var duration = 100;
    var nFrame = 10;
    var dy1 = isDown ? 0 : dy || 4;
    var dy2 = isDown ? dy || 4 : 0;
    var ddy = (dy2 - dy1) / nFrame;

    let count = 0;

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
        svgDom: $("#svg"),
        grid: 100,
        lineStyle: {
            stroke: "black",
            "stroke-width": "2.5px",
        },
    },

    init: function () {
        this.shapeGroup = SVGLib.createTag(CONST.SVG.TAG.GROUP, {
            id: "svg_shape",
            transform: SVGLib.getStrMatrix(1, 0, 0, 1, 512, 324),
        });
        this.setting.svgDom.append(this.shapeGroup);

        this.rotateEvent(".draggable-zone");
    },

    appendToShapeGroup: function (childElement) {
        this.shapeGroup.append(childElement);

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
    // g_svgRatio = getBoundingClientRect(getEl("#btn-reload-group")).width / 146;
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
    if (!console._log) {
        console._log = console.log;
    }
    initState();
    loadConfigAndStaticSVG();
    init();
    AutoResize();

    initDragEvent(_.flattenDeep(["rect-button-ignore-touch"]));


    var svg = document.querySelector("svg");
    // Create an SVGPoint for future math
    var pt = svg.createSVGPoint();

    function cursorPoint(evt) {
        var c = /Edge/.test(window.navigator.userAgent) ? document.getElementById("svg") : svg;
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        var ctm = c.getScreenCTM();
        var inverse = ctm.inverse();
        var p = pt.matrixTransform(inverse);

        return {
            x: p.x,
            y: p.y,
        };
    }
    const fnControlScrollbar = (ctrl) => {
        let elSelector = ctrl.id ? `#${ctrl.id}` : `.${ctrl.class}`;
        let el = $(elSelector);

        let isDrag = false;
        let clickOffsetX = 0;

        // 🎯 Convert mouse -> SVG local
        const getLocalPoint = (event, element) => {
            const svg = element.closest("svg");
            const pt = svg.createSVGPoint();

            pt.x = event.clientX;
            pt.y = event.clientY;

            return pt.matrixTransform(element.getScreenCTM().inverse());
        };

        let fnDrag = (event, isSnap, eventName) => {
            const [x0, x1] = ctrl.x_scope || [];

            // 🔥 Lấy tọa độ CHUẨN trong hệ SVG của scrollbar
            const localP = getLocalPoint(event, el[0]);
            let rawX = localP.x;

            // --- MOUSEDOWN ---
            if (eventName === "mousedown") {
                const handle = document.querySelector("#scroll-point");
                const isClickOnPoint = event.target.closest("#scroll-point");

                const localP = getLocalPoint(event, el[0]);
                const clickX = localP.x;

                if (isClickOnPoint && handle) {
                    // 👉 Click vào handle → giữ vị trí tương đối
                    const percent = (ctrl.value - ctrl.scope[0]) / (ctrl.scope[1] - ctrl.scope[0]);
                    const currentX = x0 + percent * (x1 - x0);

                    clickOffsetX = clickX - currentX;
                } else {
                    // 👉 Click ngoài → đưa TÂM handle tới vị trí click
                    clickOffsetX = 0;
                }
            }

            // 🎯 Tính lại vị trí sau khi trừ offset
            let x = rawX - clickOffsetX;

            let percent = (x - x0) / (x1 - x0);
            percent = Math.max(0, Math.min(1, percent));

            let roundLength = _.get(ctrl.minimum.toString().split(".")[1], "length", 0);

            let currentValue = _.round(
                percent * (ctrl.scope[1] - ctrl.scope[0]) + ctrl.scope[0],
                roundLength
            );

            // --- SNAP ---
            if (eventName === "mouseup") {
                const stopPoints = ctrl.snap_point || [];
                const snapSensitivity = 10 * ctrl.minimum;

                const stopValue = stopPoints.find(
                    (v) => Math.abs(currentValue - v) < snapSensitivity
                );

                if (stopValue !== undefined) {
                    currentValue = stopValue;
                } else if (isSnap) {
                    currentValue = _.round(
                        _.round(currentValue / ctrl.minimum) * ctrl.minimum,
                        roundLength
                    );
                }
            }

            ctrl.value = currentValue;

            // --- RENDER ---
            ctrl.render();

            if (ctrl.fn_drag) {
                ctrl.fn_drag({ value: ctrl.value, eventName });
            }

            keepScrollBarNotMove(el);
        };

        // --- EVENT ---
        $(el).on("mousedown", function (event) {
            ctrl.el = this;
            ctrl.is_drag = false;
            isDrag = true;

            fnDrag(event, true, "mousedown");
        });

        $(document).on("mousemove", function (event) {
            if (isDrag) {
                ctrl.is_drag = true;
                fnDrag(event, false, "mousemove");
            }
        });

        $(document).on("mouseup", function (event) {
            if (isDrag) {
                fnDrag(event, true, "mouseup");

                isDrag = false;
                ctrl.is_drag = false;
                delete ctrl.el;
            }
        });
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

        let els = $(
            ctrl.is_group
                ? Object.keys(ctrl.flow_member)
                    .map((x) => `#${ctrl.id}-${x}-inactive`)
                    .join(", ")
                : `#${ctrl.id}-inactive`
        );

        els.on("mousedown", function (e) {
            if (!ctrl.ignore_event_tracking) g_eventId += 1;
            let currentEventId = g_eventId;
            g_latestMousePress = ctrl.id;
            ctrl.value = "active";
            ctrl.render();
            // animateButtonEffect(`#${ctrl.id}-group`, true);

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

    g_state.controls.forEach((ctrl) => {
        switch (ctrl.type) {
            case "scrollbar":
                fnControlScrollbar(ctrl);
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

    applyControlChange();

    $(document).on("mouseup", async function (e) {
        g_isMouseDown = false;
        console.log("g_latestMousePress mouseup", g_latestMousePress);

        let ctrl = g_state.controls.find((c) => c.id == g_latestMousePress || c.class == g_latestMousePress);
        if (ctrl) {
            if (!ctrl.ignore_event_tracking) g_eventId += 1;
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

                // animateButtonEffect(`#${ctrl.id}-group`, false, function () {
                ctrl.value = "inactive";
                ctrl.render();

                if (ctrl.mouseup) ctrl.mouseup(e);
                // });
            } else if (ctrl.mouseup) ctrl.mouseup(e);
        }

        g_latestMousePress = "";
        g_isPressMouse = false;
    });

    setTimeout(() => {
        $("#divBody").css("opacity", 1);
    }, 200);
});

let controlValuesPrev = JSON.stringify({});

const applyControlChange = (isSkipCache) => {
    let controlValues = JSON.stringify({
        ..._.pick(g_state, ["a", "n", "p", "is_show_vector_ap"]),
        controls: g_state.controls.filter((x) => !x.is_skip_check_reload).map((x) => _.pick(x, ["name", "value"])),
    });

    if (controlValues == controlValuesPrev && !isSkipCache) {
        return;
    }

    controlValuesPrev = controlValues;

    fnCalculateSVGRatio();
};
