<template>
  <svg class="arrow-svg" :class="direction == 'left' ? 'arrow-svg--left' : ''" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 20 20" version="1.1">
    <g :stroke="color" stroke-width="1" :fill="isFilled ? color : 'none'" fill-rule="evenodd">
      <g transform="translate(5, 2)" :fill="isFilled ? color : 'none'">
        <path
          d="M4.973,4.175 L9.975,7.919 L9.975,3.979 L4.973,0.036 L0.004,4.078 L0.004,7.996 L0.016,8.007 L4.973,4.175 Z">
        </path>
        <path
          d="M4.973,11.958 L9.975,15.909 L9.975,11.971 L4.973,8.005 L0.004,12.069 L0.004,15.987 L0.016,15.997 L4.973,11.958 Z">
        </path>
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  name: "ArrowSVG",
  props: {
    isFilled: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'red'
    },
    direction: {
      type: String,
      default: 'right'
    }
  },
  data: () => {
    return {};
  },
};
</script>

<style  lang="scss">
.arrow-svg {
  transform: rotate(90deg);

  &--left {
    transform: rotate(-90deg);
  }
}
</style>