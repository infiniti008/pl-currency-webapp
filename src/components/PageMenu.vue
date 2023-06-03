<template>
  <div class="menu">
    <p v-if="isAdmin" class="menu__item" @click="$emit('handleToggleTab', 'PageService')">
      Service Page
    </p>

    <p class="menu__item" @click="$emit('handleToggleTab', 'PageContact')">
      Contact Us
    </p>
    <p class="menu__item" @click="$emit('handleToggleTab', 'PageSettings')">
      Settings
    </p>
    <p class="menu__item" @click="$emit('handleToggleTab', 'PageSubscriptions')">
      Manage Subscriptions
    </p>
    <p class="menu__item" @click="$emit('handleToggleTab', 'PageLastValues')">
      Current Exchange Rates
    </p>
    <p class="menu__item" @click="$emit('handleToggleTab', 'PageHello')">
      Home Page
    </p>
    <p class="menu__item">
      <select v-model="selectedCountry" name="countrySelector" id="countrySelector" class="country-selector">
        <option value="all">ALL</option>
        <option value="by">&#127463;&#127486; BY</option>
        <option value="pl">&#127477;&#127473; PL</option>
      </select>
    </p>
  </div>
</template>

<script>
// TODO - Add all countries
import config from '../models/config.js';
import buttontsService from '../services/buttons.js';

const { initButtons } = buttontsService;

export default {
  name: 'PageMenu',
  watch: {
    selectedCountry(newValue) {
      this.$store.commit('setCountry', newValue);
    }
  },
  data: () => {
    return {
      isAdmin: config.ADMIN_USER === config.TELEGRAM_USER,
      selectedCountry: config.defaultCountry
    };
  },
  created() {
    this.selectedCountry = this.$store.state.config.defaultCountry;

    initButtons('PageMenu', this.$store);
  }
}
</script>

<style lang="scss">
@import '../styles/variables/colors.scss';

.menu {
  padding: 0px 6px 10px;
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;

  &__item {
    cursor: pointer;
    text-align: center;
    padding: 10px 0;
    border-bottom: 1px solid;

    &:last-child {
      border-bottom: none;
    }

    .country-selector {
      height: 30px;
      text-align: center;
      width: 90px;
    }
  }
}
</style>