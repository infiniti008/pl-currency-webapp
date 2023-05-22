<template>
  <div class="footer">
    <div 
      class="footer__item"
      :class="isCancelDisabled ? 'footer__item--disabled' : ''"
      @click="handleClickCancel"
    >
      <CancelSVG :disabled="isCancelDisabled" />
    </div>
    <div 
      class="footer__item" 
      :class="isConfirmDisabled ? 'footer__item--disabled' : ''"
      @click="handleClickConfirm"
    >
      <ConfirmSVG :disabled="isConfirmDisabled" />
    </div>
    <div class="footer__item" @click="handleClickStarButton()">
      <StarSVG :is-favorite="isStarActive"/>
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

export default {
    name: "Footer",
    components: {
    Button,
    MenuSVG,
    StarSVG,
    ConfirmSVG,
    CancelSVG
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
          isStarActive: false
        };
    },
    computed: {
      isConfirmDisabled() {
        return !this.$store.state.isConfirmAvailable;
      },
      isCancelDisabled() {
        return !this.$store.state.isCancelAvailable;
      }
    },
    methods: {
      handleClickButton(tab) {
        this.$emit('handleToggleTab', tab);
      },
      handleClickStarButton() {
        this.isStarActive = !this.isStarActive;
        this.$bus.$emit('showFavoriteOnly', this.isStarActive);
      },
      handleClickConfirm() {
        if (!this.isConfirmDisabled) {
          this.$bus.$emit(this.$store.state.currentConfirmOperation);
        }
      },
      handleClickCancel() {
        if (!this.isCancelDisabled) {
          this.$bus.$emit(this.$store.state.currentCancelOperation);
        }
      }
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
  box-shadow: 0px 10px 20px $--green;
  position: absolute;
  top: calc(var(--tg-viewport-stable-height) - $--footer-height);
  transition: top ease-in-out 0.3s;

  &__item {
    width: 50px;

    &--disabled {
      opacity: 0.5;
    }
  }
}
</style>