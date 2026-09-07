Hướng dẫn sử dụng Control: Clickable
1. Clickable cho phép gán các tương tác click chuột (hoặc chạm trên thiết bị di động) vào các phần tử SVG. Khác với drag (kéo thả), clickable tập trung vào việc xử lý sự kiện tại thời điểm nhấn chuột (mousedown) để thay đổi trạng thái (state) và cập nhật giao diện.

2. Cấu trúc khai báo:
Để sử dụng, ta thêm một đối tượng Control mới vào trong object controls của g_state.

JavaScript
```js
controls: {
  ten_control: new Control({
    type: 'clickable',      // Bắt buộc
    id: 'id-phan-tu',       // Sử dụng nếu gắn vào 1 ID duy nhất
    class_name: 'class-chung', // Sử dụng nếu gắn vào nhóm nhiều phần tử
    mousedown: function() {
      // Logic xử lý khi click
    },
    render: function() {
      // Logic cập nhật giao diện
    }
  })
}
```
3. Các thuộc tính quan trọng:
type: Luôn để là 'clickable'.
id / class_name: Định danh phần tử SVG trong DOM. Thư viện sẽ tự động dùng jQuery để lắng nghe sự kiện trên các selector này.
ctrl.el: Trong hàm mousedown, thư viện gán phần tử DOM vừa bị click vào this.el. có thể dùng $(this.el) để lấy các thuộc tính như data, id của chính phần tử đó.
render: Hàm này không tự chạy. cần gọi ctrl.render() hoặc getControl('name').render() sau khi thay đổi dữ liệu.
4. Code mẫu: Hệ thống chuyển đổi Step và Type
Bước 1: Chuẩn bị HTML (SVG)
Các nút bấm cần có class tương ứng với khai báo trong JavaScript và thuộc tính data để truyền tham số.

```html
<svg id="svg_root" width="1024" height="648">
  <g class="change-type-graph" data="type-1">
    <rect width="100" height="40" fill="#eee" />
    <text y="25">Type 1</text>
  </g>
  
  <g class="change-step" data="1">
    <text y="80">Next Step</text>
  </g>

  <text id="ui-type-graph" y="150">Current Type: 1</text>
</svg>
```
Bước 2: Viết Logic trong index.js

```js
window.initState = () => {
  g_state = {
    type_graph: 1,
    step: 0,
    
    controls: {
      ctrl_change_type: new Control({
        type: 'clickable',
        class_name: 'change-type-graph',
        mousedown: function() {
          //xử lý btn nhún hoặc sự kiện liên quan down
        },
        mouseup: function() {
          let ctrl = this;
          // Lấy giá trị từ thuộc tính data của phần tử bị click
          let dataStr = $(ctrl.el).attr('data'); 
          g_state.type_graph = dataStr.replace('type-', ''); 
          
          // Cập nhật lại UI
          ctrl.render();
        },
        render: function() {
          let ctrl = this;
          // Highlight nút được chọn
          $(`.${ctrl.class} text`).attr('fill', 'gray');
          $(`.${ctrl.class}[data='type-${g_state.type_graph}'] text`).attr('fill', 'blue');
        }
      })
    }
  };
};
```

## 5. Kỹ thuật nâng cao: "Render Tổng" (tạo ctrl_render)
Khi ứng dụng lớn lên (như mô phỏng nhiều bước, nhiều trạng thái vật lý), việc cập nhật giao diện (ẩn/hiện các thẻ, thay đổi text) ở bên trong `mousedown` của từng nút bấm sẽ khiến code bị lặp lại và khó bảo trì.

Để giải quyết ta sẽ tạo ra một `clickable` control "giả". Control này không được người dùng click vào, nó chỉ đóng vai trò là nơi tập trung đọc `g_state` và vẽ lại toàn bộ màn hình.

### Đặc điểm cấu hình của Trạm Render Tổng
* **`id: 'ignore-this'`** (hoặc một ID không tồn tại trên file HTML): Để thư viện không vô tình gắn sự kiện click vào phần tử thật nào.
* **`mousedown: function(){}`**: Bỏ trống.
* **`render: function(){}`**: Chứa toàn bộ logic kiểm tra `g_state` và gọi các hàm cập nhật UI như `showElement()`, `$('#id').text()`, v.v.

### Code Mẫu cấu hình

```javascript
controls: {
  // 1. RENDER TỔNG
  ctrl_display: new Control({
    type: 'clickable',
    id: 'ignore-this', // tên không có thật tránh nhầm lẫn
    mousedown: function() { 
      // trống
    },
    render: function() {
      const s = g_state.simulation;

      // Đọc trạng thái (state) hiện tại để quyết định UI
      if (s.step === STEPS.HOME) {
        showElement("#graph-home", true);
        showElement("#graph-water", false);
      } else if (s.step === STEPS.ANIMATION) {
        showElement("#graph-home", false);
        // Hiển thị tuỳ theo chất liệu
        if (s.substance === SUBSTANCES.WATER) {
          showElement("#graph-water", true);
        }
      }

      // Quét và yêu cầu các control khác tự render lại giao diện của chính nó
      g_state_controls.forEach((ctrl) => {
        if (ctrl.name !== "ctrl_display" && ctrl.render) {
          ctrl.render();
        }
      });
    }
  }),

  // 2. NÚT BẤM THỰC TẾ
  ctrl_water: new Control({
    type: 'clickable',
    id: 'btn-water',
    mousedown: function() {

    },
    mouseup: function() {
      let ctrl = this;
      // Nút bấm thật CHỈ CẦN cập nhật dữ liệu vào g_state
      g_state.simulation.substance = SUBSTANCES.WATER;
      g_state.simulation.step = STEPS.ANIMATION;
      
      // Sau đó gọi "Render Tổng" giải quyết phần hiển thị
      getControl("ctrl_display").render();
      //xử lý render đặc thù của đối tượgn
      ctrl.render();
    }
  })
}
```

### Lợi ích của phương pháp này
1. **Quản lý UI tập trung:** Bất cứ khi nào thấy giao diện bị sai, chỉ cần tìm đến hàm `render` của `ctrl_display` để kiểm tra logic, thay vì phải mò mẫm xem nút bấm nào đã làm sai lệch giao diện.
2. **Code nút bấm sạch:** Các control thực tế (như `ctrl_water`, `ctrl_reset`) trở nên rất ngắn gọn. Trách nhiệm của chúng chỉ là thay đổi số liệu toán học/trạng thái để `ctrl_render` cập nhật UI.
3. **Dễ dàng làm hiệu ứng chuyển cảnh:** Vì mọi logic ẩn/hiện đều nằm ở một nơi, nên dễ so sánh `step` hiện tại và `prevStep` để gọi các hàm chạy hiệu ứng mờ dần (`fadein`, `fadeout`) một cách đồng bộ.