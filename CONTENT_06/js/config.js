var CONFIG = {
  // Khoảng thời gian tối đa (VD: 5, 10, 20, 100)
  t_max: 10
};

// ─── URL Parameter Override (for testing only) ───────────────────────────────
// Tester có thể truyền tham số qua URL để override config mà không cần sửa file.
// Ví dụ: index.html?t_max=20   hoặc   index.html?t_max=5
// Chỉ key t_max (số) mới được override.
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
