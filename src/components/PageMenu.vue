<template>
  <div class="menu">
    <p v-if="isAdmin" class="menu__item" @click="$emit('handleToggleTab', 'PageService')">
      Service Page
    </p>


    <p class="menu__item" @click="$emit('handleToggleTab', 'PageSettings')">
      Settings
    </p>
    <p class="menu__item">
      <select v-model="selectedCountry" name="countrySelector" id="countrySelector" class="country-selector"> 
        <option value="by">&#127463;&#127486; BY</option>
        <option value="pl">&#127477;&#127473; PL</option>
      </select>
    </p>
    <p class="menu__item" @click="$emit('handleToggleTab', 'PageLastValues')">
      Current Rates
    </p>
    <p class="menu__item" @click="$emit('handleToggleTab', 'PageHello')">
      Manage Subscriptions
    </p>
    <p class="menu__item" @click="$emit('handleToggleTab', 'PageHello')">
      Home Page
    </p>
  </div>
</template>

<script>
import config from '../models/config.js';

export default {
  name: 'PageMenu',
  components: {
    // Button
  },
  watch: {
    selectedCountry(newValue) {
      this.$store.commit('setCountry', newValue);
    }
  },
  data: () => {
    return {
      isAdmin: config.ADMIN_USER === config.TELEGRAM_USER,
      selectedCountry: config.DEFAULT_COUNTRY
    };
  },
  created() {
    this.selectedCountry = this.$store.state.country;
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