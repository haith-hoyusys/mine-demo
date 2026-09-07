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

const cx = 508.88;
const cy = 277.22;
const angleRadius = 36;

// Configurable parameters
let t_max = getConfig("t_max", 10);
let animation_duration = getConfig("animation_duration", 5000); // ms
let radius = getConfig("radius", 180);
let INITIAL_ANGLE = getConfig("initial_angle", 0); // 0: On positive X axis (r, 0)
let lenVelocity = getConfig("vector_v_length", 94.79);
let lenAccel = getConfig("vector_a_length", 57.28);

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

// Angular velocity: omega = 2*PI / t_max (Ensures exactly 1 full rotation when t runs 0 -> t_max)
function getOmega() {
  t_max = getConfig("t_max", 10);
  return (2 * Math.PI) / t_max;
}

// Current angle in standard mathematical coordinates (rad)
function getAngle(t) {
  INITIAL_ANGLE = getConfig("initial_angle", 0);
  const omega = getOmega();
  return INITIAL_ANGLE + omega * t;
}

// Cartesian coordinates of Point P at time t
function getCoordinates(t) {
  radius = getConfig("radius", 180);
  const angle = getAngle(t);
  // In Cartesian: x = r*cos(angle), y = r*sin(angle)
  // In SVG coordinates (y axis points downwards):
  const x = Math.round((cx + radius * Math.cos(angle)) * 1000) / 1000;
  const y = Math.round((cy - radius * Math.sin(angle)) * 1000) / 1000;
  return { x, y, angle };
}

// End condition check (separated for maximum flexibility)
function checkEndCondition(t) {
  if (typeof CONFIG !== "undefined" && CONFIG && CONFIG.loop_infinite) {
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
    c_version: "20241020",
    c_is_show_log: false,
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
          if (!isAcceptDrag || (ctrl.id == "drag-point" && eventName == "mousedown")) {
            return;
          }

          // Clamp within drag range
          ctrl.value = Math.max(ctrl.x_scope[0], Math.min(ctrl.curPos.x, ctrl.x_scope[1]));

          // Snap to closest tick on mouseup (đặt isSnap = true khi cần bật lại)
          const isSnap = false;
          if (isSnap && eventName === "mouseup") {
            const threshold = 12;
            let closest = ctrl.scope[0];
            let minDist = Math.abs(ctrl.value - closest);

            for (let i = 1; i < ctrl.scope.length; i++) {
              const dist = Math.abs(ctrl.value - ctrl.scope[i]);
              if (dist < minDist) {
                closest = ctrl.scope[i];
                minDist = dist;
              }
            }
            if (minDist <= threshold) {
              ctrl.value = closest;
            }
          }

          const minX = ctrl.x_scope[0];
          const maxX = ctrl.x_scope[1];
          const ratio = (ctrl.value - minX) / (maxX - minX);
          currentTime = ratio * t_max;

          if (currentTime < t_max && isCompleted) {
            isCompleted = false;
          }

          ctrl.render();
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
          if (isCompleted && currentTime >= t_max) {
            return;
          }
          let ctrl = this;
          ctrl.value = "push";
          ctrl.render();
        },

        mouseup: function () {
          if (isCompleted && currentTime >= t_max) {
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
  setTimeout(async () => {
    initDragEvent(_.flattenDeep(["Mycanvas"]));
    initCustomEvents();
    syncConfigUI();
    reset();
    showElement("#divBody, #stage_0", true).css("opacity", "1");
  }, 100);
});

function syncConfigUI() {
  t_max = getConfig("t_max", 10);
  animation_duration = getConfig("animation_duration", 5000);
  radius = getConfig("radius", 180);
  INITIAL_ANGLE = getConfig("initial_angle", 0);
  lenVelocity = getConfig("vector_v_length", 94.79);
  lenAccel = getConfig("vector_a_length", 57.28);

  const $lblMax = $("#label-t-max tspan");
  if ($lblMax.length) {
    $lblMax.text(t_max);
  }
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
  t_max = getConfig("t_max", 10);
  currentTime = Math.max(0, Math.min(t_max, t));

  const omega = getOmega();
  const angleSweep = omega * currentTime; // Arc magnitude omega*t (rad)

  // 1. Point P coordinates and position
  const coordP = getCoordinates(currentTime);
  const px = coordP.x;
  const py = coordP.y;
  const currentAngle = coordP.angle;

  $("#pointP").attr({ cx: px, cy: py });

  // Point P label position (radially outward so it never overlaps point P)
  const labelDistP = radius + 24;
  const labelPx = Math.round((cx + labelDistP * Math.cos(currentAngle) - 10) * 1000) / 1000;
  const labelPy = Math.round((cy - labelDistP * Math.sin(currentAngle) - 10) * 1000) / 1000;
  $("#textP").attr("transform", `translate(${labelPx} ${labelPy})`);

  // 2. Connecting Line OP & Swept Angle Arc omega*t
  if (currentTime > 0) {
    $("#lineOP").attr({ x1: cx, y1: cy, x2: px, y2: py });
    showElement(getEl("#lineOP"), true);

    const angleRadius = 36;
    const headLen = 15.18;
    const headWidth = 8.14;
    const headAngleSpan = headLen / angleRadius; // ~0.4217 rad

    if (angleSweep > 0.05) {
      // Tip is mathematically on segment OP at distance angleRadius from center
      const tipX = cx + angleRadius * Math.cos(currentAngle);
      const tipY = cy - angleRadius * Math.sin(currentAngle);

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

        // Polyline arc stops at base of arrowhead
        const arcSweep = angleSweep - headAngleSpan;
        const arcPoints = makeArcPoints(cx, cy, -INITIAL_ANGLE, angleRadius, arcSweep);
        $("#arrowAngle").attr("points", arcPoints);
        showElement(getEl("#arrowAngle"), true);
      } else {
        // When angle is small, draw arc to current angle and scale arrowhead
        showElement(getEl("#arrowheadAngle"), false);
        const arcPoints = makeArcPoints(cx, cy, -INITIAL_ANGLE, angleRadius, angleSweep);
        $("#arrowAngle").attr("points", arcPoints);
        showElement(getEl("#arrowAngle"), true);
      }

      // omega*t label (positioned at the middle of the swept arc)
      const midAngle = INITIAL_ANGLE + angleSweep / 2;
      const labelAngleRadius = angleRadius + 28;
      const labelOmegaX = Math.round((cx + labelAngleRadius * Math.cos(midAngle)) * 1000) / 1000;
      const labelOmegaY = Math.round((cy - labelAngleRadius * Math.sin(midAngle)) * 1000) / 1000 + 12;
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

  // Velocity label v (matching Scene 9 offset relative to vector tip)
  const labelVx = Math.round((vx + 16.08 * Math.cos(currentAngle) + 22.73 * Math.sin(currentAngle)) * 1000) / 1000;
  const labelVy = Math.round((vy - 16.08 * Math.sin(currentAngle) + 22.73 * Math.cos(currentAngle)) * 1000) / 1000;
  $("#labelV").attr("transform", `translate(${labelVx} ${labelVy})`);

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

  // Acceleration label a (matching Scene 9 offset relative to vector tip)
  const labelAx = Math.round((ax + 1.7 * Math.cos(currentAngle) - 18.92 * Math.sin(currentAngle)) * 1000) / 1000;
  const labelAy = Math.round((ay - 1.7 * Math.sin(currentAngle) - 18.92 * Math.cos(currentAngle)) * 1000) / 1000;
  $("#labelA").attr("transform", `translate(${labelAx} ${labelAy})`);

  showElement(getEl("#groupAcceleration"), showAcceleration);

  // 5. Update Slider thumb position
  updateSliderThumb(currentTime);
}

function updateSliderThumb(t) {
  t_max = getConfig("t_max", 10);
  const ratio = t / t_max;
  const sliderX = ratio * sliderLength;
  $("#drag-point-container").attr("transform", `translate(${sliderX} 0)`);
}

function updateButtonsState() {
  t_max = getConfig("t_max", 10);

  const ctrlPlay = g_state && g_state.controls ? g_state.controls.ctrl_play_pause : null;

  // 1. Play / Pause / Resume buttons
  showElement(getEl(".btn-play, .btn-pause, .btn-resume"), false);
  if (isCompleted && currentTime >= t_max) {
    if (ctrlPlay) {
      ctrlPlay.value = "invalid";
      ctrlPlay.value1 = "resume";
    }
    showElement(getEl("#btn-resume-invalid"), true);
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

  t_max = getConfig("t_max", 10);
  animation_duration = getConfig("animation_duration", 5000);

  // Calculate delta_t based on real-world elapsed time and animation_duration
  const deltaT = (elapsedMs / animation_duration) * t_max;
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
  t_max = getConfig("t_max", 10);
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
let makeArcPoints = (centreX, centreY, startAngle, startRadius, rAngle) => {
  const pointsPerQuarter = 70;
  const points = [];
  const absAngle = Math.abs(rAngle);
  const quarterTurns = (absAngle / (2 * Math.PI)) * 4;
  const totalSteps = Math.max(6, Math.round(quarterTurns * pointsPerQuarter));

  for (let i = 0; i <= totalSteps; i++) {
    // In SVG, counter-clockwise angle decreases
    const angle = startAngle - (i * rAngle) / totalSteps;
    points.push([
      (centreX + startRadius * Math.cos(angle)).toFixed(2),
      (centreY + startRadius * Math.sin(angle)).toFixed(2),
    ]);
  }

  return points.map((ps) => ps.join(",")).join(" ");
};