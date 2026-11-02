// config.js

const CONFIG = {
    pointColor: "#0b89dd",
    vectorColors: {
        OA: "#005aff",
        OB: "#005aff",
        OC: "#005aff",
        OP: "#ff0000"
    },
    shape: {
        O: [0, 0, 0],
        A: [0, 0, 3],
        B: [4, 0, 0],
        D: [4, 0, 3],

        C: [0, 2, -1],
        E: [0, 2, 2],
        F: [4, 2, -1],
        H: [4, 4, 1]
    },
    // Configure line types (dashed, solid, color, embossed options)
    // Type: 'dynamic' (automatically dashed when obscured), 'solid' (solid), 'dashed' (dashed).
    lines: [
        // BOTTOM EDGES / SIDE VIEWS (Normal solid line, becomes dashed when obscured)
        { start: 'B', end: 'F', color: "#000000", width: 3, type: 'dynamic' },
        // backRenderOrder -0.4: dashed part drawn after plane AFC (-0.5) so the plane doesn't cover it
        { start: 'F', end: 'C', color: "#000000", width: 3, type: 'dynamic', backRenderOrder: -0.4 },
        { start: 'A', end: 'D', color: "#000000", width: 3, type: 'dynamic' },
        { start: 'D', end: 'G', color: "#000000", width: 3, type: 'dynamic' },
        { start: 'G', end: 'E', color: "#000000", width: 3, type: 'dynamic' },
        { start: 'E', end: 'A', color: "#000000", width: 3, type: 'dynamic' },
        { start: 'B', end: 'D', color: "#000000", width: 3, type: 'dynamic' },
        { start: 'F', end: 'G', color: "#000000", width: 3, type: 'dynamic' },
        { start: 'C', end: 'E', color: "#000000", width: 3, type: 'dynamic' },

        // UNHAUNTED LINES (renderOrder = -1)
        { start: 'O', end: 'H', color: "#000000", width: 2.2, type: 'solid', renderOrder: -1 },
        { start: 'O', end: 'A', color: "#000000", width: 3, type: 'solid', renderOrder: -1 },
        { start: 'O', end: 'B', color: "#000000", width: 3, type: 'solid', renderOrder: -1 },
        { start: 'O', end: 'C', color: "#000000", width: 3, type: 'solid', renderOrder: -1 },

        { start: 'G', end: 'H', color: "#000000", width: 3, type: 'dynamic', renderOrder: -1 },

        { start: 'A', end: 'F', color: "#000000", width: 2.2, type: 'solid', renderOrder: -0.2 },
        { start: 'C', end: 'A', color: "#000000", width: 2.2, type: 'solid', renderOrder: -0.2 },
    ]
}