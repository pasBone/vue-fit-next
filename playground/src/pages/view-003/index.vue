<template>
  <div>
    <div
      v-fit:leftTop
      class="panel"
    >
      leftTop
    </div>

    <div v-fit:centerTop class="panel" style="left: -30px">
      centetTop
      居中且向左偏移 30px
    </div>

    <div v-fit:rightTop class="panel" style="right: 0">
      rightTop
    </div>

    <div v-fit:leftCenter class="panel" style="top: 0">
      leftCenter
    </div>

    <div v-fit:centerCenter class="panel" style="top: 30px">
      centerCenter <br>
      居中且向上偏移 30px
    </div>

    <div v-fit:rightCenter class="panel" style="top: 0; right: 0">
      rightCenter
    </div>

    <div v-fit:leftBottom class="panel" style="bottom: 0">
      leftBottom
    </div>

    <div v-fit:centerBottom class="panel" style="bottom: 30px;">
      centerBottom
      居中且向下偏移30px
    </div>

    <div v-fit:rightBottom class="panel" style="bottom: 0; right: 0">
      rightBottom
    </div>
  </div>
</template>

<style scoped>
.panel {
  width: 700px;
  height: 500px;
  background: url("/panel-bg.png");
  background-size: cover;
  position: absolute;
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
</style>
