<script setup lang="ts">
defineProps<{
  code: string;
  title: string;
  note?: string;
}>();
</script>

<template>
  <article class="evidence-card">
    <p class="evidence-card__code">{{ code }}</p>
    <h3 class="evidence-card__title">{{ title }}</h3>
    <p v-if="note" class="evidence-card__note">{{ note }}</p>
    <slot />
  </article>
</template>

<style scoped>
.evidence-card {
  position: relative;
  background: #d8d1bf;
  color: #231f1a;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
  font-family: var(--font-evidence);
}

.evidence-card__code {
  margin: 0 0 8px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.evidence-card__title {
  margin: 0;
  font-size: 20px;
  line-height: 1.2;
}

.evidence-card__note {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.6;
}
</style>
