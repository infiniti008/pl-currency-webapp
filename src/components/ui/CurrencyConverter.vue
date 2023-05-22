<template>
  <div class="currency-converter">
    <div>
      {{ bank }} - {{ operation }}
    </div>
    <div class="currency-converter__rate">
      <span
        class="currency"
        :class="'currency--' + currency.toLowerCase()"
      >
        <span v-html="flags[currency]" />
        {{ currency }}
      </span>
      <ArrowSVG 
        class="arrow"
        :direction="leftArrowDirection" 
        :color="leftArrowColor"
        :is-filled="isBuyOperation || isMarketOperation"
      />
      <span v-html="getFormatedCurrency(value)" />
      <ArrowSVG
        class="arrow"
        :direction="rightArrowDirection"
        :color="rightArrowColor"
        :is-filled="!isBuyOperation"
      />
      <span
        class="currency" 
        :class="'currency--' + baseCurrency.toLowerCase()"
      >
        <span v-html="flags[baseCurrency]" />
        {{ baseCurrency }}
      </span>
    </div>
  </div>
</template>

<script>
import ArrowSVG from './svg/ArrowSVG.vue';

export default {
  props: {
    currency: String,
    value: Number,
    baseCurrency: String,
    operation: String,
    bank: String
  },
  name: "CurrencyConverter",
  components: {
    ArrowSVG
  },
  data: () => {
    return {
      flags: {
        USD: '&#127482;&#127480;',
        EUR: '&#127466;&#127482;',
        PLN: '&#127477;&#127473;',
        RUB: '&#127479;&#127482;',
        BYN: '&#127463;&#127486;'
      },
      colors: {
        Buy: '#A459D1',
        Sell: '#47A992'
      }
    };
  },
  computed: {
    leftArrowDirection() {
      if (this.isMarketOperation) {
        return 'right';
      }
      return !this.isBuyOperation ? 'left' : '';
    },
    rightArrowDirection() {
      return !this.isBuyOperation ? 'left' : '';
    },
    leftArrowColor() {
      return this.colors[this.operation];
    },
    rightArrowColor() {
      return this.colors[this.operation];
    },
    isBuyOperation() {
      return this.operation === 'Buy';
    },
    isMarketOperation() {
      return this.operation === 'Market';
    },
    isSellOperation() {
      return this.operation === 'Sell';
    }
  },
  methods: {
    getFormatedCurrency(value) {
      let formatedValue = value;

      if (typeof formatedValue === 'number') {
        formatedValue = formatedValue.toFixed(4);
      }

      formatedValue = formatedValue.split('');
      const valueWithStyles = [
        '<span class="currency-value--main">',
        formatedValue[0],
        formatedValue[1],
        formatedValue[2],
        formatedValue[3],
        '</span>',
        '<span class="currency-value--second">',
        formatedValue[4],
        formatedValue[5],
        '</span>',
      ];

      return valueWithStyles.join('');
    }
  }
};
</script>

<style  lang="scss">
.currency-converter {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__rate {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
  }
  
  .currency {
    font-weight: 600;
    color: #3C486B;
  }

  .currency-value--main {
    font-size: 18px;
    font-weight: 600;
    color:#19A7CE;
  }

  .currency-value--second {
    font-size: 18px;
    font-weight: 600;
    color: #D8D8D8;
  }

  .arrow {
    width: auto;
    height: 24px;
  }
}
</style>