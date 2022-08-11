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
<div v-fit></div>
```


## License

[MIT](./LICENSE) License &copy; 2022-PRESENT [pasbone](https://github.com/pasbone)
