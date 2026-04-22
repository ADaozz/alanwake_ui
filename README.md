# AlanWake UI

A Vue 3 personal homepage for ADaozz, designed as an atmospheric portfolio interface inspired by Alan Wake 2 and Control.

This is not a dashboard-style profile page. The site treats a GitHub profile as a narrative case file: repositories become evidence cards, activity becomes trace material, and the page behaves like a public access node observed through an FBC archive terminal.

## Direction

- Cinematic minimalism with dark environmental tinting
- Alan Wake 2 inspired manuscript pages, lake/dark-place atmosphere, and restrained horror language
- Control inspired bureau-file structure, official labels, authorization language, and geometric restraint
- Evidence-board project presentation with pins, lines, notes, paper cards, and recovered records
- Local video background with subdued overlays, grain, shadow, and scroll-aware header behavior

## Features

- Vue 3 + Vite + TypeScript
- Pinia scene tone state: `forest`, `blood`, `fog`
- Dynamic GitHub repository loading from `github.com/ADaozz`
- Fallback repository records when the GitHub API is unavailable
- Local background video playback with the final 10 seconds skipped during loop
- Alan Wake style manuscript page section
- Evidence board layout with varied card types: sticky note, polaroid, type page, and title strip
- FBC / Old Gods of Asgard inspired acknowledgement archive
- Responsive layout for desktop and mobile

## Local Assets

The site uses local media files under `public/`:

```txt
public/
  video/
    Alan-Wake-2_lakehouse_trailer_website_1080p_H264.mp4
  img/
    Federal Bureau of Control emblem.png
    Metallic Old Gods of Asgard logo.png
```

The video file is intentionally local so the hero section remains stable without relying on an external CDN.

## Stack

```txt
Vue 3
Vite
TypeScript
Pinia
Vue Router
Scoped CSS
@fontsource fonts
```

## Run Locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```txt
src/
  components/
    narrative/
      BloodBranchesOverlay.vue
      CaseThread.vue
      EvidenceBoard.vue
      EvidenceCard.vue
      NarrativeHero.vue
      SceneOverlay.vue
    ui/
      BaseButton.vue
      BasePanel.vue
      BaseTag.vue
  router/
  stores/
    theme.ts
  styles/
    base.css
    fonts.css
    motion.css
    tokens.css
    tones.css
  views/
    HomeView.vue
```

## Design Rules

- Keep the center of the page available for story, image, or atmosphere.
- UI should feel like labels, evidence, access stamps, or archive records.
- Avoid SaaS cards, bright gradients, large rounded controls, and loud motion.
- Use low-saturation color, weak lines, and controlled contrast.
- Motion should feel like fog, light, or camera movement, not product animation.

## Credits

This project is a fan-made personal homepage and visual study. Alan Wake, Control, Federal Bureau of Control, and Old Gods of Asgard references belong to their respective rights holders.
