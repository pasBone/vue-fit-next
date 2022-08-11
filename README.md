# vue-fit-next

[![npm](https://img.shields.io/npm/v/vue-fit-next)](https://www.npmjs.com/package/vue-fit-next)

通过 `vue` 指令的方式为元素添加屏幕自适应功能。

### 功能

- 使用简单，一行指令即可满足基本功能。
- 支持整屏自由拖拽、缩放，帮助查看细节和界面死角。
- 支持出场入场动画，切换时过渡更自然。
- 对布局无侵入，不破坏原始 dom 结构。

### 安装

使用您选择的包管理器进行安装。

```bash

#yarn
yarn add vue-fit-next

#npm
npm install vue-fit-next

#pnpm
pnpm add vue-fit-next

```

### 基本使用

```ts 
// main.ts
import Fit from 'vue-fit-next'

app
  .use(
    Fit({
      width: 3840, // 设计稿宽度
      height: 2160, // 设计稿高度
    })
  )
  .mount('#app')

```

```html
<div v-fit>
  添加 v-fit 指令的元素会根据屏幕尺寸和预设的设计稿尺寸进行缩放
</div>
```

### 调整布局方式

1. 可通过给指令添加参数来调整元素的缩放中心，

  ```html
    <div v-fit:1>transform-origin: left top</div>
    <div v-fit:2>transform-origin: center top</div>
    <div v-fit:3>transform-origin: right top</div>

    <div v-fit:4>transform-origin: left center</div>
    <div v-fit:5>transform-origin: center center</div>
    <div v-fit:6>transform-origin: right center</div>

    <div v-fit:7>transform-origin: left bottom</div>
    <div v-fit:8>transform-origin: center bottom</div>
    <div v-fit:9>transform-origin: right bottom</div>
  ...

  如果把一个 div 划分成9个小区域的话，那么 1-9 对应的关系如下：

                 -----------
                | 1 | 2 | 3 |
                 -----------
                | 4 | 5 | 6 |
                 -----------
                | 7 | 8 | 9 |
                 -----------

  比如元素要水平垂直居中，那就设置 5
  ```
  
  1. 常见的 3 种缩放中心可以 通过 `left`、 `center`、 `right` 的方式简写

  ```html
    <div v-fit:left>缩放中心 transform-origin: left top</div>
    <div v-fit:center>缩放中心 transform-origin: center top</div>
    <div v-fit:right>缩放中心 transform-origin: right top</div>
  ```

2. 使用 origin 属性也是同样的效果
  ```html
  <div v-fit="{origin: 'left'}">缩放中心 transform-origin: left top</div>
  <div v-fit="{origin: '1'}">缩放中心 transform-origin: left top</div>
  ···

3. 也可以直接通过css样式去设置 transform-origin 达到同样的效果

## License

[MIT](./LICENSE) License &copy; 2022-PRESENT [pasbone](https://github.com/pasbone)
