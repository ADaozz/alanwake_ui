<script setup lang="ts">
defineProps<{
  dim?: number;
}>();
</script>

<template>
  <div class="scene-overlay" :style="{ '--dim': String(dim ?? 0.42) }">
    <slot />
  </div>
</template>

<style scoped>
.scene-overlay {
  position: relative;
}

.scene-overlay::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  background: linear-gradient(
    to bottom,
    rgba(4, 6, 6, calc(var(--dim) * 0.55)) 0%,
    rgba(4, 6, 6, var(--dim)) 70%,
    rgba(4, 6, 6, calc(var(--dim) + 0.08)) 100%
  );
}

.scene-overlay > * {
  position: relative;
  z-index: 1;
}
</style>
