<template>
<div class="main-feed">
  <div class="feeds">
    <template v-for="item in filteredItems">
      <CardImage
        v-if="isImage(item)"
        :key="item._id"
        :item="item"
      />
      <CardVideo
        v-else-if="isVideo"
        :key="item._id"
        :item="item"
      />
    </template>
  </div>
  <div class="aside">
    
  </div>
</div>
</template>

<script>
import CardImage from "./CardImage.vue";
import CardVideo from "./CardVideo.vue";
import { getFeedItems } from '../../services/api.js';

export default {
  name: "Main",
  components: {
    CardImage,
    CardVideo
  },
  props: {
    filterByPlatform: Array
  },
  data: () => {
    return {
      items: [],
    };
  },
  created() {
    this.getItems(0, 50);
  },
  computed: {
    filteredItems() {
      const items = this.items;

      this.items.forEach(item => {
        if (this.filterByPlatform.includes(item.platform)) {
          item.collapsed = false;
        } else {
          item.collapsed = true;
        }
      });

      return items;
    }
  },
  methods: {
    async getItems(offset, limit) {
      const items = await getFeedItems(offset, limit);
      items.data.forEach(element => {
        element.collapsed = false;
        this.items.push(element);
      });
    },
    isImage(item) {
      return item.platform === "subscriptions-telegram";
    },
    isVideo(item) {
      return item.platform === "subscriptions-video";
    },
  }
}
</script>

<style lang="scss">
.main-feed {
  padding: 0px 40% 0px 0px;
  position: sticky;
  top: 0px;
  overflow: auto;
}
.aside {
  position: absolute;
  right: 0px;
  top: 0px;
  width: 36%;
}
</style>