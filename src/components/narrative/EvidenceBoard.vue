<template>
  <section class="evidence-board">
    <slot />
  </section>
</template>

<style scoped>
.evidence-board {
  position: relative;
  min-height: 560px;
  padding: var(--space-7);
  background:
    linear-gradient(rgba(8, 10, 9, 0.74), rgba(8, 10, 9, 0.88)),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.025) 0 1px, transparent 1px 17px),
    repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.22) 0 1px, transparent 1px 19px),
    radial-gradient(circle at 24% 30%, rgba(151, 172, 159, 0.1), transparent 38%),
    #101311;
  border: 1px solid var(--line-subtle);
  box-shadow:
    inset 0 0 70px rgba(0, 0, 0, 0.78),
    0 24px 80px rgba(0, 0, 0, 0.32);
  overflow: hidden;
}

.evidence-board::before {
  content: "";
  position: absolute;
  inset: var(--space-4);
  pointer-events: none;
  border: 1px solid rgba(151, 172, 159, 0.08);
}

.evidence-board::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 18% 72%, rgba(128, 18, 18, 0.14), transparent 28%),
    radial-gradient(circle at 78% 18%, rgba(151, 172, 159, 0.07), transparent 30%);
  mix-blend-mode: screen;
}

@media (max-width: 900px) {
  .evidence-board {
    min-height: auto;
    padding: var(--space-5);
  }
}
</style>
