/**
 * Vue.jsのテストです。
 * `<div id="app">{{message}}</div>` or `#app {{message}}`
 */
import Vue from 'vue';

export default function VueText() {
  const element = document.getElementById('app');

  if (!element) {
    console.log('#appがありません。');
    return;
  }

  const app = new Vue({ // eslint-disable-line
    el: '#app',
    data: {
      message: 'Hello Vue!',
    },
  });
}
