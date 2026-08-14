<template>
  <div id="app">
    <div v-fit:left class="box" />
  </div>
</template>

<style>
html,
body {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.box {
  width: 500px;
  height: 500px;
  background: red;
}
</style>
