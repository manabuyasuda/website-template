<template>
  <li class="PostList_Item">
    <div class="PostList_Body" v-for="post in posts" :key="post.id">
      <p class="PostList_ID">postID: {{ post.id }}</p>
      <h2 class="PostList_Title">{{ post.title }}</h2>
      <p class="PostList_Description">{{ post.body }}</p>
    </div>
  </li>
</template>

<script>
export default {
  name: 'PostListItem',
  props: {
    posts: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.PostList_Item {
  &:nth-of-type(n + 2) {
    margin-top: rem(30);
  }
}

.PostList_Body {
}

.PostList_ID {
  font-size: rem(12);
  line-height: 1;
}

.PostList_Title {
  margin-top: rem(10);
  margin-bottom: rem(10);
}

.PostList_Description {
  @include multi-line-ellipsis(1.4, 2);
}
</style>
