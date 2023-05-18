<template>
  <div class="footer">
    <Button :class="isActive(tabLastValues)" @click="handleClickButton(tabLastValues)">
      Последние Данные
    </Button>

    <Button :class="isActive(tabMenu)" @click="handleClickButton(tabMenu)">
      Меню
    </Button>
  </div>
</template>

<script>
import Button from './ui/Button.vue';

export default {
    name: "Footer",
    components: {
        Button,
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
    methods: {
      handleClickButton(tab) {
        this.$emit('handleToggleTab', tab);
      },
      isActive(tab) {
        return tab === this.tab ? 'active' : '';
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
}
</style>