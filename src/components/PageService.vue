БеуьздфеуЮ
<template>
  <div class="hello-page">
    <h3>Service Page</h3>
    <hr />
    <p>Screen width = {{ screenWidth }}px</p>
    <p>Screen height = {{ screenHeight }}px</p>
    <hr />
  </div>
</template>

<script>
export default {
  name: "PageService",
  data: () => {
    return {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    };
  },
};
</script>

<style lang="scss">
.hello-page {
  padding: 10px;
  height: calc(100vh - 80px);

  p {
    margin-top: 10px;
    margin-bottom: 10px;
    padding-left: 20px;
  }
}
</style>