<template>
  <div class="footer">
    <div 
      class="footer__item"
      :class="firstNavButton.isDisabled ? 'footer__item--disabled' : ''"
      @click="handleClickNavButton(firstNavButton)"
    >
      <component :is="firstNavButton.component" />
    </div>
    <div 
      class="footer__item" 
      :class="secondNavButton.isDisabled ? 'footer__item--disabled' : ''"
      @click="handleClickNavButton(secondNavButton)"
    >
      <component :is="secondNavButton.component" />
    </div>

    <div 
      class="footer__item" 
      :class="thirdNavButton.isDisabled ? 'footer__item--disabled' : ''"
      @click="handleClickNavButton(thirdNavButton)"
    >
      <component :is="thirdNavButton.component" />
    </div>
    <div class="footer__item" @click="handleClickButton(tabMenu)">
      <MenuSVG />
      <div v-if="isSmartDonateButtonVisible" class="footer__item-donate">
        <ButtonDonateSmart />
      </div>
    </div>
  </div>
</template>

<script>
import Button from './ui/Button.vue';
import ButtonDonateSmart from './ui/ButtonDonateSmart.vue';
import ConfirmSVG from './ui/svg/ConfirmSVG.vue';
import MenuSVG from './ui/svg/MenuSVG.vue';
import StarSVG from './ui/svg/StarSVG.vue';
import CancelSVG from './ui/svg/CancelSVG.vue';
import BackSVG from './ui/svg/BackSVG.vue';
import CurrencySVG from './ui/svg/CurrencySVG.vue';
import AddSVG from './ui/svg/AddSVG.vue';
import DeleteSVG from './ui/svg/DeleteSVG.vue';
import UpdateSVG from './ui/svg/UpdateSVG.vue';

export default {
    name: "Footer",
    components: {
    Button,
    ButtonDonateSmart,
    MenuSVG,
    StarSVG,
    ConfirmSVG,
    CancelSVG,
    BackSVG,
    CurrencySVG,
    AddSVG,
    DeleteSVG,
    UpdateSVG
},
    props: {
      tab: {
        type: String,
        required: true,
      }
    },
    data: () => {
        return {
          tabLastValues: 'PageLastValues',
          tabMenu: 'PageMenu',
        };
    },
    computed: {
      firstNavButton() {
        return this.$store.state.firstNavButton;
      },
      secondNavButton() {
        return this.$store.state.secondNavButton;
      },
      thirdNavButton() {
        return this.$store.state.thirdNavButton;
      },
      isPremium() {
        return this.$store.state.config.isPremium;
      },
      isSmartDonateButtonVisible() {
        return this.tab !== 'PageHello' && this.tab !== 'PageMenu';
      }
    },
    methods: {
      handleClickButton(tab) {
        this.$emit('handleToggleTab', tab);
      },

      handleClickNavButton(button) {
        this.$bus.$emit(button.action);
      },
    }
}
</script>

<style lang="scss">
@import '../styles/variables/colors.scss';
$--footer-height: 70px;

.footer {
  height: $--footer-height;
  padding: 10px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: $--white;
  box-shadow: 0px 0px 30px -10px $--green;
  position: fixed;
  bottom: 0px;
  transition: bottom ease-in-out 0.5s;

  &__item {
    width: 50px;
    position: relative;

    &--disabled {
      opacity: 0.2;
    }
  }

  &__item-donate {
    position: absolute;
    top: 17px;
    left: 15px;
    z-index: -1;
  }
}
</style>