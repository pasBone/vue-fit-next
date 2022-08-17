<template>
  <div v-fit:center="{ lockY: true }" class="header">
    <div class="logo">
      LOGO
    </div>
    <div class="title">
      集中运维可视化平台
    </div>
    <div class="time">
      2022-08-16 11:30
    </div>
  </div>
</template>

<style scoped>
.header {
  width: 3840px;
  height: 119px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  background: url("/header-bg.png");
  background-size: 100% 100%;
  position: absolute;
}

.title {
  font-size: 60px;
  font-weight: 400;
  color: #fff;
  letter-spacing: 4px;
  position: relative;
  top: -14px;
}

.logo {
  width: 200px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: red;
  position: relative;
  top: -20px;
  font-size: 26px;
}
.time {
  font-size: 32px;
  color: #fff;
  position: relative;
  top: -20px;
  right: 10px;
}
</style>
