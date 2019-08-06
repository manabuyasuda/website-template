import Vue from 'vue';
import VButton from './VButton/VButton.vue';
import VPostList from './VPostList/VPostList.vue';

export default function app() {
  const element = document.getElementById('app');

  if (!element) return;

  const vm = new Vue({
    components: {
      VButton,
      VPostList,
    },
    data: {
      message: 'Hello Vue.js!',
    },
  });

  vm.$mount('#app');
}
