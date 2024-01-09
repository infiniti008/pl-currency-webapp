<template>
  <div v-if="data && data.records?.[0]" class="page" :style="cssVars">
    <div></div>
    <CardV1 class="headCard" :barsLength="30" :barMinHeight="66" :barMaxHeight="100">
      <div class="name">{{ data.name }}</div>
      <br>
      <div class="bankName">{{ data.records[0].BANK }}</div>
    </CardV1>

    <CardV1 class="dateTimeCard" :barsLength="30" :barMinHeight="66" :barMaxHeight="100" :showBars="false">
      <div class="container">
        <div class="dateTime">
          <div class="date">{{ getDate(data.previousDateTime) }}</div>
          <div class="time">{{ getTime(data.previousDateTime) }}</div>
        </div>
        <div class="dateTime">
          <div class="date">{{ getDate(data.dateTime) }}</div>
          <div class="time">{{ getTime(data.dateTime) }}</div>
        </div>
      </div>
    </CardV1>

    <CardV1 class="rateCard" :barsLength="30" :barMinHeight="66" :barMaxHeight="100" :showBars="false">
      <div class="container">
        <div class="item" v-for="record in data.records">
          <div class="title">
            <span class="name" :style="{ color: record.COLOR }">{{ record.NAME }}</span>
            <span class="currencies">{{ record.CURRENCY }}/{{ record.CURRENCY_BASE }}</span>
          </div>
          <div class="value">
            <div class="diff" :class="record.DIFF_STYLE">
              <span class="currency-s-diff">{{ record.DIFF_S }}</span><span class="currency-e-diff">{{ record.DIFF_E }}</span>
            </div>
            <div class="rate">
              <span class="currency-s">{{ record.LAST_VALUE_S }}</span><span class="currency-e">{{ record.LAST_VALUE_E }}</span>
            </div>
          </div>
        </div>
      </div>
    </CardV1>
    <CardV1 class="appCard" :barsLength="30" :barMinHeight="30" :barMaxHeight="100" :showBars="true">
      <div class="container">
        <p class="copyright">Produced by Currency Notifications App</p>
      </div>
    </CardV1>
    <div></div>
  </div>
  <H2 v-else>LOADING DATA</H2>
</template>

<script>
import { templateMixin } from './templateMixin.js';
import CardV1 from './ui/CardV1.vue';

export default {
  name: "VerticalBitcoinV1",
  mixins: [templateMixin],
  components: {
    CardV1
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  created() {
    const body = document.querySelector('body');
    body.classList.add('render');
  },
  data: () => {
    return {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,

    };
  },
  computed: {
    cssVars() {
      return {
        '--main-color': this.data.color
      }
    },
  },
  methods: {
    getDate(dateTime) {
      return dateTime.split(', ')[0];
    },
    getTime(dateTime) {
      return dateTime.split(', ')[1];
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  height: 100%;
  padding: 80px;
  display: grid;
  background-image: linear-gradient(to top, #303030 0%, #16384a 100%);
  grid-template-rows: 1fr 280px 200px auto 160px 1fr;
  gap: 50px;
  
  .headCard .wrapper {
    .name {
      color: var(--main-color);
      font-size: 66px;
      font-weight: bold;
      text-align: center;
      color: white;
      text-shadow: 0 0 16px rgba(255, 255, 255, 0.5);
    }
    .bankName {
      color: var(--main-color);
      font-size: 66px;
      font-weight: bold;
      text-align: center;
      text-shadow: 0 0 16px rgba(0, 0, 0, 0.2);
    }
  }

  .dateTimeCard .wrapper {
    .container {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;

      .dateTime {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;

        .date {
          color: white;
          font-size: 70px;
          font-weight: bold;
          text-shadow: 0 0 16px rgba(255, 255, 255, 0.5);
        }
        .time {
          color: #fc9696;
          font-size: 80px;
          font-weight: bold;
          text-shadow: 0 0 16px rgb(209 115 115 / 50%);
        }
      }
    }
  }

  .rateCard .wrapper {
    .container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      padding: 20px;
      gap: 60px;

      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .name {
          color: white;
          font-size: 60px;
          font-weight: bold;
          // text-shadow: 0 0 16px rgba(255, 255, 255, 0.5);
        }
        .currencies {
          color: #d8f7a1;
          font-size: 60px;
          font-weight: bold;
          text-shadow: 0 0 16px rgb(186 209 115 / 50%);
          letter-spacing: 3px;
        }
      }

      .value {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .diff {
          font-size: 60px;
          font-weight: bold;
          letter-spacing: 3px;
        }
        .rate {
          font-size: 60px;
          font-weight: bold;
          letter-spacing: 3px;

          .currency-s {
            // color: black;
            font-size: 60px;
            font-weight: bold;
            text-shadow: 0 0 16px rgb(0 0 0 / 35%);
          }
        }
      }
    }
  }

  .appCard .wrapper {
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
    .copyright {
      color: white;
      font-size: 40px;
      font-weight: bold;
      text-align: center;
      text-shadow: 0 0 16px rgba(255, 255, 255, 0.5);
    }
  }

  .diff-up {
    color: #3dff02;
    text-shadow: 0 0 16px rgba(255, 255, 255, 0.5);
  }

  .diff-down {
    color: #ff4867;
    text-shadow: 0 0 16px rgb(194 0 0 / 74%);
  }

  .currency-e {
    color: #D8D8D8;
    text-shadow: 0 0 16px rgb(177 180 122 / 56%);
  }
}
</style>

<style lang="scss">
body.render {
  width: 1080px;
  height: 1920px;
  box-shadow: 0px 0px 10px 0px #000;
}
</style>