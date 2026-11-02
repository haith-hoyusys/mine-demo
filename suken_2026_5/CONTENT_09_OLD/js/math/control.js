/* eslint-disable no-new */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-case-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-shadow */

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
  rotate: function rotate(
    shape,
    type,
    alpha,
    origin,
    isSkipCoordinate,
    targetVertice0
  ) {
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
      shape.vertices = shape.vertices.map((v) =>
        rotateMatrix.multipleVector(v.sub(o))
      );
      if (shape.vertices1)
        shape.vertices1 = shape.vertices1.map((v) =>
          rotateMatrix.multipleVector(v.sub(o))
        );
      if (shape.vertices2)
        shape.vertices2 = shape.vertices2.map((v) =>
          rotateMatrix.multipleVector(v.sub(o))
        );

      if (shape.coordinates && !isSkipCoordinate) {
        shape.coordinates = shape.coordinates.map((v) =>
          rotateMatrix.multipleVector(v.sub(o))
        );
      }
    } else {
      if (shape.vertices0)
        shape.vertices0 = shape.vertices0.map((v) =>
          rotateMatrix.multipleVector(v.sub(o))
        );
      // if (shape.vertices01) shape.vertices01 = shape.vertices01.map((v) => rotateMatrix.multipleVector(v.sub(o)));
      // if (shape.vertices02) shape.vertices02 = shape.vertices02.map((v) => rotateMatrix.multipleVector(v.sub(o)));
    }
  },
  rotate2: function rotate2(
    shape,
    P1,
    P2,
    alpha,
    origin,
    isSkipCoordinate,
    targetVertice0
  ) {
    var o = origin || new Point3D(0, 0, 0);

    if (isSkipCoordinate) {
      if (!targetVertice0) {
        shape.vertices = shape.vertices.map((v, idx) =>
          idx > shape.originVerticesIdx
            ? v
            : this.customRotate(v, P1, P2, alpha)
        );
        if (shape.vertices1)
          shape.vertices1 = shape.vertices1.map((v, idx) =>
            idx > shape.originVerticesIdx
              ? v
              : this.customRotate(v, P1, P2, alpha)
          );
        if (shape.vertices2)
          shape.vertices2 = shape.vertices2.map((v, idx) =>
            idx > shape.originVerticesIdx
              ? v
              : this.customRotate(v, P1, P2, alpha)
          );
      } else {
        if (shape.vertices0)
          shape.vertices0 = shape.vertices0.map((v, idx) =>
            idx > shape.originVerticesIdx
              ? v
              : this.customRotate(v, P1, P2, alpha)
          );

        // if (shape.vertices01)
        //     shape.vertices01 = shape.vertices01.map((v, idx) => (idx > shape.originVerticesIdx ? v : this.customRotate(v, P1, P2, alpha)));
        // if (shape.vertices02)
        //     shape.vertices02 = shape.vertices02.map((v, idx) => (idx > shape.originVerticesIdx ? v : this.customRotate(v, P1, P2, alpha)));
      }
    } else {
      if (!targetVertice0) {
        shape.vertices = shape.vertices.map((v) =>
          this.customRotate(v, P1, P2, alpha)
        );
        if (shape.vertices1)
          shape.vertices1 = shape.vertices1.map((v) =>
            this.customRotate(v, P1, P2, alpha)
          );
        if (shape.vertices2)
          shape.vertices2 = shape.vertices2.map((v) =>
            this.customRotate(v, P1, P2, alpha)
          );

        if (shape.coordinates && !isSkipCoordinate) {
          shape.coordinates = shape.coordinates.map((v) =>
            this.customRotate(v, P1, P2, alpha)
          );
        }
      } else {
        if (shape.vertices0)
          shape.vertices0 = shape.vertices0.map((v) =>
            this.customRotate(v, P1, P2, alpha)
          );
        // if (shape.vertices01) shape.vertices01 = shape.vertices01.map((v) => this.customRotate(v, P1, P2, alpha));
        // if (shape.vertices02) shape.vertices02 = shape.vertices02.map((v) => this.customRotate(v, P1, P2, alpha));
      }
    }

    // if (shape.coordinates0 && !isSkipCoordinate) {
    //     shape.coordinates0 = shape.coordinates0.map((v) => this.customRotate(v, P1, P2, alpha));
    // }

    if (shape.translateVector) {
      shape.translateVector = this.customRotate(
        shape.translateVector,
        P1,
        P2,
        alpha
      );
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
    var output = multipleMatrixes([
      T_1,
      Rx_1,
      Ry_1,
      Rz,
      Ry,
      Rx,
      T,
    ]).multipleVector(x);
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
      [
        cos + U.x * U.x * (1 - cos),
        U.x * U.y * (1 - cos) - U.z * sin,
        U.x * U.z * (1 - cos) + U.y * sin,
        0,
      ], //
      [
        U.y * U.x * (1 - cos) + U.z * sin,
        cos + U.y * U.y * (1 - cos),
        U.y * U.z * (1 - cos) - U.x * sin,
        0,
      ],
      [
        U.z * U.x * (1 - cos) - U.y * sin,
        U.z * U.y * (1 - cos) + U.x * sin,
        cos + U.z * U.z * (1 - cos),
        0,
      ],
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
    return new Point3D(
      p1.x + (p2.x - p1.x) * r,
      p1.y + (p2.y - p1.y) * r,
      p1.z + (p2.z - p1.z) * r
    );
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
      var intersect =
        yi > y + CONST.EPSILON != yj > y + CONST.EPSILON &&
        x + CONST.EPSILON < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
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
    if (
      Math.abs(ut.x / (vt.x + CONST.EPSILON) - ut.y / (vt.y + CONST.EPSILON)) <
      CONST.EPSILON
    )
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
      var radius =
        (radiusStep < 0 ? -endRadius : -startRadius) + radiusStep * i;
      // console.log(i, startRadius, "radius", radius);
      var angle =
        (isReverse ? -1 : 1) *
        (dAngle + startAngle + (i * Math.PI) / 2 / pointsPerQuarter);

      if (dArrow && i < ignoreStep) continue;
      points.push([
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle),
      ]);
    }

    points.reverse();

    return {
      points: points
        .map((ps) => ps.map((x) => _.round(x, 2)).join(","))
        .join(","),
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
      return [
        id == 0 ? "M" : "L",
        roundDecimal2((o.x + v.x) * grid),
        roundDecimal2((o.y + v.y) * grid),
      ].join(" ");
    }).join(" ")}z`;

    return d;
  },

  getPath: function (o, verticePairs, grid) {
    var d = verticePairs
      .map((p) =>
        p
          .map((v, idx) =>
            [
              idx == 0 && p.length > 1 ? "M" : "L",
              roundDecimal2((o.x + v.x) * grid),
              roundDecimal2((o.y + v.y) * grid),
            ].join(" ")
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

    var alpha = MathLib.angleBetweenVectors(
      new Point3D(0, 0, 0),
      normVector,
      w
    ); // alpha = 180 - alpha;
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
