<template>
  <div class="hello-page">
    <h3>Thank you for using the bot.</h3>
    <hr />
    <p>
      <ul class="hello-page__tips">
        <li>
          Use the menu to show current exchange rates
        </li>
        <li>
          Use the menu to select a country to display exchange rates
        </li>
        <li>
          Visit the settings page to customize your preferences
        </li>
        <li>
          Visit the contact page to leave a message to the team
        </li>
      </ul>
    </p>
    <hr />
    <template v-if="!isPremium">
      <p>
        Please support the team in developing new features and maintaining the infrastructure!
      </p>
      <hr />
      <p>
        Dear User, your contribution will directly support the ongoing operation and improvement of our service.
        Donate now and make a difference. Thank you for your support!
        ChatGPT &#169;
      </p>
      <hr />
    </template>
    <template v-else>
      <p>
        Thank You For Your Support!
      </p>
      <hr />
    </template>
    <div class="donate-button">
      <ButtonDonate />
    </div>
  </div>
</template>

<script>
import buttontsService from '../services/buttons.js';

import ButtonDonate from './ui/ButtonDonate.vue';

const { initButtons } = buttontsService;

export default {
  name: "PageHello",
  components: {
    ButtonDonate
  },
  data: () => {
    return {};
  },
  created() {
    this.$bus.$on('handleOpenCurrencyPage', this.handleOpenCurrencyPage);

    initButtons('PageHello', this.$store);
  },
  beforeDestroy() {
    this.$bus.$off('handleOpenCurrencyPage');
  },
  computed: {
    isPremium() {
      return this.$store.state.config.isPremium;
    }
  },
  methods: {
    handleOpenCurrencyPage() {
      this.$emit('handleToggleTab', 'PageLastValues');
    }
  }
};
</script>

<style lang="scss">
.hello-page {
  padding: 10px;
  
  p {
    margin-top: 10px;
    margin-bottom: 10px;
    padding-left: 20px;
  }

  &__tips {
    li {
      padding: 6px 0;
    }
  }

  .donate-button {
    position: absolute;
    bottom: 90px;
    left: 25%;
  }
}
</style>