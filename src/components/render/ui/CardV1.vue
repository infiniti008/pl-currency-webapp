<template>
  <div class="card" :class="showBars ? '' : 'hiddenBars'">
    <div class="card-back" :style="cardBackStyle">
      <div class="bar" v-for="bar in bars" :style="{ height: bar.height, background: bar.color }">
        <div class="line" :style="{ background: bar.color }"></div>
      </div>
    </div>
    <div class="wrapper">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "CardV1",
  props: {
    barsLength: {
      type: Number,
      default: 30
    },
    barMinHeight: {
      type: Number,
      default: 66
    },
    barMaxHeight: {
      type: Number,
      default: 100
    },
    showBars: {
      type: Boolean,
      default: true
    },
    isTransparent: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bars() {
      const randomColor = () => {
        const colors = [
          '#ee161a',
          '#00c46b'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      };
      const bars = [];
      for (let i = 0; i < this.barsLength; i++) {
        bars.push({
          height: `${this.barMinHeight + Math.random() * (this.barMaxHeight - this.barMinHeight)}%`,
          color: randomColor()
        });
      }
      return bars;
    },
    cardBackStyle() {
      return {
        'grid-template-columns': `repeat(${this.barsLength}, 1fr)`,
      }
    }
  }
}
</script>
<style scoped>
  .card {
    position: relative;
    padding: 50px 0px;
    overflow: hidden;

    &.hiddenBars {
      padding: 0;
    }
  }

  .wrapper {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(100px);
    border-radius: 30px;
    height: 100%;
  }

  .card-back {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0 20px;
    display: grid;
    justify-content: space-between;
    align-items: center;
    justify-items: center;
  }

  .bar {
    position: relative;
    width: 14px;

    .line {
      position: absolute;
      top: -100px;
      left: calc(50% - 1px);
      width: 2px;
      height: 1000%;
    }
  }
</style>