<script setup>
import { onMounted, ref } from 'vue'
import { leave } from 'vue-fit-next'
const show = ref(true)
const click = (value) => {
  console.log(value)
}

function onEnter(el) {
  console.log(el)
}
</script>

<template>
  <Transition mode="out-in" :css="false" @leave="leave">
    <div v-if="show" class="box">
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
        class="left"
      >
        <div>left-1-1</div>
        <div>left-1-2</div>
      </div>

      <div
        v-fit:right="{
          animate: {
            enter: 'slideInRight',
            leave: 'slideOutRight',
          },
        }"
        class="right"
      >
        right-1
      </div>

      <div
        v-fit:2="{
          animate: {
            enter: 'slideInUp',
            leave: 'slideOutUp',
          },
        }"
        class="top"
      >
        top
      </div>

      <div v-fit:8 class="bottom">
        bottom
      </div>
    </div>

    <div v-else class="box">
      <div
        v-fit:left="{
          animate: {
            enter: 'slideInLeft',
            leave: 'slideOutLeft',
          },
        }"
        class="left"
      >
        left-2
      </div>

      <div
        v-fit:right="{
          animate: {
            enter: 'slideInRight',
            leave: 'slideOutRight',
          },
        }"
        class="right"
      >
        right-2
      </div>

      <div
        v-fit:2="{
          animate: {
            enter: 'slideInUp',
            leave: 'slideOutUp',
          },
        }"
        class="top"
      >
        top
      </div>

      <div
        v-fit:8="{
          animate: {
            enter: 'slideInDown',
            leave: 'slideOutDown',
          },
        }"
        class="bottom"
      >
        bottom
      </div>
    </div>
  </Transition>

  <button class="button" @click="show = !show">
    切换
  </button>
</template>

<style>
* {
  padding: 0;
  margin: 0;
}

html {
  height: 100vh;
  overflow: hidden;
}

body{
  transform-origin: 0 0;
}

.box {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.left {
  width: 400px;
  height: 100vh;
  background: red;
}

.right {
  width: 400px;
  height: 100vh;
  background: blue;
  transform-origin: center;
}

.top {
  width: 800px;
  height: 200px;
  background: green;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
}

.bottom {
  position: absolute;
  width: 800px;
  height: 200px;
  background: pink;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
}

.button {
  position: absolute;
  left: 50%;
  top: 50%;
}
</style>
