var CONFIG = {
  // Khoảng thời gian tối đa (VD: 5, 10, 20, 100)
  t_max: 10,

  // Tổng thời gian chạy animation thực tế ngoài đời thực (ms) - Cố định không phụ thuộc t_max
  animation_duration: 5000,

  // Bán kính đường tròn (px)
  radius: 180,

  // Góc ban đầu (rad): 0 = nằm trên trục X dương tại (r, 0).
  // Nếu muốn bắt đầu ở trục Y phía trên: đặt Math.PI / 2
  initial_angle: 0,

  // Độ dài vector vận tốc (px)
  vector_v_length: 94.79,

  // Độ dài vector gia tốc (px)
  vector_a_length: 57.28,

  // Cho phép chạy vô hạn vòng hay dừng khi hết 1 vòng (t_max)
  loop_infinite: false
};

// ─── URL Parameter Override (for testing only) ───────────────────────────────
// Tester có thể truyền tham số qua URL để override config mà không cần sửa file.
// Ví dụ: index.html?t_max=20   hoặc   index.html?t_max=5&animation_duration=8000
// Chỉ các key đã có trong CONFIG và có giá trị là số mới được override.
(function () {
  var params = new URLSearchParams(window.location.search);
  params.forEach(function (value, key) {
    if (Object.prototype.hasOwnProperty.call(CONFIG, key) && typeof CONFIG[key] === 'number') {
      var parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        CONFIG[key] = parsed;
      }
    }
  });
})();
