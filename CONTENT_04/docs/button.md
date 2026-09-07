# 1. Hướng dẫn sử dụng các control cơ bản (button)

## A.Tổng quan

Control là một object cấu hình gồm:

- type: loại control (button, drag,…)

- id: id duy nhất

- value: trạng thái chính (active / inactive)

- value2: trạng thái phụ (dùng cho control nhiều state như animate)

- mousedown(): xử lý khi nhấn xuống

- mouseup(): xử lý khi thả chuột

- render(): cập nhật giao diện theo state



Control đươc lưu trong g_state.controls

## B. Cấu trúc cơ bản

```js
ctrl_btn_example: new Control({
type: "button",
id: "btn-example",
value: "inactive",

mousedown: function () {
let ctrl = this;
ctrl.value = "active";
ctrl.render();
},

mouseup: function () {
let ctrl = this;
ctrl.value = "inactive";
ctrl.render();
},

render: function () {
let ctrl = this;

    showElement(`.${ctrl.id}`, false);
    showElement(`#${ctrl.id}-${ctrl.value}`, true);

}
}
```

**value:**

- trạng thái của nút (active/inactive/disabled,..)

**value2:**

- tên nút

**mousedown()**
Thường làm 3 việc:

- Đổi trạng thái nút

- Gọi hiệu ứng nhấn nút

- Gọi logic chính

- Render lại

**mouseup()**
Thường làm 3 việc:
- Đổi lại "inactive"

- Gọi logic chính

- Render lại


## C. Cách chuyển giữa niều nút
```js
ctrl.value2 = ctrl.flow_member[ctrl.value2];
```
- trong flow-member sẻ thẻ hiện cách chuyển giao các nút
- ví dụ: 

    play -> pause

    pause->continue

    continue ->pause

## D. Cấu trúc cơ bản html của 1 nút

```html
<g id="btn-example-group">
  <g id="btn-example-inactive" class="btn-example cursor-pointer"></g>
  <g id="btn-example-active" class="btn-example"></g>
  <g id="btn-example-disabled" class="btn-example"></g>
</g>
```

## E. Cấu trúc của 1 nút chuyển nhiều dạng

ví dụ:
```html
<g id="btn-animate-group">
<g id="btn-animate-play-inactive" class="btn-play btn-animate"></g>
<g id="btn-animate-play-active" class="btn-play btn-animate"></g>
<g id="btn-animate-resume-inactive" class="btn-resume btn-animate "></g>
<g id="btn-animate-resume-active" class="btn-resume btn-animate "></g>
<g id="btn-animate-pause-inactive" class="btn-pause btn-animate"></g>
<g id="btn-animate-pause-active" class="btn-pause btn-animate "></g>
<g id="btn-animate-play-disabled" class="btn-play btn-animate "></g>
</g>
```
**Format id chuẩn:**
```js
btn-animate-{type}-{state}
```
- chứa class "btn-animate" kèm class riêng của từng dạng nút
- type là tên nút gồm:

    play

    resume

    pause

- state là trạng thái gồm:

    inactive → trạng thái bình thường

    active → khi đang được chọn / đang chạy

    disabled → bị vô hiệu hóa

**Ví dụ follow member:**
```js
 ctrl_btn_animate: new Control({
            type: "button",
            is_group: true,
            id: "btn-animate",
            value: "inactive",
            value2: "play",
            flow_member: {
                play: "pause",
                pause: "resume",
                resume: "pause",
                play1:"resume",
            },
            mousedown: function () {
                let ctrl = this;
                ctrl.value = "active";
                ctrl.render();
                animateButtonEffect(`#${ctrl.id}-group`, true, null, 4);
            },
            mouseup: function () {
                let ctrl = this;

                switch (ctrl.value2) {
                    case 'play':
                    //logic nút 
                        break;
                    case 'pause':
                    //logic nút 
                        break;
                    case 'resume':
                    //logic nút 
                        break;

                    default:
                        break;
                }


                animateButtonEffect(`#${ctrl.id}-group`, false, () => {
                    ctrl.value2 = ctrl.flow_member[ctrl.value2];
                    ctrl.value = "inactive";
                    ctrl.render();
                },
                    4
                );

            },
            render: function () {
                let ctrl = this;

                showElement(`.${ctrl.id}`, false)
                showElement(`#${ctrl.id}-${ctrl.value2}-${ctrl.value}`, true)
            }
        }),
```
## F. Cách viết render()

**Render phải:**

- Ẩn tất cả trạng thái

- Hiện đúng trạng thái hiện tại(chỉ thay đổi UI ở render)

- Ví dụ chuẩn:
```js
showElement(`.${ctrl.id}`, false);
showElement(`#${ctrl.id}-${ctrl.value}`, true);
```

# 2. Cách nhún button khi click

## Hàm sử dụng:

animateButtonEffect(id, isDown, cb, dy);

## Ý nghĩa tham số

id: selector của phần tử (ví dụ: "#btn-reset-group")
isDown: true = nhấn xuống, false = nhả ra
cb: callback chạy sau khi animation xong
dy: độ nhún theo trục Y (pixel)

## Cách dùng cơ bản

ví dụ: nút nhún 4px khi mousedown
```js
animateButtonEffect("#btn-reset-group", true, null, 4);

trả vè vị trí ban đầu khi thả chuột khi mouseup
```js
animateButtonEffect("#btn-reset-group", false, null, 4);
``
Có callback sau khi nhún xong

```js
animateButtonEffect("#btn-reset-group", true, function () {
// logic muốn thêm
console.log("Nhấn xong rồi");
}, 4);
```

Ví dụ 1 nút dùng hiệu ứng nhún:

```js
controls: {
ctrl_btn_reset: new Control({
type: "button",
id: "btn-reset",
value: "inactive",
mousedown: function () {
let ctrl = this;
ctrl.value = "active";

      animateButtonEffect("#btn-reset-group", true, null, 4);
    },
    mouseup: function () {
      let ctrl = this;
      ctrl.value = "inactive";

      animateButtonEffect("#btn-reset-group", false, null, 4);
    }

})
}
```