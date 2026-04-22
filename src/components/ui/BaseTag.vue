<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    tone?: "default" | "evidence" | "warning";
    size?: "sm" | "md";
    uppercase?: boolean;
  }>(),
  {
    tone: "default",
    size: "md",
    uppercase: true,
  },
);

const classes = computed(() => [
  "ui-tag",
  `ui-tag--${props.tone}`,
  `ui-tag--${props.size}`,
  { "is-uppercase": props.uppercase },
]);
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<style scoped>
.ui-tag {
  display: inline-flex;
  align-items: center;
  padding: 0 6px;
  min-height: 22px;
  border: 1px solid transparent;
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.08em;
}

.is-uppercase {
  text-transform: uppercase;
}

.ui-tag--md {
  min-height: 24px;
  padding: 0 8px;
}

.ui-tag--default {
  color: #59635d;
  background: #b5c1b7;
}

.ui-tag--evidence {
  color: #312921;
  background: #d8d1bf;
  border-color: rgba(0, 0, 0, 0.2);
}

.ui-tag--warning {
  color: #d5b1ad;
  background: rgba(128, 18, 18, 0.26);
  border-color: rgba(138, 16, 16, 0.45);
}
</style>
