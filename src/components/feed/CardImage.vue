<template>
<div
  class="card"
>
  <div class="wrapper-icon">
    <div
      class="icon"
      @click="handleLog"
    >
      <span v-if="isTelegram">
        TG
      </span>
      <span v-else>
        AL
      </span>
    </div>
    <div>
      <button
        v-if="item.collapsed"
        class="btn"
        @click="handleExpand"
      >
        Expand
      </button>
      <button
        v-else
        class="btn"
        @click="handleCollapse"
      >
        Collapse
      </button>
    </div>
    <div
      v-if="!item.collapsed"
      :class="renderStatusClasses"
    >
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
    <div class="image">
      <img :src="src" alt="item.name" v-if="!item.collapsed"/>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "CardImage",
  props: {
    item: Object
  },
  data: () => {
    return {};
  },
  computed: {
    isTelegram() {
      return this.item.platform === 'subscriptions-telegram';
    },
    title() {
      return this.item.name;
    },
    src() {
      const path = this.item.processes?.renderImage?.imagePath?.split('/currencyMediaFolder/')[1] || '';
      return `https://currency.nikitenok-sl.keenetic.link/files/${path}`;
    },
    date() {
      return new Date(this.item.timestamp).toLocaleString();
    },
    renderStatusClasses() {
      return {
        'render-status': true,
        'success': this.item.processes?.renderImage?.completed,
        'error': !this.item.processes?.renderImage?.completed,
      };
    }
  },
  methods: {
    handleExpand() {
      this.item.collapsed = false;
    },
    handleCollapse() {
      this.item.collapsed = true;
    },
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
      background-color: #cbefe7;
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
    padding-left: 10px;
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