/**
 * Vue.jsのテストです。
 * `<div id="app"><sample-button variant="default">{{message}}</sample-button></div>`
 *  or
 * `#app sample-button(variant="default") {{message}}`
 */
import Vue from 'vue';
import SampleButton from './components/SampleButton.vue';
import BlogList from './components/BlogList.vue';

export default function app() {
  const element = document.getElementById('app');

  if (!element) return;

  const vm = new Vue({
    components: {
      SampleButton,
      BlogList,
    },
    data: {
      message: 'Hello Vue.js!',
    },
  });

  vm.$mount('#app');
}
