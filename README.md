# Alan Wake UI Style Baseline (Vue 3)

这是一个基于你规范落地的最小可运行工程，重点是把“电影化极简 + 心理惊悚叙事 UI”变成可复用代码结构。

## 启动

```bash
npm install
npm run dev
```

## 关键结构

```txt
src/
  assets/
    fonts/
    textures/
    images/
  components/
    ui/
      BaseButton.vue
      BaseTag.vue
      BasePanel.vue
    narrative/
      NarrativeHero.vue
      ChapterTitle.vue
      EvidenceBoard.vue
      EvidenceCard.vue
      CaseThread.vue
      SceneOverlay.vue
  stores/
    theme.ts
  router/
    index.ts
  styles/
    tokens.css
    base.css
    motion.css
    tones.css
  views/
    HomeView.vue
```

## 已实现约束映射

- 字体分层 token：`--font-display` / `--font-ui` / `--font-evidence` / `--font-note`
- 低饱和色板与染色：`tokens.css` + `.scene-tint`
- 氛围动效：`fade` / `slow-rise` / `ambient-flicker`
- 组件语义：`Base*` 与 `Narrative*` 分层
- Pinia 主题：`forest` / `blood` / `fog`
- 响应式标题：`clamp(...)` 与移动端间距收敛
- 无障碍焦点样式：`:focus-visible`
