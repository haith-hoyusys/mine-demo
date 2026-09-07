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
        value: 61.33, // vị trí X ban đầu
        value1: 0,

        fn_drag({ eventName }) {
          const ctrl = this;
          if(!isAcceptDrag ||(ctrl.id == "drag-point" && eventName == "mousedown")) {
            return;
          }
          isShowText = true;
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
          isShowText = true;
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
let isAcceptDrag = true; //chay animation thi khong cho drag
let isShowText = false; //text theta ban dau khong hien thi
const init_cx = 125.59;
const init_cy = 251;
const init_r = 83.55;
const secondary_r = 27.85; // dg tròn nhor

const graphOriginX = 125.59;
const graphOriginY = init_cy;

const yScale = init_r;
const xScale = 55.91;   // (2 * Math.PI) * xScale = buowcs song (tinhtheo design thuc te)
const minDrag = 61.33; // Vị trí kéo tối thiểu
const maxDrag = 781.33; // Vị trí kéo tối đa
const totalPoints = 13;
const dragScope = Array.from({ length: totalPoints }, (_, i) =>
  minDrag + (i * (maxDrag - minDrag) / (totalPoints-1))
);
let mode = "sin"; //co 3 mode sin, cos, sin2
// ============

const cx = init_cx;
const cy = init_cy;
const r = init_r;
const minTheta = 0 * Math.PI;
const maxTheta = 6 * Math.PI;

let theta = 0;
let animation = null;
let step = 0;

// Hàm lấy giá trị Y chính theo chế độ
function getYValue(angle) {
  if (mode === "cos") return Math.cos(angle);
  if (mode === "sin2") return Math.sin(2 * angle);
  return Math.sin(angle);
}

// Biến đổi góc tùy theo chế độ
function getAngleTransformed(angle) {
  if (mode === "cos") return angle + Math.PI / 2;
  if (mode === "sin2") return 2 * angle;
  return angle;
}

// Cập nhật vị trí điểm trên vòng tròn
function updatePoint() {
  const angle = getAngleTransformed(theta);
  const x = Math.round((cx + r * Math.cos(angle)) * 1000) / 1000;;
  const y = Math.round((cy - r * Math.sin(angle)) * 1000) / 1000;;
  $("#pointP").attr({ cx: x, cy: y });
  $("#lineOP").attr({ x2: x, y2: y });

  // Điểm trên đường tròn phụ (đồng tâm, bán kính nhỏ hơn)
  const xGray = cx + secondary_r * Math.cos(angle);
  const yGray = cy - secondary_r * Math.sin(angle);
  $("#grayPointP").attr({ cx: xGray, cy: yGray });

  //các text
  let xTheta1 = cx + (secondary_r + 20) * Math.cos(angle+0.31);
  let yTheta1 = cy - (secondary_r + 20) * Math.sin(angle+0.31);
  if (theta > 0) {
    xTheta1 = cx + (secondary_r + 30) * Math.cos(angle-0.22);
    yTheta1 = cy - (secondary_r + 30) * Math.sin(angle-0.22);
  }
  $("#textTheta1").attr("transform", `translate(${xTheta1} ${yTheta1})`);
  const xP = cx + (r + 12) * Math.cos(angle+0.195);
  const yP = cy - (r + 12) * Math.sin(angle+0.195);
  $("#textP").attr("transform", `translate(${xP} ${yP})`);
  showElement(getEl(`#textTheta1, #lineOP`), isShowText);
  if (theta == 0 ){
    $("#graphDot").attr("r", `5.31`)
  }else{
    $("#graphDot").attr("r", `5.5`)
  };
}

// Vẽ đồ thị và điểm hiện tại
let maxThetaCurrent = 0;
let minThetaCurrent = 0;
function drawGraph(currentTheta) {
  let points = [];
  let grayPoints = [];

  const step = 0.01;
  if( currentTheta > maxThetaCurrent) {
    maxThetaCurrent = currentTheta;
  }
  if( currentTheta < minThetaCurrent) {
    minThetaCurrent = currentTheta;
  }
  
  for (let angle = minThetaCurrent; angle <= maxThetaCurrent; angle += step) {
    const x = graphOriginX + angle * xScale;
    const yVal = getYValue(angle);
    const y = graphOriginY - yVal * yScale;
    const yGray = graphOriginY - yVal * secondary_r;

    points.push(`${x},${y}`);
    grayPoints.push(`${x},${yGray}`);
  }
  
  $("#graphLine").attr("points", points.join(" "));
  $("#grayGraphLine").attr("points", grayPoints.join(" "));

  // Cập nhật điểm hiện tại
  const currentX = Math.round((graphOriginX + currentTheta * xScale) * 1000) / 1000;
  const yVal = getYValue(currentTheta);
  const currentY = Math.round((graphOriginY - yVal * yScale) * 1000) / 1000;
  const currentYGray = Math.round((graphOriginY - yVal * secondary_r) * 1000) / 1000;

  $("#graphDot").attr({ cx: currentX, cy: currentY });
  $("#grayGraphDot").attr({ cx: currentX, cy: currentYGray });

  const angle = getAngleTransformed(currentTheta);
  // const px = cx + r * Math.cos(angle);
  const px = Math.round((cx + r * Math.cos(angle)) * 1000) / 1000;
  const py = Math.round((cy - r * Math.sin(angle)) * 1000) / 1000;
  // const py = cy - r * Math.sin(angle);
  $("#connectLineBlue").attr({ x1: px, y1: py, x2: currentX, y2: currentY });
  $("#connectLineRed_ox").attr({ x1: currentX, y1: init_cy, x2: currentX, y2: currentY });

  const pxGray = Math.round((cx + secondary_r * Math.cos(angle)) * 1000) / 1000;
  const pyGray = Math.round((cy - secondary_r * Math.sin(angle)) * 1000) / 1000;
  $("#connectLineGray").attr({ x1: pxGray, y1: pyGray, x2: currentX, y2: currentYGray });
  $("#connectLineGray_ox").attr({ x1: currentX, y1: init_cy, x2: currentX, y2: currentYGray });

  let yTheta2 = currentY < init_cy ? 270.6 : 236.29; //điều chỉnh vị trí chữ theta2
  if(theta == 0) yTheta2 = 270.6 //dac biet khi theta = 0
  $("#textTheta2").attr("transform", `translate(${currentX} ${yTheta2})`);
}

// Gán giá trị theta mới, rồi cập nhật
function setTheta(newTheta) {
  theta = newTheta;
  updatePoint();
  drawGraph(theta);
  updateDragPointFromTheta(theta);

  // Cập nhật xoan oc
  let theta2 = theta; //sin
  let angleStart = 0;
  if (mode === "cos") {
    angleStart = 3 * Math.PI / 2;
  }else if (mode === "sin2") {
    theta2 = 2 * theta;
  }
  const arrowP = makeSpiral(init_cx, init_cy, angleStart, 9, theta2);
  let $arrow = $("#arrow");
  $arrow.attr(
            "marker-end",
            arrowP.show_arrow ? "url(#arrowhead)" : ""
        );
  $arrow.attr("points", arrowP.points);
}

function ctrlPlayPause() {
  if (animation) {
    clearInterval(animation);
    animation = null;
    acceptDrag();  // Cho phép drag lại khi pause
    return;
  } else {
    declineDrag(); // Đang chạy thì không cho drag
  }

  const stepSize = 0.01;
  let currentStep = 0;

  animation = setInterval(() => {
    // Nếu vượt quá maxTheta, reset lại về 0 và bắt đầu lại
    if (theta >= maxTheta) {
      currentStep = 0;
      theta = 0;
    }

    const angle = theta + stepSize;
    setTheta(angle);
    currentStep++;
  }, 8);
}

// Đặt lại hoạt hình
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
};
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

  getEl(`#drag-point`)
    .attr("transform", `translate(${tx} 0)`);
}
let makeSpiral = (centreX, centreY, startAngle, startRadius, rAngle) => {
  const pointsPerQuarter = 70;
  const points = [];
  const scale = 5;

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

  let show_arrow = points.length > 25 && Math.abs(rAngle) > 0.32;
  if (show_arrow) {
    let cutDistance = 5; // độ dài cần cắt cho vuwaf dau mui ten (px)
    let totalDist = 0;
    let cutIndex = points.length - 1;

    for (let i = points.length - 1; i > 0; i--) {
      const [x1, y1] = points[i];
      const [x0, y0] = points[i - 1];
      const dx = x1 - x0;
      const dy = y1 - y0;
      totalDist += Math.sqrt(dx * dx + dy * dy);

      if (totalDist >= cutDistance) {
        cutIndex = i;
        break;
      }
    }

    points.splice(cutIndex);
  }
  return {
    points: points.map((ps) => ps.join(",")).join(","),
    show_arrow: show_arrow,
  };
};