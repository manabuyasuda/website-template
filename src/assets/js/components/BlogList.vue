<template>
  <div class="BlogList">
    <VLoading v-if="isLoading"></VLoading>

    <transition appear>
      <div class="BlogList_Posts">
        <PostList :posts="computedPosts"></PostList>
      </div>
    </transition>
  </div>
</template>

<script>
import PostList from './PostList.vue';
import VLoading from './VLoading.vue';
import RepositoryFactory from '../repositories/RepositoryFactory';

const PostRepository = RepositoryFactory.get('posts');
const POSTS_COUNT_MAX = 100;
const IS_LOADING = 'IS_LOADING';
const IS_READY = 'IS_READY';

export default {
  name: 'BlogList',
  components: {
    PostList,
    VLoading,
  },
  data() {
    return {
      currentState: IS_LOADING,
      posts: [],
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    currentToLoading() {
      this.currentState = IS_LOADING;
    },
    currentToReady() {
      this.currentState = IS_READY;
    },
    async fetch() {
      const { data } = await PostRepository.get();
      this.currentToReady();
      this.posts = data;
    },
  },
  computed: {
    isLoading() {
      return this.currentState === IS_LOADING;
    },
    isReady() {
      return this.currentState === IS_READY;
    },
    computedPosts() {
      return this.posts.slice(0, POSTS_COUNT_MAX);
    },
  },
};
</script>

<style lang="scss" scoped>
.v-enter,
.v-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition-timing-function: $global-transition-timing-function;
  transition-duration: $global-transition-duration * 4;
  transition-property: opacity;
}

.BlogList {
  max-width: rem(600);
  margin: auto;
}

.BlogList_Posts {
}
</style>
