// config.js

const CONFIG = {
    show_log: false, // true: enable console log, false: disable console
    pointColor: "#0b89dd",
    vectorColors: {
        OA: "#005aff",
        OB: "#005aff",
        OC: "#005aff",
        OP: "#ff0000",
        OQ: "#ff0000"
    },
    shape: {
        O: [0, 0, 0],
        A: [0, 0, 3],
        B: [4, 0, 0],
        D: [4, 0, 3],

        C: [0, 2.3, 0],
        E: [0, 2.3, 3],
        F: [4, 2.3, 0],
        H: [4, 4.6, 3],

        // Point M on OB, and point Q on OH. Edit these to move the points.
        M: [2, 0, 0],
        Q: [0.8, 0.92, 0.6]
    },
    // Shift of the M and Q labels away from their points. [x, y, z]
    labelOffsets: {
        M: [0.2, -0.4, -0.2],
        Q: [0, 0.5, 0.2]
    },
    // Camera viewpoint. position is where the camera sits.
    // It looks at target; leave target null to look at the center of the figure.
    camera: {
        position: [-6, 5, 18],
        target: null,
        zoom: 1.2
    },
    // Configure line types (dashed, solid, color, embossed options)
    // Type: 'dynamic' (automatically dashed when obscured), 'solid' (solid), 'dashed' (dashed).
    lines: [
        // BOTTOM EDGES / SIDE VIEWS (Normal solid line, becomes dashed when obscured)
        { start: 'B', end: 'F', color: "#000000", width: 3, type: 'dynamic' },
        { start: 'F', end: 'C', color: "#000000", width: 3, type: 'dynamic' },
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

        { start: 'A', end: 'M', color: "#000000", width: 2.2, type: 'solid', renderOrder: -0.2 },
        { start: 'M', end: 'C', color: "#000000", width: 2.2, type: 'solid', renderOrder: -0.2 },
        { start: 'C', end: 'A', color: "#000000", width: 2.2, type: 'solid', renderOrder: -0.2 },
    ]
}