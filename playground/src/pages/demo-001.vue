<script setup>
import { leave } from 'vue-fit-next'
import { ref, shallowRef } from 'vue'
import view001 from './view-001/index.vue'
import view002 from './view-002/index.vue'
import view003 from './view-003/index.vue'
import Header from '~/components/Header/index.vue'

const component = shallowRef(view001)
const componentsMap = {
  1: view001,
  2: view002,
  3: view003,
}

function changeView(viewName) {
  component.value = componentsMap[viewName]
}
</script>

<template>
  <div class="bg-3d" />
  <Header />

  <!-- 如果需要出场动画，则需要添加 Transition 标签 -->
  <Transition mode="out-in" @leave="leave">
    <component :is="component" />
  </Transition>

  <div v-fit:centerBottom class="action">
    <div class="menu-btn" @click="changeView('1')">
      视图-001
    </div>
    <div class="menu-btn" @click="changeView('2')">
      视图-002
    </div>
    <div class="menu-btn" @click="changeView('3')">
      视图-003
    </div>
  </div>
</template>

<style scoped>
.bg-3d {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: url("/3d-bg.jpg");
  background-size: cover;
  z-index: -1;
}
.action {
  position: absolute;
  bottom: 60px;
  left: 0;
  display: flex;
}

.menu-btn {
  text-align: center;
  width: 248px;
  height: 77px;
  line-height: 77px;
  font-size: 36px;
  color: #fff;
  cursor: pointer;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPgAAABNCAYAAACL1qnNAAAC30lEQVR4nO3bMUiUYRyA8ce4SGxrcCtqiqT2mhpqSLBa2iK0TDsyI7kwhCShlELLwZK0GoqiTHSpQSIIkmyKQIiGxqjAhhrCNC4vvjjjuDpb7/48v+2+6X357uH97n2/q8rlciNICimVTCpVU+vdlYLJzs+xypsqxWXgUmCp4qll5+daCz+nampH/QJIlckVXArMwKXADFwK7K/f4P7mluJwBZcCM3ApMI/JpMBcwaXADFwKzMClwDwmkwJzBZcCM3ApMI/JpMBcwaXADFwKzMClwDwmkwJzBZcCM3ApMAOXAjNwKTADlwIzcCkwA5cCM3ApMAOXAjNwKTADlwIzcCkwA5cCM3ApMAOXAjNwKTADlwIzcCkwA5cCM3ApMAOXAjNwKTADlwIzcCkwA5cCM3ApMAOXAjNwKTADlwIzcCkwA5cCM3ApMAOXAjNwKTADlwIzcCkwA5cCqtuy+fekDFwKZv/eemZfTS8BDwxcCqQt3czE2O3vwBDwLOXNlWLo6T7D2a7MZ+Aa8CmZlIFLAVzpv8DJttZ3wHXg2/KMDFyqYJs2biDTcYJ0S9MMcA/IFs7GwKUKtXvXTqYejeeASeDJv2bhJptUgY40HUziXgRGSsWNgUuVp6vzFKPDg1+By8DrEhOoAgZ8RJcqyMXec5zuaHuf3yn/UmLkSdc3gUYDlypAdfUaLvX1JOfcs/l4F0uMugYYAxpwk00qf9u21pFuPcyxo41PgQlgqcSg1wGPgR3LFwxcKmP7GvYw+fBOEvR94PkKI10PTCWvoRdedJNNKlOtzY1J3AvA1f/EnUT9ojhuDFwqT8lO+fBQf7JT3g+8WWGQ24Hp/Ape6AeQ9hFdKjN957vpzLR/yP9hpNROeaIeGAfWFl1P3kM/AMwYuFRGBgd6aT/e8jb/TvnCCiM7BNwCVhddf5mP+yPLm2zZ+TnvsVQeknfK7wI/VxhOJv/onrzMUugG0P7nCA34BSHngSSLlbqZAAAAAElFTkSuQmCC);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-left: 24px;
  margin-right: 24px;
}
</style>
