<template>
  <div class="Loading">
    <p class="Loading_Text">Loading…</p>
  </div>
</template>

<script>
export default {
  name: 'VLoading',
};
</script>

<style lang="scss" scoped>
.Loading {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  margin: auto;
  font-size: rem(30);
  background-color: #fff;
}

.Loading_Text {
  position: fixed;
  right: 50%;
  bottom: 50%;
  transform: translate(50%, 50%);
}
</style>
