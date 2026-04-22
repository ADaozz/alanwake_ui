<script setup lang="ts">
import ChapterTitle from "./ChapterTitle.vue";

withDefaults(
  defineProps<{
    title: string;
    kicker?: string;
    image?: string;
  }>(),
  {
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='1000'%3E%3Cdefs%3E%3CradialGradient id='g' cx='50%25' cy='45%25' r='70%25'%3E%3Cstop offset='0%25' stop-color='%231d2a24'/%3E%3Cstop offset='100%25' stop-color='%23070a09'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='1600' height='1000' fill='url(%23g)'/%3E%3C/svg%3E",
  },
);
</script>

<template>
  <section class="chapter-hero scene-tint">
    <img class="chapter-hero__bg" :src="image" alt="" />

    <div class="chapter-hero__overlay page-shell">
      <Transition name="slow-rise" appear>
        <ChapterTitle :kicker="kicker" :title="title" />
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.chapter-hero {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  background: var(--bg-base);
}

.chapter-hero__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.45) saturate(0.7);
}

.chapter-hero__overlay {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100svh;
}
</style>
