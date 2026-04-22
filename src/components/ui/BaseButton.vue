<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    tone?: "default" | "ghost" | "danger";
    size?: "sm" | "md";
    uppercase?: boolean;
    disabled?: boolean;
  }>(),
  {
    tone: "default",
    size: "md",
    uppercase: true,
    disabled: false,
  },
);

const classes = computed(() => [
  "ui-button",
  `ui-button--${props.tone}`,
  `ui-button--${props.size}`,
  { "is-uppercase": props.uppercase },
]);
</script>

<template>
  <button :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>

<style scoped>
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--radius-none);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-primary);
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.08em;
  transition:
    background var(--dur-fast) ease,
    border-color var(--dur-fast) ease,
    opacity var(--dur-fast) ease;
}

.is-uppercase {
  text-transform: uppercase;
}

.ui-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.22);
}

.ui-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-button--sm {
  min-height: 32px;
  padding: 0 10px;
  font-size: 11px;
}

.ui-button--ghost {
  background: transparent;
}

.ui-button--danger {
  border-color: rgba(138, 16, 16, 0.45);
  color: #d5b1ad;
}

.ui-button--danger:hover:not(:disabled) {
  background: rgba(128, 18, 18, 0.2);
  border-color: rgba(138, 16, 16, 0.6);
}
</style>
