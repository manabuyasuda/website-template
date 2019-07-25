<template>
  <div class="BlogList">
    <div class="BlogList_Loading" v-if="isLoading">
      <p class="BlogList_LoadingText">Loading…</p>
    </div>

    <transition appear>
      <div class="BlogList_Posts">
        <PostList :posts="computedPosts"></PostList>
      </div>
    </transition>
  </div>
</template>

<script>
import PostList from './PostList.vue';
import RepositoryFactory from '../repositories/RepositoryFactory';

const PostRepository = RepositoryFactory.get('posts');
const POSTS_COUNT_MAX = 10;

export default {
  name: 'BlogList',
  components: {
    PostList,
  },
  data() {
    return {
      isLoading: false,
      posts: [],
    };
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.isLoading = true;
      const { data } = await PostRepository.get();
      this.isLoading = false;
      this.posts = data;
    },
  },
  computed: {
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

.BlogList_Loading {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  font-size: rem(30);
  background-color: #fff;
}

.BlogList_LoadingText {
  position: fixed;
  right: 50%;
  bottom: 50%;
  transform: translate(50%, 50%);
}

.BlogList_Posts {
}
</style>
