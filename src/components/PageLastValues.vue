<template>
  <div class="last-values">
    <div v-if="isRecordsVisible" class="currency-records">
      <div class="currency-records--header">
        <div class="header-item">Date & Time</div>
        <div class="header-item">Bank</div>
        <!-- <div class="header-item">Currency</div> -->
        <div class="header-item">Value</div>
      </div>
      <div v-for="record in records" class="currency-records--row" :style="{color: record.bankColor}">
        <div class="record-item record-item--time">
          <span>{{ record.date.split(',')[0] }}</span>
          <span>{{ record.date.split(',')[1] }}</span>
        </div>
        <div class="record-item record-item--bank">{{ record.bank }}</div>
        <CurrencyConverter 
          :currency="record.currency"
          :value="record.value"
          :operation="record.operation"
          :bank="record.bank"
          :base-currency="record.currencyBase"
        />
        <!-- <div class="record-item">{{ record.currency }}/{{ record.currencyBase }}</div> -->
        <!-- <div class="record-item" v-html="getFormatedCurrency(record.value)" /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getLastCurrencies } from '../services/api.js';

import CurrencyConverter from './ui/CurrencyConverter.vue';

export default {
  name: "PageLastValues",
  components: {
    CurrencyConverter
  },
  data: () => {
    return {
      records: [],
      isLoading: false,
      country: 'pl'
    };
  },
  computed: {
    isRecordsVisible() {
      return !this.isLoading && this.records.length > 0;
    },
    isEmptyMessageVisible() {
      return this.records.length === 0 && !this.isLoading;
    }
  },
  mounted() {
    this.getActiveSubscriptions();
  },
  methods: {
    async getActiveSubscriptions() {
      this.isLoading = true;
      this.$bus.$emit('toggleLoading', true);
      try {
        this.records = await getLastCurrencies(this.country);
      } catch(error) {
        console.error(error);
      } finally {
        this.$bus.$emit('toggleLoading', false);
        this.isLoading = false;
      }
    }
  }
};
</script>

<style  lang="scss">
.last-values {
  .currency-records {
    padding: 10px 6px;
    font-size: 14px;

    &--header {
      display: grid;
      grid-template-columns: 1fr 1fr 2fr;
      padding: 6px 0;
      font-weight: 700;

      .header-item {
        display: flex;
        align-items: center;
        justify-content: center;

        &:first-child {
          justify-content: start;
        }

        &:last-child {
          // justify-content: end;
        }
      }
    }

    &--row {
      display: grid;
      grid-template-columns: 1fr 1fr 2fr;
      padding: 8px 0;

      .record-item {
        display: flex;
        align-items: center;
        justify-content: center;

        &:first-child {
          justify-content: start;
          align-items: flex-start;
        }

        &:last-child {
          justify-content: end;
        }

        &--time {
          font-size: 12px;
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
}
</style>