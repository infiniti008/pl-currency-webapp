<template>
  <button @click="handleClick" class="button" :class="buttonClasses">
    <slot />
  </button>
</template>

<script>
export default {
  name: "Button",
  props: {
    theme: {
      type: String,
      default: 'yellow',
    },
  },
  data: () => {
    return {};
  },
  computed: {
    buttonClasses() {
      return [
        'button--' + this.theme
      ]
    }
  },
  methods: { 
    handleClick() {
      this.$emit('click')
    }
   }
};
</script>

<style lang="scss">
@import '../../styles/variables/colors.scss';

.button {
  font-size: 15px;
  padding: 0.7em 1em;
  letter-spacing: 0.06em;
  border-radius: 0.6em;
  overflow: hidden;
  line-height: 1.4em;
  border: 2px solid $--yellow;
  color: $--white;
  font-weight: 500;
  transition: color ease-out .5s;

  &::before {
    content: ">";
    color: transparent;
    transition: color ease-in .5s;
  }
  &::after {
    content: "<";
    color: transparent;
    transition: color ease-out .5s;
  }

  &.active {
    color: $--red;
    &::before {
      color: $--red;
    }
    &::after {
      color: $--red;
    }
  }

  &--yellow {
    background-color: $--yellow;
    border-color: $--yellow;
  }

  &--red {
    background-color: $--red;
    border-color: $--red;
  }

  &--green {
    background-color: $--green;
    border-color: $--green;
  }
}
</style>