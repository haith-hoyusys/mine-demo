/**
 * Matter.js physics engine (Clean standalone 2D Rigid Body Physics)
 * Optimized for Suken particle and cylinder physics simulations
 */
(function (root, factory) {
  if (typeof exports === "object" && typeof module === "object") {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports === "object") {
    exports["Matter"] = factory();
  } else {
    root["Matter"] = factory();
  }
})(typeof window !== "undefined" ? window : this, function () {
  var Matter = {};

  // --- Common Utilities ---
  var Common = {
    _nextId: 0,
    nextId: function () {
      return Common._nextId++;
    },
    clamp: function (val, min, max) {
      if (isNaN(val)) return min;
      return val < min ? min : val > max ? max : val;
    },
    now: function () {
      if (typeof performance !== "undefined" && performance.now) {
        return performance.now();
      }
      return Date.now();
    },
  };
  Matter.Common = Common;

  // --- Vector ---
  var Vector = {
    create: function (x, y) {
      return {
        x: typeof x === "number" && !isNaN(x) ? x : 0,
        y: typeof y === "number" && !isNaN(y) ? y : 0,
      };
    },
    clone: function (v) {
      if (!v) return { x: 0, y: 0 };
      return {
        x: typeof v.x === "number" && !isNaN(v.x) ? v.x : 0,
        y: typeof v.y === "number" && !isNaN(v.y) ? v.y : 0,
      };
    },
    magnitude: function (v) {
      if (!v) return 0;
      var x = typeof v.x === "number" && !isNaN(v.x) ? v.x : 0;
      var y = typeof v.y === "number" && !isNaN(v.y) ? v.y : 0;
      return Math.sqrt(x * x + y * y);
    },
    normalise: function (v) {
      var m = Vector.magnitude(v);
      if (m === 0 || isNaN(m)) return { x: 0, y: 0 };
      return { x: v.x / m, y: v.y / m };
    },
    dot: function (v1, v2) {
      if (!v1 || !v2) return 0;
      var x1 = typeof v1.x === "number" && !isNaN(v1.x) ? v1.x : 0;
      var y1 = typeof v1.y === "number" && !isNaN(v1.y) ? v1.y : 0;
      var x2 = typeof v2.x === "number" && !isNaN(v2.x) ? v2.x : 0;
      var y2 = typeof v2.y === "number" && !isNaN(v2.y) ? v2.y : 0;
      return x1 * x2 + y1 * y2;
    },
    cross: function (v1, v2) {
      if (!v1 || !v2) return 0;
      var x1 = typeof v1.x === "number" && !isNaN(v1.x) ? v1.x : 0;
      var y1 = typeof v1.y === "number" && !isNaN(v1.y) ? v1.y : 0;
      var x2 = typeof v2.x === "number" && !isNaN(v2.x) ? v2.x : 0;
      var y2 = typeof v2.y === "number" && !isNaN(v2.y) ? v2.y : 0;
      return x1 * y2 - y1 * x2;
    },
    add: function (v1, v2) {
      var x1 = v1 && typeof v1.x === "number" && !isNaN(v1.x) ? v1.x : 0;
      var y1 = v1 && typeof v1.y === "number" && !isNaN(v1.y) ? v1.y : 0;
      var x2 = v2 && typeof v2.x === "number" && !isNaN(v2.x) ? v2.x : 0;
      var y2 = v2 && typeof v2.y === "number" && !isNaN(v2.y) ? v2.y : 0;
      return { x: x1 + x2, y: y1 + y2 };
    },
    sub: function (v1, v2) {
      var x1 = v1 && typeof v1.x === "number" && !isNaN(v1.x) ? v1.x : 0;
      var y1 = v1 && typeof v1.y === "number" && !isNaN(v1.y) ? v1.y : 0;
      var x2 = v2 && typeof v2.x === "number" && !isNaN(v2.x) ? v2.x : 0;
      var y2 = v2 && typeof v2.y === "number" && !isNaN(v2.y) ? v2.y : 0;
      return { x: x1 - x2, y: y1 - y2 };
    },
    mult: function (v, s) {
      var x = v && typeof v.x === "number" && !isNaN(v.x) ? v.x : 0;
      var y = v && typeof v.y === "number" && !isNaN(v.y) ? v.y : 0;
      s = typeof s === "number" && !isNaN(s) ? s : 1;
      return { x: x * s, y: y * s };
    },
    div: function (v, s) {
      var x = v && typeof v.x === "number" && !isNaN(v.x) ? v.x : 0;
      var y = v && typeof v.y === "number" && !isNaN(v.y) ? v.y : 0;
      s = typeof s === "number" && !isNaN(s) && s !== 0 ? s : 1;
      return { x: x / s, y: y / s };
    },
    dist: function (v1, v2) {
      if (!v1 || !v2) return 0;
      var dx = (typeof v1.x === "number" && !isNaN(v1.x) ? v1.x : 0) - (typeof v2.x === "number" && !isNaN(v2.x) ? v2.x : 0);
      var dy = (typeof v1.y === "number" && !isNaN(v1.y) ? v1.y : 0) - (typeof v2.y === "number" && !isNaN(v2.y) ? v2.y : 0);
      return Math.sqrt(dx * dx + dy * dy);
    },
  };
  Matter.Vector = Vector;

  // --- Body ---
  var Body = {
    _nextId: 1,
    create: function (options) {
      options = options || {};
      var posX = options.position && typeof options.position.x === "number" && !isNaN(options.position.x) ? options.position.x : 0;
      var posY = options.position && typeof options.position.y === "number" && !isNaN(options.position.y) ? options.position.y : 0;
      var velX = options.velocity && typeof options.velocity.x === "number" && !isNaN(options.velocity.x) ? options.velocity.x : 0;
      var velY = options.velocity && typeof options.velocity.y === "number" && !isNaN(options.velocity.y) ? options.velocity.y : 0;
      var isStatic = !!options.isStatic;
      var mass = isStatic ? Infinity : typeof options.mass === "number" && !isNaN(options.mass) && options.mass > 0 ? options.mass : 1;
      var inertia = isStatic ? Infinity : typeof options.inertia === "number" && !isNaN(options.inertia) && options.inertia > 0 ? options.inertia : 1000;

      var body = {
        id: options.id || Body._nextId++,
        type: "body",
        label: options.label || "Body",
        isStatic: isStatic,
        position: Vector.create(posX, posY),
        previousPosition: Vector.create(posX, posY),
        velocity: Vector.create(velX, velY),
        force: Vector.create(0, 0),
        angle: typeof options.angle === "number" && !isNaN(options.angle) ? options.angle : 0,
        angularVelocity: typeof options.angularVelocity === "number" && !isNaN(options.angularVelocity) ? options.angularVelocity : 0,
        angularSpeed: 0,
        speed: Math.sqrt(velX * velX + velY * velY),
        motion: 0,
        mass: mass,
        inverseMass: isStatic ? 0 : 1 / mass,
        inertia: inertia,
        inverseInertia: isStatic ? 0 : 1 / inertia,
        restitution: typeof options.restitution === "number" && !isNaN(options.restitution) ? options.restitution : 1.0,
        friction: typeof options.friction === "number" && !isNaN(options.friction) ? options.friction : 0,
        frictionAir: typeof options.frictionAir === "number" && !isNaN(options.frictionAir) ? options.frictionAir : 0,
        circleRadius: typeof options.circleRadius === "number" && !isNaN(options.circleRadius) ? options.circleRadius : 0,
        shape: options.shape || "circle",
        width: typeof options.width === "number" && !isNaN(options.width) ? options.width : 0,
        height: typeof options.height === "number" && !isNaN(options.height) ? options.height : 0,
        collisionFilter: options.collisionFilter || { group: 0, category: 1, mask: 0xffffffff },
        bounds: { min: { x: posX, y: posY }, max: { x: posX, y: posY } },
      };
      Body.updateBounds(body);
      return body;
    },
    setPosition: function (body, position) {
      if (!body || !position) return;
      if (typeof position.x === "number" && !isNaN(position.x)) {
        body.position.x = position.x;
        body.previousPosition.x = position.x;
      }
      if (typeof position.y === "number" && !isNaN(position.y)) {
        body.position.y = position.y;
        body.previousPosition.y = position.y;
      }
      Body.updateBounds(body);
    },
    setVelocity: function (body, velocity) {
      if (!body || !velocity) return;
      if (typeof velocity.x === "number" && !isNaN(velocity.x)) {
        body.velocity.x = velocity.x;
      }
      if (typeof velocity.y === "number" && !isNaN(velocity.y)) {
        body.velocity.y = velocity.y;
      }
      body.speed = Vector.magnitude(body.velocity);
    },
    applyForce: function (body, position, force) {
      if (!body || !force) return;
      if (typeof force.x === "number" && !isNaN(force.x)) {
        body.force.x += force.x;
      }
      if (typeof force.y === "number" && !isNaN(force.y)) {
        body.force.y += force.y;
      }
    },
    updateBounds: function (body) {
      if (!body) return;
      if (body.shape === "circle") {
        var r = body.circleRadius || 0;
        body.bounds.min.x = body.position.x - r;
        body.bounds.min.y = body.position.y - r;
        body.bounds.max.x = body.position.x + r;
        body.bounds.max.y = body.position.y + r;
      } else {
        var hw = (body.width || 0) / 2;
        var hh = (body.height || 0) / 2;
        body.bounds.min.x = body.position.x - hw;
        body.bounds.min.y = body.position.y - hh;
        body.bounds.max.x = body.position.x + hw;
        body.bounds.max.y = body.position.y + hh;
      }
    },
  };
  Matter.Body = Body;

  // --- Bodies Factory ---
  var Bodies = {
    rectangle: function (x, y, width, height, options) {
      options = options || {};
      options.position = Vector.create(x, y);
      options.width = width;
      options.height = height;
      options.shape = "rectangle";
      return Body.create(options);
    },
    circle: function (x, y, radius, options) {
      options = options || {};
      options.position = Vector.create(x, y);
      options.circleRadius = radius;
      options.shape = "circle";
      return Body.create(options);
    },
  };
  Matter.Bodies = Bodies;

  // --- World & Composite ---
  var Composite = {
    create: function () {
      return {
        bodies: [],
      };
    },
    add: function (composite, object) {
      if (!composite || !object) return composite;
      var objects = Array.isArray(object) ? object : [object];
      for (var i = 0; i < objects.length; i++) {
        var obj = objects[i];
        if (obj && obj.type === "body") {
          composite.bodies.push(obj);
        }
      }
      return composite;
    },
    remove: function (composite, object) {
      if (!composite || !object) return composite;
      var objects = Array.isArray(object) ? object : [object];
      for (var i = 0; i < objects.length; i++) {
        var obj = objects[i];
        var idx = composite.bodies.indexOf(obj);
        if (idx !== -1) {
          composite.bodies.splice(idx, 1);
        }
      }
      return composite;
    },
    clear: function (composite) {
      if (composite) {
        composite.bodies = [];
      }
    },
  };
  Matter.Composite = Composite;

  var World = {
    create: function () {
      return Composite.create();
    },
    add: function (world, object) {
      return Composite.add(world, object);
    },
    remove: function (world, object) {
      return Composite.remove(world, object);
    },
    clear: function (world) {
      return Composite.clear(world);
    },
  };
  Matter.World = World;

  // --- Collision Solver ---
  function resolveCircleVsRect(circle, rect) {
    if (!circle || !rect) return;
    if (isNaN(circle.position.x) || isNaN(circle.position.y)) return;
    if (isNaN(rect.position.x) || isNaN(rect.position.y)) return;

    var cx = circle.position.x;
    var cy = circle.position.y;
    var r = circle.circleRadius || 0;

    var rx = rect.position.x;
    var ry = rect.position.y;
    var hw = (rect.width || 0) / 2;
    var hh = (rect.height || 0) / 2;

    var closestX = Common.clamp(cx, rx - hw, rx + hw);
    var closestY = Common.clamp(cy, ry - hh, ry + hh);

    var distX = cx - closestX;
    var distY = cy - closestY;
    var distSq = distX * distX + distY * distY;

    if (distSq < r * r && distSq > 0.000001) {
      var dist = Math.sqrt(distSq);
      var nx = distX / dist;
      var ny = distY / dist;
      var overlap = r - dist;

      circle.position.x += nx * overlap;
      circle.position.y += ny * overlap;

      var relVx = circle.velocity.x - (rect.isStatic ? 0 : rect.velocity.x);
      var relVy = circle.velocity.y - (rect.isStatic ? 0 : rect.velocity.y);
      var dot = relVx * nx + relVy * ny;

      if (dot < 0) {
        var restitution = (circle.restitution || 1) * (rect.restitution || 1);
        var impulse = -(1 + restitution) * dot;
        circle.velocity.x += nx * impulse;
        circle.velocity.y += ny * impulse;
      }
      Body.updateBounds(circle);
    } else if (distSq <= 0.000001 && cx >= rx - hw && cx <= rx + hw && cy >= ry - hh && cy <= ry + hh) {
      // Circle center inside rect: push out to nearest edge
      var dLeft = Math.abs(cx - (rx - hw));
      var dRight = Math.abs((rx + hw) - cx);
      var dTop = Math.abs(cy - (ry - hh));
      var dBottom = Math.abs((ry + hh) - cy);
      var minD = Math.min(dLeft, dRight, dTop, dBottom);
      var nx = 0, ny = 0;
      if (minD === dLeft) { nx = -1; circle.position.x = rx - hw - r; }
      else if (minD === dRight) { nx = 1; circle.position.x = rx + hw + r; }
      else if (minD === dTop) { ny = -1; circle.position.y = ry - hh - r; }
      else { ny = 1; circle.position.y = ry + hh + r; }

      var relVx = circle.velocity.x - (rect.isStatic ? 0 : rect.velocity.x);
      var relVy = circle.velocity.y - (rect.isStatic ? 0 : rect.velocity.y);
      var dot = relVx * nx + relVy * ny;
      if (dot < 0) {
        var restitution = (circle.restitution || 1) * (rect.restitution || 1);
        var impulse = -(1 + restitution) * dot;
        circle.velocity.x += nx * impulse;
        circle.velocity.y += ny * impulse;
      }
      Body.updateBounds(circle);
    }
  }

  function resolveCircleVsCircle(c1, c2) {
    if (!c1 || !c2) return;
    if (isNaN(c1.position.x) || isNaN(c1.position.y) || isNaN(c2.position.x) || isNaN(c2.position.y)) return;

    var r1 = c1.circleRadius || 0;
    var r2 = c2.circleRadius || 0;
    var dx = c2.position.x - c1.position.x;
    var dy = c2.position.y - c1.position.y;
    var distSq = dx * dx + dy * dy;
    var totalR = r1 + r2;

    if (distSq < totalR * totalR && distSq > 0.000001) {
      var dist = Math.sqrt(distSq);
      var nx = dx / dist;
      var ny = dy / dist;
      var overlap = totalR - dist;

      var invMass1 = c1.isStatic ? 0 : (c1.inverseMass || 1);
      var invMass2 = c2.isStatic ? 0 : (c2.inverseMass || 1);
      var totalInvMass = invMass1 + invMass2;
      if (totalInvMass <= 0 || isNaN(totalInvMass)) return;

      c1.position.x -= nx * overlap * (invMass1 / totalInvMass);
      c1.position.y -= ny * overlap * (invMass1 / totalInvMass);
      c2.position.x += nx * overlap * (invMass2 / totalInvMass);
      c2.position.y += ny * overlap * (invMass2 / totalInvMass);

      var relVx = c2.velocity.x - c1.velocity.x;
      var relVy = c2.velocity.y - c1.velocity.y;
      var dot = relVx * nx + relVy * ny;

      if (dot < 0) {
        var restitution = (c1.restitution || 1) * (c2.restitution || 1);
        var impulse = (-(1 + restitution) * dot) / totalInvMass;
        if (!c1.isStatic) {
          c1.velocity.x -= nx * impulse * invMass1;
          c1.velocity.y -= ny * impulse * invMass1;
        }
        if (!c2.isStatic) {
          c2.velocity.x += nx * impulse * invMass2;
          c2.velocity.y += ny * impulse * invMass2;
        }
      }
      Body.updateBounds(c1);
      Body.updateBounds(c2);
    }
  }

  // --- Engine ---
  var Engine = {
    create: function (options) {
      options = options || {};
      var grav = options.gravity || {};
      return {
        world: World.create(),
        gravity: {
          x: typeof grav.x === "number" && !isNaN(grav.x) ? grav.x : 0,
          y: typeof grav.y === "number" && !isNaN(grav.y) ? grav.y : 0,
          scale: typeof grav.scale === "number" && !isNaN(grav.scale) ? grav.scale : 0.001,
        },
        timing: {
          timestamp: 0,
          timeScale: options.timing && typeof options.timing.timeScale === "number" && !isNaN(options.timing.timeScale) ? options.timing.timeScale : 1,
        },
        positionIterations: 6,
        velocityIterations: 4,
      };
    },
    update: function (engine, delta) {
      if (!engine || !engine.world) return;
      delta = typeof delta === "number" && !isNaN(delta) && delta > 0 ? delta : 1000 / 60;
      var timeScale = engine.timing && typeof engine.timing.timeScale === "number" && !isNaN(engine.timing.timeScale) ? engine.timing.timeScale : 1;
      var dt = (delta / 1000) * timeScale;
      if (isNaN(dt) || dt <= 0) dt = 1 / 60;

      var bodies = engine.world.bodies;
      var grav = engine.gravity || {};
      var gScale = typeof grav.scale === "number" && !isNaN(grav.scale) ? grav.scale : 0.001;
      var gx = (typeof grav.x === "number" && !isNaN(grav.x) ? grav.x : 0) * gScale * 1000;
      var gy = (typeof grav.y === "number" && !isNaN(grav.y) ? grav.y : 0) * gScale * 1000;
      if (isNaN(gx)) gx = 0;
      if (isNaN(gy)) gy = 0;

      // 1. Integrate motion
      for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];
        if (body.isStatic) continue;

        var fx = typeof body.force.x === "number" && !isNaN(body.force.x) ? body.force.x : 0;
        var fy = typeof body.force.y === "number" && !isNaN(body.force.y) ? body.force.y : 0;
        var invM = typeof body.inverseMass === "number" && !isNaN(body.inverseMass) ? body.inverseMass : 1;

        if (typeof body.velocity.x !== "number" || isNaN(body.velocity.x)) body.velocity.x = 0;
        if (typeof body.velocity.y !== "number" || isNaN(body.velocity.y)) body.velocity.y = 0;

        body.velocity.x += (fx * invM + gx) * dt;
        body.velocity.y += (fy * invM + gy) * dt;

        var fAir = typeof body.frictionAir === "number" && !isNaN(body.frictionAir) ? body.frictionAir : 0;
        body.velocity.x *= 1 - fAir;
        body.velocity.y *= 1 - fAir;

        if (typeof body.position.x !== "number" || isNaN(body.position.x)) body.position.x = 0;
        if (typeof body.position.y !== "number" || isNaN(body.position.y)) body.position.y = 0;

        body.position.x += body.velocity.x * dt;
        body.position.y += body.velocity.y * dt;

        body.force.x = 0;
        body.force.y = 0;

        Body.updateBounds(body);
      }

      // 2. Resolve Collisions
      var iters = engine.positionIterations || 6;
      for (var iter = 0; iter < iters; iter++) {
        for (var a = 0; a < bodies.length; a++) {
          var b1 = bodies[a];
          for (var b = a + 1; b < bodies.length; b++) {
            var b2 = bodies[b];

            if (b1.isStatic && b2.isStatic) continue;

            if (b1.shape === "circle" && b2.shape === "rectangle") {
              resolveCircleVsRect(b1, b2);
            } else if (b1.shape === "rectangle" && b2.shape === "circle") {
              resolveCircleVsRect(b2, b1);
            } else if (b1.shape === "circle" && b2.shape === "circle") {
              if (b1.collisionFilter && b2.collisionFilter && b1.collisionFilter.group < 0 && b1.collisionFilter.group === b2.collisionFilter.group) {
                continue;
              }
              resolveCircleVsCircle(b1, b2);
            }
          }
        }
      }
    },
    clear: function (engine) {
      if (engine && engine.world) {
        World.clear(engine.world);
      }
    },
  };
  Matter.Engine = Engine;

  return Matter;
});
