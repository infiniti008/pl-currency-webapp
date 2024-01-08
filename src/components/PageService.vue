<template>
  <div class="hello-page">
    <h3>Service Page</h3>
    <hr />
    <p>Screen width = {{ screenWidth }}px</p>
    <p>Screen height = {{ screenHeight }}px</p>
    <p>Is Expanded = {{ isExpanded }}</p>
    <p v-for="(val, key) in statistic" :key="key">
      {{ getStatName(key) }}
      =
      {{ val }}
    </p>
    <hr />
  </div>
</template>

<script>
import { getStatistic } from '../services/api.js';

export default {
  name: "PageService",
  data: () => {
    return {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      statistic: {}
    };
  },
  mounted() {
    this.getStatistic();
  }, 
  computed: {
    isExpanded() {
      return this.$store.state.isExpanded;
    }
  },
  methods: {
    async getStatistic() {
      try {
        const response = await getStatistic();
        this.statistic = response;
      } catch (err) {
        console.log(err);
      }
    },
    getStatName(key) {
      const nemesForKeys = {
        usersCount: 'Users Count',
        subscriptionsCount: 'Subscriptions Count'
      };

      return nemesForKeys[key] || key;
    }
  }
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