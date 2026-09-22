
// Points from index.html SVG ideal-guide-curve (from Point A at index 0 to Point B at index 46 to End at index 61)
const IDEAL_CURVE_DATA = [
  { x: 482.0, y: 409.0 },
  { x: 476.0, y: 408.79 },
  { x: 466.8, y: 408.52 },
  { x: 457.59, y: 408.23 },
  { x: 448.39, y: 407.93 },
  { x: 439.18, y: 407.61 },
  { x: 429.98, y: 407.27 },
  { x: 420.77, y: 406.9 },
  { x: 411.57, y: 406.52 },
  { x: 402.37, y: 406.1 },
  { x: 393.17, y: 405.67 },
  { x: 383.97, y: 405.2 },
  { x: 374.78, y: 404.69 },
  { x: 365.58, y: 404.15 },
  { x: 356.39, y: 403.56 },
  { x: 347.2, y: 402.93 },
  { x: 338.02, y: 402.25 },
  { x: 328.84, y: 401.5 },
  { x: 319.66, y: 400.67 },
  { x: 310.5, y: 399.76 },
  { x: 301.34, y: 398.76 },
  { x: 292.2, y: 397.65 },
  { x: 283.07, y: 396.42 },
  { x: 273.96, y: 395.04 },
  { x: 264.89, y: 393.47 },
  { x: 255.85, y: 391.7 },
  { x: 246.87, y: 389.66 },
  { x: 237.96, y: 387.32 },
  { x: 229.16, y: 384.61 },
  { x: 220.51, y: 381.44 },
  { x: 212.08, y: 377.74 },
  { x: 203.95, y: 373.41 },
  { x: 196.27, y: 368.34 },
  { x: 189.14, y: 362.51 },
  { x: 182.69, y: 355.95 },
  { x: 176.97, y: 348.73 },
  { x: 172.0, y: 340.98 },
  { x: 167.73, y: 332.82 },
  { x: 164.1, y: 324.36 },
  { x: 161.01, y: 315.68 },
  { x: 158.36, y: 306.86 },
  { x: 156.06, y: 297.95 },
  { x: 154.05, y: 288.96 },
  { x: 152.3, y: 279.91 },
  { x: 150.77, y: 270.83 },
  { x: 149.42, y: 261.72 },
  // Point B (index 46, t = 1.0)
  { x: 148.38, y: 254.0 },
  { x: 147.13, y: 243.45 },
  { x: 146.16, y: 234.29 },
  { x: 145.26, y: 225.12 },
  { x: 144.43, y: 215.95 },
  { x: 143.67, y: 206.77 },
  { x: 142.97, y: 197.58 },
  { x: 142.33, y: 188.4 },
  { x: 141.74, y: 179.2 },
  { x: 141.2, y: 170.01 },
  { x: 140.7, y: 160.81 },
  // end-point-ideal (index 57, t = 2.0)
  { x: 139.93, y: 154.0 },
];

// Seed particles for Ideal Gas (left container) and Real Gas (right container)
// Center coordinates calculated from SVG translate(x, y) with particle radius offset + 4 (viewBox="0 0 8 8")
// Tọa độ tâm các hạt ban đầu tính từ translate SVG + 4px offset theo tâm hạt
const INITIAL_IDEAL_PARTICLES = [
  { x: 303.43, y: 135.97, vx: 3.5, vy: 3.3 },
  { x: 344.05, y: 155.13, vx: -4.0, vy: 2.6 },
  { x: 386.33, y: 133.66, vx: 2.8, vy: -3.9 },
  { x: 423.32, y: 155.13, vx: -3.8, vy: -2.9 },
  { x: 374.44, y: 185.18, vx: 4.2, vy: -2.3 },
  { x: 339.76, y: 215.9, vx: -3.0, vy: 3.7 },
  { x: 367.5, y: 242.98, vx: 3.6, vy: 3.2 },
  { x: 409.44, y: 225.47, vx: -3.9, vy: -2.8 },
  { x: 424.64, y: 251.24, vx: 3.2, vy: 3.6 },
  { x: 398.22, y: 187.16, vx: -4.1, vy: 2.5 },
  { x: 304.42, y: 182.87, vx: -2.6, vy: 4.0 },
  { x: 293.85, y: 238.69, vx: 4.0, vy: -2.6 },
  { x: 355.2, y: 175.5, vx: -3.2, vy: 3.4 },
];

const INITIAL_REAL_PARTICLES = [
  { x: 803.43, y: 135.97, vx: 3.5, vy: 3.3 },
  { x: 844.05, y: 155.13, vx: -4.0, vy: 2.6 },
  { x: 886.33, y: 133.66, vx: 2.8, vy: -3.9 },
  { x: 923.32, y: 155.13, vx: -3.8, vy: -2.9 },
  { x: 874.44, y: 185.18, vx: 4.2, vy: -2.3 },
  { x: 839.76, y: 215.9, vx: -3.0, vy: 3.7 },
  { x: 867.5, y: 242.98, vx: 3.6, vy: 3.2 },
  { x: 909.44, y: 225.47, vx: -3.9, vy: -2.8 },
  { x: 924.64, y: 251.24, vx: 3.2, vy: 3.6 },
  { x: 898.22, y: 187.16, vx: -4.1, vy: 2.5 },
  { x: 804.42, y: 182.87, vx: -2.6, vy: 4.0 },
  { x: 793.85, y: 238.69, vx: 4.0, vy: -2.6 },
  { x: 855.2, y: 175.5, vx: -3.2, vy: 3.4 },
];

const PARTICLE_COUNT = INITIAL_IDEAL_PARTICLES.length;

// Liquid anchor positions at container bottom (13 exact slots matching design SVG translates)
// Vị trí chính xác 13 điểm ngưng tụ dưới đáy bình khớp với thiết kế SVG
const ANCHOR_SLOTS = [
  { x: 782.82, y: 259.11 }, // 0 (from translate 778.82 255.11)
  { x: 798.57, y: 264.8 },  // 1 (from translate 794.57 260.8)
  { x: 812.78, y: 258.79 }, // 2 (from translate 808.78 254.79)
  { x: 823.74, y: 263.87 }, // 3 (from translate 819.74 259.87)
  { x: 836.85, y: 257.09 }, // 4 (from translate 832.85 253.09)
  { x: 855.96, y: 257.1 },  // 5 (from translate 851.96 253.1)
  { x: 871.78, y: 262.44 }, // 6 (from translate 867.78 258.44)
  { x: 885.45, y: 267.21 }, // 7 (from translate 881.45 263.21)
  { x: 890.33, y: 257.61 }, // 8 (from translate 886.33 253.61)
  { x: 906.67, y: 263.39 }, // 9 (from translate 902.67 259.39)
  { x: 921.24, y: 258.11 }, // 10 (from translate 917.24 254.11)
  { x: 929.84, y: 266.63 }, // 11 (from translate 925.84 262.63)
  { x: 939.12, y: 256.56 }, // 12 (from translate 935.12 252.56)
];

// Center-outward slot filling order (matching liquid puddle expansion)
// Thứ tự lấp đầy vị trí ngưng tụ từ giữa lan ra 2 bên
const SLOT_FILL_ORDER = [5, 6, 4, 7, 8, 3, 9, 2, 10, 1, 11, 0, 12];

const GAS_SPEED = 120;

const TOTAL_PARTICLE_FRAMES = 600;
let masterParticleTrajectories = [];
let idealMatterState = null;
let realMatterState = null;

// Get interpolated point on Ideal curve at progress t (0.0 to 2.0)
function getIdealPoint(t) {
  t = Math.max(0.0, Math.min(2.0, t));
  let floatIdx, maxIdx, minIdx;

  if (t <= 1.0) {
    floatIdx = t * 46;
    minIdx = 0;
    maxIdx = 46;
  } else {
    floatIdx = 46 + (t - 1.0) * (57 - 46);
    minIdx = 46;
    maxIdx = 57;
  }

  const i0 = Math.floor(floatIdx);
  const i1 = Math.min(maxIdx, i0 + 1);
  const frac = floatIdx - i0;

  const p0 = IDEAL_CURVE_DATA[i0];
  const p1 = IDEAL_CURVE_DATA[i1];

  const x = p0.x + frac * (p1.x - p0.x);
  const y = p0.y + frac * (p1.y - p0.y);
  return { x, y, idx: i0, frac };
}

// Get interpolated point on Real curve at progress t (0.0 to 2.0)
function getRealPoint(t) {
  t = Math.max(0.0, Math.min(2.0, t));
  if (t <= 1.0) {
    // Phase 1: Real gas follows same isothermal curve as Ideal Gas offset by +500px in X
    const idealPt = getIdealPoint(t);
    return { x: idealPt.x + 500, y: idealPt.y, idx: idealPt.idx, frac: idealPt.frac };
  } else {
    // Phase 2: Liquid-vapor condensation at CONSTANT saturated vapor pressure (y = 254.0)
    // Horizontal linear movement from Point B (x = 648.38) to Point C (x = 598.38)
    const u = t - 1.0;
    const x = 648.38 - u * (648.38 - 598.38);
    const y = 254.0;
    return { x, y, idx: 46, frac: u };
  }
}

// Piston displacements as a direct function of physical volume on the p-V curve
function getIdealPistonY(t) {
  const pt = getIdealPoint(t);
  if (t <= 1.0) {
    return ((482.0 - pt.x) / (482.0 - 148.38)) * 60.0;
  } else {
    return 60.0 + ((148.38 - pt.x) / (148.38 - 139.93)) * (120.0 - 60.0);
  }
}

function getRealPistonY(t) {
  const pt = getRealPoint(t);
  if (t <= 1.0) {
    return ((982.0 - pt.x) / (982.0 - 648.38)) * 60.0;
  } else {
    return 60.0 + ((648.38 - pt.x) / (648.38 - 598.38)) * (136.0 - 60.0);
  }
}

// Initialize Matter.js physics engine worlds for both Ideal and Real gas cylinders
// Khởi tạo thế giới vật lý Matter.js cho cả 2 bình khí lý tưởng và khí thực
function setupMatterSimulations() {
  if (typeof Matter === "undefined") return;
  const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Body = Matter.Body;

  const r = 3.8;
  const wallOpts = { isStatic: true, friction: 0, frictionAir: 0, restitution: 1.0 };
  const wallT = 80;

  // 1. Ideal Gas Matter World
  const idealEngine = Engine.create({ gravity: { x: 0, y: 0, scale: 0.001 } });
  const idealLeft = 273;
  const idealRight = 446;
  const idealBottom = 273;
  const idealMidX = (idealLeft + idealRight) / 2; // 360
  const idealWidth = idealRight - idealLeft; // 176

  const idealLeftWall = Bodies.rectangle(idealLeft - wallT / 2, 190, wallT, 400, wallOpts);
  const idealRightWall = Bodies.rectangle(idealRight + wallT / 2, 190, wallT, 400, wallOpts);
  const idealBottomWall = Bodies.rectangle(idealMidX, idealBottom + wallT / 2, idealWidth + wallT * 2, wallT, wallOpts);
  const idealPistonWall = Bodies.rectangle(idealMidX, 115 - wallT / 2, idealWidth + wallT * 2, wallT, wallOpts);

  World.add(idealEngine.world, [idealLeftWall, idealRightWall, idealBottomWall, idealPistonWall]);

  const idealBalls = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const init = INITIAL_IDEAL_PARTICLES[i];
    const ball = Bodies.circle(init.x, init.y, r, {
      friction: 0,
      frictionAir: 0,
      restitution: 1.0,
      inertia: Infinity,
      collisionFilter: { group: -1 },
    });
    Body.setVelocity(ball, { x: init.vx, y: init.vy });
    World.add(idealEngine.world, ball);
    idealBalls.push(ball);
  }

  idealMatterState = {
    engine: idealEngine,
    leftWall: idealLeftWall,
    rightWall: idealRightWall,
    bottomWall: idealBottomWall,
    pistonWall: idealPistonWall,
    balls: idealBalls,
    midX: idealMidX,
    wallT: wallT,
    left: idealLeft,
    right: idealRight,
    bottom: idealBottom,
    radius: r,
  };

  // 2. Real Gas Matter World
  const realEngine = Engine.create({ gravity: { x: 0, y: 0, scale: 0.001 } });
  const realLeft = 773;
  const realRight = 946;
  const realBottom = 272;
  const realMidX = (realLeft + realRight) / 2; // 860
  const realWidth = realRight - realLeft; // 176

  const realLeftWall = Bodies.rectangle(realLeft - wallT / 2, 190, wallT, 400, wallOpts);
  const realRightWall = Bodies.rectangle(realRight + wallT / 2, 190, wallT, 400, wallOpts);
  const realBottomWall = Bodies.rectangle(realMidX, realBottom + wallT / 2, realWidth + wallT * 2, wallT, wallOpts);
  const realPistonWall = Bodies.rectangle(realMidX, 115 - wallT / 2, realWidth + wallT * 2, wallT, wallOpts);

  World.add(realEngine.world, [realLeftWall, realRightWall, realBottomWall, realPistonWall]);

  const realBalls = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const init = INITIAL_REAL_PARTICLES[i];
    const ball = Bodies.circle(init.x, init.y, r, {
      friction: 0,
      frictionAir: 0,
      restitution: 1.0,
      inertia: Infinity,
      collisionFilter: { group: -1 },
    });
    ball.wobblePhase = 0;
    Body.setVelocity(ball, { x: init.vx, y: init.vy });
    World.add(realEngine.world, ball);
    realBalls.push(ball);
  }

  realMatterState = {
    engine: realEngine,
    leftWall: realLeftWall,
    rightWall: realRightWall,
    bottomWall: realBottomWall,
    pistonWall: realPistonWall,
    balls: realBalls,
    midX: realMidX,
    wallT: wallT,
    left: realLeft,
    right: realRight,
    bottom: realBottom,
    radius: r,
    condensedAssignments: [],
  };
}

// Generate deterministic particle trajectories across all progress steps using Matter.js physics
// Tạo quỹ đạo hạt tiền định cho tất cả các frame theo tiến trình bằng vật lý Matter.js
function generateParticleTrajectories() {
  if (typeof Matter === "undefined") return;
  const Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Body = Matter.Body;

  const frames = TOTAL_PARTICLE_FRAMES;
  const count = PARTICLE_COUNT;
  const r = 3.8;
  const wallOpts = { isStatic: true, friction: 0, frictionAir: 0, restitution: 1.0 };
  const wallT = 80;

  // Temp Ideal Engine
  const idealEngine = Engine.create({ gravity: { x: 0, y: 0, scale: 0.001 } });
  const idealMidX = (273 + 446) / 2;
  const idealWidth = 446 - 273;
  const iLeft = Bodies.rectangle(273 - wallT / 2, 190, wallT, 400, wallOpts);
  const iRight = Bodies.rectangle(446 + wallT / 2, 190, wallT, 400, wallOpts);
  const iBottom = Bodies.rectangle(idealMidX, 271 + wallT / 2, idealWidth + wallT * 2, wallT, wallOpts);
  const iPiston = Bodies.rectangle(idealMidX, 115 - wallT / 2, idealWidth + wallT * 2, wallT, wallOpts);
  World.add(idealEngine.world, [iLeft, iRight, iBottom, iPiston]);

  const idealBalls = [];
  for (let i = 0; i < count; i++) {
    const init = INITIAL_IDEAL_PARTICLES[i];
    const ball = Bodies.circle(init.x, init.y, r, {
      friction: 0,
      frictionAir: 0,
      restitution: 1.0,
      inertia: Infinity,
      collisionFilter: { group: -1 },
    });
    Body.setVelocity(ball, { x: init.vx, y: init.vy });
    World.add(idealEngine.world, ball);
    idealBalls.push(ball);
  }

  // Temp Real Engine
  const realEngine = Engine.create({ gravity: { x: 0, y: 0, scale: 0.001 } });
  const realMidX = (773 + 947) / 2;
  const realWidth = 947 - 773;
  const rLeft = Bodies.rectangle(773 - wallT / 2, 190, wallT, 400, wallOpts);
  const rRight = Bodies.rectangle(946 + wallT / 2, 190, wallT, 400, wallOpts);
  const rBottom = Bodies.rectangle(realMidX, 272 + wallT / 2, realWidth + wallT * 2, wallT, wallOpts);
  const rPiston = Bodies.rectangle(realMidX, 115 - wallT / 2, realWidth + wallT * 2, wallT, wallOpts);
  World.add(realEngine.world, [rLeft, rRight, rBottom, rPiston]);

  const realBalls = [];
  for (let i = 0; i < count; i++) {
    const init = INITIAL_REAL_PARTICLES[i];
    const ball = Bodies.circle(init.x, init.y, r, {
      friction: 0,
      frictionAir: 0,
      restitution: 1.0,
      inertia: Infinity,
      collisionFilter: { group: -1 },
    });
    ball.wobblePhase = 0;
    Body.setVelocity(ball, { x: init.vx, y: init.vy });
    World.add(realEngine.world, ball);
    realBalls.push(ball);
  }

  masterParticleTrajectories = [];
  const condensedAssignments = [];

  for (let f = 0; f < frames; f++) {
    const t = (f / (frames - 1)) * 2.0;

    // 1. Ideal Gas Frame
    const idealPistonY = getIdealPistonY(t);
    const idealTopY = 115 + idealPistonY;
    Body.setPosition(iPiston, { x: idealMidX, y: idealTopY - wallT / 2 });

    Engine.update(idealEngine, 1000 / 60);

    const frameIdeal = [];
    for (let i = 0; i < count; i++) {
      const b = idealBalls[i];
      if (isNaN(b.position.x) || isNaN(b.position.y)) {
        b.position.x = INITIAL_IDEAL_PARTICLES[i].x;
        b.position.y = INITIAL_IDEAL_PARTICLES[i].y;
        b.velocity.x = INITIAL_IDEAL_PARTICLES[i].vx;
        b.velocity.y = INITIAL_IDEAL_PARTICLES[i].vy;
      }

      if (b.position.x < 273 + r) { b.position.x = 273 + r; b.velocity.x = Math.abs(b.velocity.x); }
      if (b.position.x > 448 - r) { b.position.x = 448 - r; b.velocity.x = -Math.abs(b.velocity.x); }
      if (b.position.y < idealTopY + r) { b.position.y = idealTopY + r; b.velocity.y = Math.abs(b.velocity.y); }
      if (b.position.y > 273 - r) { b.position.y = 273 - r; b.velocity.y = -Math.abs(b.velocity.y); }

      const curSpeed = Math.sqrt(b.velocity.x * b.velocity.x + b.velocity.y * b.velocity.y);
      if (curSpeed > 0.001) {
        const factor = GAS_SPEED / curSpeed;
        b.velocity.x *= factor;
        b.velocity.y *= factor;
      }

      const px = _.round(b.position.x, 2);
      const py = _.round(b.position.y, 2);
      frameIdeal.push({ x: isNaN(px) ? INITIAL_IDEAL_PARTICLES[i].x : px, y: isNaN(py) ? INITIAL_IDEAL_PARTICLES[i].y : py });
    }

    // 2. Real Gas Frame
    const realPistonY = getRealPistonY(t);
    const realTopY = 115 + realPistonY;
    Body.setPosition(rPiston, { x: realMidX, y: realTopY - wallT / 2 });

    const u = Math.max(0, t - 1.0);
    const condenseRatio = Math.min(1.0, u / 0.72);
    const targetCondensedCount = t > 1.0 ? Math.min(count, Math.round(condenseRatio * count)) : 0;

    // When adding condensed particle: pick the free gas particle closest to that bottom slot
    // Khi cần thêm hạt ngưng tụ: chọn hạt tự do đang ở GẦN vị trí đáy đó nhất
    while (condensedAssignments.length < targetCondensedCount) {
      const slotIdx = SLOT_FILL_ORDER[condensedAssignments.length];
      const slotPos = ANCHOR_SLOTS[slotIdx];
      let bestIdx = -1;
      let bestDist = Infinity;
      for (let i = 0; i < count; i++) {
        if (condensedAssignments.some((a) => a.particleIdx === i)) continue;
        const b = realBalls[i];
        const dx = slotPos.x - b.position.x;
        const dy = slotPos.y - b.position.y;
        const d = Math.hypot(dx, dy);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
      if (bestIdx !== -1) {
        condensedAssignments.push({
          particleIdx: bestIdx,
          slotIdx: slotIdx,
          targetX: slotPos.x,
          targetY: slotPos.y,
        });
        realBalls[bestIdx].isSensor = true;
      } else {
        break;
      }
    }

    for (let i = 0; i < count; i++) {
      const isCondensed = condensedAssignments.some((a) => a.particleIdx === i);
      realBalls[i].isSensor = isCondensed;
    }

    Engine.update(realEngine, 1000 / 60);

    const frameReal = [];
    for (let i = 0; i < count; i++) {
      const b = realBalls[i];
      if (isNaN(b.position.x) || isNaN(b.position.y)) {
        b.position.x = INITIAL_REAL_PARTICLES[i].x;
        b.position.y = INITIAL_REAL_PARTICLES[i].y;
        b.velocity.x = INITIAL_REAL_PARTICLES[i].vx;
        b.velocity.y = INITIAL_REAL_PARTICLES[i].vy;
      }

      const assignment = condensedAssignments.find((a) => a.particleIdx === i);

      if (assignment) {
        const targetX = assignment.targetX;
        const targetY = assignment.targetY;
        const dx = targetX - b.position.x;
        const dy = targetY - b.position.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 0.8 && t < 1.99) {
          // Move smoothly and gently towards the target slot
          // Di chuyển chậm rãi êm ái về vị trí slot
          const speed = Math.min(dist, Math.max(0.6, dist * 0.08));
        
          b.position.x += (dx / dist) * speed;
          b.position.y += (dy / dist) * speed;
          b.velocity.x = 0;
          b.velocity.y = 0;
        } else {
          // In liquid: distinct thermal Brownian motion / micro-oscillation
          // Trong nước: dao động lắc nhiệt rõ nét hơn (Brownian motion)
          b.wobblePhase = (b.wobblePhase || 0) + 0.10;
          const wx = Math.sin(b.wobblePhase * 1.2 + assignment.slotIdx * 1.8) * 1.3;
          const wy = Math.cos(b.wobblePhase * 1.5 + assignment.slotIdx * 2.4) * 0.8;
          b.position.x = targetX + wx;
          b.position.y = targetY + wy;
          b.velocity.x = 0;
          b.velocity.y = 0;
        }

        const px = _.round(b.position.x, 2);
        const py = _.round(b.position.y, 2);
        frameReal.push({ x: isNaN(px) ? targetX : px, y: isNaN(py) ? targetY : py });
      } else {
        const vaporTop = realTopY;
        const vaporBottom = 273; // Fixed bottom at 273 / Đáy cố định 273

        if (b.position.x < 773 + r) { b.position.x = 773 + r; b.velocity.x = Math.abs(b.velocity.x); }
        if (b.position.x > 947 - r) { b.position.x = 947 - r; b.velocity.x = -Math.abs(b.velocity.x); }
        if (b.position.y < vaporTop + r) { b.position.y = vaporTop + r; b.velocity.y = Math.abs(b.velocity.y); }
        if (b.position.y > vaporBottom - r) { b.position.y = vaporBottom - r; b.velocity.y = -Math.abs(b.velocity.y); }

        const curSpeed = Math.sqrt(b.velocity.x * b.velocity.x + b.velocity.y * b.velocity.y);
        if (curSpeed > 0.001) {
          const factor = GAS_SPEED / curSpeed;
          b.velocity.x *= factor;
          b.velocity.y *= factor;
        }

        const px = _.round(b.position.x, 2);
        const py = _.round(b.position.y, 2);
        frameReal.push({ x: isNaN(px) ? INITIAL_REAL_PARTICLES[i].x : px, y: isNaN(py) ? INITIAL_REAL_PARTICLES[i].y : py });
      }
    }

    masterParticleTrajectories.push({ ideal: frameIdeal, real: frameReal });
  }
}

// Initialize particles for both containers
function initParticles() {
  if (!idealMatterState || !realMatterState) {
    setupMatterSimulations();
  }
  if (masterParticleTrajectories.length === 0) {
    generateParticleTrajectories();
  }
  if (!g_state || !g_state.sim) return;
  const sim = g_state.sim;
  const count = PARTICLE_COUNT;
  const idealContainer = document.getElementById("ideal-particles");
  const realContainer = document.getElementById("real-particles");

  sim.particles = {
    ideal: INITIAL_IDEAL_PARTICLES.map((p) => ({ ...p })),
    real: INITIAL_REAL_PARTICLES.map((p) => ({ ...p, wobblePhase: 0 })),
  };

  if (idealContainer) {
    if (idealContainer.children.length !== count) {
      idealContainer.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const circle = SVGLib.createTag("circle", {
          id: `ideal-p-${i}`,
          cx: sim.particles.ideal[i].x,
          cy: sim.particles.ideal[i].y,
          r: 3.8,
          fill: "url(#radial-gradient-b)",
        });
        idealContainer.appendChild(circle);
      }
    } else {
      for (let i = 0; i < count; i++) {
        const el = document.getElementById(`ideal-p-${i}`);
        if (el) {
          $(el).attr({
            cx: sim.particles.ideal[i].x,
            cy: sim.particles.ideal[i].y,
          });
        }
      }
    }
  }

  if (realContainer) {
    if (realContainer.children.length !== count) {
      realContainer.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const circle = SVGLib.createTag("circle", {
          id: `real-p-${i}`,
          cx: sim.particles.real[i].x,
          cy: sim.particles.real[i].y,
          r: 3.8,
          fill: "url(#radial-gradient-b)",
        });
        realContainer.appendChild(circle);
      }
    } else {
      for (let i = 0; i < count; i++) {
        const el = document.getElementById(`real-p-${i}`);
        if (el) {
          $(el).attr({
            cx: sim.particles.real[i].x,
            cy: sim.particles.real[i].y,
          });
        }
      }
    }
  }
}

// Continuous real-time particle simulation using Matter.js engine
function updateParticles(dt) {
  if (!idealMatterState || !realMatterState) {
    setupMatterSimulations();
  }
  if (!idealMatterState || !realMatterState) return;
  if (!g_state || !g_state.sim) return;

  const sim = g_state.sim;
  const t = sim.progress;
  const Engine = Matter.Engine, Body = Matter.Body;
  const r = 3.8;

  // 1. Ideal Gas
  const idealLeft = 273;
  const idealRight = 448;
  const idealBottom = 272;
  const idealPistonY = getIdealPistonY(t);
  const idealTopY = 115 + idealPistonY;
  Body.setPosition(idealMatterState.pistonWall, {
    x: idealMatterState.midX,
    y: idealTopY - idealMatterState.wallT / 2,
  });

  Engine.update(idealMatterState.engine, (dt || 1 / 60) * 1000);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const ball = idealMatterState.balls[i];
    if (isNaN(ball.position.x) || isNaN(ball.position.y)) {
      ball.position.x = INITIAL_IDEAL_PARTICLES[i].x;
      ball.position.y = INITIAL_IDEAL_PARTICLES[i].y;
      ball.velocity.x = INITIAL_IDEAL_PARTICLES[i].vx;
      ball.velocity.y = INITIAL_IDEAL_PARTICLES[i].vy;
    }
    if (ball.position.x < idealLeft + r) { ball.position.x = idealLeft + r; ball.velocity.x = Math.abs(ball.velocity.x); }
    if (ball.position.x > idealRight - r) { ball.position.x = idealRight - r; ball.velocity.x = -Math.abs(ball.velocity.x); }
    if (ball.position.y < idealTopY + r) { ball.position.y = idealTopY + r; ball.velocity.y = Math.abs(ball.velocity.y); }
    if (ball.position.y > idealBottom - r) { ball.position.y = idealBottom - r; ball.velocity.y = -Math.abs(ball.velocity.y); }

    const curSpeed = Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y);
    if (curSpeed > 0.001) {
      const factor = GAS_SPEED / curSpeed;
      ball.velocity.x *= factor;
      ball.velocity.y *= factor;
    } else {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      ball.velocity.x = Math.cos(angle) * GAS_SPEED;
      ball.velocity.y = Math.sin(angle) * GAS_SPEED;
    }

    const el = document.getElementById(`ideal-p-${i}`);
    if (el && !isNaN(ball.position.x) && !isNaN(ball.position.y)) {
      $(el).attr({
        cx: _.round(ball.position.x, 1),
        cy: _.round(ball.position.y, 1),
      });
    }
  }

  // 2. Real Gas
  const realLeft = 773;
  const realRight = 947;
  const realBottom = 273;
  const realPistonY = getRealPistonY(t);
  const realTopY = 115 + realPistonY;
  Body.setPosition(realMatterState.pistonWall, {
    x: realMatterState.midX,
    y: realTopY - realMatterState.wallT / 2,
  });

  const u = Math.max(0, t - 1.0);
  const condenseRatio = Math.min(1.0, u / 0.72);
  const targetCondensedCount = t > 1.0 ? Math.min(PARTICLE_COUNT, Math.round(condenseRatio * PARTICLE_COUNT)) : 0;
  let liquidTopY = 273;
  let liquidHalfW = 10;
  if (u > 0) {
    if (u <= 0.5) {
      const p = u / 0.5;
      liquidHalfW = (15 + (180 - 15) * p) / 2;
      liquidTopY = 273 - (273 - 251) * p;
    } else {
      liquidHalfW = 90;
      liquidTopY = 251;
    }
  }

  // Fixed bottom at 273, prevents pushing particles upward
  // Đáy bình cố định ở 273, không nâng đẩy hạt lên
  Body.setPosition(realMatterState.bottomWall, {
    x: realMatterState.midX,
    y: 273 + realMatterState.wallT / 2,
  });

  if (!realMatterState.condensedAssignments) {
    realMatterState.condensedAssignments = [];
  }
  const assignments = realMatterState.condensedAssignments;

  // When increasing condensed particles: pick free particle closest to that bottom slot
  // Khi tăng số hạt ngưng tụ: chọn hạt tự do gần vị trí đáy đó nhất
  while (assignments.length < targetCondensedCount) {
    const slotIdx = SLOT_FILL_ORDER[assignments.length];
    const slotPos = ANCHOR_SLOTS[slotIdx];
    let bestIdx = -1;
    let bestDist = Infinity;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (assignments.some((a) => a.particleIdx === i)) continue;
      const b = realMatterState.balls[i];
      const dx = slotPos.x - b.position.x;
      const dy = slotPos.y - b.position.y;
      const d = Math.hypot(dx, dy);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    if (bestIdx !== -1) {
      assignments.push({
        particleIdx: bestIdx,
        slotIdx: slotIdx,
        targetX: slotPos.x,
        targetY: slotPos.y,
      });
      realMatterState.balls[bestIdx].isSensor = true;
    } else {
      break;
    }
  }

  // When decreasing condensed particles (depressurizing): release closest condensed particle back to gas phase
  // Khi giảm số hạt ngưng tụ (xả áp lùi): nhả hạt ngưng tụ gần nhất về trạng thái khí
  while (assignments.length > targetCondensedCount) {
    const released = assignments.pop();
    const ball = realMatterState.balls[released.particleIdx];
    if (ball) {
      ball.isSensor = false;
      const angle = -Math.PI * (0.25 + Math.random() * 0.5);
      Body.setVelocity(ball, { x: Math.cos(angle) * GAS_SPEED, y: Math.sin(angle) * GAS_SPEED });
    }
  }

  // Ensure isSensor state is synced: condensed particles are sensors (not pushed by bottomWall)
  // Đảm bảo trạng thái isSensor đồng bộ: hạt ngưng tụ là sensor (không bị bottomWall đẩy văng lên mặt nước)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const isCondensed = assignments.some((a) => a.particleIdx === i);
    realMatterState.balls[i].isSensor = isCondensed;
  }

  Engine.update(realMatterState.engine, (dt || 1 / 60) * 1000);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const ball = realMatterState.balls[i];
    if (isNaN(ball.position.x) || isNaN(ball.position.y)) {
      ball.position.x = INITIAL_REAL_PARTICLES[i].x;
      ball.position.y = INITIAL_REAL_PARTICLES[i].y;
      ball.velocity.x = INITIAL_REAL_PARTICLES[i].vx;
      ball.velocity.y = INITIAL_REAL_PARTICLES[i].vy;
    }
    const assignment = assignments.find((a) => a.particleIdx === i);

    if (assignment) {
      const targetX = assignment.targetX;
      const targetY = assignment.targetY;
      const dx = targetX - ball.position.x;
      const dy = targetY - ball.position.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 0.8 && t < 1.999) {
        // Move smoothly and gently towards target slot
        // Di chuyển chậm rãi êm ái về vị trí slot
        const speed = Math.min(dist, Math.max(30 * dt, dist * 3.0 * dt));
        ball.wobblePhase = (ball.wobblePhase || 0) + dt * 2.0;
        const driftX = Math.sin(ball.wobblePhase * 1.5 + assignment.slotIdx) * 0.25;
        const driftY = Math.cos(ball.wobblePhase * 1.5 + assignment.slotIdx) * 0.12;
        ball.position.x += (dx / dist) * speed + driftX;
        ball.position.y += (dy / dist) * speed + driftY;
        Body.setVelocity(ball, { x: 0, y: 0 });
      } else {
        // In liquid: distinct thermal Brownian motion / micro-oscillation
        // Trong nước: chuyển động chậm nhẹ nhàng (Brownian motion)
        ball.wobblePhase = (ball.wobblePhase || 0) + dt * 2.5;
        const wx = Math.sin(ball.wobblePhase + assignment.slotIdx * 1.618) * 0.6;
        const wy = Math.cos(ball.wobblePhase + assignment.slotIdx * 1.618) * 0.3;
        ball.position.x = targetX + wx;
        ball.position.y = targetY + wy;
        Body.setVelocity(ball, { x: 0, y: 0 });
      }

      const el = document.getElementById(`real-p-${i}`);
      if (el && !isNaN(ball.position.x) && !isNaN(ball.position.y)) {
        $(el).attr({
          cx: _.round(ball.position.x, 2),
          cy: _.round(ball.position.y, 2),
        });
      }
    } else {
      const vaporTop = realTopY;
      const vaporBottom = 273; // Fixed bottom at 273 / Đáy cố định 273

      if (ball.position.x < realLeft + r) { ball.position.x = realLeft + r; ball.velocity.x = Math.abs(ball.velocity.x); }
      if (ball.position.x > realRight - r) { ball.position.x = realRight - r; ball.velocity.x = -Math.abs(ball.velocity.x); }
      if (ball.position.y < vaporTop + r) { ball.position.y = vaporTop + r; ball.velocity.y = Math.abs(ball.velocity.y); }
      if (ball.position.y > vaporBottom - r) { ball.position.y = vaporBottom - r; ball.velocity.y = -Math.abs(ball.velocity.y); }

      const curSpeed = Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y);
      if (curSpeed > 0.001) {
        const factor = GAS_SPEED / curSpeed;
        ball.velocity.x *= factor;
        ball.velocity.y *= factor;
      } else {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
        ball.velocity.x = Math.cos(angle) * GAS_SPEED;
        ball.velocity.y = Math.sin(angle) * GAS_SPEED;
      }

      const el = document.getElementById(`real-p-${i}`);
      if (el && !isNaN(ball.position.x) && !isNaN(ball.position.y)) {
        $(el).attr({
          cx: _.round(ball.position.x, 2),
          cy: _.round(ball.position.y, 2),
        });
      }
    }
  }
}

// Get SVG path d string for Ideal curve at progress t
function getIdealPath(t) {
  if (t <= 0.001) {
    return "";
  }
  const pt = getIdealPoint(t);
  let d = `M 482,409`;
  for (let i = 1; i <= pt.idx; i++) {
    d += ` L ${IDEAL_CURVE_DATA[i].x},${IDEAL_CURVE_DATA[i].y}`;
  }
  if (pt.frac > 0.001) {
    d += ` L ${_.round(pt.x, 2)},${_.round(pt.y, 2)}`;
  }
  return d;
}

// Get SVG path d string for Real curve Phase 1 at progress t
function getRealCurveABPath(t) {
  if (t <= 0.001) {
    return "";
  }
  if (t >= 1.0) {
    let d = `M 982,409`;
    for (let i = 1; i <= 46; i++) {
      d += ` L ${_.round(IDEAL_CURVE_DATA[i].x + 500, 2)},${IDEAL_CURVE_DATA[i].y}`;
    }
    return d;
  }
  const pt = getRealPoint(t);
  let d = `M 982,409`;
  for (let i = 1; i <= pt.idx; i++) {
    d += ` L ${_.round(IDEAL_CURVE_DATA[i].x + 500, 2)},${IDEAL_CURVE_DATA[i].y}`;
  }
  if (pt.frac > 0.001) {
    d += ` L ${_.round(pt.x, 2)},${_.round(pt.y, 2)}`;
  }
  return d;
}

// Dynamically generate the SVG path for the Real Gas Liquid layer as a function of condensation progress u (0.0 -> 1.0)
// Uses the same smooth two-phase Bezier curve algorithm as getWaterPath in CONTENT_03
function getRealLiquidPath(u) {
  if (u <= 0) return "";
  u = Math.max(0, Math.min(1.0, u));
  const width = 180;
  const offsetX = 770;
  const bottomY = 273;
  const peakY = 251;
  const touchThreshold = 0.5;
  const minWidth = 15;
  let xLeft, xRight, cornerY, cpOffset;

  if (u <= touchThreshold) {
    const p = u / touchThreshold;
    const currentWidth = minWidth + (width - minWidth) * p;
    xLeft = (width - currentWidth) / 2;
    xRight = width - xLeft;
    cornerY = bottomY;
    cpOffset = currentWidth * 0.25;
  } else {
    const p = (u - touchThreshold) / (1 - touchThreshold);
    xLeft = 0;
    xRight = width;
    cornerY = bottomY - ((bottomY - peakY) * p);
    cpOffset = (width * 0.25) * (1 - p);
  }
  const controlY = (peakY - 0.25 * cornerY) / 0.75;
  const X1 = offsetX + xLeft;
  const X2 = offsetX + xLeft + cpOffset;
  const X3 = offsetX + xRight - cpOffset;
  const X4 = offsetX + xRight;
  return `M ${_.round(X1, 2)},${bottomY} L ${_.round(X1, 2)},${_.round(cornerY, 2)} C ${_.round(X2, 2)},${_.round(controlY, 2)} ${_.round(X3, 2)},${_.round(controlY, 2)} ${_.round(X4, 2)},${_.round(cornerY, 2)} L ${_.round(X4, 2)},${bottomY} Z`;
}

// Gas color gradient stops corresponding to compression depth (every 24 px as specified in design specs)
const GAS_COLOR_STOPS = [
  { y: 0, r: 220, g: 240, b: 251 }, // 0 px:  #dcf0fb (Initial uncompressed state)
  { y: 24, r: 225, g: 241, b: 250 }, // 24 px: #e1f1fa (Step 1)
  { y: 48, r: 200, g: 232, b: 248 }, // 48 px: #c8e8f8 (Step 2)
  { y: 72, r: 160, g: 217, b: 243 }, // 72 px: #a0d9f3 (Step 3)
  { y: 96, r: 106, g: 196, b: 237 }, // 96 px: #6ac4ed (Step 4)
  { y: 120, r: 65, g: 181, b: 233 }, // 120 px:#41b5e9 (Step 5, Point B region)
  { y: 144, r: 2, g: 132, b: 199 }, // 144 px:#0284c7 (Step 6, Max compression)
];

function getGasColor(pistonY) {
  pistonY = Math.max(0, pistonY);
  if (pistonY <= GAS_COLOR_STOPS[0].y) {
    const s = GAS_COLOR_STOPS[0];
    return `rgb(${s.r}, ${s.g}, ${s.b})`;
  }
  const lastStop = GAS_COLOR_STOPS[GAS_COLOR_STOPS.length - 1];
  if (pistonY >= lastStop.y) {
    return `rgb(${lastStop.r}, ${lastStop.g}, ${lastStop.b})`;
  }

  for (let i = 0; i < GAS_COLOR_STOPS.length - 1; i++) {
    const s0 = GAS_COLOR_STOPS[i];
    const s1 = GAS_COLOR_STOPS[i + 1];
    if (pistonY >= s0.y && pistonY <= s1.y) {
      const frac = (pistonY - s0.y) / (s1.y - s0.y);
      const r = Math.round(s0.r + frac * (s1.r - s0.r));
      const g = Math.round(s0.g + frac * (s1.g - s0.g));
      const b = Math.round(s0.b + frac * (s1.b - s0.b));
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
  return `rgb(${lastStop.r}, ${lastStop.g}, ${lastStop.b})`;
}

// Line C Drawing Animation Helpers
function startLineCAnimation() {
  if (!g_state || !g_state.sim || !g_state.sim.lineCAnim) return;
  const anim = g_state.sim.lineCAnim;
  if (anim.hasDrawn || anim.isAnimating) return;
  anim.isAnimating = true;
  anim.startTime = performance.now();
  anim.hasDrawn = true;
  $("#real-line-c").attr("y2", "254");
}

function resetLineCAnimation() {
  if (!g_state || !g_state.sim || !g_state.sim.lineCAnim) return;
  const anim = g_state.sim.lineCAnim;
  anim.isAnimating = false;
  anim.hasDrawn = false;
  $("#real-line-c").attr("y2", "254");
}

function updateLineCAnimation(now) {
  if (!g_state || !g_state.sim || !g_state.sim.lineCAnim) return;
  const anim = g_state.sim.lineCAnim;
  if (!anim.isAnimating) return;
  const elapsed = now - anim.startTime;
  const p = Math.min(1.0, elapsed / anim.duration);
  // Ease out cubic
  const ease = 1 - Math.pow(1 - p, 3);
  const curY = 254 - ease * (254 - 114);
  $("#real-line-c").attr("y2", _.round(curY, 2));
  if (p >= 1.0) {
    anim.isAnimating = false;
    $("#real-line-c").attr("y2", "114");
  }
}

// List of all dynamic SVG annotation groups
const ALL_ANNOTATION_GROUPS = [
  "#ideal-guide-curve",
  "#real-guide-curve-ab",
  "#real-vapor-group",
  "#ideal-tracking-lines",
  "#real-tracking-lines",
  "#ideal-point-a",
  "#ideal-point-b",
  "#ideal-bubble-b",
  "#ideal-formula",
  "#ideal-range-gas",
  "#end-point-ideal",
  "#real-point-a",
  "#real-point-b-black",
  "#real-point-b-white",
  "#real-point-c",
  "#real-line-c-group",
  "#real-bubble-b",
  "#real-bubble-b-text-compress",
  "#real-bubble-b-text-evaporate",
  "#real-bubble-condense",
  "#real-bubble-c",
  "#real-formula",
  "#real-ranges",
  "#real-range-gas",
  "#real-range-mixed"
];

// Utility for showing/hiding elements with optional fade effect (500ms)
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

// Synchronize live Matter engine balls from deterministic trajectory snapshot at progress t
function syncMatterStateToTrajectories(t) {
  if (!idealMatterState || !realMatterState || !masterParticleTrajectories || masterParticleTrajectories.length === 0) return;
  const fIdx = Math.max(
    0,
    Math.min(TOTAL_PARTICLE_FRAMES - 1, Math.round((t / 2.0) * (TOTAL_PARTICLE_FRAMES - 1)))
  );
  const frame = masterParticleTrajectories[fIdx];
  if (!frame) return;

  if (frame.ideal) {
    frame.ideal.forEach((pos, idx) => {
      const ball = idealMatterState.balls[idx];
      if (ball && typeof pos.x === "number" && !isNaN(pos.x)) {
        ball.position.x = pos.x;
        ball.position.y = pos.y;
        ball.previousPosition.x = pos.x;
        ball.previousPosition.y = pos.y;
        const curSpeed = Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y);
        if (curSpeed < 0.1) {
          const init = INITIAL_IDEAL_PARTICLES[idx];
          ball.velocity.x = init.vx;
          ball.velocity.y = init.vy;
        }
      }
    });
  }

  if (frame.real) {
    const u = Math.max(0, t - 1.0);
    const condenseRatio = Math.min(1.0, u / 0.72);
    const targetCondensedCount = t > 1.0 ? Math.min(PARTICLE_COUNT, Math.round(condenseRatio * PARTICLE_COUNT)) : 0;
    realMatterState.condensedAssignments = [];
    for (let c = 0; c < targetCondensedCount; c++) {
      const slotIdx = SLOT_FILL_ORDER[c];
      const slotPos = ANCHOR_SLOTS[slotIdx];
      let bestIdx = -1;
      let bestDist = Infinity;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        if (realMatterState.condensedAssignments.some((a) => a.particleIdx === i)) continue;
        const pos = frame.real[i];
        if (pos && typeof pos.x === "number") {
          const d = Math.hypot(slotPos.x - pos.x, slotPos.y - pos.y);
          if (d < bestDist) {
            bestDist = d;
            bestIdx = i;
          }
        }
      }
      if (bestIdx !== -1) {
        realMatterState.condensedAssignments.push({
          particleIdx: bestIdx,
          slotIdx: slotIdx,
          targetX: slotPos.x,
          targetY: slotPos.y,
        });
      }
    }

    frame.real.forEach((pos, idx) => {
      const ball = realMatterState.balls[idx];
      if (ball && typeof pos.x === "number" && !isNaN(pos.x)) {
        ball.position.x = pos.x;
        ball.position.y = pos.y;
        ball.previousPosition.x = pos.x;
        ball.previousPosition.y = pos.y;
        const isCondensed = realMatterState.condensedAssignments.some((a) => a.particleIdx === idx);
        ball.isSensor = isCondensed;
        const curSpeed = Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y);
        if (curSpeed < 0.1) {
          const init = INITIAL_REAL_PARTICLES[idx];
          ball.velocity.x = init.vx;
          ball.velocity.y = init.vy;
        }
      }
    });
  }
}

// Render simulation state at progress t
function renderSimulation(t) {
  if (!g_state || !g_state.sim) return;
  t = Math.max(0.0, Math.min(2.0, t));
  g_state.sim.progress = t;

  // 0. Update particles from deterministic trajectories only when in step mode
  if (g_state.sim.isStepMode && masterParticleTrajectories && masterParticleTrajectories.length > 0) {
    const fIdx = Math.max(
      0,
      Math.min(TOTAL_PARTICLE_FRAMES - 1, Math.round((t / 2.0) * (TOTAL_PARTICLE_FRAMES - 1)))
    );
    const frame = masterParticleTrajectories[fIdx];
    if (frame) {
      if (frame.ideal) {
        frame.ideal.forEach((pos, idx) => {
          const el = document.getElementById(`ideal-p-${idx}`);
          if (el && typeof pos.x === "number" && !isNaN(pos.x) && typeof pos.y === "number" && !isNaN(pos.y)) {
            $(el).attr({
              cx: pos.x,
              cy: pos.y,
            });
          }
          if (g_state.sim.particles && g_state.sim.particles.ideal && g_state.sim.particles.ideal[idx]) {
            if (typeof pos.x === "number" && !isNaN(pos.x)) g_state.sim.particles.ideal[idx].x = pos.x;
            if (typeof pos.y === "number" && !isNaN(pos.y)) g_state.sim.particles.ideal[idx].y = pos.y;
          }
        });
      }
      if (frame.real) {
        frame.real.forEach((pos, idx) => {
          const el = document.getElementById(`real-p-${idx}`);
          if (el && typeof pos.x === "number" && !isNaN(pos.x) && typeof pos.y === "number" && !isNaN(pos.y)) {
            $(el).attr({
              cx: pos.x,
              cy: pos.y,
            });
          }
          if (g_state.sim.particles && g_state.sim.particles.real && g_state.sim.particles.real[idx]) {
            if (typeof pos.x === "number" && !isNaN(pos.x)) g_state.sim.particles.real[idx].x = pos.x;
            if (typeof pos.y === "number" && !isNaN(pos.y)) g_state.sim.particles.real[idx].y = pos.y;
          }
        });
      }
    }
    syncMatterStateToTrajectories(t);
  }

  // 1. Ideal Gas Calculations
  const curIdealPt = getIdealPoint(t);
  const idealPistonY = getIdealPistonY(t);
  let idealNeedleAngle;
  if (t <= 1.0) {
    idealNeedleAngle = ((409.0 - curIdealPt.y) / (409.0 - 254.0)) * 67.5;
  } else {
    idealNeedleAngle = 67.5 + ((254.0 - curIdealPt.y) / (254.0 - 154.0)) * (135.0 - 67.5);
  }

  // Update Ideal Piston & Pressure Gauge
  $("#ideal-piston").attr("transform", `translate(0, ${_.round(idealPistonY, 2)})`);
  $("#ideal-needle-group").attr("transform", `rotate(${_.round(idealNeedleAngle, 2)}, 405, 66.5)`);

  // Update Ideal Gas Fill Path & Color Density
  const idealGasTop = 115 + idealPistonY;
  const idealStraightH = Math.max(0, 263 - idealGasTop);
  const idealGasPath = `M 450,${_.round(idealGasTop, 2)} v ${_.round(idealStraightH, 2)} c 0,6.6 -5.4,12 -12,12 h -156 c -6.6,0 -12,-5.4 -12,-12 V ${_.round(idealGasTop, 2)} Z`;
  const idealColor = getGasColor(idealPistonY);
  $("#ideal-gas-rect")
    .attr("d", idealGasPath)
    .attr("fill", idealColor)
    .css("fill", idealColor)
    .attr("opacity", 1);

  // Update Ideal Active Curve
  $("#ideal-active-curve").attr("d", getIdealPath(t));

  // Current Ideal Graph Tracking Point
  $("#ideal-line-p")
    .attr("x1", 72)
    .attr("y1", _.round(curIdealPt.y, 2))
    .attr("x2", _.round(curIdealPt.x, 2))
    .attr("y2", _.round(curIdealPt.y, 2));
  $("#ideal-dot-p")
    .attr("cx", 72)
    .attr("cy", _.round(curIdealPt.y, 2));

  // 2. Real Gas Calculations
  const curRealPt = getRealPoint(t);
  const realPistonY = getRealPistonY(t);
  let realNeedleAngle;
  if (t <= 1.0) {
    realNeedleAngle = ((409.0 - curRealPt.y) / (409.0 - 254.0)) * 67.5;
  } else {
    realNeedleAngle = 67.5; // Pressure remains CONSTANT at saturated vapor pressure!
  }

  // Update Real Piston & Pressure Gauge
  $("#real-piston").attr("transform", `translate(0, ${_.round(realPistonY, 2)})`);
  $("#real-needle-group").attr("transform", `rotate(${_.round(realNeedleAngle, 2)}, 905, 66.5)`);

  // Update Real Liquid Layer at bottom
  const sim = g_state.sim;
  if (t <= 1.0) {
    if (sim.isLiquidVisible) {
      sim.isLiquidVisible = false;
      showElement("#real-liquid-group", false, "fadeout");
    }
    $("#real-liqid-path").attr("d", "");
  } else {
    const u = Math.min(1.0, Math.max(0.0, (648.38 - curRealPt.x) / (648.38 - 598.38)));
    const liquidPath = getRealLiquidPath(u);
    $("#real-liqid-path").attr("d", liquidPath);
    if (!sim.isLiquidVisible) {
      sim.isLiquidVisible = true;
      showElement("#real-liquid-group", true, "fadein");
    }
    $("#real-liquid-group").removeAttr("transform");
  }

  // Update Real Gas Fill Path & Color Density
  const realGasTop = 115 + realPistonY;
  const realStraightH = Math.max(0, 263 - realGasTop);
  const realGasPath = `M 950,${_.round(realGasTop, 2)} v ${_.round(realStraightH, 2)} c 0,6.6 -5.4,12 -12,12 h -156 c -6.6,0 -12,-5.4 -12,-12 V ${_.round(realGasTop, 2)} Z`;
  const realColor = getGasColor(Math.min(60, realPistonY));
  $("#real-gas-rect")
    .attr("d", realGasPath)
    .attr("fill", realColor)
    .css("fill", realColor)
    .attr("opacity", 1);

  // Update Real Curves
  $("#real-active-curve-ab").attr("d", getRealCurveABPath(t));
  if (t <= 1.0) {
    $("#real-active-line-bc")
      .attr({
        x1: 648.38,
        x2: 648.38,
        y1: 254,
        y2: 254,
        opacity: 0,
      })
      .css("opacity", 0)
      .css("visibility", "hidden");
  } else {
    $("#real-active-line-bc")
      .attr({
        x1: 648.38,
        x2: _.round(curRealPt.x, 2),
        y1: 254,
        y2: 254,
        opacity: 1,
      })
      .css("opacity", 1)
      .css("visibility", "visible");
  }

  // Current Real Graph Tracking Point
  $("#real-line-p")
    .attr("x1", 572)
    .attr("y1", _.round(curRealPt.y, 2))
    .attr("x2", _.round(curRealPt.x, 2))
    .attr("y2", _.round(curRealPt.y, 2));
  $("#real-dot-p")
    .attr("cx", 572)
    .attr("cy", _.round(curRealPt.y, 2));

  // 3. Update Annotations & Visibility
  updateAnnotationVisibility(t);

  // 4. Update Button Controls
  renderControls();

  // Real-time logging of needle angle, graph coordinates, and piston position during simulation run (throttled to 300ms during playback, or immediate on Step/Checkpoint)
  // Log góc kim, đồ thị và piston theo thời gian chạy (định kỳ mỗi 300ms khi Play, hoặc ngay lập tức khi Step/Checkpoint)
  const now = typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  const isCheckpoint = (t === 0.0 || t === 1.0 || t === 2.0);
  const timeSinceLastLog = now - (sim.lastLogTimestamp || 0);

  if (g_state.c_is_show_log || sim.isStepMode || isCheckpoint || (sim.isPlaying && !sim.isPaused && timeSinceLastLog >= 300)) {
    sim.lastLogTimestamp = now;

    // Checkpoint Banner for Testers
    if (isCheckpoint && (!sim.lastLoggedCheckpoint || sim.lastLoggedCheckpoint !== t)) {
      sim.lastLoggedCheckpoint = t;
      const cpName = t === 0.0 ? "ĐIỂM A (t = 0.0) - Trạng thái ban đầu" : (t === 1.0 ? "ĐIỂM B (t = 1.0) - Bắt đầu ngưng tụ" : "ĐIỂM C (t = 2.0) - Nén tối đa");
      console.log(`%c[KIỂM CHỨNG ĐỒ THỊ] >>> ${cpName} <<<`, "background: #005bac; color: #fff; padding: 3px 8px; border-radius: 3px; font-weight: bold;");
    } else if (!isCheckpoint) {
      sim.lastLoggedCheckpoint = null;
    }

    console.table({
      "Khí lý tưởng (Ideal)": {
        "Tiến độ (t)": _.round(t, 2),
        "Đồ thị X (Trục V)": _.round(curIdealPt.x, 1),
        "Piston Y (Nén px)": `${_.round(idealPistonY, 1)} px`,
        "Khoang khí (Cao)": `${_.round(273 - idealGasTop, 1)} px`,
        "Đồ thị Y (Trục p)": _.round(curIdealPt.y, 1),
        "Góc kim (Áp suất)": `${_.round(idealNeedleAngle, 1)}°`,
        "Trạng thái": t <= 1.0 ? "Khí đẳng nhiệt A->B" : "Khí nén tiếp B->C"
      },
      "Khí thực (Real)": {
        "Tiến độ (t)": _.round(t, 2),
        "Đồ thị X (Trục V)": _.round(curRealPt.x, 1),
        "Piston Y (Nén px)": `${_.round(realPistonY, 1)} px`,
        "Khoang khí (Cao)": `${_.round(273 - realGasTop, 1)} px`,
        "Đồ thị Y (Trục p)": _.round(curRealPt.y, 1),
        "Góc kim (Áp suất)": `${_.round(realNeedleAngle, 1)}°`,
        "Trạng thái": t <= 1.0 ? "Khí đẳng nhiệt A->B" : `Ngưng tụ hơi bão hòa (${_.round(t - 1.0, 2)*100}% C)`
      }
    });
  }
}

// Annotation visibility state machine with smooth 500ms fadein / fadeout transitions
// Quản lý hiển thị các chú thích / đồ thị / bong bóng thoại (Annotation Visibility State Machine) với hiệu ứng fade in / fade out (500ms)
function updateAnnotationVisibility(t, forceInstant = false) {
  if (!g_state || !g_state.sim) return;
  const sim = g_state.sim;

  // 1. Determine target phase based on progress t and direction
  // 1. Xác định giai đoạn (Phase) mục tiêu dựa vào tiến độ t và hướng chuyển động (direction)
  let targetPhase = "";
  if (t <= 0.001 && !sim.hasStarted && !sim.hasDecompressedToA) {
    // Initial state before pressing Play and before decompressing back to Point A
    // Trạng thái ban đầu khi chưa nhấn Play và chưa từng xả áp về A
    targetPhase = "INITIAL";
  } else if (t <= 0.001) {
    // At Point A checkpoint (t = 0.0) after having run or decompressed back
    // Đang ở mốc Điểm A (t = 0.0) sau khi đã chạy/xả áp về
    targetPhase = sim.hasDecompressedToA ? "A_DECOMPRESSED" : "MOVING_1";
  } else if (t < 0.999) {
    // Moving between Point A and Point B (0.0 < t < 1.0)
    // Đang chuyển động giữa Điểm A và Điểm B (0.0 < t < 1.0)
    targetPhase = "MOVING_1";
  } else if (t <= 1.001) {
    // At Point B checkpoint (t = 1.0): distinguish between Compressing and Decompressing/Evaporating
    // Đạt mốc Điểm B (t = 1.0): phân biệt đang Nén (Compress) hay đang Xả áp/Bay hơi (Evaporate)
    targetPhase = sim.direction === -1 ? "B_EVAPORATE" : "B_COMPRESS";
  } else if (t < 1.999) {
    // Moving between Point B and Point C (1.0 < t < 2.0): distinguish between Condensing and Evaporating
    // Đang chuyển động giữa Điểm B và Điểm C (1.0 < t < 2.0): phân biệt Nén hóa lỏng hay Xả áp bay hơi
    targetPhase = sim.direction === 1 ? "MOVING_2_COMPRESS" : "MOVING_2_DECOMPRESS";
  } else {
    // Reached maximum compression at Point C (t = 2.0)
    // Đạt mốc nén tối đa tại Điểm C (t = 2.0)
    targetPhase = "C";
  }

  // 2. Only trigger visibility transitions when phase changes or when forced (forceInstant)
  // 2. Chỉ thực hiện chuyển đổi hiển thị khi giai đoạn thay đổi hoặc khi bị ép buộc (forceInstant)
  if (targetPhase !== sim.lastVisibilityPhase || forceInstant) {
    const isFirstRun = typeof sim.lastVisibilityPhase === "undefined" || sim.lastVisibilityPhase === "";
    sim.lastVisibilityPhase = targetPhase;

    let visibleSelectors = [];
    switch (targetPhase) {
      // Phase 0: Initial state before start (Hide all annotations, keep static frame only)
      // Giai đoạn 0: Ban đầu trước khi chạy (Ẩn toàn bộ chú thích, chỉ giữ khung tĩnh)
      case "INITIAL":
        visibleSelectors = [];
        break;

      // Phase 1A: Decompressed back to Point A (Show Point A, B markers and Point B bubble)
      // Giai đoạn 1A: Đã xả áp quay lại điểm A (Hiển thị mốc A, B và bong bóng điểm B)
      case "A_DECOMPRESSED":
        visibleSelectors = [
          "#ideal-guide-curve",
          "#real-guide-curve-ab",
          "#real-vapor-group",
          "#ideal-point-a",
          "#ideal-point-b",
          "#ideal-bubble-b",
          "#real-point-a",
          "#real-point-b-black",
          "#real-bubble-b",
          "#real-bubble-b-text-compress"
        ];
        break;

      // Phase 1B: Moving between A and B (Show only dynamic tracking lines, hide static text/bubbles)
      // Giai đoạn 1B: Đang di chuyển giữa A và B (Chỉ hiện đường dóng tracking lines động, ẩn chữ/bong bóng tĩnh)
      case "MOVING_1":
        visibleSelectors = [
          "#ideal-guide-curve",
          "#real-guide-curve-ab",
          "#real-vapor-group",
          "#ideal-tracking-lines",
          "#real-tracking-lines"
        ];
        break;

      // Phase 2A: Reached Point B while COMPRESSING (Condensation begins)
      // -> Show formulas, gas range, Point A/B markers, and Point B bubble with "condensation starts" text
      // Giai đoạn 2A: Đạt mốc Điểm B khi đang NÉN (Bắt đầu ngưng tụ hóa lỏng)
      // -> Hiện công thức, vùng khí (gas range), mốc A, B và bong bóng điểm B nội dung "bắt đầu hóa lỏng"
      case "B_COMPRESS":
        visibleSelectors = [
          "#ideal-guide-curve",
          "#real-guide-curve-ab",
          "#real-vapor-group",
          "#ideal-point-a",
          "#ideal-point-b",
          "#ideal-bubble-b",
          "#ideal-formula",
          "#ideal-range-gas",
          "#real-point-a",
          "#real-point-b-black",
          "#real-formula",
          "#real-ranges",
          "#real-range-gas",
          "#real-bubble-b",
          "#real-bubble-b-text-compress"
        ];
        break;

      // Phase 2B: Reached Point B while DECOMPRESSING (Liquid has completely evaporated back to gas)
      // -> Same as B_COMPRESS but switch Point B bubble to "evaporated completely" text
      // Giai đoạn 2B: Đạt mốc Điểm B khi đang XẢ ÁP LÙI (Vừa bay hơi hoàn toàn trở lại thành khí)
      // -> Tương tự B_COMPRESS nhưng đổi bong bóng điểm B sang nội dung "bay hơi hết"
      case "B_EVAPORATE":
        visibleSelectors = [
          "#ideal-guide-curve",
          "#real-guide-curve-ab",
          "#real-vapor-group",
          "#ideal-point-a",
          "#ideal-point-b",
          "#ideal-bubble-b",
          "#ideal-formula",
          "#ideal-range-gas",
          "#real-point-a",
          "#real-point-b-black",
          "#real-formula",
          "#real-ranges",
          "#real-range-gas",
          "#real-bubble-b",
          "#real-bubble-b-text-evaporate"
        ];
        break;

      // Phase 3A: Compressing from B to C (Real gas gradually condenses into liquid)
      // -> Show dynamic tracking lines and condensation notification bubble ("凝縮開始（気液平衡）")
      // Giai đoạn 3A: Đang nén từ B sang C (Khí thực ngưng tụ dần)
      // -> Hiện đường dóng tracking và bong bóng thông báo ngưng tụ ("凝縮開始（気液平衡）")
      case "MOVING_2_COMPRESS":
        visibleSelectors = [
          "#ideal-guide-curve",
          "#real-guide-curve-ab",
          "#real-vapor-group",
          "#ideal-tracking-lines",
          "#real-tracking-lines",
          "#real-bubble-condense"
        ];
        break;

      // Phase 3B: Decompressing backwards from C to B (Liquid gradually evaporates)
      // -> Show only dynamic tracking lines, hide compression bubble
      // Giai đoạn 3B: Đang xả áp lùi từ C sang B (Chất lỏng bay hơi dần)
      // -> Chỉ hiện đường dóng tracking, ẩn bong bóng nén
      case "MOVING_2_DECOMPRESS":
        visibleSelectors = [
          "#ideal-guide-curve",
          "#real-guide-curve-ab",
          "#real-vapor-group",
          "#ideal-tracking-lines",
          "#real-tracking-lines"
        ];
        break;

      // Phase 4: Maximum compression reached at Point C (t = 2.0)
      // -> Show Point C, Point B (switched to white), gas-liquid mixed range, Point C bubble, and trigger Line C upward animation
      // Giai đoạn 4: Đạt mốc nén tối đa tại Điểm C (t = 2.0)
      // -> Hiện điểm C, điểm B (chuyển sang màu trắng), vùng hỗn hợp khí-lỏng (mixed range),
      //    bong bóng điểm C, và kích hoạt animation vẽ nét dọc Line C
      case "C":
        visibleSelectors = [
          "#ideal-guide-curve",
          "#real-guide-curve-ab",
          "#real-vapor-group",
          "#ideal-point-a",
          "#ideal-point-b",
          "#ideal-formula",
          "#ideal-range-gas",
          "#end-point-ideal",
          "#real-point-a",
          "#real-point-b-white",
          "#real-point-c",
          "#real-line-c-group",
          "#real-bubble-c",
          "#real-ranges",
          "#real-range-gas",
          "#real-range-mixed"
        ];
        break;
    }

    // 3. Apply Fade-in / Fade-out effects or instant toggle to all annotation groups
    // 3. Thực hiện áp dụng hiệu ứng Fade-in / Fade-out hoặc ẩn/hiện tức thì cho tất cả nhóm Annotation
    ALL_ANNOTATION_GROUPS.forEach((sel) => {
      const isVis = visibleSelectors.includes(sel);
      if (forceInstant || isFirstRun) {
        showElement(sel, isVis);
      } else {
        if (isVis) {
          showElement(sel, true, "fadein");
        } else {
          showElement(sel, false, "fadeout");
        }
      }
    });

    // 4. Trigger or reset Line C upward drawing animation at Point C
    // 4. Kích hoạt hoặc đặt lại hoạt ảnh vẽ đường thẳng đứng tại điểm C
    if (targetPhase === "C") {
      startLineCAnimation();
    } else {
      resetLineCAnimation();
    }
  }
}



// Render all Control objects registered in g_state.controls
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

// Main Animation & Physics Loop
function animationLoop() {
  if (!g_state || !g_state.sim) return;
  const sim = g_state.sim;
  const timestamp = typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  if (!sim.lastTimestamp) sim.lastTimestamp = timestamp;
  const dt = Math.min((timestamp - sim.lastTimestamp) / 1000, 0.05);
  sim.lastTimestamp = timestamp;

  if (sim.isPlaying && !sim.isPaused) {
    const delta = sim.direction * sim.playSpeed * dt;
    sim.progress += delta;

    // Boundary and checkpoint stops
    if (sim.direction === 1) {
      // Forward (Pressurize)
      if (sim.targetProgress === 1.0 && sim.progress >= 1.0) {
        sim.progress = 1.0;
        sim.isPlaying = false;
        console.log(`[INFO][Check] Checkpoint reached: Point B (t=1.00)`);
        renderControls();
      } else if (sim.targetProgress === 2.0 && sim.progress >= 2.0) {
        sim.progress = 2.0;
        sim.isPlaying = false;
        console.log(`[INFO][Check] Checkpoint reached: Point C (t=2.00)`);
        renderControls();
      }
    } else {
      // Backward (Depressurize)
      if (sim.targetProgress === 1.0 && sim.progress <= 1.0) {
        sim.progress = 1.0;
        sim.isPlaying = false;
        console.log(`[INFO][Check] Checkpoint reached: Point B (t=1.00)`);
        renderControls();
      } else if (sim.targetProgress === 0.0 && sim.progress <= 0.0) {
        sim.progress = 0.0;
        sim.isPlaying = false;
        sim.hasDecompressedToA = true;
        sim.direction = 1;
        console.log(`[INFO][Check] Checkpoint reached: Point A (t=0.00)`);
        renderControls();
      }
    }

    renderSimulation(sim.progress);
  }

  // Real-time particle physics: runs whenever started, not paused, and not in step mode (continues moving when stopped at step checkpoints)
  if (sim.hasStarted && !sim.isPaused && !sim.isStepMode) {
    updateParticles(dt);
  }

  // Update Line C upward drawing animation if active
  if (sim.lineCAnim && sim.lineCAnim.isAnimating) {
    updateLineCAnimation(timestamp);
  }
}

// Action Handlers
function startPressurize() {
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
  sim.direction = 1;
  sim.isPaused = false;
  sim.isPlaying = true;
  sim.hasStarted = true;
  sim.hasDecompressedToA = false;

  if (sim.progress < 0.999) {
    sim.targetProgress = 1.0; // Phase 1: A -> B
  } else {
    sim.targetProgress = 2.0; // Phase 2: B -> C
  }

  console.log(`[INFO][Check] Action: Pressurize, progress=${_.round(sim.progress, 2)}, targetProgress=${_.round(sim.targetProgress, 2)}`);
  renderSimulation(sim.progress);
  renderControls();
}

function startDepressurize() {
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
  sim.direction = -1;
  sim.isPaused = false;
  sim.isPlaying = true;
  sim.hasStarted = true;

  if (sim.progress > 1.001) {
    sim.targetProgress = 1.0; // Reverse Phase 2: C -> B
  } else {
    sim.targetProgress = 0.0; // Reverse Phase 1: B -> A
  }

  console.log(`[INFO][Check] Action: Depressurize, progress=${_.round(sim.progress, 2)}, targetProgress=${_.round(sim.targetProgress, 2)}`);
  renderSimulation(sim.progress);
  renderControls();
}

function togglePause() {
  if (!g_state || !g_state.sim) return;
  const sim = g_state.sim;
  g_latestMousePress = "";
  if (sim.isStepMode) {
    // Resuming from step mode
    syncMatterStateToTrajectories(sim.progress);
    sim.isStepMode = false;
    sim.isPaused = false;
    sim.isPlaying = true;
    if (sim.direction === 1) {
      sim.targetProgress = sim.progress < 0.999 ? 1.0 : 2.0;
    } else {
      sim.targetProgress = sim.progress > 1.001 ? 1.0 : 0.0;
    }
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

function stepForward() {
  if (!g_state || !g_state.sim) return;
  const sim = g_state.sim;
  sim.hasStarted = true;
  sim.isStepMode = true;
  sim.isPlaying = false;
  sim.isPaused = true;
  g_latestMousePress = "";

  if (sim.direction === -1) {
    // Depressurizing: step forward means decompressing towards Point A (progress decreases)
    if (sim.progress <= 0.001) {
      renderControls();
      return;
    }
    let nextP = sim.progress - 0.04;
    if (sim.progress > 1.0 && nextP <= 1.0) {
      nextP = 1.0;
      sim.isPlaying = false;
      sim.isPaused = true;
      sim.isStepMode = true;
    } else if (nextP <= 0.0) {
      nextP = 0.0;
      sim.isPlaying = false;
      sim.isPaused = true;
      sim.isStepMode = true;
      sim.hasDecompressedToA = true;
      sim.direction = 1;
    } else {
      sim.targetProgress = nextP > 1.0 ? 1.0 : 0.0;
    }
    console.log(`[INFO][Check] Action: StepForward, progress=${_.round(nextP, 2)}`);
    renderSimulation(nextP);
  } else {
    // Pressurizing: step forward means compressing towards Point C (progress increases)
    if (sim.progress >= 1.999) {
      renderControls();
      return;
    }
    let nextP = sim.progress + 0.04;
    if (sim.progress < 1.0 && nextP >= 1.0) {
      nextP = 1.0;
      sim.isPlaying = false;
      sim.isPaused = true;
      sim.isStepMode = true;
    } else if (nextP >= 2.0) {
      nextP = 2.0;
      sim.isPlaying = false;
      sim.isPaused = true;
      sim.isStepMode = true;
    } else {
      sim.targetProgress = nextP < 1.0 ? 1.0 : 2.0;
    }
    console.log(`[INFO][Check] Action: StepForward, progress=${_.round(nextP, 2)}`);
    renderSimulation(nextP);
  }
  renderControls();
}

function stepBack() {
  if (!g_state || !g_state.sim) return;
  const sim = g_state.sim;
  sim.hasStarted = true;
  sim.isStepMode = true;
  sim.isPlaying = false;
  sim.isPaused = true;
  g_latestMousePress = "";

  if (sim.direction === -1) {
    // Depressurizing: step back means rewinding decompression towards Point C (progress increases)
    if (sim.progress >= 1.999) {
      renderControls();
      return;
    }
    let prevP = sim.progress + 0.04;
    if (sim.progress < 1.0 && prevP >= 1.0) {
      prevP = 1.0;
      sim.isPlaying = false;
      sim.isPaused = true;
      sim.isStepMode = true;
    } else if (prevP >= 2.0) {
      prevP = 2.0;
      sim.isPlaying = false;
      sim.isPaused = true;
      sim.isStepMode = true;
    } else {
      sim.targetProgress = prevP > 1.0 ? 1.0 : 0.0;
    }
    console.log(`[INFO][Check] Action: StepBack, progress=${_.round(prevP, 2)}`);
    renderSimulation(prevP);
  } else {
    // Pressurizing: step back means rewinding compression towards Point A (progress decreases)
    if (sim.progress <= 0.001) {
      renderControls();
      return;
    }
    let prevP = sim.progress - 0.04;
    if (sim.progress > 1.0 && prevP <= 1.0) {
      prevP = 1.0;
      sim.isPlaying = false;
      sim.isPaused = true;
      sim.isStepMode = true;
    } else if (prevP <= 0.0) {
      prevP = 0.0;
      sim.isPlaying = false;
      sim.isPaused = true;
      sim.isStepMode = true;
      sim.hasDecompressedToA = true;
      sim.direction = 1;
    } else {
      sim.targetProgress = prevP < 1.0 ? 1.0 : 2.0;
    }
    console.log(`[INFO][Check] Action: StepBack, progress=${_.round(prevP, 2)}`);
    renderSimulation(prevP);
  }
  renderControls();
}

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
  resetLineCAnimation();
  ALL_ANNOTATION_GROUPS.forEach((sel) => showElement(sel, false));
  showElement("#real-liquid-group", false);
  setupMatterSimulations();
  initParticles();
  console.log("[INFO][Check] Action: Reset, progress=0.00");
  renderSimulation(0.0);
  renderControls();
}

// 3D Framework state initialization
window.initState = () => {
  g_state = {
    c_version: "2026-09-15",
    c_is_show_log: false,
    c_is_init_canvas: false,
    c_screen_width: 1024,
    c_screen_height: 648,
    sim: {
      progress: 0.0, // 0.0 (Point A) -> 1.0 (Point B) -> 2.0 (Point C)
      targetProgress: 0.0,
      isPlaying: false,
      isPaused: false,
      isStepMode: false,
      hasStarted: false,
      hasDecompressedToA: false,
      isLiquidVisible: false,
      lastVisibilityPhase: "",
      direction: 1, // +1: pressurize (compress), -1: depressurize (expand)
      playSpeed: 0.35, // progress units per second in Phase 1 (approx 2.8s)
      playSpeedPhase2: 0.70, // progress units per second in Phase 2 (approx 1.4s to match visual drawing speed)
      lastTimestamp: 0,
      particles: {
        ideal: [],
        real: [],
      },
      intervalId: null,
      lineCAnim: {
        isAnimating: false,
        startTime: 0,
        duration: 450, // ms
        hasDrawn: false,
      },
    },
    controls: {
      ctrl_btn_pressurize: new Control({
        type: "button",
        id: "btn-pressurize",
        value: "inactive",
        ignore_mouseup: true,
        event_for_active_state: true,
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
          const isAtValidCheckpoint = (t <= 0.001) || (Math.abs(t - 1.0) <= 0.001 && !sim.isPlaying);
          const isDisabled = sim.isPlaying || !isAtValidCheckpoint || t >= 1.999;
          if (isDisabled) {
            this.value = "disabled";
          } else if (typeof g_latestMousePress !== "undefined" && g_latestMousePress === this.id) {
            this.value = "active";
          } else {
            this.value = "inactive";
          }
          showElement(`#${this.id}-inactive`, this.value === "inactive");
          showElement(`#${this.id}-active`, this.value === "active");
          showElement(`#${this.id}-disabled`, this.value === "disabled");
        },
      }),
      ctrl_btn_depressurize: new Control({
        type: "button",
        id: "btn-depressurize",
        value: "disabled",
        ignore_mouseup: true,
        event_for_active_state: true,
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
          const isAtValidCheckpoint = (Math.abs(t - 1.0) <= 0.001 && !sim.isPlaying) || (t >= 1.999);
          const isDisabled = sim.isPlaying || !isAtValidCheckpoint || t <= 0.001;
          if (isDisabled) {
            this.value = "disabled";
          } else if (typeof g_latestMousePress !== "undefined" && g_latestMousePress === this.id) {
            this.value = "active";
          } else {
            this.value = "inactive";
          }
          showElement(`#${this.id}-inactive`, this.value === "inactive");
          showElement(`#${this.id}-active`, this.value === "active");
          showElement(`#${this.id}-disabled`, this.value === "disabled");
        },
      }),
      ctrl_btn_step_back: new Control({
        type: "button",
        id: "btn-step-back",
        value: "disabled",
        ignore_mouseup: true,
        event_for_active_state: true,
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
          const isAtBoundary = (sim.direction === -1) ? (t >= 1.999) : (t <= 0.001);
          const isDisabled = (sim.isPlaying && !sim.isPaused) || isAtBoundary;
          if (isDisabled) {
            this.value = "disabled";
          } else if (typeof g_latestMousePress !== "undefined" && g_latestMousePress === this.id) {
            this.value = "active";
          } else {
            this.value = "inactive";
          }
          showElement(`#${this.id}-inactive`, this.value === "inactive");
          showElement(`#${this.id}-active`, this.value === "active");
          showElement(`#${this.id}-disabled`, this.value === "disabled");
        },
      }),
      ctrl_btn_pause: new Control({
        type: "button",
        id: "btn-pause",
        value: "disabled",
        ignore_mouseup: true,
        event_for_active_state: true,
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
        ignore_mouseup: true,
        event_for_active_state: true,
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
          const isAtEnd = (sim.direction === 1 && t >= 1.999) || (sim.direction === -1 && t <= 0.001);
          const canResume = (sim.isPlaying && sim.isPaused) || (sim.isStepMode && !isAtEnd);

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
        ignore_mouseup: true,
        event_for_active_state: true,
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
          let isAtBoundary = false;
          if (sim.direction === -1) {
            isAtBoundary = t <= 0.001;
          } else {
            isAtBoundary = (t >= 1.999) || (t <= 0.001 && !sim.hasStarted && !sim.isPlaying);
          }
          const isDisabled = (sim.isPlaying && !sim.isPaused) || isAtBoundary;
          if (isDisabled) {
            this.value = "disabled";
          } else if (typeof g_latestMousePress !== "undefined" && g_latestMousePress === this.id) {
            this.value = "active";
          } else {
            this.value = "inactive";
          }
          showElement(`#${this.id}-inactive`, this.value === "inactive");
          showElement(`#${this.id}-active`, this.value === "active");
          showElement(`#${this.id}-disabled`, this.value === "disabled");
        },
      }),
      ctrl_btn_reset: new Control({
        type: "button",
        id: "btn-reset",
        value: "disabled",
        ignore_mouseup: true,
        event_for_active_state: true,
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
          showElement(`#${this.id}-inactive`, this.value === "inactive");
          showElement(`#${this.id}-active`, this.value === "active");
          showElement(`#${this.id}-disabled`, this.value === "disabled");
        },
      }),
      ctrl_overlay: new Control({
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
        render: function () { },
      }),
      ctrl_rect_overlay: new Control({
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
            $(document).trigger("mouseup", { note: "trigger-rect-overlay" });
          }
        },
        render: function () { },
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
  setTimeout(async () => {
    initDragEvent(["form-input"]);
    if (typeof loadConfigAndStaticSVG === "function") {
      loadConfigAndStaticSVG();
    }
    if (g_state && g_state.sim && !g_state.sim.intervalId) {
      g_state.sim.intervalId = setInterval(animationLoop, 1000 / 60);
    }
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
