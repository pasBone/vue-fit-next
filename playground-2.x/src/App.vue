<script>
export default {
  name: 'App',
  created() {
    const obj = {
      a: 10,
    }
    console.log(obj.a?.b?.c)
  },
}
</script>

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
