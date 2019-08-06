import Vue from 'vue';
import SampleButton from './SampleButton/SampleButton.vue';
import PostList from './PostList/PostList.vue';

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
