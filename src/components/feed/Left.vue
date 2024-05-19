<template>
<div class="left-menu">
  Menu
  <div class="filter-by-platform">
    <ul>
      <li>
        Filter by platform
      </li>
      <li>
        <label for="telegram">
          <input type="checkbox" id="telegram" name="telegram" value="subscriptions-telegram" v-model="filterByPlatform">
          Telegram
        </label>
      </li>
      <li>
        <label for="video">
          <input type="checkbox" id="video" name="video" value="subscriptions-video" v-model="filterByPlatform">
          Video
        </label>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
export default {
  name: "Left",
  data: () => {
    return {
      filterByPlatform: [],
    };
  },
  watch: {
    filterByPlatform: {
      handler: function (value) {
        this.$emit('setFilterByPlatform', value);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss">
.left-menu {
  background-color: #fafafa;
  padding: 10px;
  position: sticky;
  top: 0px;
  max-height: 100%;
}
</style>