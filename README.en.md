# vue-fit-next

[简体中文](./README.md) | English

[![npm](https://img.shields.io/npm/v/vue-fit-next)](https://www.npmjs.com/package/vue-fit-next)

A Vue directive that makes elements adapt to different screen sizes.

## Important

The most common cause of a blank page is missing base styles. Make sure the page has a defined width and height:

```css
html, body {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
```

## Features

- Simple API: basic screen adaptation requires only one directive.
- Drag and zoom the entire screen to inspect details and hard-to-reach areas.
- Enter and leave animations for smoother view transitions.
- Both `zoom` and `scale` adaptation modes.
- Non-invasive layout handling that preserves the original DOM structure.

## Demo

- [Scale mode](https://62fca80a83bbdb00082f2b14--tranquil-baklava-24da8b.netlify.app/demo-scale-mode)
- [Zoom mode](https://62fca80a83bbdb00082f2b14--tranquil-baklava-24da8b.netlify.app/demo-zoom-mode)

![vue-fit-next demo](https://github.com/pasBone/vue-fit-next/blob/dev/playground/public/gif.gif)

## Installation

Install the package with your preferred package manager:

```bash
# yarn
yarn add vue-fit-next

# npm
npm install vue-fit-next

# pnpm
pnpm add vue-fit-next
```

## Basic Usage

```ts
// main.ts
import Fit from 'vue-fit-next'

app
  .use(
    Fit({
      width: 3840, // Design width
      height: 2160, // Design height
      mode: 'scale', // Optional: "scale" or "zoom"; defaults to "scale"
      scaleStep: 0.05, // Optional: zoom increment per wheel event; defaults to 0.05
    }),
  )
  .mount('#app')
```

```html
<div v-fit>
  Elements using v-fit scale according to the viewport and configured design size.
</div>
```

## Zoom Mode

`zoom` mode uses the browser's non-standard CSS `zoom` property.

Limitations:

1. Firefox does not support CSS `zoom`. Large-screen displays commonly run in Chromium-based browsers, but you should verify your target environment.
2. `zoom` may cause the whole page to be rendered again. This is usually acceptable for display-oriented dashboards that render infrequently.

Advantage:

`zoom` mode works naturally with ordinary CSS layouts, so you do not need to account for the positioning model used by `v-fit` in `scale` mode.

## Scale Mode

`scale` mode uses the CSS `scale` transform. Before using it with `v-fit`, you should understand the positioning options added by the directive.

### Positioning

Pass a directive argument to select the element's scaling origin:

```html
<div v-fit:left>Shorthand for leftTop</div>
<div v-fit:center>Shorthand for centerTop</div>
<div v-fit:right>Shorthand for rightTop</div>

<!-- Additional positions -->
<div v-fit:leftCenter>Left, vertically centered</div>
<div v-fit:centerCenter>Horizontally and vertically centered</div>
<div v-fit:rightCenter>Right, vertically centered</div>

<div v-fit:leftBottom>Bottom left</div>
<div v-fit:centerBottom>Bottom center</div>
<div v-fit:rightBottom>Bottom right</div>
```

The positions correspond to a 3-by-3 grid:

```text
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
|            |              |             |
 -----------------------------------------
```

Combine these positions with CSS properties such as `top`, `right`, `bottom`, and `left` for fine-grained offsets.

You can also use the `origin` option instead of a directive argument:

```html
<div v-fit="{ origin: 'left' }"></div>
```

## Dragging and Zooming

- Hold Space and drag with the mouse to move the entire screen.
- Hold Ctrl and scroll the mouse wheel to zoom and reposition the screen.
- Double-press Space to reset the position.

## Enter and Leave Animations

### Available Animations

- `slideInLeft` | `slideInRight`
- `slideOutLeft` | `slideOutRight`
- `slideInUp` | `slideInDown`
- `slideOutUp` | `slideOutDown`

### Usage

1. Optional global configuration:

```ts
// main.ts
import Fit from 'vue-fit-next'

app
  .use(
    Fit({
      width: 3840,
      height: 2160,
      animate: {
        enter: {
          duration: 600,
          delay: 0,
        },
        leave: {
          duration: 600,
          delay: 0,
        },
      },
    }),
  )
  .mount('#app')
```

Default values:

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

2. Per-element configuration:

```html
<div
  v-fit="{
    origin: 'left',
    animate: {
      enter: {
        name: 'slideInLeft',
        duration: 800,
      },
      leave: 'slideOutLeft',
    },
  }"
></div>
```

`enter` and `leave` can use an animation name as shorthand. Their `duration` and `delay` values inherit from the global configuration and can be overridden per element.

### Leave Transitions

To use leave animations, wrap the root element with Vue's `Transition` component.

First, import the leave hook:

```ts
import { leave } from 'vue-fit-next'
```

Then attach it to `Transition`:

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
