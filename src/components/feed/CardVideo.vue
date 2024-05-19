<template>
<div
  class="card"
>
  <div class="wrapper-icon">
    <div
      class="icon"
      @click="handleLog"
    >
      <span>
        VI
      </span>
    </div>
    <div :class="renderStatusClasses">
      RENDER
    </div>
  </div>
  <div class="wrapper-content">
    <div class="title">
      {{ title }}
    </div>
    <div class="date">
      {{ date }}
    </div>
    <div class="video">
      <video width="100%" controls v-if="!item.collapsed">
        <source :src="src" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "CardVideo",
  props: {
    item: Object
  },
  data: () => {
    return {};
  },
  computed: {
    title() {
      return this.item.videoTitle || this.item.titleTextTemplate;
    },
    renderStatusClasses() {
      return {
        'render-status': true,
        'success': this.item.processes?.renderVideo?.completed,
        'error': !this.item.processes?.renderVideo?.completed,
      };
    },
    src() {
      const path = this.item.processes?.renderVideo?.videoPath?.split('/currencyMediaFolder/')[1] || '';
      return `https://currency.nikitenok-sl.keenetic.link/files/${path}`;
    },
    date() {
      return new Date(this.item.timestamp).toLocaleString();
    },
  },
  methods: {
    handleLog() {
      console.log(this.item);
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  padding: 10px;
  border-bottom: 1px solid #e1e1e1;
  border-left: 1px solid #e1e1e1;
  border-right: 1px solid #e1e1e1;
  box-sizing: border-box;
  transition: all 0.3s;
  cursor: pointer;
  display: grid;
  grid-template-columns: 50px 1fr;

  &:hover {
    background-color: #f1f1f1;
  }

  .wrapper-icon {
    width: 50px;
    height: 100%;
    min-width: 40px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    & .icon {
      width: 50px;
      height: 50px;
      background-color: #f7dfdf;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .render-status {
      font-size: 10px;
      color: white;
      padding: 2px;
      text-align: center;
      border-radius: 4px;
      font-weight: 600;

      &.success {
        background-color: #106f54;
      }

      &.error {
        background-color: #aa3939;
      }
    }
  }

  .wrapper-content {
    padding: 10px;
    flex: 1;
    max-width: 100%;
    overflow: hidden;

    & .title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    & .date {
      font-size: 12px;
      color: #8b8b8b;
      margin-bottom: 4px;
    }

    & img {
      width: 100%;
      height: auto;
    }
  }
}
</style>