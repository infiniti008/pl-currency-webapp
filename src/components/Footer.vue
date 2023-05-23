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
    </div>
  </div>
</template>

<script>
import Button from './ui/Button.vue';
import ConfirmSVG from './ui/svg/ConfirmSVG.vue';
import MenuSVG from './ui/svg/MenuSVG.vue';
import StarSVG from './ui/svg/StarSVG.vue';
import CancelSVG from './ui/svg/CancelSVG.vue';
import BackSVG from './ui/svg/BackSVG.vue';

export default {
    name: "Footer",
    components: {
    Button,
    MenuSVG,
    StarSVG,
    ConfirmSVG,
    CancelSVG,
    BackSVG
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

    &--disabled {
      opacity: 0.2;
    }
  }
}
</style>