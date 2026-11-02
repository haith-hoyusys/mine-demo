function Point3D(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

Point3D.prototype.plot2D = function () {
    return new Point2D(this.x, this.y);
};

Point3D.prototype.toArray = function () {
    return [this.x, this.y, this.z];
};

Point3D.prototype.sub = function (p) {
    return new Point3D(this.x - p.x, this.y - p.y, this.z - p.z);
};

Point3D.prototype.add = function (p) {
    return new Point3D(this.x + p.x, this.y + p.y, this.z + p.z);
};

Point3D.prototype.multiple = function (t) {
    return new Point3D(this.x * t, this.y * t, this.z * t);
};

Point3D.prototype.dot = function (p) {
    return this.x * p.x + this.y * p.y + this.z * p.z;
};

Point3D.prototype.dotXY = function (p) {
    return this.x * p.x + this.y * p.y;
};

Point3D.prototype.vectorLengthXY = function (p) {
    return Math.sqrt(this.dotXY(this));
};

Point3D.prototype.vectorLength = function (p) {
    return Math.sqrt(this.dot(this));
};

Point3D.prototype.copy = function () {
    return new Point3D(this.x, this.y, this.z);
};
Point3D.prototype.toVector3 = function () {
    return new THREE.Vector3(this.x, this.y, this.z);
};

// https://math.stackexchange.com/questions/137538/calculate-the-vector-normal-to-the-plane-by-given-points
Point3D.prototype.crossProduct = function (p) {
    var x = this.y * p.z - this.z * p.y;
    var y = this.z * p.x - this.x * p.z;
    var z = this.x * p.y - this.y * p.x;

    return new Point3D(x, y, z);
};

const getShapeFaceGeometry = (vertices, faces) => {
    let geo = new THREE.BufferGeometry();

    geo.setIndex(_.flatMapDeep(faces));
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(_.flattenDeep(vertices.map((p) => [p.x, p.y, p.z]))), 3));

    return geo;
};

const getLineGeomery = (vertices) => {
    const geo = new THREE.LineGeometry();
    geo.setPositions(_.flattenDeep(vertices.map((p) => [p.x, p.y, p.z])));

    return geo;
};
