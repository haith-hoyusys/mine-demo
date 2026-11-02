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
};

// --------------------------- MATRIX 4 ---------------------------
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
    for (var i = 0; i < degree; i++) m.push([]);

    for (var i = 0; i < degree; i++)
        for (var j = 0; j < degree; j++) {
            m[i].push(0);

            for (var k = 0; k < degree; k++) {
                m[i][j] += this.m[i][k] * matrix2.m[k][j];
            }
        }

    return new Matrix4(m);
};

// Returns the inverse of matrix `M`.
function matrix_invert(matrix) {
    var M = matrix.m;
    // I use Guassian Elimination to calculate the inverse:
    // (1) 'augment' the matrix (left) by the identity (on the right)
    // (2) Turn the matrix on the left into the identity by elemetry row ops
    // (3) The matrix on the right is the inverse (was the identity matrix)
    // There are 3 elemtary row ops: (I combine b and c in my code)
    // (a) Swap 2 rows
    // (b) Multiply a row by a scalar
    // (c) Add 2 rows

    // if the matrix isn't square: exit (error)
    if (M.length !== M[0].length) {
        return;
    }

    // create the identity matrix (I), and a copy (C) of the original
    var i = 0;
    var ii = 0;
    var j = 0;
    var dim = M.length;
    var e = 0;
    var t = 0;
    var I = [];
    var C = [];
    for (i = 0; i < dim; i += 1) {
        // Create the row
        I[I.length] = [];
        C[C.length] = [];
        for (j = 0; j < dim; j += 1) {
            // if we're on the diagonal, put a 1 (for identity)
            if (i == j) {
                I[i][j] = 1;
            } else {
                I[i][j] = 0;
            }

            // Also, make the copy of the original
            C[i][j] = M[i][j];
        }
    }

    // Perform elementary row operations
    for (i = 0; i < dim; i += 1) {
        // get the element e on the diagonal
        e = C[i][i];

        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
        if (e == 0) {
            // look through every row below the i'th row
            for (ii = i + 1; ii < dim; ii += 1) {
                // if the ii'th row has a non-0 in the i'th col
                if (C[ii][i] != 0) {
                    // it would make the diagonal have a non-0 so swap it
                    for (j = 0; j < dim; j++) {
                        e = C[i][j]; // temp store i'th row
                        C[i][j] = C[ii][j]; // replace i'th row by ii'th
                        C[ii][j] = e; // repace ii'th by temp
                        e = I[i][j]; // temp store i'th row
                        I[i][j] = I[ii][j]; // replace i'th row by ii'th
                        I[ii][j] = e; // repace ii'th by temp
                    }
                    // don't bother checking other rows since we've swapped
                    break;
                }
            }
            // get the new diagonal
            e = C[i][i];
            // if it's still 0, not invertable (error)
            if (e == 0) {
                return;
            }
        }

        // Scale this row down by e (so we have a 1 on the diagonal)
        for (j = 0; j < dim; j++) {
            C[i][j] = C[i][j] / e; // apply to original matrix
            I[i][j] = I[i][j] / e; // apply to identity
        }

        // Subtract this row (scaled appropriately for each row) from ALL of
        // the other rows so that there will be 0's in this column in the
        // rows above and below this one
        for (ii = 0; ii < dim; ii++) {
            // Only apply to other rows (we want a 1 on the diagonal)
            if (ii == i) {
                continue;
            }

            // We want to change this element to 0
            e = C[ii][i];

            // Subtract (the row above(or below) scaled by e) from (the
            // current row) but start at the i'th column and assume all the
            // stuff left of diagonal is 0 (which it should be if we made this
            // algorithm correctly)
            for (j = 0; j < dim; j++) {
                C[ii][j] -= e * C[i][j]; // apply to original matrix
                I[ii][j] -= e * I[i][j]; // apply to identity
            }
        }
    }

    // we've done all operations, C should be the identity
    // matrix I should be the inverse:
    return I;
}

function multipleMatrixes(matrixes) {
    var M = matrixes[0];
    for (var i = 1; i < matrixes.length; i++) M = M.multipleMatrix(matrixes[i]);

    return M;
}

// --------------------------- MATRIX 3 ---------------------------
var MathLib = {
    rotatePoint: function (type, origin, P, alpha) {
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
    rotate: function (shape, type, alpha, origin) {
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

        var o = origin || new Point3D(0, 0, 0);
        var oldVertices = $.map(shape.vertices, function (v) {
            return v.sub(o);
        });
        var newVertices = [];

        for (var i = 0; i < oldVertices.length; i++) {
            newVertices.push(rotateMatrix.multipleVector(oldVertices[i]));
        }

        var newVertices = $.map(newVertices, function (v) {
            return v.sub(o);
        });
        shape.vertices = newVertices;

        // vertices2
        var oldVertices2 = $.map(shape.vertices2, function (v) {
            return v.sub(o);
        });
        var newVertices2 = [];

        for (var i = 0; i < oldVertices2.length; i++) {
            newVertices2.push(rotateMatrix.multipleVector(oldVertices2[i]));
        }

        var newVertices2 = $.map(newVertices2, function (v) {
            return v.sub(o);
        });
        shape.vertices2 = newVertices2;
    },

    rotate2: function (shape, P1, P2, alpha, origin) {
        var o = origin || new Point3D(0, 0, 0);
        var oldVertices = $.map(shape.vertices, function (v) {
            return v;
        });
        var newVertices = [];

        for (var i = 0; i < oldVertices.length; i++) {
            var P = this.customRotate(oldVertices[i], P1, P2, alpha);
            newVertices.push(P);
        }

        var newVertices = $.map(newVertices, function (v) {
            return v;
        });

        shape.vertices = newVertices;
        if (shape.translateVector) {
            shape.translateVector = this.customRotate(shape.translateVector, P1, P2, alpha);
        }
    },

    // https://robotics.stackexchange.com/questions/12782/how-rotate-a-point-around-an-arbitrary-line-in-3d
    customRotate: function (P, P1, P2, alpha) {
        var theta = (alpha * Math.PI) / 180;
        // var AC = C.sub(A);
        // var AB = B.sub(A);
        // var t = AC.dot(AB) / Math.pow(AB.length(), 2);
        // var D = A.add(AB.muliple(t));
        var V = P2.sub(P1);
        // console.log("V", V);
        // if (V.x == 0 && V.y == 0) {
        //     console.log("rotatePoint axis Z");

        //     return MathLib.rotatePoint(CONST.AXIS.Z, new Point3D(0, 0, 0), P, alpha);
        // }
        // if (V.x == 0 && V.z == 0) {
        //     console.log("rotatePoint axis Y");

        //     return MathLib.rotatePoint(CONST.AXIS.Y, new Point3D(0, 0, 0), P, alpha);
        // }
        // if (V.y == 0 && V.z == 0) {
        //     console.log("rotatePoint axis X");

        //     return MathLib.rotatePoint(CONST.AXIS.X, new Point3D(0, 0, 0), P, alpha);
        // }
        var l = V.vectorLength();
        var U = V.multiple(1 / l);
        var a = U.x;
        var b = U.y;
        var c = U.z;
        var d = Math.sqrt(b * b + c * c);

        // rotate
        var x = [P.x, P.y, P.z, 1];

        var cos = Math.cos(theta);
        var sin = Math.sin(theta);

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

        var Rz = new Matrix4([
            [cos, -sin, 0, 0],
            [sin, cos, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]);
        var T_1 = new Matrix4(matrix_invert(T));
        var Rx_1 = new Matrix4(matrix_invert(Rx));
        var Ry_1 = new Matrix4(matrix_invert(Ry));

        var output = multipleMatrixes([T_1, Rx_1, Ry_1, Rz, Ry, Rx, T]).multipleVector(x);

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
            [cos + U.x * U.x * (1 - cos), U.x * U.y * (1 - cos) - U.z * sin, U.x * U.z * (1 - cos) + U.y * sin, 0], //
            [U.y * U.x * (1 - cos) + U.z * sin, cos + U.y * U.y * (1 - cos), U.y * U.z * (1 - cos) - U.x * sin, 0],
            [U.z * U.x * (1 - cos) - U.y * sin, U.z * U.y * (1 - cos) + U.x * sin, cos + U.z * U.z * (1 - cos), 0],
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

    getPointByRatio: function (p1, p2, r) {
        return new Point3D(p1.x + (p2.x - p1.x) * r, p1.y + (p2.y - p1.y) * r, p1.z + (p2.z - p1.z) * r);
    },

    getPointByLength: function (p1, p2, d) {
        var r = d / MathLib.length3D(p1, p2);
        if (r > 10000) r = 1;

        return this.getPointByRatio(p1, p2, r);
    },

    getPointByLengthXY: function (p1, p2, d) {
        var r = d / MathLib.lengthXY(p1, p2);
        if (r > 10000) r = 1;

        return this.getPointByRatio(p1, p2, r);
    },

    length3D: function (p1, p2) {
        return p1.sub(p2).vectorLength();
    },

    lengthXY: function (p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    },

    angleBetweenVectors: function (p, p1, p2) {
        var u = p1.sub(p);
        var v = p2.sub(p);
        var cos = u.dot(v) / (u.vectorLength() * v.vectorLength());

        return (Math.acos(cos) * 180) / Math.PI;
    },

    pointInsidePolygon: function (p, vs) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

        var { x } = p;
        var { y } = p;

        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i].x;
            var yi = vs[i].y;
            var xj = vs[j].x;
            var yj = vs[j].y;

            var intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) inside = !inside;
        }

        return inside;
    },

    lineIntersectLine: function (_P1, _P2, _Q1, _Q2) {
        var P1 = new Point3D(_P1.x, _P1.y, 0);
        var P2 = new Point3D(_P2.x, _P2.y, 0);
        var Q1 = new Point3D(_Q1.x, _Q1.y, 0);
        var Q2 = new Point3D(_Q2.x, _Q2.y, 0);

        // P = P1 + s * (P2 - P1)
        var u = P2.sub(P1);
        var v = Q2.sub(Q1);

        var ut = new Point3D(u.y, -u.x, 0);
        var vt = new Point3D(v.y, -v.x, 0);

        var w = P1.sub(Q1);

        if (Math.abs(ut.x / (vt.x + CONST.EPSILON) - ut.y / (vt.y + CONST.EPSILON)) < CONST.EPSILON)
            return {
                intersect: false,
            };

        var t1 = -vt.dot(w) / vt.dot(u);
        var P = P1.add(u.multiple(t1));

        // P = Q1 + t2 * (Q2 - Q1)
        var t2 = ut.dot(w) / ut.dot(v);

        return {
            intersect: true,
            ratio: t1,
            ratio2: t2,
            intersectPoint: P,
        };
    },

    // http://geomalgorithms.com/a05-_intersect-1.html
    lineIntersectPlan: function (P1, P2, planePoints) {
        var A = planePoints[1];
        var B = planePoints[0];
        var C = planePoints[2];

        // P = P1 + t * u
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
        var P = P1.add(u.multiple(t));

        // check point P inside plane
        var epsilon = 0.00001;
        var isInsideRay = t > epsilon && t < 1 - epsilon;
        var isInsidePolygon = this.pointInsidePolygon(P, planePoints);

        return {
            isIntersect: true,
            intersectPoint: P,
            isInsideRay: isInsideRay,
            isInsidePolygon: isInsidePolygon,
            ratio: t,
        };
    },

    lineFormular: function (p1, p2) {
        var v = p1.sub(p2);
        var n = new Point3D(-v.y, v.x, 0);

        // n.x * (x-p1.x) + n.y*(y-p1.y) = 0
        // n.x * x + n.y * y - n.x*p1.x - n.y*p1.y = 0

        return {
            a: n.x,
            b: n.y,
            c: -n.x * p1.x - n.y * p1.y,
        };
    },

    centerPoint: function (points) {
        var n = points.length;
        var G = new Point3D(0, 0, 0);

        for (var i = 0; i < n; i++) G = G.add(points[i].multiple(1 / n));

        return G;
    },

    toVector3: (p) => {
        return new THREE.Vector3(p.x, p.y, p.z);
    },

    toPoint3D: (p) => {
        return new Point3D(p.x, p.y, p.z);
    },

    circumcircleCenterY: function (A, B, C) {
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

    sortPolygonPoints: function (points) {
        points.sort(function (a, b) {
            return a.y - b.y;
        });

        // Get center y
        var cy = (points[0].y + points[points.length - 1].y) / 2;

        // Sort from right to left
        points.sort(function (a, b) {
            return b.x - a.x;
        });

        // Get center x
        var cx = (points[0].x + points[points.length - 1].x) / 2;

        // Center point
        var center = { x: cx, y: cy };

        // Pre calculate the angles as it will be slow in the sort
        // As the points are sorted from right to left the first point
        // is the rightmost

        // Starting angle used to reference other angles
        var startAng;
        points.forEach(function (point) {
            var ang = Math.atan2(point.y - center.y, point.x - center.x);
            if (!startAng) {
                startAng = ang;
            } else if (ang < startAng) {
                // ensure that all points are clockwise of the start point
                ang += Math.PI * 2;
            }
            point.angle = ang; // add the angle to the point
        });

        // Sort clockwise;
        return points.sort(function (a, b) {
            return a.angle - b.angle;
        });
    },
};
