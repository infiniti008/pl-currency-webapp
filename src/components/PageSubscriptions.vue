<template>
  <div class="subscriptions-page">
    <div class="item" v-for="item in subscriptions" :key="item._id">
      <label :for="item._id">
        <div class="item__group item__group--row">
          <div class="item__title">
            Interval:
          </div>
          <div class="item__text">
            {{ getIntervalName(item.interval) }}
          </div>
        </div>
        <div class="item__group">
          <div class="item__title">
            Keys:
          </div>
          <div class="item__list" :class="isKeyDeprecated(key) ? 'item__list--deprecated' : ''" v-for="key in item.keys" :key="key">
            {{ getKeyName(key) }}
          </div>
          <div class="item__checkbox">
            <input :id="item._id" type="radio" name="subscription" v-model="selectedSubscription" :value="item._id">
          </div>
        </div>
        <div class="item__group">
          <div class="item__title">
            Times:
          </div>
          <div class="item__list item__list--row">
            <span  v-for="time in item.times" :key="time">
              {{ time }}
            </span>
          </div>
        </div>
      </label>
    </div>
    <div v-if="subscriptions.length === 0" class="item__empty">
      No Items to Display
    </div>
  </div>
</template>

<script>
import buttontsService from '../services/buttons.js';
import { getSubscriptions, deleteSubscription } from '../services/api.js';
const { initButtons, updateButtonsByKey } = buttontsService;

export default {
  name: "PageSubscriptions",
  data: () => {
    return {
      subscriptions: [],
      settings: {
        keys: [],
      },
      selectedSubscription: null
    };
  },
  mounted() {
    this.getSubscriptions();
  },
  created() {
    this.$bus.$on('addSubscription', this.addSubscription);
    this.$bus.$on('deleteSubscription', this.deleteSubscription);
    this.$bus.$on('manageSubscription', this.manageSubscription);

    initButtons('PageSubscriptions', this.$store);
  },
  beforeDestroy() {
    this.$bus.$off('addSubscription');
    this.$bus.$off('deleteSubscription');
    this.$bus.$off('manageSubscription');
  },
  watch: {
    hasSelectedItem(newValue) {
      updateButtonsByKey('PageSubscriptions', this.$store, 'hasSelectedItem', !newValue);
    }
  },
  computed: {
    hasSelectedItem() {
      return !!this.selectedSubscription;
    },
    intervals() {
      return this.$store.state.config.intervals;
    }
  },
  methods: {
    async getSubscriptions() {
      try {
        this.isLoading = true;
        this.$bus.$emit('toggleLoading', true);

        const response = await getSubscriptions();

        this.subscriptions = response.subscriptions;
        this.settings.keys = response.settings.keys;
      } catch(err) {
        console.log(err);
      } finally {
        this.$bus.$emit('toggleLoading', false);
        this.isLoading = false;
      }
    },
    addSubscription() {
      this.$emit('handleToggleTab', 'PageManageSubscription');
    },
    async deleteSubscription() {
      if (this.hasSelectedItem) {
        try {
          this.isLoading = true;
          this.$bus.$emit('toggleLoading', true);

          const response = await deleteSubscription(this.selectedSubscription);

          if (response.status) {
            this.subscriptions = this.subscriptions.filter(subscription => subscription._id !== this.selectedSubscription);
            this.selectedSubscription = null;
          }

        } catch(err) {
          console.log(err);
        } finally {
          this.$bus.$emit('toggleLoading', false);
          this.isLoading = false;
        }
      }
    },
    manageSubscription() {
      if (this.hasSelectedItem) {
        const selectesSubscription = this.subscriptions.find(subscription => subscription._id === this.selectedSubscription) || null;

        if (selectesSubscription) {
          this.$store.commit('setCurentSubscriptionToManage', selectesSubscription);
          this.$emit('handleToggleTab', 'PageManageSubscription');
        }
      }
    },
    getKeyName(keyToDefine) {
      const key = this.settings.keys.find(key => key.key === keyToDefine);
      if (key) {
        return `${key.currency} | ${key.name}`;
      }
      return keyToDefine;
    },
    isKeyDeprecated(keyToDefine) {
      return !this.settings.keys.find(key => key.key === keyToDefine);
    },
    getIntervalName(intervalToDefine) {
      return this.intervals.find(interval => interval.key === intervalToDefine)?.name || intervalToDefine;
    }
  }
};
</script>

<style lang="scss">
.subscriptions-page {
  padding: 10px;
  height: calc(100vh - 70px);
  overflow-y: auto;

  .item {
    margin: 6px 0px;
    border-bottom: 1px solid #545B77;

    &:last-child {
      border: none;
    }

    &__empty {
      text-align: center;
    }

    &__group {
      display: flex;
      flex-direction: column;
      padding: 2px 0px;
      position: relative;

      &--row {
        flex-direction: row;
        justify-content: space-between;
      }
    }

    &__title {
      font-weight: 600;
      color: #F99B7D;
    }

    &__text, &__list {
      color: #4C4C6D;
    }

    &__list {
      display: flex;
      flex-direction: column;
  
      &--row {
        flex-direction: row;
        justify-content: space-between;
      }

      &--deprecated {
        text-decoration: line-through;
      }
    }

    &__checkbox {
      position: absolute;
      right: 0px;
      top: 50%;
      transform: translateY(-25%);
      padding: 4px;

      input {
        width: 30px;
        height: 30px;
      }
    }
  }
}
</style>