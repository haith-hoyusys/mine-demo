let camera, scene, renderer, controls;
let container;
let pointL, lHitbox, lineOL, vectorOL, pointIntersection;
const canvasLabels = {};
let defaultCameraPos, defaultTarget;

var globalFont;
var globalMathFont;
var labels3D = {};

function load3DFont() {
    var loader = new THREE.FontLoader();

    try {
        globalFont = loader.parse(myFontData);
        globalMathFont = loader.parse(myFontData_2);

        createAll3DLabels();
    } catch (error) {
        console.error("error parse font:", error);
    }
}

function create3DLabel(name, color, size = 0.2, isOnTop = false) {
    let fontToUse = (name === "a" || name === "b" || name === "c") ? globalMathFont : globalFont;
    if (!fontToUse) return;

    var textGeo = new THREE.TextGeometry(name, {
        font: fontToUse,
        size: size,
        height: 0.01,
        curveSegments: 4,
        bevelEnabled: false
    });

    textGeo.computeBoundingBox();
    const bb = textGeo.boundingBox;
    const offsetX = -0.5 * (bb.max.x - bb.min.x);
    const offsetY = -0.5 * (bb.max.y - bb.min.y);
    textGeo.translate(offsetX, offsetY, 0);

    const group = new THREE.Group();

    var matFront = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        depthFunc: THREE.LessEqualDepth,
        depthWrite: !isOnTop,
        depthTest: !isOnTop,
        transparent: true
    });
    var meshFront = new THREE.Mesh(textGeo, matFront);
    meshFront.renderOrder = isOnTop ? 100 : -1;
    group.add(meshFront);

    if (name === "a" || name === "b" || name === "c") {
        const arrowW = Math.max(bb.max.x - bb.min.x, size * 0.6) * 1.1;
        const arrowY = (bb.max.y - bb.min.y) / 2 + size * 0.35;

        const scale = 0.4;
        const localP1 = new THREE.Vector3(0, 0, 0);
        const localP2 = new THREE.Vector3(arrowW / scale, 0, 0);

        const vectorFront = createVector(localP1, localP2, color);
        scene.remove(vectorFront);
        vectorFront.scale.set(scale, scale, scale);
        vectorFront.position.set(-arrowW / 2, arrowY, 0);

        vectorFront.children.forEach(child => {
            child.material = matFront;
            child.renderOrder = isOnTop ? 100 : -1;
        });
        const coneFront = vectorFront.getObjectByName("cone");
        if (coneFront) coneFront.scale.set(1.2, 1, 1.2);

        group.add(vectorFront);

    }

    scene.add(group);

    return group;
}

const shapeData = CONFIG.shape;
const points = {
    O: new THREE.Vector3(...shapeData.O),
    A: new THREE.Vector3(...shapeData.A),
    B: new THREE.Vector3(...shapeData.B),
    C: new THREE.Vector3(...shapeData.C),
    D: new THREE.Vector3(...shapeData.D),
    E: new THREE.Vector3(...shapeData.E),
    F: new THREE.Vector3(...shapeData.F),
    H: new THREE.Vector3(...shapeData.H),
    G: new THREE.Vector3().addVectors(new THREE.Vector3(...shapeData.H), new THREE.Vector3(...shapeData.D)).multiplyScalar(0.5)
};
let initialCamDir = new THREE.Vector3();

function initCanvas() {
    container = document.getElementById("container");
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // 1. Camera Orthographic
    const aspect = window.innerWidth / window.innerHeight;
    const d = 5;
    camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 0.1, 1000);
    // camera.position.set(-8, 5, 10);
    camera.zoom = 1.2

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    const center = new THREE.Vector3().addVectors(points.O, points.G).multiplyScalar(0.5);
    controls.target.copy(center);
    camera.lookAt(center);

    let isUserInteracting = false;
    controls.addEventListener('start', () => { isUserInteracting = true; });
    controls.addEventListener('end', () => { isUserInteracting = false; });

    controls.addEventListener('change', () => {
        if (!isUserInteracting) return;

        if (typeof g_state !== 'undefined' && g_state.controls) {
            const reloadBtn = g_state.controls.find(c => c.name === "reload") || (typeof getControl === 'function' ? getControl("reload") : null);
            if (reloadBtn && reloadBtn.value === "disabled") {
                reloadBtn.value = "inactive";
                reloadBtn.render();
            }
        }
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    createBoxEdges();
    createPlaneCAB(points.C, points.A, points.B);

    pointIntersection = createSphere(getPlaneIntersection(points), 0x000000, 0.07);
    pointIntersection.material.transparent = true;
    pointIntersection.renderOrder = -0.4;

    createDraggableL();
    createAll3DLabels();

    const isMovePoints = CONFIG.isMovePoints;
    if (isMovePoints) {
        setupInteractions();
    }

    const colorOA = (CONFIG.vectorColors && CONFIG.vectorColors.OA) ? CONFIG.vectorColors.OA : 0x005aff;
    const colorOB = (CONFIG.vectorColors && CONFIG.vectorColors.OB) ? CONFIG.vectorColors.OB : 0x005aff;
    const colorOC = (CONFIG.vectorColors && CONFIG.vectorColors.OC) ? CONFIG.vectorColors.OC : 0x005aff;

    createVector(points.O, points.A, colorOA);
    createVector(points.O, points.B, colorOB);
    createVector(points.O, points.C, colorOC);


    const boxCenter = new THREE.Vector3().addVectors(points.O, points.G).multiplyScalar(0.5);

    defaultCameraPos = new THREE.Vector3(7.7, 5.6, 12.5);
    defaultTarget = boxCenter.clone();
    camera.position.copy(defaultCameraPos);
    controls.target.copy(defaultTarget);
    camera.lookAt(defaultTarget);

    camera.getWorldDirection(initialCamDir);
    renderer.domElement.addEventListener('touchstart', function (e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    let lastTouchEnd = 0;
    renderer.domElement.addEventListener('touchend', function (e) {
        let now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    load3DFont();

    window.addEventListener('resize', () => onThreeResize(window.innerWidth, window.innerHeight));
}

function onThreeResize(newWidth, newHeight) {
    if (!renderer || !camera || !scene) return;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(newWidth, newHeight);

    const aspect = newWidth / newHeight;
    const frustumSize = 10;

    const xOffset = -2.35;

    const yOffset = 0.7;

    camera.left = (-frustumSize * aspect / 2) - xOffset;
    camera.right = (frustumSize * aspect / 2) - xOffset;

    camera.top = (frustumSize / 2) + yOffset;
    camera.bottom = (-frustumSize / 2) + yOffset;

    camera.updateProjectionMatrix();

    const currentZoomRatio = (typeof gData !== 'undefined') ? gData.zoomRatio : 1;

    scene.traverse(obj => {
        if (obj.material && obj.material.resolution) {
            obj.material.resolution.set(newWidth, newHeight);

            if (obj.userData && obj.userData.baseLineWidth) {
                obj.material.linewidth = obj.userData.baseLineWidth * currentZoomRatio;
            }
        }
    });
}

function createBoxOccluder() {
    const geo = new THREE.BufferGeometry();
    const p = points;

    const vertices = new Float32Array([
        // Đáy: O, B, F, C
        p.O.x, p.O.y, p.O.z, p.B.x, p.B.y, p.B.z, p.F.x, p.F.y, p.F.z,
        p.O.x, p.O.y, p.O.z, p.F.x, p.F.y, p.F.z, p.C.x, p.C.y, p.C.z,

        // Đỉnh: A, D, G, E
        p.A.x, p.A.y, p.A.z, p.D.x, p.D.y, p.D.z, p.G.x, p.G.y, p.G.z,
        p.A.x, p.A.y, p.A.z, p.G.x, p.G.y, p.G.z, p.E.x, p.E.y, p.E.z,

        // O, B, D, A
        p.O.x, p.O.y, p.O.z, p.B.x, p.B.y, p.B.z, p.D.x, p.D.y, p.D.z,
        p.O.x, p.O.y, p.O.z, p.D.x, p.D.y, p.D.z, p.A.x, p.A.y, p.A.z,

        // B, F, G, D
        p.B.x, p.B.y, p.B.z, p.F.x, p.F.y, p.F.z, p.G.x, p.G.y, p.G.z,
        p.B.x, p.B.y, p.B.z, p.G.x, p.G.y, p.G.z, p.D.x, p.D.y, p.D.z,

        // F, C, E, G
        p.F.x, p.F.y, p.F.z, p.C.x, p.C.y, p.C.z, p.E.x, p.E.y, p.E.z,
        p.F.x, p.F.y, p.F.z, p.E.x, p.E.y, p.E.z, p.G.x, p.G.y, p.G.z,

        // C, O, A, E
        p.C.x, p.C.y, p.C.z, p.O.x, p.O.y, p.O.z, p.A.x, p.A.y, p.A.z,
        p.C.x, p.C.y, p.C.z, p.A.x, p.A.y, p.A.z, p.E.x, p.E.y, p.E.z,
    ]);

    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const mat = new THREE.MeshBasicMaterial({
        colorWrite: false,
        depthWrite: true,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: 4.0,
        polygonOffsetUnits: 4.0,
        transparent: true
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = 0;
    scene.add(mesh);
}

function createDynamicEdge(p1, p2, color, width, isAlwaysDashed = false) {
    const group = new THREE.Group();

    const frontLine = createLine([p1, p2], color, width, isAlwaysDashed);
    frontLine.renderOrder = 2;

    const geometry = new THREE.LineGeometry();
    geometry.setPositions([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z]);

    const currentZoom = (typeof gData !== 'undefined') ? gData.zoomRatio : 1;

    const dashedWidth = width * 0.5;

    const dashedMat = new THREE.LineMaterial({
        color: color,
        linewidth: dashedWidth * currentZoom,
        resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
        dashed: true,
        dashSize: 0.15,
        gapSize: 0.1,
        transparent: true
    });

    const backLine = new THREE.Line2(geometry, dashedMat);
    backLine.computeLineDistances();
    backLine.renderOrder = -100;

    dashedMat.depthTest = true;
    dashedMat.depthWrite = true;
    dashedMat.depthFunc = THREE.LessEqualDepth;

    backLine.userData.baseLineWidth = dashedWidth;

    scene.remove(frontLine);
    group.add(frontLine);
    group.add(backLine);

    scene.add(group);
    return group;
}

function createLine(pointsList, color, width, isDashed = false) {
    const geometry = new THREE.LineGeometry();
    const positions = [];
    pointsList.forEach(p => positions.push(p.x, p.y, p.z));
    geometry.setPositions(positions);

    const currentZoom = (typeof gData !== 'undefined') ? gData.zoomRatio : 1;

    const matLine = new THREE.LineMaterial({
        color: color,
        linewidth: width * currentZoom,
        resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
        alphaToCoverage: true,
        dashed: isDashed,
        dashSize: 0.14,
        gapSize: 0.1,
        transparent: true
    });

    const line = new THREE.Line2(geometry, matLine);

    line.computeLineDistances();

    line.userData.baseLineWidth = width;

    scene.add(line);
    return line;
}

const equalityMarksData = [];

function createEqualityMarks(p1, p2) {
    const tickLen = 0.3;
    const spacing = 0.08;

    const lines = [];
    for (let i = 0; i < 2; i++) {
        const line = createLine([new THREE.Vector3(), new THREE.Vector3()], 0x000000, 1.5);
        line.renderOrder = -1;
        lines.push(line);
    }

    equalityMarksData.push({ lines, p1, p2, spacing, tickLen });
    if (typeof camera !== "undefined") {
        updateEqualityMarks();
    }
}

function updateEqualityMarks() {
    if (!camera) return;
    equalityMarksData.forEach(item => {
        const { lines, p1, p2, spacing, tickLen } = item;
        const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

        const viewDir = new THREE.Vector3().subVectors(camera.position, mid).normalize();

        const tickDir = new THREE.Vector3().crossVectors(viewDir, dir).normalize();
        if (tickDir.lengthSq() < 0.001) tickDir.set(1, 0, 0);

        tickDir.add(dir.clone().multiplyScalar(0)).normalize();

        lines.forEach((line, i) => {
            const offset = (i - 0.5) * spacing;
            const center = new THREE.Vector3().copy(mid).add(dir.clone().multiplyScalar(offset));

            const end1 = new THREE.Vector3().copy(center).add(tickDir.clone().multiplyScalar(tickLen / 2));
            const end2 = new THREE.Vector3().copy(center).sub(tickDir.clone().multiplyScalar(tickLen / 2));

            if (line.geometry) {
                line.geometry.setPositions([end1.x, end1.y, end1.z, end2.x, end2.y, end2.z]);
                line.computeLineDistances();
            }
        });
    });
}

function createBoxEdges() {
    createBoxOccluder();

    if (CONFIG.lines) {
        CONFIG.lines.forEach(lineOpts => {
            const p1 = points[lineOpts.start];
            const p2 = points[lineOpts.end];
            if (!p1 || !p2) return;

            let rawColor = lineOpts.color !== undefined ? lineOpts.color : 0x000000;
            if (typeof rawColor === 'string' && rawColor.startsWith('#') && rawColor.length === 9) {
                rawColor = rawColor.substring(0, 7);
            }
            const parsedColor = new THREE.Color(rawColor).getHex();
            const width = lineOpts.width !== undefined ? lineOpts.width : 3;

            if (lineOpts.type === 'dynamic') {
                createDynamicEdge(p1, p2, parsedColor, width);
            } else if (lineOpts.type === 'dashed') {
                const line = createLine([p1, p2], parsedColor, width, true);
                if (lineOpts.renderOrder !== undefined) line.renderOrder = lineOpts.renderOrder;
            } else {
                const line = createLine([p1, p2], parsedColor, width, false);
                if (lineOpts.renderOrder !== undefined) line.renderOrder = lineOpts.renderOrder;
            }
        });
    } else {
        const pairs = [
            [points.B, points.F], [points.F, points.C],
            [points.A, points.D], [points.D, points.G], [points.G, points.E], [points.E, points.A],
            [points.B, points.D], [points.F, points.G], [points.C, points.E]
        ];
        pairs.forEach(pair => createDynamicEdge(pair[0], pair[1], 0x000000, 3));

        createLine([points.O, points.H], 0x000000, 3).renderOrder = -1;
        createLine([points.O, points.A], 0x000000, 3).renderOrder = -1;
        createLine([points.O, points.B], 0x000000, 3).renderOrder = -1;
        createLine([points.O, points.C], 0x000000, 3).renderOrder = -1;

        createLine([points.G, points.H], 0x000000, 3).renderOrder = -1;
        createLine([points.A, points.B], 0x000000, 2.2).renderOrder = -1;
        createLine([points.B, points.C], 0x000000, 2.2).renderOrder = -1;
        createLine([points.C, points.A], 0x000000, 2.2).renderOrder = -1;
    }

    createEqualityMarks(points.D, points.G);
    createEqualityMarks(points.G, points.H);
}

function setupInteractions() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;

    renderer.domElement.addEventListener('pointermove', (e) => {
        if (isDragging) return;

        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(lHitbox);

        if (intersects.length > 0) {
            renderer.domElement.style.cursor = 'pointer';
        } else {
            renderer.domElement.style.cursor = 'auto';
        }
    });

    renderer.domElement.addEventListener('pointerdown', (e) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(lHitbox);

        if (intersects.length > 0) {
            isDragging = true;
            controls.enabled = false;
            renderer.domElement.style.cursor = 'pointer';
        }
    });

    window.addEventListener('pointermove', (e) => {
        if (!isDragging) return;

        renderer.domElement.style.cursor = 'pointer';

        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const dragPlane = new THREE.Plane();
        const normal = new THREE.Vector3();
        camera.getWorldDirection(normal);
        dragPlane.setFromNormalAndCoplanarPoint(normal.negate(), pointL.position);

        const targetPoint = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(dragPlane, targetPoint)) {
            const OH = new THREE.Vector3().subVectors(points.H, points.O);
            const OT = new THREE.Vector3().subVectors(targetPoint, points.O);

            let k = OT.dot(OH) / OH.lengthSq();
            k = THREE.MathUtils.clamp(k, 0, 1);

            const snaps = [0, 0.25, 0.5, 0.75, 1];
            snaps.forEach(s => { if (Math.abs(k - s) < 0.02) k = s; });

            updateL(k);

            if (typeof g_state !== 'undefined' && g_state.controls) {
                const scrollCtrl = g_state.controls.find(c => c.id === "scroll-bar");
                if (scrollCtrl) {
                    scrollCtrl.value = k * 100;
                    scrollCtrl.render();
                    const reloadBtn = getControl("reload");
                    if (reloadBtn && reloadBtn.value !== "inactive") {
                        reloadBtn.value = "inactive";
                        reloadBtn.render();
                    }
                }
            }
        }
    });

    window.addEventListener('pointerup', () => {
        isDragging = false;
        controls.enabled = true;
        renderer.domElement.style.cursor = 'auto';
    }, true);
}

function getPlaneIntersection(pts) {
    const plane = new THREE.Plane().setFromCoplanarPoints(pts.C, pts.A, pts.B);
    const line = new THREE.Line3(pts.O, pts.H);
    const L = new THREE.Vector3();
    plane.intersectLine(line, L);
    return L;
}

function getLabelOffset(point, center, distance = 0.4) {
    return new THREE.Vector3().subVectors(point, center).normalize().multiplyScalar(distance);
}

const LABEL_OFFSETS = {
    a: new THREE.Vector3(0.6, 0, 0),
    b: new THREE.Vector3(0.1, 0.4, 0),
    c: new THREE.Vector3(0.4, 0.3, 0),
    O: new THREE.Vector3(-0.4, 0.1, -0.2),
    A: new THREE.Vector3(-0.2, -0.2, 0.2),
    B: new THREE.Vector3(0.2, -0.3, -0.2),
    C: new THREE.Vector3(-0.2, 0.2, -0.2),
    D: new THREE.Vector3(0.1, -0.3, 0.2),
    E: new THREE.Vector3(-0.3, 0.1, 0.2),
    F: new THREE.Vector3(0.2, -0.1, -0.2),
    G: new THREE.Vector3(0.3, -0.2, 0),
    H: new THREE.Vector3(0, 0.4, 0),
    L: new THREE.Vector3(0.2, -0.3, -0.2)
};

function createAll3DLabels() {
    const names = ["a", "b", "c", "O", "A", "B", "C", "D", "E", "F", "G", "H", "L"];

    names.forEach(name => {
        if (canvasLabels[name]) {
            scene.remove(canvasLabels[name]);
            delete canvasLabels[name];
        }

        const color = 0x000000;
        const labelMesh = create3DLabel(name, color, 0.35, (name === "L"));
        if (!labelMesh) return;

        let pos;
        if (name === "L") {
            pos = getPlaneIntersection(points);
        } else if (name === "a") {
            pos = new THREE.Vector3().addVectors(points.O, points.A).multiplyScalar(0.5);
        } else if (name === "b") {
            pos = new THREE.Vector3().addVectors(points.O, points.B).multiplyScalar(0.5);
        } else if (name === "c") {
            pos = new THREE.Vector3().addVectors(points.O, points.C).multiplyScalar(0.5);
        } else {
            pos = points[name];
        }

        if (!pos) return;

        const offset = LABEL_OFFSETS[name] || new THREE.Vector3();

        labelMesh.position.copy(pos).add(offset);

        canvasLabels[name] = labelMesh;
    });
}


function updateLabelsSmart() {
    const currentDir = new THREE.Vector3();
    camera.getWorldDirection(currentDir);

    const dot = currentDir.dot(initialCamDir);
    const t = THREE.MathUtils.clamp((1 - dot) / 0.1, 0, 1);

    const center = new THREE.Vector3()
        .addVectors(points.O, points.G)
        .multiplyScalar(0.5);

    for (let name in canvasLabels) {
        const label = canvasLabels[name];
        if (!label) continue;

        let pos;
        if (name === "L") {
            pos = getPlaneIntersection(points);
        } else if (name === "a") {
            pos = new THREE.Vector3().addVectors(points.O, points.A).multiplyScalar(0.5);
        } else if (name === "b") {
            pos = new THREE.Vector3().addVectors(points.O, points.B).multiplyScalar(0.5);
        } else if (name === "c") {
            pos = new THREE.Vector3().addVectors(points.O, points.C).multiplyScalar(0.5);
        } else {
            pos = points[name];
        }

        if (!pos) continue;

        const customOffset = LABEL_OFFSETS[name] || new THREE.Vector3();
        const autoOffset = getLabelOffset(pos, center, 0.4);

        const finalOffset = new THREE.Vector3().lerpVectors(
            customOffset,
            autoOffset,
            t
        );

        label.position.copy(pos).add(finalOffset);

        label.quaternion.copy(camera.quaternion);
    }
}


function createPlaneCAB(C, A, B) {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([C.x, C.y, C.z, A.x, A.y, A.z, B.x, B.y, B.z]);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshBasicMaterial({
        color: 0xFFE8A1,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        depthTest: true,
        depthWrite: false
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.renderOrder = -0.5;
    scene.add(plane);
    return plane;
}

function createSphere(pos, color, radius = 0.08) {
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 16, 16),
        new THREE.MeshBasicMaterial({
            color: color,
            depthTest: true
        })
    );
    mesh.position.copy(pos);
    scene.add(mesh);
    return mesh;
}

const ARROW_LENGTH = 0.27;
const EPS = 0.0001;

const VECTOR_THICKNESS = 0.03;
const ARROW_HEAD_RADIUS = 0.07;

function createVector(p1, p2, color, isDynamic = false) {
    let rawColor = color;
    if (typeof rawColor === 'string' && rawColor.startsWith('#') && rawColor.length === 9) {
        rawColor = rawColor.substring(0, 7);
    }

    const group = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(rawColor),
        transparent: true
    });

    const shaftGeo = new THREE.CylinderGeometry(VECTOR_THICKNESS, VECTOR_THICKNESS, 1, 16);
    shaftGeo.translate(0, 0.5, 0);
    const shaft = new THREE.Mesh(shaftGeo, mat);
    shaft.name = "shaft";
    shaft.renderOrder = -1;
    group.add(shaft);

    const coneGeo = new THREE.ConeGeometry(ARROW_HEAD_RADIUS, ARROW_LENGTH, 16);
    coneGeo.translate(0, ARROW_LENGTH / 2, 0);
    const cone = new THREE.Mesh(coneGeo, mat);
    cone.name = "cone";
    cone.renderOrder = -1;
    group.add(cone);

    scene.add(group);
    if (!isDynamic) updateVectorShape(group, p1, p2);

    return group;
}
function updateVectorShape(group, p1, p2) {
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const length = dir.length();

    const shaft = group.getObjectByName("shaft");
    const cone = group.getObjectByName("cone");

    if (length < EPS) {
        shaft.scale.set(1, EPS, 1);
        cone.visible = false;
        return;
    }

    cone.visible = true;

    const shaftLength = Math.max(EPS, length - ARROW_LENGTH);

    shaft.scale.set(1, shaftLength, 1);

    cone.position.set(0, shaftLength + EPS, 0);

    dir.normalize();
    group.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir
    );

    group.position.copy(p1);
}

function createDraggableL() {
    pointL = createSphere(new THREE.Vector3(), CONFIG.pointColor, 0.07);
    pointL.material.transparent = true;
    pointL.renderOrder = -0.3;

    const hitGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    lHitbox = new THREE.Mesh(hitGeo, hitMat);
    scene.add(lHitbox);

    const positions = new Float32Array([points.O.x, points.O.y, points.O.z, points.O.x, points.O.y, points.O.z]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    lineOL = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xEA4F2F, linewidth: 2 }));
    lineOL.renderOrder = -1;
    scene.add(lineOL);

    const colorOL = (CONFIG.vectorColors && CONFIG.vectorColors.OL) ? CONFIG.vectorColors.OL : 0xff0000;
    vectorOL = createVector(points.O, points.O, colorOL, true);
    updateL(0.5);
}

function updateL(k) {
    if (!pointL || !points.O || !points.H) return;

    let newPos = new THREE.Vector3().lerpVectors(points.O, points.H, k);

    pointL.position.copy(newPos);
    lHitbox.position.copy(newPos);

    if (lineOL) {
        const positions = lineOL.geometry.attributes.position.array;
        positions[3] = newPos.x;
        positions[4] = newPos.y;
        positions[5] = newPos.z;
        lineOL.geometry.attributes.position.needsUpdate = true;
    }
    // updateAllLabels();
    if (vectorOL) {
        updateVectorShape(vectorOL, points.O, newPos);
    }
}

function updateAllLabels() {
    const center = new THREE.Vector3().addVectors(points.O, points.G).multiplyScalar(0.5);

    if (canvasLabels["L"] && pointL) {
        const offsetL = getLabelOffset(pointL.position, center, 0.3);
        canvasLabels["L"].position.copy(pointL.position).add(offsetL);
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (controls) controls.update();

    updateLabelsSmart();
    if (typeof updateEqualityMarks === 'function') updateEqualityMarks();

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }

}