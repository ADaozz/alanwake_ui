<script setup lang="ts">
defineProps<{
  kicker?: string;
  title: string;
}>();
</script>

<template>
  <div class="chapter-title">
    <p v-if="kicker" class="ui-kicker">{{ kicker }}</p>
    <h1 class="display-title">{{ title }}</h1>
  </div>
</template>

<style scoped>
.chapter-title {
  display: grid;
  gap: var(--space-4);
}

.display-title {
  max-width: 9ch;
}
</style>
