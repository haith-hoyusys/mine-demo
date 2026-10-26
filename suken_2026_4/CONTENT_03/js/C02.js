/* eslint-disable no-eval */
/* eslint-disable no-new */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-case-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */

// ============================================================================
// 等積変化 — isochoric cooling / heating. Lid stays fixed. t is how far cooling has gone.
// Đẳng tích: nắp cố định. t là mức lạnh (0 nóng → 1 điểm B → 2 điểm C).
// ============================================================================

// Progress t: 0 = hot (needle 6) → 1 = B (needle 3) → 2 = C (needle 1).
// +1 cools (t increases), −1 heats (t decreases).
const MAX_T = 2.0;
const POINT_KEYS = ["A", "B", "C"];

// p–T graph. Both charts use symbol #pT図; the real chart is translated +500 px (measured).
// Axis origin in page space: symbol (40, 440) + translate(32, 34) = (72, 474).
// Cooling moves the temperature marker LEFT (hot is on the right). The written spec said
// "right when cooling"; the exported SVG does the opposite, so the SVG wins.
const GRAPH_OFFSET_X = 500;
const GRAPH_ORIGIN_IDEAL = { x: 72, y: 474 };
const GRAPH_ORIGIN_REAL = { x: 572, y: 474 };
const IDEAL_POINTS = {
  A: { x: 452, y: 191.44 },
  B: { x: 292, y: 310.41 },
  C: { x: 172, y: 399.64 },
};
const REAL_POINTS = {
  A: { x: 952, y: 191.44 },
  B: { x: 792, y: 310.41 },
  C: { x: 672, y: 416.42 },
};

// 蒸気圧曲線, segment C → B (first cubic of the dashed path in artboard 17 / 20).
// Relative c67.39,-13.02 96.75,-52.85 120,-106.01 from (672, 416.42) lands on B.
const VAPOR_CUBIC = {
  p0: { x: 672, y: 416.42 },
  p1: { x: 739.39, y: 403.4 },
  p2: { x: 768.75, y: 363.57 },
  p3: { x: 792, y: 310.41 },
};

// Needle pivots on the gauge center. Symbol pivot is local (22.5, 3); world center (245, 71.5) / (745, 71.5).
// Angles from #_針: mark 6 = 135°, mark 3 = 67.5°, mark 1 = 22.5°.
const NEEDLE_PIVOT = { x: 245, y: 71.5 };
const NEEDLE_LOCAL = { x: 22.5, y: 3 };
const NEEDLE_ANGLE_HOT = 135;
const NEEDLE_ANGLE_B = 67.5;
const NEEDLE_ANGLE_C = 22.5;

// Lid does not move. Gas rect is the design rounded rect (y 115, height 160 → floor 275).
const PISTON_REST_Y = 115;
const CONTAINER_BOTTOM_Y = 271;
const IDEAL_GAS_COLOR = "#dcf0fb";
const REAL_GAS_COLOR_HOT = { r: 220, g: 240, b: 251 };
const REAL_GAS_COLOR_COLD = { r: 255, g: 255, b: 255 };

// Clamp t into [0, MAX_T].
// Giới hạn t trong khoảng [0, MAX_T].
function clampT(t) {
  return Math.max(0, Math.min(MAX_T, t));
}
// Linear interpolation between a and b (u = 0 → a, u = 1 → b).
// Nội suy tuyến tính giữa a và b (u = 0 → a, u = 1 → b).
function lerp(a, b, u) {
  return a + (b - a) * u;
}
// Linear interpolation between two points {x, y}.
// Nội suy tuyến tính giữa hai điểm {x, y}.
function lerpPt(p0, p1, u) {
  return { x: lerp(p0.x, p1.x, u), y: lerp(p0.y, p1.y, u) };
}
// Which segment t is on: 0→1 is A→B (both gases, straight), 1→2 is B→C.
function getSegment(t) {
  t = clampT(t);
  if (t <= 1) return { from: 0, to: 1, u: t };
  return { from: 1, to: 2, u: t - 1 };
}
function isMilestone(t) {
  return t <= 0.001 || Math.abs(t - 1) <= 0.001 || t >= 1.999;
}
// Next checkpoint when cooling: 1, then 2. No skip.
function nextCoolTarget(t) {
  if (t < 0.999) return 1;
  return 2;
}
// Next checkpoint when heating: 1, then 0. No skip.
function nextHeatTarget(t) {
  if (t > 1.001) return 1;
  return 0;
}

// ============================================================================
// Particle data / Dữ liệu hạt
// ============================================================================

// Seed particles: center = SVG translate + 4 (circle offset); vx/vy = initial velocity.
// Hạt ban đầu: tâm = translate SVG + 4 (offset của hình tròn); vx/vy = vận tốc ban đầu. 13 hạt
const INITIAL_IDEAL_PARTICLES = [
  { x: 143.43, y: 135.97, vx: 3.5, vy: 3.3 },
  { x: 184.05, y: 155.13, vx: -4.0, vy: 2.6 },
  { x: 226.33, y: 133.66, vx: 2.8, vy: -3.9 },
  { x: 263.32, y: 155.13, vx: -3.8, vy: -2.9 },
  { x: 214.44, y: 185.18, vx: 4.2, vy: -2.3 },
  { x: 179.76, y: 215.9, vx: -3.0, vy: 3.7 },
  { x: 207.5, y: 242.98, vx: 3.6, vy: 3.2 },
  { x: 249.44, y: 225.47, vx: -3.9, vy: -2.8 },
  { x: 264.64, y: 251.24, vx: 3.2, vy: 3.6 },
  { x: 238.22, y: 187.16, vx: -4.1, vy: 2.5 },
  { x: 144.42, y: 182.87, vx: -2.6, vy: 4.0 },
  { x: 133.85, y: 238.69, vx: 4.0, vy: -2.6 },
  { x: 195.2, y: 175.5, vx: -3.2, vy: 3.4 },
];

// Same layout as the ideal container, shifted 500 px to the right.
// Bố trí giống bình lý tưởng, dịch sang phải 500 px. 13 hạt
const INITIAL_REAL_PARTICLES = [
  { x: 643.43, y: 135.97, vx: 3.5, vy: 3.3 },
  { x: 684.05, y: 155.13, vx: -4.0, vy: 2.6 },
  { x: 726.33, y: 133.66, vx: 2.8, vy: -3.9 },
  { x: 763.32, y: 155.13, vx: -3.8, vy: -2.9 },
  { x: 714.44, y: 185.18, vx: 4.2, vy: -2.3 },
  { x: 679.76, y: 215.9, vx: -3.0, vy: 3.7 },
  { x: 707.5, y: 242.98, vx: 3.6, vy: 3.2 },
  { x: 749.44, y: 225.47, vx: -3.9, vy: -2.8 },
  { x: 764.64, y: 251.24, vx: 3.2, vy: 3.6 },
  { x: 738.22, y: 187.16, vx: -4.1, vy: 2.5 },
  { x: 644.42, y: 182.87, vx: -2.6, vy: 4.0 },
  { x: 633.85, y: 238.69, vx: 4.0, vy: -2.6 },
  { x: 695.2, y: 175.5, vx: -3.2, vy: 3.4 },
];

// PARTICLE_COUNT — particles per container; PARTICLE_R — particle radius (px).
// PARTICLE_COUNT — số hạt mỗi bình; PARTICLE_R — bán kính hạt (px).
const PARTICLE_COUNT = INITIAL_IDEAL_PARTICLES.length;
const PARTICLE_R = 3.8;

// Condensed-particle anchors from the design SVGs (translate + 4 = circle center).
// Copy 8 / 7 = point C (taller water). Copy 6 = point D (anchors sink as the lid drops).
// Vị trí neo của hạt đã ngưng tụ, lấy từ SVG design (translate + 4 = tâm hạt).
// Bản copy 8 / 7 = điểm C (mặt nước cao hơn). Copy 6 = điểm D (hạt lún xuống khi nắp hạ).
const ANCHOR_SLOTS_C = [
  { x: 629.9, y: 251.67 },  // 0  translate(625.9 247.67)
  { x: 638.57, y: 264.8 },  // 1  translate(634.57 260.8)
  { x: 649.27, y: 245.94 }, // 2  translate(645.27 241.94)
  { x: 663.74, y: 263.87 }, // 3  translate(659.74 259.87)
  { x: 681.86, y: 251.23 }, // 4  translate(677.86 247.23)
  { x: 691.55, y: 260.47 }, // 5  translate(687.55 256.47)
  { x: 714.89, y: 249.46 }, // 6  translate(710.89 245.46)
  { x: 721.93, y: 262.81 }, // 7  translate(717.93 258.81)
  { x: 737.11, y: 247.04 }, // 8  translate(733.11 243.04)
  { x: 746.67, y: 263.39 }, // 9  translate(742.67 259.39)
  { x: 761.16, y: 248.59 }, // 10 translate(757.16 244.59)
  { x: 769.84, y: 266.63 }, // 11 translate(765.84 262.63)
  { x: 779.12, y: 256.56 }, // 12 translate(775.12 252.56)
];
const ANCHOR_SLOTS_D = [
  { x: 629.9, y: 251.67 },  // 0  translate(625.9 247.67)
  { x: 638.57, y: 264.8 },  // 1  translate(634.57 260.8)
  { x: 646.93, y: 254.36 }, // 2  translate(642.93 250.36)
  { x: 663.74, y: 263.87 }, // 3  translate(659.74 259.87)
  { x: 677.96, y: 257.62 }, // 4  translate(673.96 253.62)
  { x: 691.55, y: 260.47 }, // 5  translate(687.55 256.47)
  { x: 711.46, y: 256.32 }, // 6  translate(707.46 252.32)
  { x: 721.93, y: 262.81 }, // 7  translate(717.93 258.81)
  { x: 734.93, y: 253.12 }, // 8  translate(730.93 249.12)
  { x: 746.67, y: 263.39 }, // 9  translate(742.67 259.39)
  { x: 760.5, y: 256.91 },  // 10 translate(756.5 252.91)
  { x: 769.84, y: 266.63 }, // 11 translate(765.84 262.63)
  { x: 779.12, y: 256.56 }, // 12 translate(775.12 252.56)
];

// Slot filling order, from the center outward (matches how the liquid puddle spreads).
// Thứ tự lấp đầy vị trí ngưng tụ, từ giữa lan ra hai bên (khớp với vũng nước loang ra).
const SLOT_FILL_ORDER = [6, 5, 7, 4, 8, 3, 9, 2, 10, 1, 11, 0, 12];

// Anchor slots stay on the container floor (the lid does not drop).
function getAnchorSlot(slotIdx) {
  return ANCHOR_SLOTS_C[slotIdx];
}

// Assign every real particle by t = 1.55. The steer then has the rest of B→C to seat
// them in the puddle, so at t = 2 they are all inside the liquid. The puddle outline
// still grows with u = t - 1 across the whole segment.
const CONDENSE_ASSIGN_BY = 1.55;

// How many real-gas particles are condensed at t (0 before B, all of them by CONDENSE_ASSIGN_BY).
// Số hạt khí thực đã ngưng tụ tại t (0 trước B, đủ số hạt trước khi tới C).
function getCondensedCount(t) {
  if (t <= 1.0) return 0;
  if (t >= 1.999) return PARTICLE_COUNT;
  const ratio = Math.min(1, (t - 1) / (CONDENSE_ASSIGN_BY - 1));
  return Math.min(PARTICLE_COUNT, Math.ceil(ratio * PARTICLE_COUNT - 1e-9));
}

// Particle speed follows temperature (ideal-graph x): ~200 at A, ~20 at C.
const GAS_SPEED_MAX = 200;
const GAS_SPEED_MIN = 20;

// TOTAL_PARTICLE_FRAMES — number of baked frames covering t = 0..3 (used in step mode).
// TOTAL_PARTICLE_FRAMES — số frame quỹ đạo tính sẵn cho t = 0..3 (dùng ở chế độ từng bước).
const TOTAL_PARTICLE_FRAMES = 600;
// particleTrajectoryFrames — baked frames: [{ ideal: [{x, y}], real: [{x, y}] }, ...].
// particleTrajectoryFrames — các frame tính sẵn: [{ ideal: [{x, y}], real: [{x, y}] }, ...].
let particleTrajectoryFrames = [];
// Live Matter.js worlds (see createMatterWorld), used while playing.
// Thế giới Matter.js chạy thời gian thực (xem createMatterWorld), dùng khi đang chạy animation.
let idealMatterState = null;
let realMatterState = null;

function cubicAt(p0, p1, p2, p3, u) {
  const a = lerpPt(p0, p1, u);
  const b = lerpPt(p1, p2, u);
  const c = lerpPt(p2, p3, u);
  return lerpPt(lerpPt(a, b, u), lerpPt(b, c, u), u);
}
// Portion of a cubic from parameter 0 to u (de Casteljau).
function subBezier(p0, p1, p2, p3, u) {
  const q1 = lerpPt(p0, p1, u);
  const mid = lerpPt(p1, p2, u);
  const q2 = lerpPt(q1, mid, u);
  const q3 = cubicAt(p0, p1, p2, p3, u);
  return [p0, q1, q2, q3];
}

function getIdealPoint(t) {
  const seg = getSegment(t);
  return lerpPt(IDEAL_POINTS[POINT_KEYS[seg.from]], IDEAL_POINTS[POINT_KEYS[seg.to]], seg.u);
}

// Real gas is straight A→B, then follows 蒸気圧曲線 from B back toward C.
function getRealPoint(t) {
  t = clampT(t);
  if (t <= 1) return lerpPt(REAL_POINTS.A, REAL_POINTS.B, t);
  const s = Math.min(1, t - 1);
  return cubicAt(VAPOR_CUBIC.p0, VAPOR_CUBIC.p1, VAPOR_CUBIC.p2, VAPOR_CUBIC.p3, 1 - s);
}

function needleAngle(t) {
  t = clampT(t);
  if (t <= 1) return lerp(NEEDLE_ANGLE_HOT, NEEDLE_ANGLE_B, t);
  return lerp(NEEDLE_ANGLE_B, NEEDLE_ANGLE_C, t - 1);
}
function needleTransform(angle, offsetX) {
  const a = (angle * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const tx = NEEDLE_PIVOT.x + offsetX - (NEEDLE_LOCAL.x * c - NEEDLE_LOCAL.y * s);
  const ty = NEEDLE_PIVOT.y - (NEEDLE_LOCAL.x * s + NEEDLE_LOCAL.y * c);
  return `translate(${_.round(tx, 2)} ${_.round(ty, 2)}) rotate(${_.round(angle, 2)})`;
}

function getGasSpeed(t) {
  const hot = IDEAL_POINTS.A.x;
  const cold = IDEAL_POINTS.C.x;
  const ratio = (getIdealPoint(t).x - cold) / (hot - cold);
  return GAS_SPEED_MIN + (GAS_SPEED_MAX - GAS_SPEED_MIN) * Math.max(0, Math.min(1, ratio));
}

// ============================================================================
// Matter.js particle physics / Vật lý hạt bằng Matter.js
// ============================================================================

// Inner area of each container that particles move in (the top is the piston, moving with t).
// Vùng bên trong mỗi bình mà hạt di chuyển (mép trên là pít-tông, thay đổi theo t).
const CONTAINERS = {
  ideal: { left: 113, right: 288, bottom: CONTAINER_BOTTOM_Y },
  real: { left: 613, right: 787, bottom: CONTAINER_BOTTOM_Y },
};

// Thickness of the static Matter.js walls, thick enough that fast balls cannot tunnel through.
// Độ dày tường tĩnh Matter.js, đủ dày để hạt chạy nhanh không xuyên qua.
const MATTER_WALL_T = 80;

// Build one Matter.js world: zero gravity, 4 walls (left, right, bottom, piston) and one ball per seed particle.
// Returns { engine, pistonWall, balls, midX, wallT, condensedAssignments }.
// Tạo một thế giới Matter.js: không trọng lực, 4 tường (trái, phải, đáy, pít-tông) và mỗi hạt ban đầu một quả bóng.
// Trả về { engine, pistonWall, balls, midX, wallT, condensedAssignments }.
function createMatterWorld(box, initialParticles) {
  const { Engine, World, Bodies, Body } = Matter;
  const wallT = MATTER_WALL_T;
  const wallOpts = { isStatic: true, friction: 0, frictionAir: 0, restitution: 1.0 };
  const engine = Engine.create({ gravity: { x: 0, y: 0, scale: 0.001 } });
  const midX = (box.left + box.right) / 2;
  const width = box.right - box.left;

  const leftWall = Bodies.rectangle(box.left - wallT / 2, 190, wallT, 400, wallOpts);
  const rightWall = Bodies.rectangle(box.right + wallT / 2, 190, wallT, 400, wallOpts);
  const bottomWall = Bodies.rectangle(midX, box.bottom + wallT / 2, width + wallT * 2, wallT, wallOpts);
  const pistonWall = Bodies.rectangle(midX, PISTON_REST_Y - wallT / 2, width + wallT * 2, wallT, wallOpts);
  World.add(engine.world, [leftWall, rightWall, bottomWall, pistonWall]);

  const balls = initialParticles.map((init) => {
    const ball = Bodies.circle(init.x, init.y, PARTICLE_R, {
      friction: 0,
      frictionAir: 0,
      restitution: 1.0,
      inertia: Infinity,
      collisionFilter: { group: -1 },
    });
    ball.wobblePhase = 0;
    Body.setVelocity(ball, { x: init.vx, y: init.vy });
    World.add(engine.world, ball);
    return ball;
  });

  return { engine, pistonWall, balls, midX, wallT, condensedAssignments: [] };
}

// Move the piston wall so its lower face sits at topY.
// Dời tường pít-tông để mặt dưới nằm tại topY.
function movePistonWall(world, topY) {
  Matter.Body.setPosition(world.pistonWall, { x: world.midX, y: topY - world.wallT / 2 });
}

// Safety net: if the physics produced NaN, put the ball back at its seed position/velocity.
// Phòng lỗi: nếu vật lý sinh ra NaN thì đưa hạt về vị trí/vận tốc ban đầu.
function resetBallIfNaN(ball, init) {
  if (isNaN(ball.position.x) || isNaN(ball.position.y)) {
    ball.position.x = init.x;
    ball.position.y = init.y;
    ball.velocity.x = init.vx;
    ball.velocity.y = init.vy;
  }
}

// Keep a gas particle inside the container (bounce off walls/piston) and set its speed to `speed`,
// keeping its direction (i gives a fallback direction when the ball is at rest).
// Giữ hạt khí trong bình (bật lại khi chạm tường/pít-tông) và đặt tốc độ bằng `speed`,
// giữ nguyên hướng (i dùng để chọn hướng dự phòng khi hạt đứng yên).
function updateGasBall(ball, bounds, topY, speed, i) {
  const r = PARTICLE_R;
  if (ball.position.x < bounds.left + r) { ball.position.x = bounds.left + r; ball.velocity.x = Math.abs(ball.velocity.x); }
  if (ball.position.x > bounds.right - r) { ball.position.x = bounds.right - r; ball.velocity.x = -Math.abs(ball.velocity.x); }
  if (ball.position.y < topY + r) { ball.position.y = topY + r; ball.velocity.y = Math.abs(ball.velocity.y); }
  if (ball.position.y > bounds.bottom - r) { ball.position.y = bounds.bottom - r; ball.velocity.y = -Math.abs(ball.velocity.y); }

  const curSpeed = Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y);
  if (curSpeed > 0.001) {
    const factor = speed / curSpeed;
    ball.velocity.x *= factor;
    ball.velocity.y *= factor;
  } else {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
    ball.velocity.x = Math.cos(angle) * speed;
    ball.velocity.y = Math.sin(angle) * speed;
  }
}

// Assign free particles to bottom slots until `targetCount` particles are condensed.
// Each new slot (in SLOT_FILL_ORDER) takes the free particle closest to it; getPos(i) returns {x, y} or null.
// Gán hạt tự do vào các slot dưới đáy cho tới khi đủ `targetCount` hạt ngưng tụ.
// Mỗi slot mới (theo SLOT_FILL_ORDER) nhận hạt tự do gần nó nhất; getPos(i) trả về {x, y} hoặc null.
function fillCondensedSlots(assignments, targetCount, t, getPos) {
  while (assignments.length < targetCount) {
    const slotIdx = SLOT_FILL_ORDER[assignments.length];
    const slotPos = getAnchorSlot(slotIdx);
    let bestIdx = -1;
    let bestDist = Infinity;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (assignments.some((a) => a.particleIdx === i)) continue;
      const pos = getPos(i);
      if (!pos) continue;
      const d = Math.hypot(slotPos.x - pos.x, slotPos.y - pos.y);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    if (bestIdx === -1) break;
    assignments.push({ particleIdx: bestIdx, slotIdx, targetX: slotPos.x, targetY: slotPos.y });
  }
}

// Refresh every assignment's target to its slot position at t (slots slide between C and D).
// Cập nhật đích của mỗi hạt ngưng tụ theo vị trí slot tại t (slot trượt giữa C và D).
function updateSlotTargets(assignments, t) {
  assignments.forEach((a) => {
    const pos = getAnchorSlot(a.slotIdx);
    a.targetX = pos.x;
    a.targetY = pos.y;
  });
}

// Condensed balls become sensors (no collisions) so gas balls pass through the liquid.
// Hạt đã ngưng tụ thành sensor (không va chạm) để hạt khí đi xuyên qua chất lỏng.
function syncSensorFlags(balls, assignments) {
  balls.forEach((ball, i) => {
    ball.isSensor = assignments.some((a) => a.particleIdx === i);
  });
}

// Create the live Matter.js worlds for the ideal and real containers.
// Khởi tạo thế giới vật lý Matter.js cho cả bình khí lý tưởng và bình khí thực.
function setupMatterSimulations() {
  if (typeof Matter === "undefined") return;
  idealMatterState = createMatterWorld(CONTAINERS.ideal, INITIAL_IDEAL_PARTICLES);
  realMatterState = createMatterWorld(CONTAINERS.real, INITIAL_REAL_PARTICLES);
}

// Condensed particle motion when baking trajectories (fixed per-frame step): glide to the slot, then wobble.
// Params:
//   b  — Matter.js ball body
//   a  — assignment { particleIdx, slotIdx, targetX, targetY }
//   t  — current progress (0..3)
// Chuyển động hạt ngưng tụ khi tính sẵn quỹ đạo (bước cố định mỗi frame): trượt về slot rồi rung nhẹ.
// Tham số:
//   b  — vật thể Matter.js ball
//   a  — bản ghi gán { particleIdx, slotIdx, targetX, targetY }
//   t  — tiến trình hiện tại (0..3)
function moveCondensedBallBaked(b, a, t) {
  const dx = a.targetX - b.position.x;
  const dy = a.targetY - b.position.y;
  const dist = Math.hypot(dx, dy);
  if (dist > 0.8 && t < 2.99) {                      // 0.8 px: ngưỡng "đủ gần" để chuyển sang rung tại chỗ
    const speed = Math.min(dist, Math.max(0.6, dist * 0.08)); // 0.08 = 8% khoảng cách/frame; min 0.6 px/frame để không dừng
    b.position.x += (dx / dist) * speed;
    b.position.y += (dy / dist) * speed;
  } else {
    b.wobblePhase = (b.wobblePhase || 0) + 0.10;     // 0.10 rad/frame ≈ 1 chu kỳ / 63 frame ≈ 1 Hz @ 60 fps
    b.position.x = a.targetX + Math.sin(b.wobblePhase * 1.2 + a.slotIdx * 1.8) * 1.3;  // biên độ ngang ±1.3 px
    b.position.y = a.targetY + Math.cos(b.wobblePhase * 1.5 + a.slotIdx * 2.4) * 0.8;  // biên độ dọc  ±0.8 px
    // 1.2 / 1.5: tần số X/Y khác nhau để tránh dao động hình elipse hoàn hảo (trông tự nhiên hơn)
    // 1.8 / 2.4: lệch pha mỗi slot để các hạt không rung đồng bộ
  }
  b.velocity.x = 0;
  b.velocity.y = 0;
}

// Ball position rounded to 2 decimals, falling back to `fallback` if NaN.
// Vị trí hạt làm tròn 2 chữ số thập phân, dùng `fallback` nếu ra NaN.
function roundedPos(ball, fallback) {
  const px = _.round(ball.position.x, 2);
  const py = _.round(ball.position.y, 2);
  return { x: isNaN(px) ? fallback.x : px, y: isNaN(py) ? fallback.y : py };
}

// Bake deterministic particle positions for TOTAL_PARTICLE_FRAMES steps over t = 0..3 (used by step mode).
// Tính sẵn vị trí hạt (tiền định) cho TOTAL_PARTICLE_FRAMES frame trên t = 0..3 (dùng ở chế độ từng bước).
function generateParticleTrajectories() {
  if (typeof Matter === "undefined") return;
  const { Engine } = Matter;
  const ideal = createMatterWorld(CONTAINERS.ideal, INITIAL_IDEAL_PARTICLES);
  const real = createMatterWorld(CONTAINERS.real, INITIAL_REAL_PARTICLES);
  const assignments = [];

  particleTrajectoryFrames = [];
  for (let f = 0; f < TOTAL_PARTICLE_FRAMES; f++) {
    const t = (f / (TOTAL_PARTICLE_FRAMES - 1)) * MAX_T;
    const speed = getGasSpeed(t);
    const topY = PISTON_REST_Y;

    movePistonWall(ideal, topY);
    Engine.update(ideal.engine, 1000 / 60);
    const frameIdeal = ideal.balls.map((b, i) => {
      resetBallIfNaN(b, INITIAL_IDEAL_PARTICLES[i]);
      updateGasBall(b, CONTAINERS.ideal, topY, speed, i);
      return roundedPos(b, INITIAL_IDEAL_PARTICLES[i]);
    });

    movePistonWall(real, topY);
    fillCondensedSlots(assignments, getCondensedCount(t), t, (i) => real.balls[i].position);
    updateSlotTargets(assignments, t);
    syncSensorFlags(real.balls, assignments);
    Engine.update(real.engine, 1000 / 60);

    const frameReal = real.balls.map((b, i) => {
      resetBallIfNaN(b, INITIAL_REAL_PARTICLES[i]);
      const a = assignments.find((x) => x.particleIdx === i);
      if (a) {
        moveCondensedBallBaked(b, a, t);
        return roundedPos(b, { x: a.targetX, y: a.targetY });
      }
      updateGasBall(b, CONTAINERS.real, topY, speed, i);
      return roundedPos(b, INITIAL_REAL_PARTICLES[i]);
    });

    particleTrajectoryFrames.push({ ideal: frameIdeal, real: frameReal });
  }
}

// Baked frame closest to t (null if trajectories have not been generated).
// Frame tính sẵn gần t nhất (null nếu chưa tạo quỹ đạo).
function getTrajectoryFrame(t) {
  if (!particleTrajectoryFrames.length) return null;
  const fIdx = Math.max(0, Math.min(TOTAL_PARTICLE_FRAMES - 1, Math.round((t / MAX_T) * (TOTAL_PARTICLE_FRAMES - 1))));
  return particleTrajectoryFrames[fIdx] || null;
}

// ============================================================================
// Particle DOM / Phần tử DOM của hạt
// ============================================================================

// Particle <circle> elements, cached after initParticles creates them.
// Các phần tử <circle> của hạt, lưu cache sau khi initParticles tạo ra.
const particleEls = { ideal: [], real: [] };

// Move a particle <circle> to (x, y); ignores missing elements and NaN.
// Dời <circle> của hạt tới (x, y); bỏ qua nếu thiếu phần tử hoặc toạ độ NaN.
function setParticlePos(el, x, y) {
  if (!el || isNaN(x) || isNaN(y)) return;
  el.setAttribute("cx", x);
  el.setAttribute("cy", y);
}

// Make sure `container` holds exactly PARTICLE_COUNT circles (id `${prefix}-p-${i}`),
// put them at their seed positions and return them in order.
// Đảm bảo `container` có đúng PARTICLE_COUNT hình tròn (id `${prefix}-p-${i}`),
// đặt về vị trí ban đầu và trả về danh sách theo thứ tự.
function createParticleCircles(container, prefix, initialParticles) {
  const els = [];
  if (!container) return els;
  if (container.children.length !== PARTICLE_COUNT) {
    container.innerHTML = "";
    initialParticles.forEach((p, i) => {
      container.appendChild(SVGLib.createTag("circle", {
        id: `${prefix}-p-${i}`,
        cx: p.x,
        cy: p.y,
        r: PARTICLE_R,
        fill: "url(#radial-gradient-b)",
      }));
    });
  }
  initialParticles.forEach((p, i) => {
    const el = document.getElementById(`${prefix}-p-${i}`);
    setParticlePos(el, p.x, p.y);
    els.push(el);
  });
  return els;
}

// Initialize physics, baked trajectories and particle circles for both containers.
// Khởi tạo vật lý, quỹ đạo tính sẵn và các hình tròn hạt cho cả hai bình.
function initParticles() {
  if (!idealMatterState || !realMatterState) {
    setupMatterSimulations();
  }
  if (particleTrajectoryFrames.length === 0) {
    generateParticleTrajectories();
  }
  if (!g_state || !g_state.sim) return;
  particleEls.ideal = createParticleCircles(document.getElementById("ideal-particles"), "ideal", INITIAL_IDEAL_PARTICLES);
  particleEls.real = createParticleCircles(document.getElementById("real-particles"), "real", INITIAL_REAL_PARTICLES);
}

// Condensed particle motion in real time (dt in seconds): glide to the slot, then jiggle in place.
// Params:
//   ball — Matter.js ball body
//   a    — assignment { particleIdx, slotIdx, targetX, targetY }
//   t    — current progress (0..3)
//   dt   — elapsed time since last frame (seconds, typically ~1/60)
// Chuyển động hạt ngưng tụ theo thời gian thực (dt tính bằng giây): trượt về slot rồi rung tại chỗ.
// Tham số:
//   ball — vật thể Matter.js ball
//   a    — bản ghi gán { particleIdx, slotIdx, targetX, targetY }
//   t    — tiến trình hiện tại (0..3)
//   dt   — thời gian kể từ frame trước (giây, thường ~1/60)
function moveCondensedBallLive(ball, a, t, dt) {
  const { Body } = Matter;
  const dx = a.targetX - ball.position.x;
  const dy = a.targetY - ball.position.y;
  const dist = Math.hypot(dx, dy);
  if (dist > 0.8 && t < 2.999) {   // 0.8 px: ngưỡng "đủ gần" để chuyển sang rung tại chỗ
    // speed: tối thiểu 30 px/s, tối đa bằng dist (không vượt qua đích); 3.0 = hệ số bắt kịp 30%/giây
    const speed = Math.min(dist, Math.max(30 * dt, dist * 3.0 * dt));
    ball.wobblePhase = (ball.wobblePhase || 0) + dt * 2.0; // 2.0 rad/s ≈ 0.32 Hz: dao động nhẹ khi trượt
    const driftX = Math.sin(ball.wobblePhase * 1.5 + a.slotIdx) * 0.25; // nhiễu ngang ±0.25 px khi tiến vào
    const driftY = Math.cos(ball.wobblePhase * 1.5 + a.slotIdx) * 0.12; // nhiễu dọc  ±0.12 px khi tiến vào
    ball.position.x += (dx / dist) * speed + driftX;
    ball.position.y += (dy / dist) * speed + driftY;
  } else {
    ball.wobblePhase = (ball.wobblePhase || 0) + dt * 2.5; // 2.5 rad/s ≈ 0.4 Hz: rung nhanh hơn một chút khi tại chỗ
    ball.position.x = a.targetX + Math.sin(ball.wobblePhase + a.slotIdx * 1.618) * 0.6; // biên độ ngang ±0.6 px
    ball.position.y = a.targetY + Math.cos(ball.wobblePhase + a.slotIdx * 1.618) * 0.3; // biên độ dọc  ±0.3 px
    // 1.618 = tỉ lệ vàng: mỗi slot lệch pha nhau một lượng vô tỉ → không có 2 hạt nào rung đồng bộ
  }
  Body.setVelocity(ball, { x: 0, y: 0 }); // reset velocity để Matter.js không override vị trí vừa đặt
}

// Advance the live Matter.js simulation by dt seconds and draw the particles.
// Chạy mô phỏng Matter.js thời gian thực thêm dt giây và vẽ lại các hạt.
function updateParticles(dt) {
  if (!idealMatterState || !realMatterState) {
    setupMatterSimulations();
  }
  if (!idealMatterState || !realMatterState) return;
  if (!g_state || !g_state.sim) return;

  const { Engine, Body } = Matter;
  const t = g_state.sim.progress;
  const stepMs = (dt || 1 / 60) * 1000;
  const speed = getGasSpeed(t);
  g_state.sim.gasSpeed = speed;
  const topY = PISTON_REST_Y;

  movePistonWall(idealMatterState, topY);
  Engine.update(idealMatterState.engine, stepMs);
  idealMatterState.balls.forEach((ball, i) => {
    resetBallIfNaN(ball, INITIAL_IDEAL_PARTICLES[i]);
    updateGasBall(ball, CONTAINERS.ideal, topY, speed, i);
    setParticlePos(particleEls.ideal[i], _.round(ball.position.x, 1), _.round(ball.position.y, 1));
  });

  movePistonWall(realMatterState, topY);

  const assignments = realMatterState.condensedAssignments;
  const targetCount = getCondensedCount(t);
  fillCondensedSlots(assignments, targetCount, t, (i) => realMatterState.balls[i].position);

  // Heating: release the most recently condensed particles back into the gas, moving upward.
  // Khi đun nóng: nhả các hạt ngưng tụ gần nhất trở lại thành khí, bay lên trên.
  while (assignments.length > targetCount) {
    const released = assignments.pop();
    const ball = realMatterState.balls[released.particleIdx];
    if (ball) {
      // angle: ngẫu nhiên trong khoảng [−0.75π, −0.25π] = cung 90° hướng lên (−π/2 ± 45°)
      // 0.25 = −π×0.25 = −45°, 0.5 = dải ngẫu nhiên 90°; hướng âm Y = đi lên trong SVG
      const angle = -Math.PI * (0.25 + Math.random() * 0.5);
      Body.setVelocity(ball, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed });
    }
  }

  updateSlotTargets(assignments, t);
  syncSensorFlags(realMatterState.balls, assignments);
  Engine.update(realMatterState.engine, stepMs);

  realMatterState.balls.forEach((ball, i) => {
    resetBallIfNaN(ball, INITIAL_REAL_PARTICLES[i]);
    const a = assignments.find((x) => x.particleIdx === i);
    if (a) {
      moveCondensedBallLive(ball, a, t, dt);
    } else {
      updateGasBall(ball, CONTAINERS.real, topY, speed, i);
    }
    setParticlePos(particleEls.real[i], _.round(ball.position.x, 2), _.round(ball.position.y, 2));
  });
}

// Draw the baked trajectory positions at t (step mode).
// Vẽ vị trí hạt theo quỹ đạo tính sẵn tại t (chế độ từng bước).
function applyTrajectoryFrame(t) {
  const frame = getTrajectoryFrame(t);
  if (!frame) return;
  frame.ideal.forEach((pos, i) => setParticlePos(particleEls.ideal[i], pos.x, pos.y));
  frame.real.forEach((pos, i) => setParticlePos(particleEls.real[i], pos.x, pos.y));
}

// Move the live Matter balls to the baked positions at t (so leaving step mode does not jump).
// Đưa các hạt Matter thời gian thực về vị trí tính sẵn tại t (để thoát chế độ từng bước không bị giật).
function syncMatterStateToTrajectories(t) {
  if (!idealMatterState || !realMatterState) return;
  const frame = getTrajectoryFrame(t);
  if (!frame) return;

  // Teleport a ball to pos; give it back its seed velocity if it has almost stopped.
  // Dời hạt tới pos; trả lại vận tốc ban đầu nếu hạt gần như đứng yên.
  const placeBall = (ball, pos, init) => {
    if (!ball || typeof pos.x !== "number" || isNaN(pos.x)) return;
    ball.position.x = pos.x;
    ball.position.y = pos.y;
    ball.previousPosition.x = pos.x;
    ball.previousPosition.y = pos.y;
    const curSpeed = Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y);
    if (curSpeed < 0.1) {
      ball.velocity.x = init.vx;
      ball.velocity.y = init.vy;
    }
  };

  frame.ideal.forEach((pos, i) => placeBall(idealMatterState.balls[i], pos, INITIAL_IDEAL_PARTICLES[i]));

  const assignments = [];
  fillCondensedSlots(assignments, getCondensedCount(t), t, (i) => {
    const pos = frame.real[i];
    return pos && typeof pos.x === "number" ? pos : null;
  });
  realMatterState.condensedAssignments = assignments;
  frame.real.forEach((pos, i) => placeBall(realMatterState.balls[i], pos, INITIAL_REAL_PARTICLES[i]));
  syncSensorFlags(realMatterState.balls, assignments);
}

// ============================================================================
// Static shapes derived from t / Các hình vẽ suy ra từ t
// ============================================================================

function fmtPt(p) {
  return `${_.round(p.x, 2)},${_.round(p.y, 2)}`;
}

function getIdealPath(t) {
  if (t <= 0.001) return "";
  const A = IDEAL_POINTS.A;
  const pt = getIdealPoint(t);
  if (t <= 1) return `M ${fmtPt(A)} L ${fmtPt(pt)}`;
  return `M ${fmtPt(A)} L ${fmtPt(IDEAL_POINTS.B)} L ${fmtPt(pt)}`;
}

function getRealCurveABPath(t) {
  if (t <= 0.001) return "";
  const A = REAL_POINTS.A;
  const B = REAL_POINTS.B;
  if (t >= 1) return `M ${fmtPt(A)} L ${fmtPt(B)}`;
  return `M ${fmtPt(A)} L ${fmtPt(getRealPoint(t))}`;
}

// Orange stroke along 蒸気圧曲線 from B toward C, only as far as t.
function getRealCurveBCDPath(t) {
  if (t <= 1.001) return "";
  const s = Math.min(1, t - 1);
  const c = VAPOR_CUBIC;
  const [q0, q1, q2, q3] = subBezier(c.p3, c.p2, c.p1, c.p0, s);
  return `M ${fmtPt(q0)} C ${fmtPt(q1)} ${fmtPt(q2)} ${fmtPt(q3)}`;
}

// Puddle on the real-gas floor. u = 0 empty, u = 1 is the artboard-20 shape (right edge 786.77, hump 35 px).
function getRealLiquidPath(u) {
  if (u <= 0) return "";
  u = Math.max(0, Math.min(1, u));
  const full = { x: 786.77, w: 169.65, c1x: -2.78, c1y: -19.32, c2x: 27.87, c2y: -35, ex: 84.83, ey: -35, sx: 87.59, sy: 16.08, ex2: 84.83, ey2: 35 };
  const w = full.w * u;
  const x = 701.945 + w / 2;
  const r = (n) => _.round(n, 2);
  return `M ${r(x)},275 h ${r(-w)} c ${r(full.c1x * u)},${r(full.c1y * u)} ${r(full.c2x * u)},${r(full.c2y * u)} ${r(full.ex * u)},${r(full.ey * u)} s ${r(full.sx * u)},${r(full.sy * u)} ${r(full.ex2 * u)},${r(full.ey2 * u)} Z`;
}

function getRealGasColor(t) {
  const u = clampT(t) / MAX_T;
  const r = Math.round(lerp(REAL_GAS_COLOR_HOT.r, REAL_GAS_COLOR_COLD.r, u));
  const g = Math.round(lerp(REAL_GAS_COLOR_HOT.g, REAL_GAS_COLOR_COLD.g, u));
  const b = Math.round(lerp(REAL_GAS_COLOR_HOT.b, REAL_GAS_COLOR_COLD.b, u));
  return `rgb(${r}, ${g}, ${b})`;
}

// ============================================================================
// Annotations shown per phase / Chú thích hiển thị theo từng phase
// ============================================================================

const RUN_BASE = [
  "#ideal-guide-curve", "#real-guide-curve-ab",
  "#ideal-tracking-lines", "#real-tracking-lines",
  "#real-vapor-group", "#real-vapor-pressure",
];
const VAPOR_DASH = ["#real-vapor-curve-dashed"];

const PHASE_ANNOTATIONS = {
  INITIAL: [],
  STATE_HOT_RETURNED: [
    ...RUN_BASE,
    "#ideal-bubble-b", "#ideal-bubble-b-text-heat",
    "#real-bubble-b", "#real-bubble-b-text-heat",
  ],
  COOLING_HOT_TO_B: RUN_BASE,
  STATE_B_AFTER_COOL: [
    ...RUN_BASE,
    "#ideal-point-a", "#ideal-point-b", "#ideal-bubble-b", "#ideal-bubble-b-text-cool",
    "#ideal-formula", "#ideal-range-gas",
    "#real-point-a", "#real-point-b-black", "#real-bubble-b", "#real-bubble-b-text-cool",
    "#real-formula", "#real-ranges", "#real-range-gas",
  ],
  COOLING_EARLY: [...RUN_BASE, ...VAPOR_DASH],
  COOLING_B_TO_C: [...RUN_BASE, ...VAPOR_DASH, "#real-bubble-condense"],
  STATE_C_CONDENSED: [
    ...RUN_BASE, ...VAPOR_DASH,
    "#ideal-point-a", "#ideal-point-b", "#ideal-point-c",
    "#ideal-bubble-b", "#ideal-bubble-b-text-cool",
    "#ideal-formula", "#ideal-range-gas-c",
    "#real-point-a", "#real-point-b-black", "#real-point-c",
    "#real-bubble-c",
    "#real-ranges", "#real-range-gas", "#real-range-mixed",
  ],
  HEATING_C_TO_B: [...RUN_BASE, ...VAPOR_DASH],
  STATE_B_AFTER_HEAT: [
    ...RUN_BASE,
    "#ideal-point-a", "#ideal-point-b", "#ideal-bubble-b", "#ideal-bubble-b-text-heat",
    "#ideal-formula", "#ideal-range-gas",
    "#real-point-a", "#real-point-b-black", "#real-bubble-b", "#real-bubble-b-text-cool",
    "#real-bubble-b-evaporated",
    "#real-ranges", "#real-range-gas",
  ],
  HEATING_B_TO_HOT: RUN_BASE,
};

// Every group that any phase can show (all others get hidden when the phase changes).
// Mọi nhóm mà ít nhất một phase có hiện (các nhóm này bị ẩn khi phase mới không chứa chúng).
const ALL_ANNOTATION_GROUPS = [...new Set(Object.values(PHASE_ANNOTATIONS).flat())];

// Show/hide an element; effect "fadein"/"fadeout" animates opacity over 500 ms, otherwise instant.
// Hiện/ẩn phần tử; effect "fadein"/"fadeout" chuyển opacity trong 500 ms, không có effect thì đổi ngay.
function showElement(element, visible, effect) {
  var $el = $(element);
  $el.stop(true, false);

  if (visible) {
    if (effect === "fadein") {
      const curVis = $el.css("visibility");
      const curOp = parseFloat($el.css("opacity"));
      if (curVis === "visible" && curOp >= 0.99) {
        $el.css({ visibility: "visible", opacity: 1, "pointer-events": "auto" });
        return $el;
      }
      $el.css({ visibility: "visible", "pointer-events": "auto" });
      if (isNaN(curOp) || curVis === "hidden" || curOp === 0) {
        $el.css("opacity", 0);
      }
      return $el.animate({ opacity: 1 }, 500);
    } else {
      $el.css({ visibility: "visible", opacity: 1, "pointer-events": "auto" });
      return $el;
    }
  } else {
    if (effect === "fadeout") {
      const curVis = $el.css("visibility");
      const curOp = parseFloat($el.css("opacity"));
      if (curVis === "hidden" || curOp === 0) {
        $el.css({ visibility: "hidden", opacity: 0, "pointer-events": "none" });
        return $el;
      }
      $el.css({ visibility: "visible", "pointer-events": "none" });
      return $el.animate({ opacity: 0 }, 500, function () {
        $(this).css({ visibility: "hidden", opacity: 0 });
      });
    } else {
      $el.css({ visibility: "hidden", opacity: 0, "pointer-events": "none" });
      return $el;
    }
  }
}

// ============================================================================
// Rendering & controls / Vẽ và điều khiển
// ============================================================================

// Draw the whole scene at progress t (pistons, gas, liquid, graph lines, annotations, buttons).
// Vẽ toàn bộ khung cảnh tại tiến trình t (pít-tông, khí, chất lỏng, đường đồ thị, chú thích, nút bấm).
function renderSimulation(t) {
  if (!g_state || !g_state.sim) return;
  const sim = g_state.sim;
  t = clampT(t);
  sim.progress = t;

  if (sim.isStepMode) {
    applyTrajectoryFrame(t);
    syncMatterStateToTrajectories(t);
  }

  const angle = needleAngle(t);
  $("#ideal-needle").attr("transform", needleTransform(angle, 0));
  $("#real-needle").attr("transform", needleTransform(angle, GRAPH_OFFSET_X));

  const curIdealPt = getIdealPoint(t);
  $("#ideal-gas-rect").attr("fill", IDEAL_GAS_COLOR).css("fill", IDEAL_GAS_COLOR);
  $("#ideal-active-curve").attr("d", getIdealPath(t));
  $("#ideal-line-p")
    .attr("x1", _.round(curIdealPt.x, 2))
    .attr("y1", GRAPH_ORIGIN_IDEAL.y)
    .attr("x2", _.round(curIdealPt.x, 2))
    .attr("y2", _.round(curIdealPt.y, 2));
  $("#ideal-dot-p").attr("cx", _.round(curIdealPt.x, 2)).attr("cy", GRAPH_ORIGIN_IDEAL.y);

  const curRealPt = getRealPoint(t);
  if (t <= 1.0) {
    $("#real-liquid-path").attr("d", "");
    if (sim.isLiquidVisible) {
      sim.isLiquidVisible = false;
      showElement("#real-liquid-group", false, "fadeout");
    }
  } else {
    $("#real-liquid-path").attr("d", getRealLiquidPath(Math.min(1, t - 1)));
    if (!sim.isLiquidVisible) {
      sim.isLiquidVisible = true;
      showElement("#real-liquid-group", true, "fadein");
    }
  }

  const realColor = getRealGasColor(t);
  $("#real-gas-rect").attr("fill", realColor).css("fill", realColor);

  $("#real-active-curve-ab").attr("d", getRealCurveABPath(t));
  const vaporD = getRealCurveBCDPath(t);
  $("#real-active-line-bc")
    .attr("d", vaporD)
    .attr("opacity", vaporD ? 1 : 0)
    .css({ opacity: vaporD ? 1 : 0, visibility: vaporD ? "visible" : "hidden" });

  $("#real-line-p")
    .attr("x1", _.round(curRealPt.x, 2))
    .attr("y1", GRAPH_ORIGIN_REAL.y)
    .attr("x2", _.round(curRealPt.x, 2))
    .attr("y2", _.round(curRealPt.y, 2));
  $("#real-dot-p").attr("cx", _.round(curRealPt.x, 2)).attr("cy", GRAPH_ORIGIN_REAL.y);

  updateAnnotationVisibility(t);
  renderControls();
}

// Console log for testers: on every checkpoint, in step mode, and every 300 ms while playing.
// Params: all values already computed by renderSimulation — passed directly to avoid recomputing.
// Log console cho tester: tại mỗi điểm mốc, ở chế độ từng bước, và mỗi 300 ms khi đang chạy.
// Tham số: tất cả đã được tính trong renderSimulation — truyền thẳng vào để tránh tính lại.
function logSimulationState(t, curIdealPt, curRealPt, idealPistonDrop, realPistonDrop) {
  const sim = g_state.sim;
  const now = typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  const isCheckpoint = t === 0.0 || t === 1.0 || t === 2.0 || t === 3.0;
  const timeSinceLastLog = now - (sim.lastLogTimestamp || 0);
  // 300 ms: tốc độ log khi đang chạy liên tục — đủ nhanh để theo dõi nhưng không spam console
  if (!(g_state.c_is_show_log || sim.isStepMode || isCheckpoint || (sim.isPlaying && !sim.isPaused && timeSinceLastLog >= 300))) return;
  sim.lastLogTimestamp = now;

  if (isCheckpoint && sim.lastLoggedCheckpoint !== t) {
    sim.lastLoggedCheckpoint = t;
    console.log(`%c[KIỂM CHỨNG ĐỒ THỊ] >>> ĐIỂM ${POINT_KEYS[t]} (t = ${t.toFixed(1)}) <<<`, "background: #005bac; color: #fff; padding: 3px 8px; border-radius: 3px; font-weight: bold;");
  } else if (!isCheckpoint) {
    sim.lastLoggedCheckpoint = null;
  }

  // One table row: graph point, piston drop, gas height and a state label.
  // Một dòng của bảng: điểm đồ thị, độ hạ pít-tông, chiều cao khoang khí và nhãn trạng thái.
  const row = (pt, pistonDrop, state) => ({
    "Tiến độ (t)": _.round(t, 2),
    "Đồ thị X (Trục T)": _.round(pt.x, 1),
    "Đồ thị Y (Trục V)": _.round(pt.y, 1),
    "Piston hạ (px)": _.round(pistonDrop, 1),
    "Khoang khí (Cao px)": _.round(CONTAINER_BOTTOM_Y - PISTON_REST_Y - pistonDrop, 1),
    "Trạng thái": state,
  });
  console.table({
    "Khí lý tưởng (Ideal)": row(curIdealPt, idealPistonDrop, t <= 1.0 ? "A->B" : t <= 2.0 ? "B->C" : "C->D"),
    "Khí thực (Real)": row(
      curRealPt,
      realPistonDrop,
      t <= 1.0 ? "Khí A->B" : t <= 2.0 ? `Ngưng tụ (${Math.round(Math.min(1, t - 1.0) * 100)}%)` : "Lỏng C->D"
    ),
  });
}

// Phase name (key of PHASE_ANNOTATIONS) for progress t and the current direction.
// Tên phase (khoá của PHASE_ANNOTATIONS) ứng với tiến trình t và chiều hiện tại.
function getAnnotationPhase(t, sim) {
  const heating = sim.direction === -1;
  if (t <= 0.001) return sim.hasDecompressedToA ? "STATE_HOT_RETURNED" : "INITIAL";
  if (t < 0.999) return heating ? "HEATING_B_TO_HOT" : "COOLING_HOT_TO_B";
  if (t <= 1.001) return heating ? "STATE_B_AFTER_HEAT" : "STATE_B_AFTER_COOL";
  if (t < 1.999) {
    if (heating) return "HEATING_C_TO_B";
    if (t < 1.15) return "COOLING_EARLY";
    return "COOLING_B_TO_C";
  }
  return "STATE_C_CONDENSED";
}

// Show the annotation groups of the current phase (500 ms fade) and hide the rest.
// Runs only when the phase changes; the first run after load/reset is instant.
// Hiện các nhóm chú thích của phase hiện tại (fade 500 ms) và ẩn các nhóm còn lại.
// Chỉ chạy khi phase thay đổi; lần đầu sau khi tải trang/reset thì đổi ngay không fade.
function updateAnnotationVisibility(t) {
  if (!g_state || !g_state.sim) return;
  const sim = g_state.sim;
  const phase = getAnnotationPhase(t, sim);
  if (phase === sim.lastVisibilityPhase) return;

  const isFirstRun = !sim.lastVisibilityPhase;
  sim.lastVisibilityPhase = phase;
  const visible = PHASE_ANNOTATIONS[phase];
  ALL_ANNOTATION_GROUPS.forEach((sel) => {
    const isVis = visible.includes(sel);
    if (isFirstRun) {
      showElement(sel, isVis);
    } else {
      showElement(sel, isVis, isVis ? "fadein" : "fadeout");
    }
  });
}

// Render all Control objects registered in g_state.controls (button enabled/disabled states).
// Vẽ lại mọi Control đã đăng ký trong g_state.controls (trạng thái bật/tắt của các nút).
function renderControls() {
  if (typeof g_state !== "undefined" && g_state.controls) {
    Object.keys(g_state.controls).forEach((k) => {
      const ctrl = g_state.controls[k];
      if (ctrl && typeof ctrl.render === "function") {
        ctrl.render();
      }
    });
  }
}

// Main animation & physics loop (called every frame): advance t while playing, then move the particles.
// Vòng lặp animation & vật lý chính (gọi mỗi frame): tăng/giảm t khi đang chạy, sau đó di chuyển hạt.
function animationLoop() {
  if (!g_state || !g_state.sim) return;
  const sim = g_state.sim;
  const timestamp = typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  if (!sim.lastTimestamp) sim.lastTimestamp = timestamp;
  // dt: thời gian thực kể từ frame trước (giây); clamp 0.05 s = 20 fps tối thiểu để tránh hạt bắn xuyên tường khi tab bị freeze
  const dt = Math.min((timestamp - sim.lastTimestamp) / 1000, 0.05);
  sim.lastTimestamp = timestamp;

  if (sim.isPlaying && !sim.isPaused) {
    sim.progress += sim.direction * sim.playSpeed * dt;

    // Stop exactly on the target checkpoint
    // Dừng đúng tại điểm mốc đích
    const reached = sim.direction === 1 ? sim.progress >= sim.targetProgress : sim.progress <= sim.targetProgress;
    if (reached) {
      sim.progress = sim.targetProgress;
      sim.isPlaying = false;
      if (sim.targetProgress === 0.0) {
        sim.hasDecompressedToA = true;
        sim.direction = 1;
      }
      console.log(`[INFO][Check] Checkpoint reached: Point ${POINT_KEYS[sim.targetProgress]} (t=${sim.targetProgress.toFixed(2)})`);
      renderControls();
    }

    renderSimulation(sim.progress);
  }

  // Particles keep moving while stopped at a checkpoint (but not when paused or in step mode)
  // Hạt vẫn chuyển động khi dừng tại điểm mốc (nhưng không chạy khi tạm dừng hoặc ở chế độ từng bước)
  if (sim.hasStarted && !sim.isPaused && !sim.isStepMode) {
    updateParticles(dt);
  }
}

// Start playing towards the next checkpoint. direction: 1 = cool (t increases), -1 = heat (t decreases).
// Bắt đầu chạy tới điểm mốc kế tiếp. direction: 1 = làm lạnh (t tăng), -1 = đun nóng (t giảm).
function startMoving(direction) {
  if (!g_state || !g_state.sim) return;
  const sim = g_state.sim;
  g_latestMousePress = "";
  if (sim.isPlaying && !sim.isPaused) {
    renderControls();
    return;
  }

  if (sim.isStepMode) {
    syncMatterStateToTrajectories(sim.progress);
    sim.isStepMode = false;
  }
  sim.direction = direction;
  sim.isPaused = false;
  sim.isPlaying = true;
  sim.hasStarted = true;
  if (direction === 1) sim.hasDecompressedToA = false;
  sim.targetProgress = direction === 1 ? nextCoolTarget(sim.progress) : nextHeatTarget(sim.progress);

  console.log(`[INFO][Check] Action: ${direction === 1 ? "Cool" : "Heat"}, progress=${_.round(sim.progress, 2)}, targetProgress=${_.round(sim.targetProgress, 2)}`);
  renderSimulation(sim.progress);
  renderControls();
}

// 冷却する (cool) button. The name is kept because the code below initState calls it.
// Nút 冷却する (làm lạnh). Giữ tên cũ vì phần code sau initState đang gọi hàm này.
function startPressurize() {
  startMoving(1);
}

// 加熱する (heat) button. The name is kept because the code below initState calls it.
// Nút 加熱する (đun nóng). Giữ tên cũ vì phần code sau initState đang gọi hàm này.
function startDepressurize() {
  startMoving(-1);
}

// 一時停止 button: pause/resume playback; from step mode it resumes towards the next checkpoint.
// Nút 一時停止: tạm dừng/tiếp tục; nếu đang ở chế độ từng bước thì chạy tiếp tới điểm mốc kế tiếp.
function togglePause() {
  if (!g_state || !g_state.sim) return;
  const sim = g_state.sim;
  g_latestMousePress = "";
  if (sim.isStepMode) {
    // Resuming from step mode
    // Tiếp tục chạy từ chế độ từng bước
    syncMatterStateToTrajectories(sim.progress);
    sim.isStepMode = false;
    sim.isPaused = false;
    sim.isPlaying = true;
    sim.targetProgress = sim.direction === 1 ? nextCoolTarget(sim.progress) : nextHeatTarget(sim.progress);
    console.log(`[INFO][Check] Action: Resume from Step Mode, progress=${_.round(sim.progress, 2)}, target=${_.round(sim.targetProgress, 2)}`);
    renderControls();
    return;
  }
  if (!sim.isPlaying) {
    renderControls();
    return;
  }
  sim.isPaused = !sim.isPaused;
  console.log(`[INFO][Check] Action: ${sim.isPaused ? "Pause" : "Resume"}, progress=${_.round(sim.progress, 2)}`);
  renderControls();
}

// Change of t per ◀/▶ click.
// Lượng t thay đổi mỗi lần bấm ◀/▶.
const STEP_SIZE = 0.04;

// Move t by one step (sign: +1 towards D, -1 towards A), stopping on every checkpoint.
// Dịch t một bước (sign: +1 về phía D, -1 về phía A), luôn dừng lại tại mỗi điểm mốc.
function stepProgress(sign, label) {
  if (!g_state || !g_state.sim) return;
  const sim = g_state.sim;
  sim.hasStarted = true;
  sim.isPlaying = false;
  sim.isPaused = true;
  g_latestMousePress = "";

  const p = sim.progress;
  if ((sign === 1 && p >= 1.999) || (sign === -1 && p <= 0.001)) {
    sim.isStepMode = false;
    sim.isPaused = false;
    renderControls();
    return;
  }

  let next = p + sign * STEP_SIZE;
  const crossed = [0, 1, 2].find((mark) => (sign === 1 ? p < mark && next >= mark : p > mark && next <= mark));
  if (crossed !== undefined) {
    next = crossed;
  } else if (sign === 1 && next >= MAX_T) {
    next = MAX_T;
  } else if (sign === -1 && next <= 0) {
    next = 0;
  }

  if (next <= 0.001) {
    sim.hasDecompressedToA = true;
    sim.direction = 1;
  }

  sim.isStepMode = true;
  sim.isPaused = true;
  sim.isPlaying = false;
  console.log(`[INFO][Check] Action: ${label}, progress=${_.round(next, 2)}`);
  renderSimulation(next);
  if (isMilestone(next)) {
    sim.isStepMode = false;
    sim.isPaused = false;
    sim.isPlaying = false;
  }
  renderControls();
}

// ▶ button: one step in the current direction.
// Nút ▶: tiến một bước theo chiều hiện tại.
function stepForward() {
  if (!g_state || !g_state.sim) return;
  stepProgress(g_state.sim.direction === -1 ? -1 : 1, "StepForward");
}

// ◀ button: one step against the current direction.
// Nút ◀: lùi một bước, ngược chiều hiện tại.
function stepBack() {
  if (!g_state || !g_state.sim) return;
  stepProgress(g_state.sim.direction === -1 ? 1 : -1, "StepBack");
}

// 最初に戻る button: back to the initial state (t = 0, nothing annotated, fresh physics).
// Nút 最初に戻る: về trạng thái ban đầu (t = 0, ẩn mọi chú thích, khởi tạo lại vật lý).
function resetSimulation() {
  if (!g_state || !g_state.sim) return;
  const sim = g_state.sim;
  g_latestMousePress = "";
  sim.isStepMode = false;
  sim.isPlaying = false;
  sim.isPaused = false;
  sim.direction = 1;
  sim.progress = 0.0;
  sim.targetProgress = 0.0;
  sim.hasStarted = false;
  sim.hasDecompressedToA = false;
  sim.isLiquidVisible = false;
  sim.lastVisibilityPhase = "";
  ALL_ANNOTATION_GROUPS.forEach((sel) => showElement(sel, false));
  showElement("#real-liquid-group", false);
  setupMatterSimulations();
  initParticles();
  console.log("[INFO][Check] Action: Reset, progress=0.00");
  renderSimulation(0.0);
  renderControls();
}

window.initState = () => {
  g_state = {
    c_version: "2026-09-15",
    c_is_show_log: false,
    c_is_init_canvas: false,
    c_screen_width: 1024,
    c_screen_height: 648,
    sim: {
      progress: 0.0, // 0.0 A -> 1.0 B -> 2.0 C -> 3.0 D
      targetProgress: 0.0,
      isPlaying: false,
      isPaused: false,
      isStepMode: false,
      hasStarted: false,
      hasDecompressedToA: false,
      isLiquidVisible: false,
      lastVisibilityPhase: "",
      direction: 1, // +1: pressurize (compress), -1: depressurize (expand)
      playSpeed: 0.35, // progress units per second (approx 2.9s per segment)
      lastTimestamp: 0,
      particles: {
        ideal: [],
        real: [],
      },
      intervalId: null,
    },
    controls: {
      ctrl_btn_pressurize: new Control({
        type: "button",
        id: "btn-pressurize",
        value: "inactive",
        mousedown: function (e) {
          if (this.value === "disabled") return;
          this.value = "active";
          this.render();
        },
        mouseup: function (e) {
          if (this.value === "disabled") return;
          g_latestMousePress = "";
          startPressurize();
        },
        render: function () {
          const sim = g_state && g_state.sim;
          if (!sim) return;
          const t = sim.progress;
          const settled = !sim.isPlaying && !sim.isPaused && !sim.isStepMode;
          const isDisabled = !settled || t >= 1.999;
          if (isDisabled) {
            this.value = "disabled";
          } else if (typeof g_latestMousePress !== "undefined" && g_latestMousePress === this.id) {
            this.value = "active";
          } else {
            this.value = "inactive";
          }
          showElement(`.${this.id}`, false);
          showElement(`#${this.id}-${this.value}`, true);
        },
      }),
      ctrl_btn_depressurize: new Control({
        type: "button",
        id: "btn-depressurize",
        value: "disabled",
        mousedown: function (e) {
          if (this.value === "disabled") return;
          this.value = "active";
          this.render();
        },
        mouseup: function (e) {
          if (this.value === "disabled") return;
          g_latestMousePress = "";
          startDepressurize();
        },
        render: function () {
          const sim = g_state && g_state.sim;
          if (!sim) return;
          const t = sim.progress;
          const settled = !sim.isPlaying && !sim.isPaused && !sim.isStepMode;
          const atStop = Math.abs(t - 1) <= 0.001 || t >= 1.999;
          const isDisabled = !settled || t <= 0.001 || !atStop;
          if (isDisabled) {
            this.value = "disabled";
          } else if (typeof g_latestMousePress !== "undefined" && g_latestMousePress === this.id) {
            this.value = "active";
          } else {
            this.value = "inactive";
          }
          showElement(`.${this.id}`, false);
          showElement(`#${this.id}-${this.value}`, true);
        },
      }),
      ctrl_btn_step_back: new Control({
        type: "button",
        id: "btn-step-back",
        value: "disabled",
        mousedown: function (e) {
          if (this.value === "disabled") return;
          this.value = "active";
          this.render();
        },
        mouseup: function (e) {
          if (this.value === "disabled") return;
          g_latestMousePress = "";
          stepBack();
        },
        render: function () {
          const sim = g_state && g_state.sim;
          if (!sim) return;
          const t = sim.progress;
          const isDisabled = t <= 0.001;
          if (isDisabled) {
            this.value = "disabled";
          } else if (typeof g_latestMousePress !== "undefined" && g_latestMousePress === this.id) {
            this.value = "active";
          } else {
            this.value = "inactive";
          }
          showElement(`.${this.id}`, false);
          showElement(`#${this.id}-${this.value}`, true);
        },
      }),
      ctrl_btn_pause: new Control({
        type: "button",
        id: "btn-pause",
        value: "disabled",
        mousedown: function (e) {
          if (this.value === "disabled") return;
          this.value = "active";
          this.render();
        },
        mouseup: function (e) {
          if (this.value === "disabled") return;
          g_latestMousePress = "";
          togglePause();
        },
        render: function () {
          const sim = g_state && g_state.sim;
          if (!sim) return;
          if (sim.isPlaying && !sim.isPaused && !sim.isStepMode) {
            if (typeof g_latestMousePress !== "undefined" && g_latestMousePress === this.id) {
              this.value = "active";
            } else {
              this.value = "inactive";
            }
          } else {
            this.value = "disabled";
          }
          showElement("#btn-pause-inactive", this.value === "inactive");
          showElement("#btn-pause-active", this.value === "active");
          const isResumeActiveOrInactive = g_state && g_state.controls && g_state.controls.ctrl_btn_pause_resume && g_state.controls.ctrl_btn_pause_resume.value !== "disabled";
          if (this.value === "disabled" && !isResumeActiveOrInactive) {
            showElement("#btn-pause-disabled", true);
          } else if (this.value !== "disabled") {
            showElement("#btn-pause-disabled", false);
          }
        },
      }),
      ctrl_btn_pause_resume: new Control({
        type: "button",
        id: "btn-pause-resume",
        value: "disabled",
        mousedown: function (e) {
          if (this.value === "disabled") return;
          this.value = "active";
          this.render();
        },
        mouseup: function (e) {
          if (this.value === "disabled") return;
          g_latestMousePress = "";
          togglePause();
        },
        render: function () {
          const sim = g_state && g_state.sim;
          if (!sim) return;
          const t = sim.progress;
          const atMilestone = isMilestone(t);
          const canResume = !atMilestone && ((sim.isPlaying && sim.isPaused) || sim.isStepMode);

          if (canResume) {
            if (typeof g_latestMousePress !== "undefined" && g_latestMousePress === this.id) {
              this.value = "active";
            } else {
              this.value = "inactive";
            }
          } else {
            this.value = "disabled";
          }
          showElement("#btn-pause-resume-inactive", this.value === "inactive");
          showElement("#btn-pause-resume-active", this.value === "active");
          const isPauseActiveOrInactive = g_state && g_state.controls && g_state.controls.ctrl_btn_pause && g_state.controls.ctrl_btn_pause.value !== "disabled";
          if (this.value === "disabled" && !isPauseActiveOrInactive) {
            showElement("#btn-pause-disabled", true);
          } else if (this.value !== "disabled") {
            showElement("#btn-pause-disabled", false);
          }
        },
      }),
      ctrl_btn_step_forward: new Control({
        type: "button",
        id: "btn-step-forward",
        value: "disabled",
        mousedown: function (e) {
          if (this.value === "disabled") return;
          this.value = "active";
          this.render();
        },
        mouseup: function (e) {
          if (this.value === "disabled") return;
          g_latestMousePress = "";
          stepForward();
        },
        render: function () {
          const sim = g_state && g_state.sim;
          if (!sim) return;
          const t = sim.progress;
          const playing = sim.isPlaying && !sim.isPaused && !sim.isStepMode;
          const atMilestone = isMilestone(t);
          const endOfDir = (sim.direction === -1 && t <= 0.001) || (sim.direction !== -1 && t >= 1.999);
          const isDisabled = endOfDir || (!playing && atMilestone);
          if (isDisabled) {
            this.value = "disabled";
          } else if (typeof g_latestMousePress !== "undefined" && g_latestMousePress === this.id) {
            this.value = "active";
          } else {
            this.value = "inactive";
          }
          showElement(`.${this.id}`, false);
          showElement(`#${this.id}-${this.value}`, true);
        },
      }),
      ctrl_btn_reset: new Control({
        type: "button",
        id: "btn-reset",
        value: "disabled",
        mousedown: function (e) {
          if (this.value === "disabled") return;
          this.value = "active";
          this.render();
        },
        mouseup: function (e) {
          if (this.value === "disabled") return;
          g_latestMousePress = "";
          resetSimulation();
        },
        render: function () {
          const sim = g_state && g_state.sim;
          if (!sim) return;
          const t = sim.progress;
          if (t <= 0.001 && !sim.hasDecompressedToA && !sim.hasStarted && !sim.isPlaying) {
            this.value = "disabled";
          } else if (typeof g_latestMousePress !== "undefined" && g_latestMousePress === this.id) {
            this.value = "active";
          } else {
            this.value = "inactive";
          }
          showElement(`.${this.id}`, false);
          showElement(`#${this.id}-${this.value}`, true);
        },
      }),
      ctrl_rect_overlay: new Control({
        type: "button",
        id: "rect-overlay",
        mousedown: function (e) {
          if (e) { e.stopPropagation?.(); e.preventDefault?.(); }
        },
        mouseup: function (e) {
          if (e) {
            e.stopPropagation?.();
            e.preventDefault?.();
            $(document).trigger("mouseup", { note: "trigger-rect-overlay" });
          }
        },
        render: function () {},
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

const loadConfigAndStaticSVG = () => {
  initParticles();
  renderSimulation(0.0);
};

// Document ready bootstrap
$(document).ready(function () {
  // Delay 100 ms: chờ browser paint lần đầu xong trước khi chạy physics nặng (tránh freeze trắng màn hình)
  setTimeout(async () => {
    initDragEvent(["form-input"]);
    if (typeof loadConfigAndStaticSVG === "function") {
      loadConfigAndStaticSVG();
    }
    // setInterval ở 1000/60 ≈ 16.67 ms/frame = 60 fps; dùng setInterval thay requestAnimationFrame
    // vì content chạy trong iframe và tab có thể bị throttle bởi browser
    if (g_state && g_state.sim && !g_state.sim.intervalId) {
      g_state.sim.intervalId = setInterval(animationLoop, 1000 / 60);
    }
    // Delay thêm 100 ms sau khi physics khởi tạo xong rồi mới fade-in #divBody
    // để tránh flash hạt ở vị trí ban đầu trước khi renderSimulation chạy
    await delay(100);
    showElement("#divBody", true).css("opacity", "1");
  }, 100);
});


let controlValuesPrev = JSON.stringify({});
let isDebugDOM = true;
const applyControlChange = (isSkipCache) => {
  let controlValues = JSON.stringify({
    ..._.pick(g_state, ["menu", "menu_item_selected", "menu_data"]),
    controls: g_state_controls
      .filter((x) => !x.is_skip_check_reload)
      .map((x) => _.pick(x, ["name", "value"])),
  });

  if (controlValues === controlValuesPrev && !isSkipCache) {
    return;
  }
  controlValuesPrev = controlValues;
};
