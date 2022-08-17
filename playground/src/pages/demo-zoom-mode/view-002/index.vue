<template>
  <div>
    <div
      v-fit="{
        animate: {
          enter: 'slideInLeft',
          leave: 'slideOutLeft',
        },
      }"
      class="panel panel-left"
    >
      视图-002

      <div class="tips">
        默认 div 总体尺寸会受到浏览器宽度影响<br>
        可以尝试调整浏览器宽度查看效果
      </div>
    </div>

    <div
      v-fit="{
        animate: {
          enter: 'slideInRight',
          leave: 'slideOutRight',
        },
      }"
      class="panel panel-right"
    >
      视图-002

      <div class="tips">
        默认 div 总体尺寸会受到浏览器宽度影响<br>
        可以尝试调整浏览器宽度查看效果
      </div>
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
</style>
