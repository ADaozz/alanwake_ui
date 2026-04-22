<template>
  <div class="blood-branches" aria-hidden="true">
    <svg class="blood-branches__svg" viewBox="0 0 1200 800" preserveAspectRatio="none">
      <g fill="none" stroke-linecap="round">
        <path class="branch branch--thick" pathLength="100" style="--delay: 0s; --dur: 7.5s" d="M0,700 C80,620 120,560 180,500" />
        <path class="branch branch--mid" pathLength="100" style="--delay: 0.4s; --dur: 6.8s" d="M180,500 C220,460 250,420 270,360" />
        <path class="branch branch--thin" pathLength="100" style="--delay: 0.9s; --dur: 6.2s" d="M180,500 C150,450 130,420 100,390" />
        <path class="branch branch--hair" pathLength="100" style="--delay: 1.4s; --dur: 5.6s" d="M100,390 C70,350 45,330 20,300" />

        <path class="branch branch--thick" pathLength="100" style="--delay: 0.2s; --dur: 7.1s" d="M1200,120 C1100,160 1050,220 980,300" />
        <path class="branch branch--mid" pathLength="100" style="--delay: 0.8s; --dur: 6.4s" d="M980,300 C940,350 900,390 860,430" />
        <path class="branch branch--thin" pathLength="100" style="--delay: 1.2s; --dur: 5.8s" d="M980,300 C1030,270 1080,250 1140,240" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.blood-branches {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.blood-branches__svg {
  width: 100%;
  height: 100%;
  opacity: 0.78;
  mix-blend-mode: screen;
  filter: blur(0.2px) saturate(0.9);
}

.branch {
  stroke: var(--vein-color);
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation:
    branch-grow var(--dur) ease-out var(--delay) infinite,
    branch-pulse calc(var(--dur) * 0.75) ease-in-out calc(var(--delay) + 1.2s) infinite;
}

.branch--thick {
  stroke-width: 3;
}

.branch--mid {
  stroke-width: 2;
}

.branch--thin {
  stroke-width: 1.5;
}

.branch--hair {
  stroke-width: 1;
}

@keyframes branch-grow {
  0% {
    stroke-dashoffset: 100;
    opacity: 0;
  }
  18% {
    opacity: 1;
  }
  60%,
  100% {
    stroke-dashoffset: 0;
    opacity: 0.8;
  }
}

@keyframes branch-pulse {
  0%,
  100% {
    stroke: var(--vein-color);
  }
  50% {
    stroke: var(--vein-color-hot);
  }
}

@media (prefers-reduced-motion: reduce) {
  .branch {
    animation: none;
    stroke-dashoffset: 0;
    opacity: 0.72;
  }
}
</style>
