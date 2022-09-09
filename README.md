# vue-fit-next

[![npm](https://img.shields.io/npm/v/vue-fit-next)](https://www.npmjs.com/package/vue-fit-next)

通过 `vue` 指令的方式为元素添加屏幕自适应功能。

## 注意事项

被问到最多次的问题就是加载出来之后是一片空白。

请先检查下是否设置了基础样式哈：

```css
html, body{
  height: 100vh;
  width: 100vw;
  overflow: hidden
}
```

## 功能

- 使用简单，一行指令即可满足基本功能。
- 支持整屏自由拖拽、缩放，帮助开发者查看细节和死角。
- 支持出场入场动画，切换时过渡更自然。
- 支持 zoom 模式和 scale 两种模式。
- 对布局无侵入，不破坏原始 dom 结构。

## 预览

- [scale 模式](https://62fca80a83bbdb00082f2b14--tranquil-baklava-24da8b.netlify.app/demo-scale-mode)
- [zoom 模式](https://62fca80a83bbdb00082f2b14--tranquil-baklava-24da8b.netlify.app/demo-zoom-mode)

![](https://github.com/pasBone/vue-fit-next/blob/dev/playground/public/gif.gif)

## 安装

使用您选择的包管理器进行安装。

```bash

#yarn
yarn add vue-fit-next

#npm
npm install vue-fit-next

#pnpm
pnpm add vue-fit-next

```

## 基本使用

```ts 
// main.ts
import Fit from 'vue-fit-next'

app
  .use(
    Fit({
      width: 3840, // 设计稿宽度
      height: 2160, // 设计稿高度
      mode: 'scale', // 可选， 支持 scale 和 zoom 两种方案，默认为 scale
      scaleStep: 0.05 // 可选，默认 0.05， 每次鼠标滚动缩放的增量，分辨率很大的时候会比较有用
    })
  )
  .mount('#app')

```

```html
<div v-fit>
  添加 `v-fit` 指令的元素会根据屏幕尺寸和预设的设计稿尺寸进行缩放
</div>
```

## 使用 zoom 模式

`zoom` 模式采用浏览器非标准属性进行缩放。  

缺点： 

1. **FireFox** 不支持！ (不过大屏展示大多数不用考虑浏览器环境，可以直接上chrome)
2. 渲染的性能存在差异，zoom会引起一整个页面的重新渲染。 (个人觉得大屏几乎是一次性渲染做展示，倒也不用顾虑太多)

优点：

配合 v-fit 食用更简单，完全不用考虑 `v-fit` 定义的布局概念，直接使用 `css` 就能完成你想要的布局和适配。


## 使用 scale 模式

`scale` 模式是采用的 css 的 scale 属性进行缩放。

`scale` 模式配合 `v-fit` 使用前需要了解一些 `v-fit` 对布局增加的属性概念：


### 布局方式

- 可通过给指令添加参数来调整元素的缩放中心，

  ```html
    <div v-fit:left>leftTop 的简写, 左上角</div>
    <div v-fit:center>centerTop 的简写, 顶部位置且水平居中</div>
    <div v-fit:right>rightTop 的简写, 右上角</div>

    大多数场景用上面3个布局属性就够用了。当然我们也提供了其他几个位置的属性:

    <div v-fit:leftCenter>靠左，垂直居中</div>
    <div v-fit:centerCenter>水平垂直居中</div>
    <div v-fit:rightCenter>靠右，垂直居中</div>

    <div v-fit:leftBottom>左下角</div>
    <div v-fit:centerBottom>底部位置且水平居中</div>
    <div v-fit:rightBottom>右下角</div>
  ...

  如果把一个屏幕划分成9个小区域的话，那么对应的关系如下：

         -----------------------------------------
        |            |              |             |
        |    left    |    center    |    right    |
        |            |              |             |
         -----------------------------------------
        |            |              |             |
        | leftCenter | centerCenter | rightCenter |
        |            |              |             |
         -----------------------------------------
        |            |              |             |
        | leftBottom | centerBottom | rightBottom |
        |            |               |            |
         -----------------------------------------
  ```
  再配合 css 的 top、right、bottom、left 等可以进行更细微的位置偏移

- 使用 origin 属性代替上面:left的写法
   
```html
<div v-fit="{origin: 'left'}"></div>
```

## 拖拽和缩放

- 按住空格键的同时鼠标点击界面即可进行拖动。
- 按住 ctrl 键的同时滚动鼠标，实现整体缩放及位置偏移。
- 双击 space 键进行位置复原。


## 入场和出场动画

### 动画列表

目前内置了以下几种出/入动画

- slideInLeft | slideInRight 
- slideOutLeft | slideOutRight 
- slideInUp | slideInDown
- slideOutUp | slideOutDown

### 使用方式

1. 全局配置(可选)
  
```ts 
// main.ts
import Fit from 'vue-fit-next'
app
  .use(
    Fit({
      width: 3840, // 设计稿宽度
      height: 2160, // 设计稿高度
      animate: {
        enter: { // 入场
          duration: 600, // 过渡时长
          delay: 0 // 动画延迟
        },
        leave: {
          duration: 600, // 过渡时长
          delay: 0 // 动画延迟
        },
      },
    })
  )
  .mount('#app')

```

全局默认值：

```ts
const animate = {
  enter: {
    name: null,
    duration: 500,
    delay: 0,
  },
  leave: {
    name: null,
    duration: 500,
    delay: 0,
  },
}
```

2. 单个组件指令
   
```html
<div
  v-fit="{
    origin: 'left',
    animate: {
      enter: {
        name: 'slideInLeft',
        duration: 800,
      },
      leave: 'slideOutLeft',   // 也可以直接提供动画名称的方式简写
    },
  }"
>
</div>
```

`enter` 和 `leave` 可以直接简写成动画名称，`duration`和`delay`则从全局继承，也可以单个组件覆盖全局。


**注意：**

如果需要**出场**动画，需按要求给根元素添加`Transition`组件

第一步：
```ts
import { leave } from 'vue-fit-next'
```
第二步：

`Transition` 包裹组件即可

```html
<Transition mode="out-in" @leave="leave">
  <div v-if="show" class="box">
    <div
      v-fit="{
        origin: 'left',
        animate: {
          enter: 'slideInLeft',
          leave: 'slideOutLeft',
        },
      }"
    >
      left-1
    </div>

    <div
      v-fit:right="{
        animate: {
          enter: 'slideInRight',
          leave: 'slideOutRight',
        },
      }"
    >
      right-1
    </div>
  </div>
</Transition>

```
## License

[MIT](./LICENSE) License &copy; 2022-PRESENT [pasbone](https://github.com/pasbone)
