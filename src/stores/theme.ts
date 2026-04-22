import { defineStore } from "pinia";

export type SceneTone = "forest" | "blood" | "fog";

export const toneClassMap: Record<SceneTone, string> = {
  forest: "tone-forest",
  blood: "tone-blood",
  fog: "tone-fog",
};

export const useThemeStore = defineStore("theme", {
  state: () => ({
    sceneTone: "forest" as SceneTone,
  }),
  getters: {
    toneClass: (state) => toneClassMap[state.sceneTone],
  },
  actions: {
    setTone(tone: SceneTone) {
      this.sceneTone = tone;
    },
  },
});
