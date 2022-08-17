<template>
  <div>
    <div
      v-fit="{
        lockX: true,
        animate: {
          enter: {
            name: 'slideInLeft',
            duration: 500,
          },
          leave: {
            name: 'slideOutLeft',
            duration: 500,
          },
        },
      }"
      class="panel panel-left"
    >
      视图-001

      <div class="tips">
        设置 lockX: true 属性之后，<br>
        div 总体尺寸不受屏幕宽度影响<br>
        可以尝试调整浏览器宽度查看效果
      </div>
    </div>
    <div
      v-fit="{
        lockX: true,
        animate: {
          enter: 'slideInRight',
          leave: 'slideOutRight',
        },
      }"
      class="panel panel-right"
    >
      视图-001

      <div class="tips">
        设置 lockX: true 属性之后，<br>
        div 总体尺寸不受屏幕宽度影响<br>
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
  color: #fff;
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
</style>
