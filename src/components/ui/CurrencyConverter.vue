<template>
  <div class="currency-converter">
    <span
      class="currency"
      :class="'currency--' + currency.toLowerCase()"
    >
      {{ currency }}
    </span>
    <ArrowSVG 
      class="arrow arrow--filled"
      :direction="!isBuyOperation ? 'left' : ''" 
      :color="!isBuyOperation ? '#47A992' : '#A459D1'"
      :is-filled="isBuyOperation"
    />
    <span v-html="getFormatedCurrency(value)" />
    <ArrowSVG
      class="arrow"
      :direction="!isBuyOperation ? 'left' : ''"
      :color="!isBuyOperation ? '#47A992' : '#A459D1'"
      :is-filled="!isBuyOperation"
    />
    <span
      class="currency" 
      :class="'currency--' + baseCurrency.toLowerCase()"
    >
      {{ baseCurrency }}
    </span>
  </div>
</template>

<script>
import ArrowSVG from './ArrowSVG.vue';

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
    return {};
  },
  computed: {
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
      let formatedValue = value.toFixed(4);

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
  align-items: center;
  justify-content: flex-end;
  gap: 4px;

  .currency {
    font-weight: 600;
    color: #3C486B;

    // &--usd {
    //   color: #6B8068;
    // }

    // &--eur {
    //   color: #5D7EA7;
    // }
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