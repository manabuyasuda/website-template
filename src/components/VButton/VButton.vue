<template>
  <button
    :id="id ? id : null"
    class="Button"
    :class="[variant ? '-' + variant : '', size ? '-' + size : '']"
    :disabled="disabled"
    :type="type"
    @click="clickHandler"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  >
    <slot></slot>
    <span v-if="icon" class="Button_Icon" :class="[icon ? 'Button_Icon-' + icon : '']"></span>
  </button>
</template>

<script>
export default {
  name: 'SampleButton',
  props: {
    variant: {
      type: String,
      requires: false,
      default: '',
      validator(val) {
        return ['', 'default', 'outline'].includes(val);
      },
    },
    size: {
      type: String,
      requires: false,
      default: '',
      validator(val) {
        return ['', 'full', 'auto'].includes(val);
      },
    },
    icon: {
      type: String,
      requires: false,
      default: '',
      validator(val) {
        return ['', 'arrow', 'external'].includes(val);
      },
    },
    id: { type: String, requires: false, default: '' },
    type: {
      type: String,
      requires: false,
      default: 'button',
      validator(val) {
        return ['button', 'submit'].includes(val);
      },
    },
    disabled: { type: Boolean, requires: false, default: false },
  },
  methods: {
    clickHandler(e) {
      this.$emit('click', e);
    },
  },
};
</script>

<style lang="scss" scoped>
.Button {
  display: inline-block;
  position: relative;
  width: 280px;
  max-width: 100%;
  margin: 0;
  padding: rem(12) rem(32);
  text-align: center;
  text-decoration: none;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1;
  border: none;
  border: 1px solid #d0d0d0;
  border-radius: $form-border-radius;
  background: transparent;
  background-color: #fff;
  color: inherit;
  cursor: pointer;
  transition-timing-function: $global-transition-timing-function;
  transition-duration: $global-transition-duration;
  appearance: none;

  &[type='button'],
  &[type='reset'],
  &[type='submit'] {
    appearance: none;
  }

  [data-whatintent='keyboard'] &:focus {
    outline-width: 0;
    box-shadow: $form-box-shadow-focus;
  }

  [data-whatintent='mouse'] &:focus,
  [data-whatintent='touch'] &:focus {
    outline-width: 0;
    box-shadow: none;
  }

  &:disabled,
  &.-disabled,
  &:disabled:hover,
  &.-disabled:hover {
    border-color: $form-background-color-disabled !important;
    background-color: $form-background-color-disabled !important;
    opacity: $form-opacity-disabled !important;
    cursor: $form-cursor-disabled !important;
  }

  &.-disabled {
    pointer-events: none;
  }
}

.Button.-default {
  border-color: $color-brand;
  background-color: $color-brand;
  color: #fff;

  html:not([data-whatintent='touch']) &:hover {
    background-color: #fff;
    color: $color-brand;
  }

  html:not([data-whatintent='touch']) &:disabled:hover,
  html:not([data-whatintent='touch']) &.-disabled:hover {
    color: #fff;
  }
}

.Button.-outline {
  border-color: $color-brand;
  background-color: #fff;
  color: $color-brand;

  html:not([data-whatintent='touch']) &:hover {
    background-color: $color-brand;
    color: #fff;
  }

  html:not([data-whatintent='touch']) &:disabled:hover,
  html:not([data-whatintent='touch']) &.-disabled:hover {
    color: $color-brand;
  }
}

.Button.-full {
  width: 100%;
  max-width: none;
}

.Button.-auto {
  width: auto;
}
</style>
