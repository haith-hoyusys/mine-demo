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

window.initState = null;
window.initState = () => {
  g_state = {
    c_version: "20241020",
    c_is_show_log: false,
    c_is_init_canvas: false,
    c_screen_width: 1024,
    c_screen_height: 648,

    menu: 1, // 1,  2, 3
    menu_item_selected: 1, // null, 1, 2, 3
    show_popup: false,
    delete_mode: false,
    mode_draw: "", // line_dash, line_solid, hand_dash, hand_solid
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
        value: 357.5, // vị trí X ban đầu
        value1: 0,

        fn_drag({ eventName }) {
          const ctrl = this;
          if(!isAcceptDrag ||(ctrl.id == "drag-point" && eventName == "mousedown")) {
            return;
          }
          // Giới hạn kéo trong phạm vi
          ctrl.value = Math.max(ctrl.x_scope[0], Math.min(ctrl.curPos.x, ctrl.x_scope[1]));

          // Nếu là sự kiện "mouseup", thực hiện snap vào điểm gần nhất trong scope
          if (eventName === "mouseup") {
            const threshold = 10;
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
          
          // Tính toán value1 tương ứng từ vị trí value
          const minX = ctrl.x_scope[0];
          const maxX = ctrl.x_scope[1];
          
          const ratio = (ctrl.value - minX) / (maxX - minX); // tỷ lệ từ 0 → 1
          theta = minTheta + ratio * (maxTheta - minTheta); // newTheta
          // Gán giá trị theta để cập nhật đồ thị
          ctrl.render();
        },
        
        render: function () {
          const ctrl = this;
          setTheta(theta);
          ctrl.tx = ctrl.value + 3.5; // điều chỉnh bù 4px cho cân đối drag-point
          getEl(`#drag-point`)
            .attr("transform", `translate(${ctrl.tx} 0)`);
          
          showElement(getEl(`#btn-reset-invalid`), false);
        },
      }),

      ctrl_play_pause: new Control({
        type: "clickable",
        id: "btn-play-group",
        value: "valid", //trang thai btn
        value1: "play", //tên btn
        mousedown: function () {
          let ctrl = this;
          ctrl.value = "push";
          if(isNewAnimate){
            ctrl.value1 = "play"
          }else{
            if(isPause){
              ctrl.value1 = "pause";
            }else{
              ctrl.value1 = "resume";
            }
          }

          ctrl.render(); 
        },
        mouseup: function () {
          let ctrl = this;
          ctrl.value = "valid";
          isNewAnimate = false
          if(isPause){
            ctrl.value1 = "resume";
          }else{
            ctrl.value1 = "pause";
          }
          isPause = !isPause;
          ctrl.render();
          //hoan thanh nut thi chay logics
          ctrlPlayPause();
        },
        render: function () {
          let ctrl = this;
          showElement(getEl(`.btn-play, .btn-pause, .btn-resume`), false);
          showElement(getEl(`#btn-${ctrl.value1}-${ctrl.value}`), true);
          showElement(getEl(`#btn-reset-invalid`), isNewAnimate);
        },
      }),
      ctrl_reset: new Control({
        type: "clickable",
        id: "btn-reset",
        value: "valid",
        mousedown: function () {
          showElement(getEl(`.btn-reset`), false);
          showElement(getEl(`#btn-reset-push`), true);
          showElement(getEl(`#btn-reset-invalid`), false);
        },
        mouseup: function () {
          let ctrl = this;
          ctrl.render();
          //trang thái ban đầu
          reset();
        },
        render: function () {
          showElement(getEl(`.btn-reset`), false);
          showElement(getEl(`#btn-reset-valid, #btn-reset-invalid`), true)

          showElement(getEl(`.btn-play, .btn-pause, .btn-resume`), false);
          showElement(getEl(`#btn-play-valid`), true);
        },
      }),
    },

    fnCalculateShapePoints: function (points, point_number) {
      let u = _(points.split(" "))
        .chunk(2)
        .value()
        .map((x) => new Point3D(Number(x[0]), Number(x[1]), 0))
        .slice(-point_number);
      console.log(JSON.stringify(u));
    },
    fnCalculateRotatedPoint: function (el) {
      let rSVG = getSVGRect(el);

      // console.log(rSVG);
      let pSVG = new Point3D(
        rSVG.x + rSVG.width / 2,
        rSVG.y + rSVG.height / 2,
        0
      );

      return pSVG;
    },

    fnCalculateDiffTranslate: function (el1, el2) {
      let rect1 = getSVGRect($(el1));
      let rect2 = getSVGRect($(el2));

      return {
        dx: -rect1.x + rect2.x,
        dy: -rect1.y + rect2.y,
      };
    },

    setDeleteMode: function (mode) {
      g_state.delete_mode = !!mode;
      g_state.mode_draw = "";
      g_state_controls
        .filter((x) => x.mark == "mode-draw")
        .forEach((c) => {
          c.value = "inactive";
          c.render();
        });
      console.log("set delete mode", g_state.delete_mode);
      showElement(".draw-line-ruler", !g_state.delete_mode);
    },
  };

  g_state_controls = Object.keys(g_state.controls).map((k) => {
    let ctrl = g_state.controls[k];
    ctrl.name = k;

    return ctrl;
  });

  Object.keys(g_state.menu_data).forEach((k) => {
    g_state.menu_data[k].line_delete = [];
    g_state.menu_data[k].line_delete_origin = [];
  });
  g_default_state = JSON.parse(JSON.stringify(g_state));
};

const checkedInput = (x, y, z, g) => {
  console.log("version", g_state.c_version);
};

const loadConfigAndStaticSVG = () => {
  console.log("version", g_state.c_version);
};

let controlValuesPrev = JSON.stringify({});

let isDebugDOM = true;
const applyControlChange = (isSkipCache) => {
  let controlValues = JSON.stringify({
    ..._.pick(g_state, ["menu", "menu_item_selected", "menu_data"]),
    controls: g_state_controls
      .filter((x) => !x.is_skip_check_reload)
      .map((x) => _.pick(x, ["name", "value"])),
  });

  if (controlValues == controlValuesPrev && !isSkipCache) {
    return;
  }
  controlValuesPrev = controlValues;
};

function transformCoordinate(coord, grid, mirrorX, mirrorY) {
  let x = coord.x * grid;
  let y = coord.y * grid;

  if (mirrorX) x = -x;
  if (mirrorY) y = -y;

  return { x, y };
}

$(document).ready(function () {
  window.initState();
  setTimeout(async () => {
    initDragEvent(_.flattenDeep(["Mycanvas"]));

    showElement("#divBody, #stage_0", true).css("opacity", "1");
  }, 100);
});

// Biến khởi tạo có thể điều chỉnh
let isNewAnimate = true;
let isAnimating = false;
let isPause = false;
let isAcceptDrag = true; // chay animation thi khong cho drag
let isShowText = false; // text theta ban dau hien thi

const init_cx = 125.59;
const init_cy = 251;
const init_r = 83.55;
const secondary_r = init_r; // đường tròn nhỏ (gốc), có thể ghi đè

const graphOriginX = 357.52;
const graphOriginY = init_cy;

const yScale = init_r;
const xScale = 73.82;
const minDrag = 117.5;
const maxDrag = 717.5;
const totalPoints = 11;
const dragScope = Array.from({ length: totalPoints }, (_, i) =>
  minDrag + (i * (maxDrag - minDrag) / (totalPoints - 1))
);
let mode = "sin3"; // có 3 mode sin, sin2, sin3

const cx = init_cx;
const cy = init_cy;
const r = init_r;
const minTheta = -2 * Math.PI;
const maxTheta = 3 * Math.PI;

let theta = 0;
let theta2 = 0;
let animation = null;
let step = 0;

function getYValue(angle) {
  if (mode === "cos") return Math.cos(angle);
  if (mode === "sin2") return Math.sin(2 * angle);
  if (mode === "sin3") return Math.sin(angle - 1);
  return Math.sin(angle);
}

function getAngleTransformed(angle) {
  if (mode === "cos") return angle + Math.PI / 2;
  if (mode === "sin2") return 2 * angle;
  if (mode === "sin3") return angle - 1;
  return angle;
}

function updatePoint() {
  const angle = getAngleTransformed(theta);
  const realAngle = theta; // dùng cho gray point
  const useSecondaryR = (mode === "sin2" || mode === "sin3") ? init_r : secondary_r;

  const x = cx + r * Math.cos(angle);
  const y = cy - r * Math.sin(angle);
  $("#pointP").attr({ cx: x, cy: y });
  $("#lineOP").attr({ x2: x, y2: y });
  
  const xGray = cx + useSecondaryR * Math.cos(realAngle);
  const yGray = cy - useSecondaryR * Math.sin(realAngle);
  $("#grayPointP").attr({ cx: xGray, cy: yGray });
  $("#lineOO").attr({ x2: xGray, y2: yGray });

  let xTheta1 = cx + (useSecondaryR - 55) * Math.cos(realAngle - 0.32);
  let yTheta1 = cy - (useSecondaryR - 55) * Math.sin(realAngle - 0.32);
  if (theta < 0) {
    xTheta1 = cx + (useSecondaryR - 52) * Math.cos(realAngle + 0.35);
    yTheta1 = cy - (useSecondaryR - 52) * Math.sin(realAngle + 0.35);
  }
  $("#textTheta1").attr("transform", `translate(${xTheta1} ${yTheta1})`);

  const xP = cx + (r + 12) * Math.cos(angle + 0.195);
  const yP = cy - (r + 12) * Math.sin(angle + 0.195);
  $("#textP").attr("transform", `translate(${xP} ${yP})`);

  let xP2 = cx + (r - 35) * Math.cos(angle - 0.7);
  let yP2 = cy - (r - 35) * Math.sin(angle - 0.7);
  if(theta2 < 0) {
    xP2 = cx + (r - 26) * Math.cos(angle + .45);
    yP2 = cy - (r - 26) * Math.sin(angle + .45);
  }
  $("#textP2").attr("transform", `translate(${xP2} ${yP2})`);
  showElement(getEl(`#arrow, #arrowP, #arrowO, #textP2, #textTheta1`), isShowText);

  $("#graphDot").attr("r", theta == 0 ? `5.31` : `5.5`);
}

let maxThetaCurrent = 0;
let minThetaCurrent = 0;

function drawGraph(currentTheta) {
  let points = [];
  let grayPoints = [];

  const step = 0.01;
  if (currentTheta > maxThetaCurrent) maxThetaCurrent = currentTheta;
  if (currentTheta < minThetaCurrent) minThetaCurrent = currentTheta;

  const useSecondaryR = (mode === "sin2" || mode === "sin3") ? init_r : secondary_r;

  for (let angle = minThetaCurrent; angle <= maxThetaCurrent; angle += step) {
    const x = graphOriginX + angle * xScale;
    const yVal = getYValue(angle);
    const y = graphOriginY - yVal * yScale;

    const yGray = graphOriginY - Math.sin(angle) * useSecondaryR;

    points.push(`${x},${y}`);
    grayPoints.push(`${x},${yGray}`);
  }

  $("#graphLine").attr("points", points.join(" "));
  $("#grayGraphLine").attr("points", grayPoints.join(" "));

  const currentX = graphOriginX + currentTheta * xScale;
  const yVal = getYValue(currentTheta);
  const currentY = graphOriginY - yVal * yScale;
  const currentYGray = graphOriginY - Math.sin(currentTheta) * useSecondaryR;

  $("#graphDot").attr({ cx: currentX, cy: currentY });
  $("#grayGraphDot").attr({ cx: currentX, cy: currentYGray });

  const angle = getAngleTransformed(currentTheta);
  const realAngle = currentTheta;
  const px = cx + r * Math.cos(angle);
  const py = cy - r * Math.sin(angle);
  $("#connectLineBlue").attr({ x1: px, y1: py, x2: currentX, y2: currentY });
  $("#connectLineRed_ox").attr({ x1: currentX, y1: init_cy, x2: currentX, y2: currentY });
  showElement(getEl(`#connectLineRed_ox`), theta != 0);//hien thi line do khi theta khac 0
  
  console.log(theta);
  const pxGray = cx + useSecondaryR * Math.cos(realAngle);
  const pyGray = cy - useSecondaryR * Math.sin(realAngle);
  $("#connectLineGray").attr({ x1: pxGray, y1: pyGray, x2: currentX, y2: currentYGray });
  $("#connectLineGray_ox").attr({ x1: currentX, y1: init_cy, x2: currentX, y2: currentYGray });

  // const yTheta2 = currentY <= init_cy ? 270.6 : 236.29;
  const yTheta2 = (currentY <= init_cy && theta != 0) ? currentY - 16 : currentY + 24;
  $("#textTheta2").attr("transform", `translate(${currentX} ${yTheta2})`);
}

function setTheta(newTheta) {
  theta = newTheta;
  theta2 = theta;
  let angleStart = 0;
  if (mode === "cos") {
    angleStart = 3 * Math.PI / 2;
  } else if (mode === "sin2") {
    theta2 = 2 * theta;
  } else if (mode === "sin3") {
    theta2 = theta - 1;
  }

  updatePoint();
  drawGraph(theta);
  updateDragPointFromTheta(theta);

  isShowText = true;
  // if(theta > Math.PI / 2 || theta < -Math.PI / 2 + 1){
  // }else{
  //   isShowText = false;
  // }
  const arrowP = makeSpiral(init_cx, init_cy, angleStart, 15, theta2);
  let $arrowP = $("#arrowP");
  $arrowP.attr("marker-end", arrowP.show_arrow ? "url(#arrowhead)" : "");
  $arrowP.attr("points", arrowP.points);
  const arrowO = makeSpiral(init_cx, init_cy, angleStart, 11, theta);
  let $arrowO = $("#arrowO");
  $arrowO.attr("marker-end", arrowO.show_arrow ? "url(#arrowheadGray)" : "");
  $arrowO.attr("points", arrowO.points);
}

function ctrlPlayPause() {
  if (animation) {
    clearInterval(animation);
    animation = null;
    acceptDrag();
    return;
  } else {
    declineDrag();
  }

  const stepSize = 0.01;
  animation = setInterval(() => {
    if (theta >= maxTheta) {
      theta = 0;
    }
    setTheta(theta + stepSize);
  }, 8);
}

function reset() {
  theta = 0;
  maxThetaCurrent = 0;
  minThetaCurrent = 0;
  step = 0;
  isNewAnimate = true;
  isAnimating = false;
  isPause = false;
  isShowText = false;
  acceptDrag();
  if (animation) {
    clearInterval(animation);
    animation = null;
  }
  setTheta(theta);
}

function acceptDrag() {
  isAcceptDrag = true;
  $(`#drag-point, #slider`).addClass("cursor-pointer");
  $(`#drag-point`).css("fill", "#0b89dd");
}
function declineDrag() {
  isAcceptDrag = false;
  $(`#drag-point, #slider`).removeClass("cursor-pointer");
  $(`#drag-point`).css("fill", "#bfe4ff");
}

function updateDragPointFromTheta(theta) {
  const ratio = (theta - minTheta) / (maxTheta - minTheta);
  let value = minDrag + ratio * (maxDrag - minDrag);
  let tx = value + 3.5;
  getEl(`#drag-point`).attr("transform", `translate(${tx} 0)`);
}

let makeSpiral = (centreX, centreY, startAngle, startRadius, rAngle) => {
  const pointsPerQuarter = 70;
  const points = [];
  const scale = 8;

  const absAngle = Math.abs(rAngle);
  const quarterTurns = (absAngle / (2 * Math.PI)) * 4;

  const totalSteps = Math.round(quarterTurns * pointsPerQuarter);
  const endRadius = startRadius + scale * (quarterTurns / 4);
  const radiusStep = (endRadius - startRadius) / totalSteps;

  for (let i = 0; i < totalSteps; i++) {
    const radius = startRadius + radiusStep * i;
    const angle = startAngle - (i * rAngle) / totalSteps;
    points.push([
      centreX + radius * Math.cos(angle),
      centreY + radius * Math.sin(angle),
    ]);
  }

  return {
    points: points.map((ps) => ps.join(",")).join(","),
    show_arrow: false,
  };
};