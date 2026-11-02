/* eslint-disable no-eval */
/* eslint-disable no-new */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-case-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */

// 1. BIẾN TOÀN CỤC & CÁC HÀM GIẢ THREEJS
var renderer = null;
var camera = null;
var orbitControls = null;
var scene = null;
var mouse = {x:0,y:0};
var raycaster = { setFromCamera: function(){} };

window.UpdateThreeJS = function () {};
function controlTouch() {
  $("#overlay").on("mousedown mouseup", function (e) {
    e.stopPropagation();
    e.preventDefault();

    $(document).trigger("mouseup", { note: "trigger-overlay" });
  });

  $("#rect-overlay").on("mousedown mouseup", function (e) {
    e.stopPropagation();
    e.preventDefault();

    $(document).trigger("mouseup", { note: "trigger-rect-overlay" });
  });

  $(document).on("mousedown", function (e) {
    let targetId = $(e.target).attr("id");
    if (["rect-overlay"].indexOf(targetId) > -1) {
      return;
    }

    $("#rect-overlay").css({ visibility: "visible"});
  });

  $(document).on("mouseup", function (e, data) {
    $("#rect-overlay").css({ visibility: "hidden"});
  });

}


// ========= LOGIC 2D (Quản lý trạng thái theo hướng hàm) =========

// 1. RÀNG BUỘC TRẠNG THÁI (MÔ PHỎNG CƠ CHẾ HOOK KIỂU REACT)
const initialVertices = {
    pointO: { x: 351.97, y: 186.37 },
    pointA: { x: 220.49, y: 521.23 },
    pointB: { x: 682.87, y: 521.23 }
};

let vertices = JSON.parse(JSON.stringify(initialVertices));
let activeHighlight = 'OAD'; // 'OAD' | 'OCB'
let isModified = false;
let g_dragConstraints = null; // Tính trước khi nhấn chuột, dùng suốt quá trình kéo
let g_labelCache = {}; // Lưu trữ kích thước nhãn để tối ưu hiệu năng
let g_designOffsets = {}; // Lưu trữ khoảng cách lệch (offset) từ bản thiết kế

// 2. KHỞI TẠO
function initState() {
    g_state = {
        c_version: "20260409",
        c_screen_width: 1024,
        c_screen_height: 648,
        controls: {}
    };

    g_state.controls = {
        control_drag_O: new Control({
            type: "drag", id: "drag_O",
            fn_drag: function ({ eventName, event }) {
                if (eventName === "mousedown") {
                    this.isDragging = true;
                    computeDragConstraints("pointO"); // Pre-compute once on grab
                } else if (eventName === "mousemove" && this.isDragging) {
                    let pt = getSVGPoint(event);
                    updatePos("pointO", pt.x, pt.y);
                } else if (eventName === "mouseup") this.isDragging = false;
            }
        }),
        control_drag_A: new Control({
            type: "drag", id: "drag_A",
            fn_drag: function ({ eventName, event }) {
                if (eventName === "mousedown") {
                    this.isDragging = true;
                    computeDragConstraints("pointA");
                } else if (eventName === "mousemove" && this.isDragging) {
                    let pt = getSVGPoint(event);
                    updatePos("pointA", pt.x, pt.y);
                } else if (eventName === "mouseup") this.isDragging = false;
            }
        }),
        control_drag_B: new Control({
            type: "drag", id: "drag_B",
            fn_drag: function ({ eventName, event }) {
                if (eventName === "mousedown") {
                    this.isDragging = true;
                    computeDragConstraints("pointB");
                } else if (eventName === "mousemove" && this.isDragging) {
                    let pt = getSVGPoint(event);
                    updatePos("pointB", pt.x, pt.y);
                } else if (eventName === "mouseup") this.isDragging = false;
            }
        }),
        ctrl_reload: new Control({
            name: "reload", type: "button", id: "btn-reload", value: "disabled",
            mousedown: function () {
                if (this.value === "inactive") { this.value = "active"; this.render(); }
            },
            mouseup: function () {
                if (this.value === "disabled") return;
                resetState();
                this.value = "disabled";
                this.render();
            },
            render: function () {
                this.value = isModified ? (this.value === "active" ? "active" : "inactive") : "disabled";
                ["disabled", "active", "inactive"].forEach(s => {
                    showElement(`#${this.id}-${s}`, this.value === s);
                });
            }
        }),
        ctrl_btn_OAD: new Control({
            name: "btn_OAD", type: "button", id: "btn-OAD", value: "active",
            ignore_mouseup: true,
            render: function () {
                let isActive = (this.value === "active");
                showElement(`#${this.id}-active`,   isActive);
                showElement(`#${this.id}-inactive`, !isActive);
            },
            mousedown: function () {
                if (this.value === "active") return; // đã được chọn, không làm gì
                this.value = "active";
                activeHighlight = "OAD";
                // Tắt nút OCB
                let ocb = g_state.controls.ctrl_btn_OCB;
                ocb.value = "inactive";
                ocb.render();
                this.render();
                updateSVG2D();
            },
            mouseup: function () {
                this.value = "active";
                this.render();
            }
        }),
        ctrl_btn_OCB: new Control({
            name: "btn_OCB", type: "button", id: "btn-OCB", value: "inactive",
            ignore_mouseup: true,
            render: function () {
                let isActive = (this.value === "active");
                showElement(`#${this.id}-active`,   isActive);
                showElement(`#${this.id}-inactive`, !isActive);
            },
            mousedown: function () {
                if (this.value === "active") return; // đã được chọn, không làm gì
                this.value = "active";
                activeHighlight = "OCB";
                // Tắt nút OAD
                let oad = g_state.controls.ctrl_btn_OAD;
                oad.value = "inactive";
                oad.render();
                this.render();
                updateSVG2D();
            },
            mouseup: function () {
                this.value = "active";
                this.render();
            }
        })
    };

    g_state_controls = Object.keys(g_state.controls).map((k) => {
        let ctrl = g_state.controls[k];
        ctrl.name = k;
        return ctrl;
    });

    g_state.menu = 1;
    g_state.menu_item_selected = 1;
    g_state.menu_data = { 1: {}, 2: {}, 3: {} };
}

// Khởi tạo cache kích thước và tính toán offset từ thiết kế mẫu
const initLabelCache = () => {
    // Offset được tính toán: dx = (Design_X + Design_Width/2) - Initial_Base_Point_X
    // Tọa độ này giúp translate thẻ text rơi vào đúng TÂM của nhãn
    g_designOffsets = {
        "lbl-O":    { dx: -20.33, dy: -14.61 },
        "lbl-A":    { dx: -28.17, dy: 38.12 },
        "lbl-B":    { dx: 6.64, dy: 38.12 },
        "lbl-C":    { dx: -42.2971, dy: 4.7 },
        "lbl-D":    { dx: 8.34, dy: -13.88 },
        "lbl-P":    { dx: -13.85, dy: 39.06},
        "lbl-1-ob": { dx: -10.88, dy: 12.69 }, // Tỉ lệ trên OB
        "lbl-2-ob": { dx: -13.88, dy: 11.29 },
        "text-s":   { dx: -8.21, dy: 10.39 }, // Nhãn cung tròn
        // "text-1-s": { dx: -50.0, dy: 3.22 },
        "text-1-s": { dx: -58.0, dy: 3.22 },
        "text-t":   { dx: -10.20, dy: 12 },
        "text-1-t": { dx: -16.45, dy: 12.97 }
    };
};

// Yêu cầu nội bộ của 3D-1.0.2.js
function loadConfigAndStaticSVG() {
    console.log("phiên bản", g_state.c_version);
}

let controlValuesPrev = JSON.stringify({});
function applyControlChange(isSkipCache) {
    let controlValues = JSON.stringify({
        ..._.pick(g_state, ["menu", "menu_item_selected", "menu_data"]),
        controls: g_state_controls.filter((x) => !x.is_skip_check_reload).map((x) => _.pick(x, ["name", "value"])),
    });
    if (controlValues == controlValuesPrev && !isSkipCache) return;
    controlValuesPrev = controlValues;
}

// 3. TIỆN ÍCH GIAO DIỆN
function getSVGPoint(event) {
    let svg = document.getElementById("svg_root");
    let pt = svg.createSVGPoint();
    let clientX = event.touches && event.touches.length > 0 ? event.touches[0].clientX : event.clientX;
    let clientY = event.touches && event.touches.length > 0 ? event.touches[0].clientY : event.clientY;
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
}

// Tính giao điểm hai đường thẳng bằng định thức (hàm thuần túy)
function getIntersection(A, B, C, D) {
    let a1 = B.y - A.y;
    let b1 = A.x - B.x;
    let c1 = a1 * A.x + b1 * A.y;

    let a2 = D.y - C.y;
    let b2 = C.x - D.x;
    let c2 = a2 * C.x + b2 * C.y;

    let determinant = a1 * b2 - a2 * b1;
    if (determinant == 0) return { x: 0, y: 0 };
    let x = (b2 * c1 - b1 * c2) / determinant;
    let y = (a1 * c2 - a2 * c1) / determinant;
    return { x: x, y: y };
}

// Tính các điểm phụ thuộc C, D, P dựa trên ba đỉnh cơ sở O, A, B (hàm thuần túy)
function calculateDependentPoints(v) {
    let rC = typeof CONFIG_DEMO !== "undefined" && CONFIG_DEMO.ratio_C_on_OA !== undefined ? CONFIG_DEMO.ratio_C_on_OA : 0.5;
    let rD = typeof CONFIG_DEMO !== "undefined" && CONFIG_DEMO.ratio_D_on_OB !== undefined ? CONFIG_DEMO.ratio_D_on_OB : 2/3;
    
    let pointC = { x: v.pointO.x + (v.pointA.x - v.pointO.x) * rC, y: v.pointO.y + (v.pointA.y - v.pointO.y) * rC };
    let pointD = { x: v.pointO.x + (v.pointB.x - v.pointO.x) * rD, y: v.pointO.y + (v.pointB.y - v.pointO.y) * rD };
    let pointP = getIntersection(v.pointA, pointD, v.pointB, pointC);
    return { pointC, pointD, pointP };
}

// Các hàm vẽ hình học bổ sung
function drawArrowSVG(parentSelector, idPrefix, pStart, pEnd, color, thickness) {
    let dx = pEnd.x - pStart.x;
    let dy = pEnd.y - pStart.y;
    let length = Math.sqrt(dx*dx + dy*dy);
    if (length < 0.1) return;
    
    let headLen = 21.5; // dài mũi tên
    let headW = 6;    // rộng mũi tên
    let nx = dx / length;
    let ny = dy / length;
    
    let lineEndX = pEnd.x - nx * headLen;
    let lineEndY = pEnd.y - ny * headLen;
    
    let lineId = `${idPrefix}-line`;
    let polyId = `${idPrefix}-poly`;
    
    let parent = document.querySelector(parentSelector);
    let line = document.getElementById(lineId);
    let poly = document.getElementById(polyId);
    
    if (!line) {
        line = SVGLib.createTag("line", { id: lineId, "stroke-linecap": "round" });
        parent.appendChild(line);

        poly = SVGLib.createTag("polygon", { id: polyId });
        parent.appendChild(poly);
    }
    
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", thickness);
    line.setAttribute("x1", pStart.x);
    line.setAttribute("y1", pStart.y);
    line.setAttribute("x2", lineEndX);
    line.setAttribute("y2", lineEndY);
    
    let pTip = `${pEnd.x},${pEnd.y}`;
    let pBaseLeft = `${lineEndX - ny * headW},${lineEndY + nx * headW}`;
    let pBaseRight = `${lineEndX + ny * headW},${lineEndY - nx * headW}`;
    poly.setAttribute("fill", color);
    poly.setAttribute("points", `${pBaseLeft} ${pTip} ${pBaseRight}`);
}

function drawArcWithText(pathId, textId, p1, p2, textStr, bulgeDist, colorStr) {
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    let len = Math.sqrt(dx*dx + dy*dy);
    if (len < 0.1) return { x: p1.x, y: p1.y };

    let ux = dx / len, uy = dy / len;   // doc theo cung
    let nx = -uy,      ny =  ux;         // phap tuyen trai

    // Do cong ty le voi sqrt(len): doan ngan hon se co chieu cao nho hon
    // bulgeDist chi xac dinh chieu cong (am = trai, duong = phai)
    // Cong thuc: perp = sign(bulgeDist) * |bulgeDist| * sqrt(len / 300)
    // Chieu dai tham chieu 300px ~ doan OD, cho perp xap xi |bulgeDist|
    let perp = Math.sign(bulgeDist) * Math.abs(bulgeDist) * Math.sqrt(len / 300);

    // Cubic Bezier: dat CP cach dau/cuoi ~22% chieu dai cung, lech phap tuyen perp
    let s = 0.22 * len;
    let cp1 = { x: p1.x + ux*s + nx*perp, y: p1.y + uy*s + ny*perp };
    let cp2 = { x: p2.x - ux*s + nx*perp, y: p2.y - uy*s + ny*perp };

    // Tinh diem tren cubic Bezier tai tham so t
    function B(t) {
        let m = 1 - t;
        return {
            x: m*m*m*p1.x + 3*m*m*t*cp1.x + 3*m*t*t*cp2.x + t*t*t*p2.x,
            y: m*m*m*p1.y + 3*m*m*t*cp1.y + 3*m*t*t*cp2.y + t*t*t*p2.y
        };
    }

    // De Casteljau: tach cubic Bezier tai t
    function splitAt(t) {
        let m = 1 - t;
        let q0x = m*p1.x  + t*cp1.x, q0y = m*p1.y  + t*cp1.y;
        let q1x = m*cp1.x + t*cp2.x, q1y = m*cp1.y + t*cp2.y;
        let q2x = m*cp2.x + t*p2.x,  q2y = m*cp2.y + t*p2.y;
        let r0x = m*q0x + t*q1x, r0y = m*q0y + t*q1y;
        let r1x = m*q1x + t*q2x, r1y = m*q1y + t*q2y;
        let mx  = m*r0x + t*r1x, my  = m*r0y + t*r1y;
        return {
            mid: { x: mx, y: my },
            left:  { a: { x: q0x, y: q0y }, b: { x: r0x, y: r0y } },
            right: { a: { x: r1x, y: r1y }, b: { x: q2x, y: q2y } }
        };
    }

    // Khoang trang giua de dat nhan
    let delta = Math.min(0.4, 18 / len);
    // if (textStr.length > 2) delta = Math.min(0.4, 25 / len);
    if(textStr === "1-s") delta = 0.15;

    let t1 = 0.5 - delta;
    let t2 = 0.5 + delta;

    let s1 = splitAt(t1);
    let s2 = splitAt(t2);

    // Ve: doan p1->B(t1) roi B(t2)->p2 (dung lenh C cua SVG)
    let d = `M ${p1.x} ${p1.y} `
          + `C ${s1.left.a.x} ${s1.left.a.y} ${s1.left.b.x} ${s1.left.b.y} ${s1.mid.x} ${s1.mid.y} `
          + `M ${s2.mid.x} ${s2.mid.y} `
          + `C ${s2.right.a.x} ${s2.right.a.y} ${s2.right.b.x} ${s2.right.b.y} ${p2.x} ${p2.y}`;

    $(`#${pathId}`).attr("d", d);
    if (colorStr) $(`#${pathId}`).attr("stroke", colorStr);

    // Tra ve trung diem thuc cua duong cong tai t=0.5
    return B(0.5);
}

function drawTicksOnSegment(idPrefix, p1, p2) {
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    let len = Math.sqrt(dx*dx+dy*dy);
    if(len<0.1) return;
    let nx = -dy/len * 9;  // độ dài tick
    let ny = dx/len * 9;
    let mx = p1.x + dx/2;
    let my = p1.y + dy/2;
    
    let offset = 3;        // khoảng cách giữa 2 tick
    let tx = dx/len * offset;
    let ty = dy/len * offset;
    
    $(`#${idPrefix}-1`).attr({ x1: mx - nx - tx, y1: my - ny - ty, x2: mx + nx - tx, y2: my + ny - ty });
    $(`#${idPrefix}-2`).attr({ x1: mx - nx + tx, y1: my - ny + ty, x2: mx + nx + tx, y2: my + ny + ty });
}

// 4. HÀM RENDER CHÍNH
function updateSVG2D() {
    let { pointC, pointD, pointP } = calculateDependentPoints(vertices);
    let { pointO, pointA, pointB } = vertices;

    // Cập nhật vị trí các thực thể điểm (vòng tròn) trên SVG
    $("#pt-O, #drag_O").attr({ cx: pointO.x, cy: pointO.y });
    $("#pt-A, #drag_A").attr({ cx: pointA.x, cy: pointA.y });
    $("#pt-B, #drag_B").attr({ cx: pointB.x, cy: pointB.y });
    
    // $("#pt-C").attr({ cx: pointC.x, cy: pointC.y });
    // $("#pt-D").attr({ cx: pointD.x, cy: pointD.y });
    // $("#pt-P").attr({ cx: pointP.x, cy: pointP.y });

    // Cập nhật vị trí các nhãn chữ dùng Offset từ thiết kế và transform translate
    const applyDesignPosition = (id, pt) => {
        let offset = g_designOffsets[id] || { dx: 0, dy: 0 };
        let el = document.getElementById(id);
        if (el) {
            // Translate thẻ text đến TÂM điểm mong muốn một cách chính xác
            el.setAttribute("transform", `translate(${pt.x + offset.dx}, ${pt.y + offset.dy})`);
        }
    };

    applyDesignPosition("lbl-O", pointO);
    applyDesignPosition("lbl-A", pointA);
    applyDesignPosition("lbl-B", pointB);
    applyDesignPosition("lbl-C", pointC);
    applyDesignPosition("lbl-D", pointD);
    applyDesignPosition("lbl-P", pointP);

    $("#grp-vec-a").attr("transform", `translate(${pointA.x - 24.84}, ${pointA.y - 32.65})`);
    $("#grp-vec-b").attr("transform", `translate(${pointB.x - 1.62}, ${pointB.y - 34.53})`);

    // Cập nhật các đoạn thẳng nối bên trong
    $("#line-AD").attr({ x1: pointA.x, y1: pointA.y, x2: pointD.x, y2: pointD.y });
    $("#line-BC").attr({ x1: pointB.x, y1: pointB.y, x2: pointC.x, y2: pointC.y });
    $("#line-AB").attr({ x1: pointA.x, y1: pointA.y, x2: pointB.x, y2: pointB.y });

    // Chế độ hiển thị (vùng tô sáng + cung tròn)
    let colorOAD = typeof CONFIG_DEMO !== "undefined" ? CONFIG_DEMO.color_OAD : "#ffcabf";
    let colorOCB = typeof CONFIG_DEMO !== "undefined" ? CONFIG_DEMO.color_OCB : "#ffcabf";
    let colorArcOAD = typeof CONFIG_DEMO !== "undefined" && CONFIG_DEMO.color_arc_OAD ? CONFIG_DEMO.color_arc_OAD : "#2196F3";
    let colorArcOCB = typeof CONFIG_DEMO !== "undefined" && CONFIG_DEMO.color_arc_OCB ? CONFIG_DEMO.color_arc_OCB : "#2196F3";
    let colorArcOB = typeof CONFIG_DEMO !== "undefined" && CONFIG_DEMO.color_arc_OB_scale ? CONFIG_DEMO.color_arc_OB_scale : "#005aff";

    if (activeHighlight === "OAD") {
        $("#poly-highlight").attr({ points: `${pointO.x},${pointO.y} ${pointA.x},${pointA.y} ${pointD.x},${pointD.y}`, fill: colorOAD });
        $("#mode-OAD-labels").show();
        $("#mode-OCB-labels").hide();
        $("#mode-OAD-arc-texts").show();
        $("#mode-OCB-arc-texts").hide();
        let midS   = drawArcWithText("arc-s",   "text-s",   pointA, pointP, "s",   -45, colorArcOAD);
        let mid1S  = drawArcWithText("arc-1-s", "text-1-s", pointP, pointD, "1-s", -45, colorArcOAD);
        
        applyDesignPosition("text-s",   midS);
        applyDesignPosition("text-1-s", mid1S);
    } else {
        $("#poly-highlight").attr({ points: `${pointO.x},${pointO.y} ${pointC.x},${pointC.y} ${pointB.x},${pointB.y}`, fill: colorOCB });
        $("#mode-OAD-labels").hide();
        $("#mode-OCB-labels").show();
        $("#mode-OAD-arc-texts").hide();
        $("#mode-OCB-arc-texts").show();
        let mid1T  = drawArcWithText("arc-1-t", "text-1-t", pointC, pointP, "1-t", -45, colorArcOCB);
        let midT   = drawArcWithText("arc-t",   "text-t",   pointP, pointB, "t",   -45, colorArcOCB);
        
        applyDesignPosition("text-1-t", mid1T);
        applyDesignPosition("text-t",   midT);
    }

    // Các ký hiệu tĩnh (dấu gạch tick)
    drawTicksOnSegment("tick-oc", pointO, pointC);
    drawTicksOnSegment("tick-ca", pointC, pointA);

    let mid2OB = drawArcWithText("arc-2-ob", "lbl-2-ob", pointO, pointD, "2", -50, colorArcOB);
    let mid1OB = drawArcWithText("arc-1-ob", "lbl-1-ob", pointD, pointB, "1", -50, colorArcOB);

    applyDesignPosition("lbl-2-ob", mid2OB);
    applyDesignPosition("lbl-1-ob", mid1OB);

    // Đồng bộ trạng thái nút reload
    if (g_state && g_state.controls && g_state.controls.ctrl_reload) {
        g_state.controls.ctrl_reload.render();
    }

    // Ve cac vector mu ten: OP truoc (duoi), OA va OB sau (tren)
    drawArrowSVG("#vectors", "vec-OP", pointO, pointP, typeof CONFIG_DEMO !== "undefined" ? CONFIG_DEMO.color_vector_OP : "#ff4b00", 5);
    drawArrowSVG("#vectors", "vec-OA", pointO, pointA, typeof CONFIG_DEMO !== "undefined" ? CONFIG_DEMO.color_vector_OA : "#000", 5);
    drawArrowSVG("#vectors", "vec-OB", pointO, pointB, typeof CONFIG_DEMO !== "undefined" ? CONFIG_DEMO.color_vector_OB : "#000", 5);
}

// Hàm kiểm tra tam giác hợp lệ: đảm bảo không bị xẹp, giữ khả năng đọc được
function isValidTriangle(v) {
    let cfg = typeof CONFIG_DEMO !== "undefined" ? CONFIG_DEMO : {};
    let minOA = cfg.min_length_OA || 80;
    let minOB = cfg.min_length_OB || 80;
    let minAB = cfg.min_length_AB || 80;
    let minAng = cfg.min_angle_deg || 20;

    let lenOA = Math.hypot(v.pointA.x - v.pointO.x, v.pointA.y - v.pointO.y);
    let lenOB = Math.hypot(v.pointB.x - v.pointO.x, v.pointB.y - v.pointO.y);
    let lenAB = Math.hypot(v.pointA.x - v.pointB.x, v.pointA.y - v.pointB.y);

    if (lenOA < minOA || lenOB < minOB || lenAB < minAB) return false;

    // Angle limits using Law of Cosines
    function getAngle(a, b, c) {
        let cosAng = (a*a + b*b - c*c) / (2 * a * b);
        cosAng = Math.max(-1, Math.min(1, cosAng));
        return Math.acos(cosAng) * 180 / Math.PI;
    }
    
    let angleO = getAngle(lenOA, lenOB, lenAB);
    let angleA = getAngle(lenOA, lenAB, lenOB);
    let angleB = getAngle(lenOB, lenAB, lenOA);

    if (angleO < minAng || angleA < minAng || angleB < minAng) return false;

    // Horizontal orientation check (A is STRICTLY left of B)
    if (v.pointB.x - v.pointA.x < (cfg.distance_min || 50)) return false;

    // Height check: O must be higher than A and B (smaller y)
    let dMin = cfg.distance_min || 50;
    if (v.pointO.y >= v.pointA.y - dMin || v.pointO.y >= v.pointB.y - dMin) return false;

    return true;
}

// 5a. TÍNH TRƯỚC RÀNG BUỘC KÉO KHI NHẤN CHUỘT
// Gọi một lần khi người dùng bắt đầu kéo một đỉnh. Tính các tia biên góc cố định
// và các đường tròn ràng buộc độ dài — không đổi trong suốt thao tác kéo.
function computeDragConstraints(pointNode) {
    let pointO = { ...vertices.pointO };
    let pointA = { ...vertices.pointA };
    let pointB = { ...vertices.pointB };
    let cfg = typeof CONFIG_DEMO !== "undefined" ? CONFIG_DEMO : {};
    let minAngRad = (cfg.min_angle_deg || 25) * Math.PI / 180;
    let minOA = cfg.min_length_OA || 80;
    let minOB = cfg.min_length_OB || 80;
    let minAB = cfg.min_length_AB || 80;

    // Tạo tia biên từ đỉnh V, tạo góc minAng với V→adjacent,
    // cùng phía với refPoint (đỉnh đang kéo, tại vị trí lúc nhấn chuột).
    //
    // Trả về { origin, dir, validSign }:
    //   - origin: đỉnh cố định V
    //   - dir: vector đơn vị dọc theo tia biên (đúng bằng minAng so với V→adjacent)
    //   - validSign: dấu của cross(dir, P-V) cho các điểm P nằm trong vùng HỢP LỆ
    //
    // Toán học: hướng "về phía refPoint" được xác định qua vector vuông góc của V→adjacent
    // có tích vô hướng dương với V→refPoint. Cách này độc lập với vị trí
    // (không phụ thuộc vào refPoint có hợp lệ hay không — tránh sai dấu validSign).
    function makeBoundary(V, adjacent, refPoint) {
        let adx = adjacent.x - V.x, ady = adjacent.y - V.y;
        let adLen = Math.hypot(adx, ady);
        if (adLen < 0.01) return null;
        adx /= adLen; ady /= adLen;

        let c = Math.cos(minAngRad), s = Math.sin(minAngRad);
        let rpx = refPoint.x - V.x, rpy = refPoint.y - V.y;

        // Hai vector vuông góc của hướng adjacent:
        let perp1 = { x:  ady, y: -adx }; // theo chiều kim đồng hồ so với adjacent
        let perp2 = { x: -ady, y:  adx }; // ngược chiều kim đồng hồ so với adjacent

        // Chọn vector vuông góc hướng về phía refPoint
        let u_perp = (perp1.x * rpx + perp1.y * rpy) >= 0 ? perp1 : perp2;

        // Hướng tia biên: xoay adjacent đi minAng về phía refPoint
        let dir = { x: adx * c + u_perp.x * s, y: ady * c + u_perp.y * s };

        // validSign: dấu của cross(dir, refPoint-V) xác định phía hợp lệ.
        // Tính giải tích (không dùng vị trí hiện tại vì có thể không hợp lệ):
        // cross(dir, u_perp) = c > 0 nếu u_perp được chọn là hướng "về phía refPoint".
        // Vùng hợp lệ nằm đối diện với phía điểm tiếp cận biên.
        // Sau khi kiểm tra hình học: hợp lệ khi cross(dir, P-V) > 0
        // nếu u_perp hướng về refPoint (dot > 0), ngược lại < 0.
        let perpDot = perp1.x * rpx + perp1.y * rpy;
        let validSign = perpDot >= 0 ? -1 : 1; // chọn perp1 → validSign=-1, perp2 → +1

        return { origin: { ...V }, dir, validSign };
    }

    if (pointNode === "pointO") {
        g_dragConstraints = {
            pointNode: "pointO",
            bndB: makeBoundary(pointB, pointA, pointO),   // ∠OBA ≥ minAng: biên từ B
            bndA: makeBoundary(pointA, pointB, pointO),   // ∠OAB ≥ minAng: biên từ A
            cA: { center: { ...pointA }, r: minOA },  // |OA| ≥ minOA
            cB: { center: { ...pointB }, r: minOB }   // |OB| ≥ minOB
        };
    } else if (pointNode === "pointA") {
        g_dragConstraints = {
            pointNode: "pointA",
            bndO: makeBoundary(pointO, pointB, pointA),   // ∠AOB ≥ minAng: biên từ O
            bndB: makeBoundary(pointB, pointO, pointA),   // ∠ABO ≥ minAng: biên từ B
            cO: { center: { ...pointO }, r: minOA },  // |OA| ≥ minOA
            cB: { center: { ...pointB }, r: minAB }   // |AB| ≥ minAB
        };
    } else if (pointNode === "pointB") {
        g_dragConstraints = {
            pointNode: "pointB",
            bndO: makeBoundary(pointO, pointA, pointB),   // ∠BOA ≥ minAng: biên từ O
            bndA: makeBoundary(pointA, pointO, pointB),   // ∠BAO ≥ minAng: biên từ A
            cO: { center: { ...pointO }, r: minOB },  // |OB| ≥ minOB
            cA: { center: { ...pointA }, r: minAB }   // |AB| ≥ minAB
        };
    }
}

// 5b. CẬP NHẬT VỊ TRÍ — dùng ràng buộc đã tính trước
function updatePos(pointNode, x, y) {
    let cfg = typeof CONFIG_DEMO !== "undefined" ? CONFIG_DEMO : {
        limit_left: 20, limit_right: 1004, limit_top: 20, limit_bottom: 628
    };

    // Giới hạn trong phạm vi canvas
    x = Math.max(cfg.limit_left, Math.min(x, cfg.limit_right));
    y = Math.max(cfg.limit_top, Math.min(y, cfg.limit_bottom));

    let dc = g_dragConstraints;
    if (!dc || dc.pointNode !== pointNode) return; // An toàn: không có ràng buộc hợp lệ

    let nx = x, ny = y;

    // --- Chiếu (nx,ny) lên tia biên góc nếu điểm nằm sai phía.
    //     Biên là một nửa mặt phẳng cố định; vượt qua biên nghĩa là góc < minAng. ---
    function applyBoundary(bnd) {
        if (!bnd) return;
        let cross = bnd.dir.x * (ny - bnd.origin.y) - bnd.dir.y * (nx - bnd.origin.x);
        if (cross * bnd.validSign < 0) {
            // Điểm nằm phía không hợp lệ → chiếu lên tia biên
            let t = Math.max(1, (nx - bnd.origin.x) * bnd.dir.x + (ny - bnd.origin.y) * bnd.dir.y);
            nx = bnd.origin.x + t * bnd.dir.x;
            ny = bnd.origin.y + t * bnd.dir.y;
        }
    }

    // --- Trượt theo cung tròn nếu vi phạm ràng buộc độ dài.
    //     Điểm trượt tiếp tuyến trên mặt tròn khi quá gần tâm (< bán kính tối thiểu). ---
    function applyCircle(circ) {
        if (!circ) return;
        let dx = nx - circ.center.x, dy = ny - circ.center.y;
        let d = Math.hypot(dx, dy);
        if (d < circ.r) {
            if (d < 0.01) { dx = 0; dy = -1; d = 1; } // dự phòng: đẩy lên trên
            nx = circ.center.x + (dx / d) * circ.r;
            ny = circ.center.y + (dy / d) * circ.r;
        }
    }

    // Áp dụng ràng buộc theo thứ tự: biên góc trước, rồi đến đường tròn độ dài
    if (pointNode === "pointO") {
        applyBoundary(dc.bndB);
        applyBoundary(dc.bndA);
        applyCircle(dc.cA);
        applyCircle(dc.cB);
    } else if (pointNode === "pointA") {
        applyBoundary(dc.bndO);
        applyBoundary(dc.bndB);
        applyCircle(dc.cO);
        applyCircle(dc.cB);
    } else if (pointNode === "pointB") {
        applyBoundary(dc.bndO);
        applyBoundary(dc.bndA);
        applyCircle(dc.cO);
        applyCircle(dc.cA);
    }

    // Giới hạn lại trong canvas sau khi chiếu
    nx = Math.max(cfg.limit_left, Math.min(nx, cfg.limit_right));
    ny = Math.max(cfg.limit_top, Math.min(ny, cfg.limit_bottom));

    // Bảo vệ hướng: A phải luôn nằm bên trái B
    if (pointNode === "pointA" && nx >= vertices.pointB.x - 1) nx = vertices.pointB.x - 2;
    if (pointNode === "pointB" && nx <= vertices.pointA.x + 1) nx = vertices.pointA.x + 2;

    // Ràng buộc chiều cao: O luôn cao hơn A và B ít nhất distance_min
    let dMinHeight = cfg.distance_min || 50;
    if (pointNode === "pointO") {
        let maxY = Math.min(vertices.pointA.y, vertices.pointB.y) - (dMinHeight + 1);
        if (ny > maxY) ny = maxY;
    } else { // pointA hoặc pointB
        let minY = vertices.pointO.y + (dMinHeight + 1);
        if (ny < minY) ny = minY;
    }

    // Lưới an toàn cứng: không bao giờ lưu trạng thái không hợp lệ
    let sim = { pointO: { ...vertices.pointO }, pointA: { ...vertices.pointA }, pointB: { ...vertices.pointB } };
    sim[pointNode] = { x: nx, y: ny };
    if (!isValidTriangle(sim)) return;

    vertices[pointNode] = { x: nx, y: ny };
    isModified = true;
    updateSVG2D();
}

// 6. HIỆU ỨNG NHẤP NHÁY CHO CÁC ĐIỂM KÉO ĐƯỢC
// Dao động opacity mượt mà bằng sóng sin + requestAnimationFrame.
// Trả về hàm huỷ: const stop = blinkPoint([...]);
function blinkPoint(selectors, options = {}) {
    const duration   = options.duration   ?? 1.5;  // giây cho một chu kỳ đầy đủ
    const minOpacity = options.minOpacity ?? 0.25;
    const maxOpacity = options.maxOpacity ?? 1.0;
    const mid   = (minOpacity + maxOpacity) / 2;
    const amp   = (maxOpacity - minOpacity) / 2;
    const omega = (2 * Math.PI) / duration;        // tần số góc

    const els = (Array.isArray(selectors) ? selectors : [selectors])
        .map(s => (typeof s === 'string' ? document.getElementById(s.replace(/^#/, '')) : s))
        .filter(Boolean);

    let rafId = null;
    let startTime = null;

    function tick(timestamp) {
        if (!startTime) startTime = timestamp;
        // cos bắt đầu ở giá trị lớn nhất → hiệu ứng khởi động mượt mà
        const opacity = mid - amp * Math.cos(omega * (timestamp - startTime) / 1000);
        for (let i = 0; i < els.length; i++) els[i].setAttribute('opacity', opacity.toFixed(3));
        rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => {
        if (rafId) cancelAnimationFrame(rafId);
        for (let i = 0; i < els.length; i++) els[i].setAttribute('opacity', '1');
    };
}

let g_blinkStop = null; // holds the cancel function for active blink animation

// 7. XỬ LÝ SỰ KIỆN
function resetState() {
    vertices = JSON.parse(JSON.stringify(initialVertices));
    isModified = false;
    updateSVG2D();
    // lưu ý: trạng thái activeHighlight KHÔNG được reset ở đây
}

$(document).ready(function () {
    setTimeout(function () {
        if (typeof initDragEvent === "function") {
            initDragEvent(_.flattenDeep(["svg_root"]));
        }

        showElement("#divBody", true).css("opacity", "1");
        controlTouch();
        initLabelCache(); // Tính toán và lưu kích thước nhãn trước khi render lần đầu

        if (g_state && g_state.controls) {
            Object.values(g_state.controls).forEach(function (ctrl) {
                if (ctrl.id) {
                    $("#" + ctrl.id)
                        .addClass("pointer-events-visible")
                        .removeClass("pointer-events-none")
                        .css("cursor", "pointer");
                }
            });
        }
        
        if (typeof getControl === "function") {
            Object.values(g_state.controls).forEach(ctrl => {
                if (ctrl.render) ctrl.render();
            });
        }
        
        updateSVG2D();

        // Bắt đầu hiệu ứng nhấp nháy cho các điểm kéo được
        if (g_blinkStop) g_blinkStop();
        g_blinkStop = blinkPoint(['pt-O', 'pt-A', 'pt-B'], { duration: 1.5, minOpacity: 0.3 });

        // bindButtonControls(); // Đã loại bỏ, dùng thư viện xử lý
    }, 100);
});