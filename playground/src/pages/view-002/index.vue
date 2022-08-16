<template>
  <div>
    <div
      v-fit:left="{
        animate: {
          enter: 'slideInLeft',
          leave: 'slideOutLeft',
        },
      }"
      class="panel panel-left"
    >
      视图-002
    </div>

    <div
      v-fit:center="{
        animate: {
          enter: 'slideInUp',
          leave: 'slideOutUp',
        },
      }"
      class="top-panel"
    >
      top-view
    </div>

    <div
      v-fit:center="{
        animate: {
          enter: 'slideInDown',
          leave: 'slideOutDown',
        },
      }"
      class="bottom-panel"
    >
      bottom-view
    </div>

    <div
      v-fit:bottom="{
        animate: {
          enter: 'slideInRight',
          leave: 'slideOutRight',
        },
      }"
      class="panel panel-right"
    >
      视图-002
    </div>
  </div>
</template>

<style scoped>
.panel {
  width: 675px;
  height: 2025px;
  background: url("/panel-bg.png");
  background-size: cover;
  position: absolute;
  top: 120px;
  color: #f90;
  font-size: 100px;
  text-align: center;
}
.panel-left {
  left: 12px;
}
.panel-right {
  right: 12px;
}

.tips {
  font-size: 32px;
  color: red;
  text-align: left;
  font-weight: bold;
  width: 500px;
  margin: 50px auto;
}

.top-panel {
  width: 1800px;
  height: 200px;
  background: #abcdef;
  top: 60px;
  position: absolute;
  font-size: 100px;
  text-align: center;
}

.bottom-panel {
  width: 1800px;
  height: 200px;
  background: #ff9900;
  bottom: 60px;
  position: absolute;
  transform-origin: left bottom !important;
  font-size: 100px;
  text-align: center;
}
</style>
