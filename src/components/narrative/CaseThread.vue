<script setup lang="ts">
defineProps<{
  top?: string;
  left?: string;
  width?: string;
}>();
</script>

<template>
  <div class="case-thread" :style="{ top: top ?? '50%', left: left ?? '10%', width: width ?? '220px' }" />
</template>

<style scoped>
.case-thread {
  position: absolute;
  height: 1px;
  transform-origin: left center;
  transform: rotate(8deg);
  background:
    linear-gradient(to right, rgba(133, 28, 28, 0.1), rgba(133, 28, 28, 0.76), rgba(133, 28, 28, 0.1));
}
</style>
