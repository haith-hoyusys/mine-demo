/* eslint-disable no-eval */
/* eslint-disable no-new */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-case-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */

var g_isAnimatingButton = {};
var g_latestMousePress = "";

window.loadConfigAndStaticSVG = () => {
  console.log("version", g_state ? g_state.c_version : "");
};

window.checkedInput = (x, y, z, g) => {
  console.log("version", g_state ? g_state.c_version : "");
};

// ==========================================
// 1. CONFIGURATION & CORE PARAMETERS
// ==========================================
function getConfig(key, defaultValue) {
  if (typeof CONFIG !== "undefined" && CONFIG && CONFIG[key] !== undefined) {
    return CONFIG[key];
  }
  return defaultValue;
}

function getTMax() {
  let val = getConfig("t_max", 10);
  val = Math.round(val);
  return Math.max(0, Math.min(100, val));
}

const cx = 508.88;
const cy = 277.22;
const angleRadius = 36;
const SPIRAL_GAP = 12; // px mở rộng bán kính mỗi vòng xoắn (dùng chung cho arc và arrowhead)

// ─── Default constants (các giá trị định nghĩa nếu không cấu hình qua config.js) ───
const ANIMATION_DURATION = 5000; // ms — thời gian cơ sở cho 1 vòng (t_max = 10)
const RADIUS = 180;              // px — bán kính đường tròn
const INITIAL_ANGLE = 0;         // rad — 0 = trục X dương
const VECTOR_V_LENGTH = 94.79;   // px — độ dài vector vận tốc
const VECTOR_A_LENGTH = 57.28;   // px — độ dài vector gia tốc
const LOOP_INFINITE = false;     // bool — chạy vô hạn hay dừng sau 1 vòng

// Label center offsets (measured once at init via getBBox, mirroring CONTENT_10 pattern)
let _labelP_hw = { w: 0, h: 0 };
let _labelV_hw = { w: 0, h: 0 };
let _labelA_hw = { w: 0, h: 0 };
let _labelOmegaT_hw = { w: 0, h: 0 };

// Configurable parameters
let t_max = getTMax();

// Slider dimensions
const minDrag = 338.75;
const maxDrag = 678.75;
const sliderLength = maxDrag - minDrag; // 340px

const totalSnapPoints = 11;
const dragScope = Array.from({ length: totalSnapPoints }, (_, i) =>
  minDrag + (i * sliderLength) / (totalSnapPoints - 1)
);

// State variables
let currentTime = 0; // t in [0, t_max]
let isAnimating = false;
let isPause = false;
let isAcceptDrag = true;
let isNewAnimate = true;
let isCompleted = false;

let showVelocity = false;
let showAcceleration = false;

let rafId = null;
let lastFrameTime = 0;

// ==========================================
// 2. MATHEMATICAL CORE LOGIC
// ==========================================

// Angular velocity: constant omega = PI/5 (calibrated for t_max=10, exactly 1 full rotation per 10s)
// omega does NOT change with t_max — a larger t_max means more rotations.
function getOmega() {
  return Math.PI / 5; // = 2*PI / 10
}

// Current angle in standard mathematical coordinates (rad)
function getAngle(t) {
  return INITIAL_ANGLE + getOmega() * t;
}

// Cartesian coordinates of Point P at time t
function getCoordinates(t) {
  const angle = getAngle(t);
  const x = Math.round((cx + RADIUS * Math.cos(angle)) * 1000) / 1000;
  const y = Math.round((cy - RADIUS * Math.sin(angle)) * 1000) / 1000;
  return { x, y, angle };
}

// End condition check (separated for maximum flexibility)
function checkEndCondition(t) {
  if (LOOP_INFINITE) {
    return false;
  }
  return t >= t_max;
}

// ==========================================
// 3. CONTROLS INITIALIZATION
// ==========================================
window.initState = null;
window.initState = () => {
  g_state = {
    c_version: "20260908",
    c_is_show_log: true,
    c_is_init_canvas: false,
    c_screen_width: 1024,
    c_screen_height: 648,

    menu: 1,
    menu_item_selected: 1,
    show_popup: false,
    delete_mode: false,
    mode_draw: "",
    cut_shape: false,

    menu_data: {
      1: {},
      2: {},
      3: {},
    },

    mouseup_nothing: function () {
      g_state_controls
        .filter((x) => x.mark == "ctrl-rotate")
        .forEach((c) => {
          c.visible = false;
          c.render();
        });
    },

    controls: {
      ctrl_drag: new Control({
        type: "drag",
        class_name: "slider-bar",
        scope: dragScope,
        x_scope: [minDrag, maxDrag],
        value: minDrag,

        fn_drag({ eventName }) {
          const ctrl = this;
          if (!isAcceptDrag) {
            return;
          }

          if (eventName === "mousedown") {
            ctrl.startPointerX = ctrl.curPos.x;
            const currentThumbX = minDrag + (currentTime / t_max) * sliderLength;

            if (ctrl.id === "drag-point") {
              // Click trực tiếp vào drag-point: giữ nguyên offset tương đối, không nhảy vị trí
              ctrl.startThumbX = currentThumbX;
              return;
            } else {
              // Click vào thanh slider: nhảy thumb đến ngay vị trí click
              const targetX = Math.max(ctrl.x_scope[0], Math.min(ctrl.curPos.x, ctrl.x_scope[1]));
              ctrl.startThumbX = targetX;
              ctrl.value = targetX;
              const ratio = (targetX - minDrag) / sliderLength;
              currentTime = ratio * t_max;
              if (currentTime < t_max && isCompleted) {
                isCompleted = false;
              }
              ctrl.render();
              return;
            }
          }

          if (eventName === "mousemove") {
            if (!ctrl.startPointerX || !ctrl.startThumbX) {
              return;
            }
            const dx = ctrl.curPos.x - ctrl.startPointerX;
            const targetX = Math.max(ctrl.x_scope[0], Math.min(ctrl.startThumbX + dx, ctrl.x_scope[1]));
            ctrl.value = targetX;

            const ratio = (targetX - minDrag) / sliderLength;
            currentTime = ratio * t_max;

            if (currentTime < t_max && isCompleted) {
              isCompleted = false;
            }

            ctrl.render();
            return;
          }

          if (eventName === "mouseup") {
            // Khi bật isSnap thì hút về mốc gần nhất dựa trên vị trí hiện tại
            const isSnap = false; // Đổi thành true nếu muốn bật snap
            if (isSnap && ctrl.startPointerX && ctrl.startThumbX) {
              let closest = ctrl.scope[0];
              let minDist = Math.abs(ctrl.value - closest);
              for (let i = 1; i < ctrl.scope.length; i++) {
                const dist = Math.abs(ctrl.value - ctrl.scope[i]);
                if (dist < minDist) {
                  closest = ctrl.scope[i];
                  minDist = dist;
                }
              }

              ctrl.value = closest;
              const ratio = (closest - minDrag) / sliderLength;
              currentTime = ratio * t_max;

              if (currentTime < t_max && isCompleted) {
                isCompleted = false;
              }

              ctrl.render();
            }

            // Dọn dẹp cờ, không tính lại tọa độ chuột khi thả -> Triệt tiêu 100% độ rung khi thả chuột!
            ctrl.startPointerX = null;
            ctrl.startThumbX = null;
          }
        },

        render: function () {
          setTime(currentTime);
          updateButtonsState();
        },
      }),

      ctrl_play_pause: new Control({
        type: "clickable",
        id: "btn-play-group",
        value: "valid",
        value1: "play",

        mousedown: function () {
          if (currentTime >= t_max) {
            return;
          }
          let ctrl = this;
          ctrl.value = "push";
          ctrl.render();
        },

        mouseup: function () {
          if (currentTime >= t_max) {
            return;
          }
          let ctrl = this;
          ctrl.value = "valid";

          if (isNewAnimate) {
            isNewAnimate = false;
            isPause = false;
            isCompleted = false;
            ctrl.value1 = "pause";
            startAnimation();
          } else {
            if (isAnimating) {
              pauseAnimation();
              ctrl.value1 = "resume";
            } else {
              resumeAnimation();
              ctrl.value1 = "pause";
            }
          }

          ctrl.render();
          updateButtonsState();
        },

        render: function () {
          let ctrl = this;
          showElement(getEl(`.btn-play, .btn-pause, .btn-resume`), false);
          showElement(getEl(`#btn-${ctrl.value1}-${ctrl.value}`), true);
        },
      }),

      ctrl_reset: new Control({
        type: "clickable",
        id: "btn-reset",
        value: "valid",

        mousedown: function () {
          const isResetActive = currentTime > 0 || !isNewAnimate;
          if (!isResetActive) {
            return;
          }
          showElement(getEl(".btn-reset"), false);
          showElement(getEl("#btn-reset-push"), true);
        },

        mouseup: function () {
          const isResetActive = currentTime > 0 || !isNewAnimate;
          if (!isResetActive) {
            return;
          }
          reset();
        },

        render: function () {
          updateButtonsState();
        },
      }),

      ctrl_chk_velocity: new Control({
        type: "clickable",
        id: "group-chk-velocity",

        mousedown: function () {
          showVelocity = !showVelocity;
          updateCheckboxesUI();
          setTime(currentTime);
        },
      }),

      ctrl_chk_accel: new Control({
        type: "clickable",
        id: "group-chk-accel",

        mousedown: function () {
          showAcceleration = !showAcceleration;
          updateCheckboxesUI();
          setTime(currentTime);
        },
      }),
    },
  };

  g_state_controls = Object.keys(g_state.controls).map((k) => {
    let ctrl = g_state.controls[k];
    ctrl.name = k;
    return ctrl;
  });

  g_default_state = JSON.parse(JSON.stringify(g_state));
};

$(document).ready(function () {
  window.initState();
  if (!g_state.c_is_show_log) { console.log = function () {}; }
  
  setTimeout(async () => {
    initDragEvent(_.flattenDeep(["Mycanvas"]));
    initCustomEvents();
    syncConfigUI();
    reset();
    showElement("#divBody, #stage_0", true).css("opacity", "1");
  }, 100);
});

function syncConfigUI() {
  t_max = getTMax();

  const $lblMax = $("#label-t-max tspan");
  if ($lblMax.length) {
    $lblMax.text(t_max);

    // Căn giữa label-t-max theo mốc cuối (x = 678.75)
    const TICK_END_X = 678.75;
    const $lblText = $("#label-t-max");
    if ($lblText.length) {
      const rect = getSVGRect($lblText[0]);
      const currentTranslateY = 544.58; // giữ nguyên y
      const newX = TICK_END_X - rect.width / 2;
      $lblText.attr("transform", "translate(" + newX + " " + currentTranslateY + ")");
    }
  }

  // Kích thước tĩnh của các label (đo từ design)
  // Tính từ tâm (center) của label đến origin (baseline) của text
  _labelP_hw = { w: 11.7, h: -12.2 };
  _labelV_hw = { w: 10.86, h: -9.5 };
  _labelA_hw = { w: 10.86, h: -9.5 };
  // textOmegaT: font-size 36px, "ωt" rộng ~39px, cap-height ~25px
  // w = half-width ≈ 19.5, h = -half-cap-height ≈ -12 (dịch xuống để căn giữa theo chiều dọc)
  _labelOmegaT_hw = { w: 19.5, h: -12 };
}

function initCustomEvents() {
  $("#hit-chk-velocity, #group-chk-velocity").on("click touchstart", function (e) {
    e.preventDefault();
    showVelocity = !showVelocity;
    updateCheckboxesUI();
    setTime(currentTime);
  });

  $("#hit-chk-accel, #group-chk-accel").on("click touchstart", function (e) {
    e.preventDefault();
    showAcceleration = !showAcceleration;
    updateCheckboxesUI();
    setTime(currentTime);
  });
}

function updateCheckboxesUI() {
  showElement(getEl("#chk-velocity-unchecked"), !showVelocity);
  showElement(getEl("#chk-velocity-checked"), showVelocity);

  showElement(getEl("#chk-accel-unchecked"), !showAcceleration);
  showElement(getEl("#chk-accel-checked"), showAcceleration);
}

// ==========================================
// 4. RENDERING & DYNAMIC VECTOR GRAPHICS
// ==========================================
function setTime(t) {
  t_max = getTMax();
  currentTime = Math.max(0, Math.min(t_max, t));

  const omega = getOmega();
  const angleSweep = omega * currentTime; // Arc magnitude omega*t (rad)

  // 1. Point P coordinates and position
  const coordP = getCoordinates(currentTime);
  const px = coordP.x;
  const py = coordP.y;
  const currentAngle = coordP.angle;

  $("#pointP").attr({ cx: px, cy: py });

  // Point P label: precise position matching design at t=0
  {
    // Căn theo offset tính từ gốc tọa độ O ở t=0:
    // dx = 714.54 - 508.88 = 205.66, dy = 255.02 - 277.22 = -22.2
    // Bán kính: 206.85, Góc offset: 0.107 rad
    const anchorPx = cx + 206.85 * Math.cos(currentAngle + 0.107);
    const anchorPy = cy - 206.85 * Math.sin(currentAngle + 0.107);
    const newPx = Math.round((anchorPx - _labelP_hw.w) * 1000) / 1000;
    const newPy = Math.round((anchorPy - _labelP_hw.h) * 1000) / 1000;
    $("#textP").attr("transform", `translate(${newPx} ${newPy})`);
  }

  // 2. Connecting Line OP & Swept Angle Arc omega*t
  if (currentTime > 0) {
    $("#lineOP").attr({ x1: cx, y1: cy, x2: px, y2: py });
    showElement(getEl("#lineOP"), true);

    const angleRadius = 36;
    const headLen = 15.18;
    const headWidth = 8.14;

    if (angleSweep > 0.05) {
      // isSpiral được quyết định dựa trên t_max: > 10 thì xoắn ốc ngay từ vòng đầu tiên
      const isSpiral = getTMax() > 10;
      // r_tip: giữ angleRadius khi <= 1 vòng, tăng theo spiral khi > 1 vòng
      const r_tip = isSpiral
        ? angleRadius + (angleSweep / (2 * Math.PI)) * SPIRAL_GAP
        : angleRadius;

      // headAngleSpan tính theo r_tip vì đầu mũi tên nằm trên spiral
      const headAngleSpan = headLen / r_tip;

      // Tip nằm trên vòng xoắn tại angle hiện tại, bán kính r_tip
      const tipX = cx + r_tip * Math.cos(currentAngle);
      const tipY = cy - r_tip * Math.sin(currentAngle);

      if (angleSweep >= headAngleSpan) {
        // Chord direction angle (midway between base angle and tip angle)
        const dirAngle = currentAngle - headAngleSpan / 2;
        const ux = -Math.sin(dirAngle);
        const uy = -Math.cos(dirAngle);
        const nx = Math.cos(dirAngle);
        const ny = -Math.sin(dirAngle);

        const baseCenterX = tipX - headLen * ux;
        const baseCenterY = tipY - headLen * uy;

        const w1x = baseCenterX - (headWidth / 2) * nx;
        const w1y = baseCenterY - (headWidth / 2) * ny;
        const w2x = baseCenterX + (headWidth / 2) * nx;
        const w2y = baseCenterY + (headWidth / 2) * ny;

        $("#arrowheadAngle").attr(
          "points",
          `${w1x.toFixed(2)} ${w1y.toFixed(2)} ${tipX.toFixed(2)} ${tipY.toFixed(2)} ${w2x.toFixed(2)} ${w2y.toFixed(2)}`
        );
        showElement(getEl("#arrowheadAngle"), true);

        // Polyline arc dừng trước đầu mũi tên; truyền angleSweep để makeArcPoints biết chế độ spiral
        const arcSweep = angleSweep - headAngleSpan;
        const arcPoints = makeArcPoints(cx, cy, -INITIAL_ANGLE, angleRadius, arcSweep, angleSweep);
        $("#arrowAngle").attr("points", arcPoints);
        showElement(getEl("#arrowAngle"), true);
      } else {
        // When angle is small, draw arc to current angle and scale arrowhead
        showElement(getEl("#arrowheadAngle"), false);
        const arcPoints = makeArcPoints(cx, cy, -INITIAL_ANGLE, angleRadius, angleSweep, angleSweep);
        $("#arrowAngle").attr("points", arcPoints);
        showElement(getEl("#arrowAngle"), true);
      }

      // omega*t label:
      // - < 2PI: đặt ở giữa arc (midAngle), như thiết kế gốc
      // - >= 2PI: đặt đối diện OP (currentAngle + PI) để tránh chồng lên xoắn ốc
      let anchorOmegaX, anchorOmegaY;
      if (isSpiral) {
        // Đối diện OP: góc currentAngle + PI, bán kính = r_tip + 28
        const labelAngleRadius = r_tip + 28;
        const labelOppAngle = currentAngle + Math.PI;
        anchorOmegaX = cx + labelAngleRadius * Math.cos(labelOppAngle);
        anchorOmegaY = cy - labelAngleRadius * Math.sin(labelOppAngle);
      } else {
        // Giữa arc: midAngle, bán kính cố định = angleRadius + 28
        const midAngle = INITIAL_ANGLE + angleSweep / 2;
        const labelAngleRadius = angleRadius + 28;
        anchorOmegaX = cx + labelAngleRadius * Math.cos(midAngle);
        anchorOmegaY = cy - labelAngleRadius * Math.sin(midAngle);
      }
      const labelOmegaX = Math.round((anchorOmegaX - _labelOmegaT_hw.w) * 1000) / 1000;
      const labelOmegaY = Math.round((anchorOmegaY - _labelOmegaT_hw.h) * 1000) / 1000;
      $("#textOmegaT").attr("transform", `translate(${labelOmegaX} ${labelOmegaY})`);
      showElement(getEl("#textOmegaT"), true);
    } else {
      showElement(getEl("#arrowAngle, #arrowheadAngle, #textOmegaT"), false);
    }
  } else {
    showElement(getEl("#lineOP, #arrowAngle, #arrowheadAngle, #textOmegaT"), false);
  }

  // 3. Velocity Vector v (Orange-Red #ff4b00, Tangent: angle + PI/2, matching Scene 9)
  const angleV = currentAngle + Math.PI / 2;
  const tipLenV = 112.5;
  const lineLenV = 94.79;
  const headLen = 21.68;
  const headWidth = 11.63;

  const vx = Math.round((px + tipLenV * Math.cos(angleV)) * 1000) / 1000;
  const vy = Math.round((py - tipLenV * Math.sin(angleV)) * 1000) / 1000;

  const lineEndX_V = Math.round((px + lineLenV * Math.cos(angleV)) * 1000) / 1000;
  const lineEndY_V = Math.round((py - lineLenV * Math.sin(angleV)) * 1000) / 1000;
  $("#lineV").attr({ x1: px, y1: py, x2: lineEndX_V, y2: lineEndY_V });

  const baseCenterVx = vx - headLen * Math.cos(angleV);
  const baseCenterVy = vy + headLen * Math.sin(angleV);
  const b1vx = baseCenterVx - (headWidth / 2) * Math.sin(angleV);
  const b1vy = baseCenterVy - (headWidth / 2) * Math.cos(angleV);
  const b2vx = baseCenterVx + (headWidth / 2) * Math.sin(angleV);
  const b2vy = baseCenterVy + (headWidth / 2) * Math.cos(angleV);

  $("#arrowheadV").attr(
    "points",
    `${b1vx.toFixed(2)} ${b1vy.toFixed(2)} ${vx.toFixed(2)} ${vy.toFixed(2)} ${b2vx.toFixed(2)} ${b2vy.toFixed(2)}`
  );

  // Velocity label v: precise local offset from tip V matching design at t=0
  {
    // dx = 26.94 (radial), dy = 13.23 (tangent inverted)
    const anchorVx = vx + 26.94 * Math.cos(currentAngle) + 13.23 * Math.sin(currentAngle);
    const anchorVy = vy - 26.94 * Math.sin(currentAngle) + 13.23 * Math.cos(currentAngle);
    const newVx = Math.round((anchorVx - _labelV_hw.w) * 1000) / 1000;
    const newVy = Math.round((anchorVy - _labelV_hw.h) * 1000) / 1000;
    $("#labelV").attr("transform", `translate(${newVx} ${newVy})`);
  }

  showElement(getEl("#groupVelocity"), showVelocity);

  // 4. Acceleration Vector a (Blue #0b89dd, Centripetal towards center O: angle + PI, matching Scene 9)
  const angleA = currentAngle + Math.PI;
  const tipLenA = 75.0;
  const lineLenA = 57.28;

  const ax = Math.round((px + tipLenA * Math.cos(angleA)) * 1000) / 1000;
  const ay = Math.round((py - tipLenA * Math.sin(angleA)) * 1000) / 1000;

  const lineEndX_A = Math.round((px + lineLenA * Math.cos(angleA)) * 1000) / 1000;
  const lineEndY_A = Math.round((py - lineLenA * Math.sin(angleA)) * 1000) / 1000;
  $("#lineA").attr({ x1: px, y1: py, x2: lineEndX_A, y2: lineEndY_A });

  const baseCenterAx = ax - headLen * Math.cos(angleA);
  const baseCenterAy = ay + headLen * Math.sin(angleA);
  const b1ax = baseCenterAx - (headWidth / 2) * Math.sin(angleA);
  const b1ay = baseCenterAy - (headWidth / 2) * Math.cos(angleA);
  const b2ax = baseCenterAx + (headWidth / 2) * Math.sin(angleA);
  const b2ay = baseCenterAy + (headWidth / 2) * Math.cos(angleA);

  $("#arrowheadA").attr(
    "points",
    `${b1ax.toFixed(2)} ${b1ay.toFixed(2)} ${ax.toFixed(2)} ${ay.toFixed(2)} ${b2ax.toFixed(2)} ${b2ay.toFixed(2)}`
  );

  // Acceleration label a: precise local offset from tip A matching design at t=0
  {
    // dx = 12.56, dy = -28.42
    const anchorAx = ax + 12.56 * Math.cos(currentAngle) - 28.42 * Math.sin(currentAngle);
    const anchorAy = ay - 12.56 * Math.sin(currentAngle) - 28.42 * Math.cos(currentAngle);
    const newAx = Math.round((anchorAx - _labelA_hw.w) * 1000) / 1000;
    const newAy = Math.round((anchorAy - _labelA_hw.h) * 1000) / 1000;
    $("#labelA").attr("transform", `translate(${newAx} ${newAy})`);
  }

  showElement(getEl("#groupAcceleration"), showAcceleration);

  // 5. Update Slider thumb position
  updateSliderThumb(currentTime);
}

function updateSliderThumb(t) {
  t_max = getTMax();
  const ratio = t / t_max;
  const sliderX = ratio * sliderLength;
  $("#drag-point-container").attr("transform", `translate(${sliderX} 0)`);
}

function updateButtonsState() {
  t_max = getTMax();

  const ctrlPlay = g_state && g_state.controls ? g_state.controls.ctrl_play_pause : null;

  // 1. Play / Pause / Resume buttons
  showElement(getEl(".btn-play, .btn-pause, .btn-resume"), false);
  if (currentTime >= t_max) {
    if (isNewAnimate) {
      if (ctrlPlay) {
        ctrlPlay.value = "invalid";
        ctrlPlay.value1 = "play";
      }
      showElement(getEl("#btn-play-invalid"), true);
    } else {
      if (ctrlPlay) {
        ctrlPlay.value = "invalid";
        ctrlPlay.value1 = "resume";
      }
      showElement(getEl("#btn-resume-invalid"), true);
    }
  } else if (isAnimating) {
    if (ctrlPlay) {
      ctrlPlay.value = "valid";
      ctrlPlay.value1 = "pause";
    }
    showElement(getEl("#btn-pause-valid"), true);
  } else if (!isNewAnimate) {
    if (ctrlPlay) {
      ctrlPlay.value = "valid";
      ctrlPlay.value1 = "resume";
    }
    showElement(getEl("#btn-resume-valid"), true);
  } else {
    if (ctrlPlay) {
      ctrlPlay.value = "valid";
      ctrlPlay.value1 = "play";
    }
    showElement(getEl("#btn-play-valid"), true);
  }

  // 2. Reset Button (最初に戻る) - Always hide all .btn-reset states first
  showElement(getEl(".btn-reset"), false);
  const isResetActive = currentTime > 0 || !isNewAnimate;
  if (isResetActive) {
    showElement(getEl("#btn-reset-valid"), true);
  } else {
    showElement(getEl("#btn-reset-invalid"), true);
  }
}

// ==========================================
// 5. REAL-TIME ANIMATION LOOP (requestAnimationFrame)
// ==========================================
function animationLoop(timestamp) {
  if (!isAnimating) return;

  if (!lastFrameTime) {
    lastFrameTime = timestamp;
  }

  const elapsedMs = timestamp - lastFrameTime;
  lastFrameTime = timestamp;

  t_max = getTMax();

  // Tốc độ thời gian thực của t là cố định.
  // T_BASE=10 là chuẩn: khi t_max=10 animation mất đúng ANIMATION_DURATION ms.
  // Khi t_max lớn hơn, animation kéo dài tỉ lệ tương ứng (t_max/10 * ANIMATION_DURATION).
  const T_BASE = 10;
  const deltaT = (elapsedMs / ANIMATION_DURATION) * T_BASE;
  let nextTime = currentTime + deltaT;

  if (checkEndCondition(nextTime)) {
    nextTime = t_max;
    setTime(nextTime);
    completeAnimation();
    return;
  }

  setTime(nextTime);
  rafId = requestAnimationFrame(animationLoop);
}

function startAnimation() {
  isAnimating = true;
  isPause = false;
  isCompleted = false;
  declineDrag();

  lastFrameTime = 0;
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
  rafId = requestAnimationFrame(animationLoop);
}

function pauseAnimation() {
  isAnimating = false;
  isPause = true;
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  acceptDrag();
}

function resumeAnimation() {
  t_max = getTMax();
  if (currentTime >= t_max) {
    currentTime = 0;
  }
  startAnimation();
}

function completeAnimation() {
  isAnimating = false;
  isPause = false;
  isCompleted = true;
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  acceptDrag();
  updateButtonsState();
}

function reset() {
  currentTime = 0;
  isAnimating = false;
  isPause = false;
  isNewAnimate = true;
  isCompleted = false;

  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  acceptDrag();
  setTime(0);

  const ctrlPlay = g_state && g_state.controls ? g_state.controls.ctrl_play_pause : null;
  if (ctrlPlay) {
    ctrlPlay.value = "valid";
    ctrlPlay.value1 = "play";
  }

  const ctrlReset = g_state && g_state.controls ? g_state.controls.ctrl_reset : null;
  if (ctrlReset) {
    ctrlReset.value = "valid";
  }

  updateCheckboxesUI();
  updateButtonsState();
}

function acceptDrag() {
  isAcceptDrag = true;
  $("#drag-point, #slider").addClass("cursor-pointer");
  $("#drag-point").css("fill", "#0b89dd");
}

function declineDrag() {
  isAcceptDrag = false;
  $("#drag-point, #slider").removeClass("cursor-pointer");
  $("#drag-point").css("fill", "#bfe4ff");
}


// Curve drawing helper for angle omega*t
// - Khi rAngle (của arc thân) > 2*PI hoặc totalAngle > 2*PI: vẽ xoắn ốc Archimedean
let makeArcPoints = (centreX, centreY, startAngle, startRadius, rAngle, totalAngle = rAngle) => {
  const pointsPerQuarter = 15; // Giảm từ 70 xuống 15 để tối ưu hiệu năng khi t_max lớn
  const absAngle = Math.abs(rAngle);
  const quarterTurns = (absAngle / (2 * Math.PI)) * 4;
  const totalSteps = Math.max(6, Math.round(quarterTurns * pointsPerQuarter));

  // isSpiral được quyết định dựa trên t_max: > 10 thì xoắn ốc ngay từ vòng đầu tiên
  // Đảm bảo arc thân và đầu mũi tên luôn dùng cùng chế độ
  const isSpiral = getTMax() > 10;

  let pointsStr = "";
  for (let i = 0; i <= totalSteps; i++) {
    // In SVG, counter-clockwise angle decreases
    const angle = startAngle - (i * rAngle) / totalSteps;
    // Vòng 1 (isSpiral=false): bán kính cố định (hình tròn thuần)
    // Sau vòng 1 (isSpiral=true): xoắn ốc theo cùng công thức với r_tip
    const cumulativeAngle = (i / totalSteps) * Math.abs(rAngle);
    const r = isSpiral
      ? startRadius + (cumulativeAngle / (2 * Math.PI)) * SPIRAL_GAP
      : startRadius;
    
    pointsStr += `${(centreX + r * Math.cos(angle)).toFixed(2)},${(centreY + r * Math.sin(angle)).toFixed(2)} `;
  }

  return pointsStr.trim();
};