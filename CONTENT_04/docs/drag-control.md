# Hướng dẫn kỹ thuật: Drag Control 

Điều khiển kéo thả (`drag`) sử dụng thuộc tính `translate` của SVG (sử dụng `SVGLib.getTranslate` ) để quản lý vị trí tuyệt đối, giúp việc di chuyển mượt mà và chính xác hơn trong các nhóm phần tử phức tạp.

---

## 1. Khởi tạo Control Drag

Để tạo một vùng kéo thả, chúng ta khai báo một đối tượng `Control` với `type: "drag"`.

```javascript
ctrl_rect_drag: new Control({
        type: "drag",
        mark: "ctrl-drag",
        id: "rect-drag-demo",
        value1: new Point3D(600, 50, 0),
        minimum: 0.001,
        value: 0,

        info: {
          x: [75, 75],
          y: [75, 75],
          width: 150, //  width of the rectangle
          height: 100, //  height of the rectangle
        },
    
    fn_drag: function ({ eventName }) {
        // Logic xử lý kéo thả (xem mục 2)
    },
    
    render: function () {
        // Logic hiển thị (xem mục 3)
    }
})
```

```svg
<g id="rect-drag-demo" transform="translate(600, 50)">
  <text x="0" y="-20" fill="#4caf50" font-size="20" font-weight="bold">Constrained Rectangle Drag:</text>
  <rect id="rect-constrained" x="0" y="0" width="150" height="100" fill="#4caf50" opacity="0.7" stroke="white" stroke-width="3" rx="10" class="cursor-pointer" />
  <text id="rect-status" x="0" y="125" fill="#4caf50" font-size="14" font-weight="bold">Pos: (0, 0)</text>
</g>
```
---

## 2. Logic xử lý trong `fn_drag`

Cơ chế kéo thả dựa trên việc tính toán sự thay đổi (`delta`) giữa vị trí chuột hiện tại và vị trí lúc bắt đầu nhấn chuột.

### Bước 1: Mousedown (Lấy vị trí gốc)
Khi người dùng nhấn chuột, chúng ta sử dụng `SVGLib.getTranslate` để lấy tọa độ `translate` hiện tại của phần tử. Điều này đảm bảo việc kéo thả luôn bắt đầu từ vị trí thực tế của vật thể.

```javascript
if (eventName === "mousedown") {
     ctrl.startMouse = { x: ctrl.curPos.x, y: ctrl.curPos.y };

            ctrl.startRect = { x: ctrl.value1.x, y: ctrl.value1.y };
}
```

### Bước 2: Mousemove (Tính toán và Giới hạn)
Hệ thống tính toán `delta` và cộng vào vị trí gốc. Sau đó, nó thực hiện "Clamping" để đảm bảo vật thể không đi ra ngoài vùng hiển thị cho phép (`visible_x/y`).

```javascript
else if (eventName === "mousemove") {
    if (!ctrl.startMouse || !ctrl.startRect) return;

            const dx = ctrl.curPos.x - ctrl.startMouse.x;
            const dy = ctrl.curPos.y - ctrl.startMouse.y;

            let newX = ctrl.startRect.x + dx;
            let newY = ctrl.startRect.y + dy;

            const minX = ctrl.info.x[0] - ctrl.info.width;
            const maxX = g_state.c_screen_width - ctrl.info.x[1];
            const minY = ctrl.info.y[0] - ctrl.info.height;
            const maxY = g_state.c_screen_height - ctrl.info.y[1];

            // clamp to allowed region
            ctrl.value1.x = Math.max(minX, Math.min(maxX, newX));
            ctrl.value1.y = Math.max(minY, Math.min(maxY, newY));

            ctrl.render();
}
```

---

## 3. Hiển thị thay đổi translate trong `render`

Thay đổi translate cua ca nhom drag

```javascript
render: function () {
    let ctrl = this;
    let el = $(`#${ctrl.id}`);
    if (el.length && ctrl.value1) {
        // Sử dụng translate để di chuyển cả group
        el.attr("transform", `translate(${ctrl.value1.x}, ${ctrl.value1.y})`);
        
        // Cập nhật text hiển thị tọa độ
        $("#rect-status").text(
            `Pos: (${Math.round(ctrl.value1.x)}, ${Math.round(ctrl.value1.y)})`
        );
    }
}
```


```javascript
ctrl_rect_drag: new Control({
        type: "drag",
        mark: "ctrl-drag",
        id: "rect-drag-demo",
        value1: new Point3D(600, 50, 0),
        minimum: 0.001,
        value: 0,

        info: {
          x: [75, 75],
          y: [75, 75],
          width: 150, //  width of the rectangle
          height: 100, //  height of the rectangle
        },

        fn_drag: function ({ eventName }) {
          let ctrl = this;

          if (eventName === "mousedown") {
            ctrl.startMouse = { x: ctrl.curPos.x, y: ctrl.curPos.y };

            ctrl.startRect = { x: ctrl.value1.x, y: ctrl.value1.y };
          } else if (eventName === "mousemove") {
            if (!ctrl.startMouse || !ctrl.startRect) return;

            const dx = ctrl.curPos.x - ctrl.startMouse.x;
            const dy = ctrl.curPos.y - ctrl.startMouse.y;

            let newX = ctrl.startRect.x + dx;
            let newY = ctrl.startRect.y + dy;

            const minX = ctrl.info.x[0] - ctrl.info.width;
            const maxX = g_state.c_screen_width - ctrl.info.x[1];
            const minY = ctrl.info.y[0] - ctrl.info.height;
            const maxY = g_state.c_screen_height - ctrl.info.y[1];

            // clamp to allowed region
            ctrl.value1.x = Math.max(minX, Math.min(maxX, newX));
            ctrl.value1.y = Math.max(minY, Math.min(maxY, newY));

            ctrl.render();
          }
        },

        render: function () {
          let ctrl = this;
          let el = $(`#${ctrl.id}`);
          if (el.length && ctrl.value1) {
            el.attr(
              "transform",
              `translate(${ctrl.value1.x}, ${ctrl.value1.y})`,
            );
          }
        },
      }),
```
---


