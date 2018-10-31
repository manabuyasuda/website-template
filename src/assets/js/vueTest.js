/**
 * Vue.jsのテストです。
 * `<div id="app">{{message}}</div>` or `#app {{message}}`
 */
import Vue from 'vue';

export default function vueTest() {
  const element = document.getElementById('app');

  if (!element) return;

  const app = new Vue({ // eslint-disable-line
    el: '#app',
    data: {
      message: 'Hello Vue!',
    },
  });
}
