/**
 * Vue.jsのテストです。
 * `<div id="app"><sample-button variant="default">{{message}}</sample-button></div>`
 *  or
 * `#app sample-button(variant="default") {{message}}`
 */
import Vue from 'vue';
import SampleButton from './components/SampleButton.vue';
import PostList from './components/PostList.vue';

export default function app() {
  const element = document.getElementById('app');

  if (!element) return;

  const vm = new Vue({
    components: {
      SampleButton,
      PostList,
    },
    data: {
      message: 'Hello Vue.js!',
    },
  });

  vm.$mount('#app');
}
