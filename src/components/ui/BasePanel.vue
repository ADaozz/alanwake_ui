<template>
  <section class="ui-panel">
    <header v-if="$slots.header" class="ui-panel__header">
      <slot name="header" />
    </header>
    <div class="ui-panel__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.ui-panel {
  background: rgba(10, 14, 13, 0.72);
  border: 1px solid var(--line-subtle);
  backdrop-filter: blur(2px);
}

.ui-panel__header {
  padding: var(--space-4) var(--space-4) var(--space-2);
  border-bottom: 1px solid var(--line-subtle);
}

.ui-panel__body {
  padding: var(--space-4);
}
</style>
