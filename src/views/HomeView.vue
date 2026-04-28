<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, onUnmounted, ref } from "vue";

import BaseButton from "../components/ui/BaseButton.vue";
import BaseTag from "../components/ui/BaseTag.vue";
import BloodBranchesOverlay from "../components/narrative/BloodBranchesOverlay.vue";
import CaseThread from "../components/narrative/CaseThread.vue";
import EvidenceBoard from "../components/narrative/EvidenceBoard.vue";
import EvidenceCard from "../components/narrative/EvidenceCard.vue";
import { useThemeStore } from "../stores/theme";

const themeStore = useThemeStore();
const { toneClass } = storeToRefs(themeStore);

const heroVideo = "/video/Alan-Wake-2_lakehouse_trailer_website_1080p_H264.mp4";
const manuscriptLines = [
  "The repository was not opened. It was found.",
  "A commit flickered like a page under a lamp. The lake kept the older draft beneath the surface.",
  "Every tool asked for permission before it crossed the threshold. Every interface left a trace in the dark.",
];
const references = [
  {
    name: "Federal Bureau of Control",
    role: "感谢本机构对页面异常现象收容、阈限干扰监测与低概率现实偏移记录提供支持",
    note: "记录级别：Bureau Approved / Active Observation",
    image: "/img/Federal Bureau of Control emblem.png",
  },
  {
    name: "Old Gods of Asgard",
    role: "感谢其为夜间导航、精神锚定、舞台照明记忆与高噪环境下的叙事稳定提供支持",
    note: "介入方式：音频残响 / 仪式性共鸣",
    image: "/img/Metallic Old Gods of Asgard logo.png",
  },
];

interface GitHubRepo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  license: {
    spdx_id: string;
  } | null;
  updated_at: string;
  created_at: string;
}

interface ProjectCard {
  code: string;
  title: string;
  note: string;
  href: string;
  meta: string;
  status: string;
  signal: string;
  risk: string;
}

const fallbackProjects: ProjectCard[] = [
  {
    code: "REPO-01",
    title: "mcp-authz",
    note: "AI Agent tool authorization framework for local tools and remote MCP tools.",
    href: "https://github.com/ADaozz/mcp-authz",
    meta: "MIT / updated Apr 22, 2026",
    status: "ACTIVE",
    signal: "CONTROLLED",
    risk: "LOW",
  },
  {
    code: "REPO-02",
    title: "deep_agent_v1",
    note: "A real multi-agent parallel demo based on create_deep_agent.",
    href: "https://github.com/ADaozz/deep_agent_v1",
    meta: "Agent demo / updated Apr 21, 2026",
    status: "OBSERVED",
    signal: "UNSTABLE",
    risk: "MEDIUM",
  },
  {
    code: "REPO-03",
    title: "mygit",
    note: "Early public repository record from the archive.",
    href: "https://github.com/ADaozz/mygit",
    meta: "Archive / created Feb 13, 2023",
    status: "ARCHIVED",
    signal: "DORMANT",
    risk: "LOW",
  },
  {
    code: "REPO-04",
    title: "Interactive Scenes",
    note: "This portfolio interface: Vue 3, cinematic layout, SVG vein motion, evidence-board project display.",
    href: "https://github.com/ADaozz",
    meta: "Portfolio case / current build",
    status: "OPEN",
    signal: "VISIBLE",
    risk: "LOW",
  },
];

const repos = ref<ProjectCard[]>(fallbackProjects);
const isLoadingRepos = ref(true);
const repoLoadError = ref("");
const isHeaderHidden = ref(false);
const lastScrollY = ref(0);
const heroVideoRef = ref<HTMLVideoElement | null>(null);

const projects = computed(() => repos.value);

function formatRepoDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function mapRepoToProject(repo: GitHubRepo, index: number): ProjectCard {
  const language = repo.language ?? "Code";
  const license = repo.license?.spdx_id && repo.license.spdx_id !== "NOASSERTION" ? repo.license.spdx_id : "Public";
  const isRecent = Date.now() - new Date(repo.updated_at).getTime() < 1000 * 60 * 60 * 24 * 14;

  return {
    code: `REPO-${String(index + 1).padStart(2, "0")}`,
    title: repo.name,
    note: repo.description ?? "Public GitHub repository from ADaozz.",
    href: repo.html_url,
    meta: `${language} / ${license} / updated ${formatRepoDate(repo.updated_at)}`,
    status: isRecent ? "ACTIVE" : "ARCHIVED",
    signal: repo.description ? "READABLE" : "PARTIAL",
    risk: license === "Public" ? "UNKNOWN" : "LOW",
  };
}

function getEvidenceStyle(index: number) {
  const positions = [
    { top: "9%", left: "6%", rotate: "-4deg" },
    { top: "18%", left: "38%", rotate: "2deg" },
    { top: "48%", left: "20%", rotate: "3deg" },
    { top: "38%", left: "68%", rotate: "-3deg" },
    { top: "66%", left: "50%", rotate: "2deg" },
    { top: "61%", left: "4%", rotate: "-2deg" },
    { top: "9%", left: "72%", rotate: "4deg" },
    { top: "70%", left: "76%", rotate: "-4deg" },
  ];
  const position = positions[index % positions.length];

  return {
    top: position.top,
    left: position.left,
    "--rotate": position.rotate,
  };
}

function getEvidenceVariant(index: number) {
  const variants = ["sticky-note", "polaroid", "type-page", "title-strip"];

  return variants[index % variants.length];
}

async function loadRepos() {
  try {
    const response = await fetch("https://api.github.com/users/ADaozz/repos?sort=updated&per_page=8");

    if (!response.ok) {
      throw new Error(`GitHub API ${response.status}`);
    }

    const data = (await response.json()) as GitHubRepo[];
    repos.value = data.filter((repo) => repo.name).map(mapRepoToProject);
  } catch (error) {
    repoLoadError.value = error instanceof Error ? error.message : "Unable to load GitHub repositories";
    repos.value = fallbackProjects;
  } finally {
    isLoadingRepos.value = false;
  }
}

function handleScroll() {
  const currentScrollY = window.scrollY;
  const isScrollingDown = currentScrollY > lastScrollY.value;

  isHeaderHidden.value = isScrollingDown && currentScrollY > 96;
  lastScrollY.value = Math.max(currentScrollY, 0);
}

function handleHeroVideoTimeUpdate() {
  const video = heroVideoRef.value;

  if (!video || !Number.isFinite(video.duration) || video.duration <= 10) {
    return;
  }

  if (video.currentTime >= video.duration - 10) {
    video.currentTime = 0;
    void video.play();
  }
}

onMounted(() => {
  lastScrollY.value = window.scrollY;
  window.addEventListener("scroll", handleScroll, { passive: true });
  void loadRepos();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div :class="['page-root', toneClass]">
    <BloodBranchesOverlay />

    <header class="site-header" :class="{ 'is-hidden': isHeaderHidden }" @focusin="isHeaderHidden = false">
      <a class="brand-mark" href="/" aria-label="Personal home">ADAOZZ</a>
      <nav class="site-nav" aria-label="Primary">
        <a href="#profile">Profile</a>
        <a href="#work">Work</a>
        <a href="#contact">Contact</a>
      </nav>
      <a class="header-link" href="https://github.com/ADaozz" target="_blank" rel="noreferrer">GitHub</a>
    </header>

    <main class="page-content">
      <section class="hero-screen scene-tint" aria-labelledby="hero-title">
        <video
          ref="heroVideoRef"
          class="hero-media"
          :src="heroVideo"
          autoplay
          muted
          playsinline
          @timeupdate="handleHeroVideoTimeUpdate"
        />
        <div class="hero-grain" aria-hidden="true" />
        <div class="hero-shadow" aria-hidden="true" />

        <div class="hero-copy page-shell">
          <p class="ui-kicker">Dark Place Archive / ADaozz</p>
          <h1 id="hero-title" class="hero-title">ADaozz</h1>
          <p class="hero-line">A public GitHub trace observed somewhere between Cauldron Lake, the Dark Place, and an FBC case terminal</p>

          <div class="hero-actions" aria-label="Primary actions">
            <BaseButton tone="danger" @click="themeStore.setTone('blood')">View Work</BaseButton>
            <BaseButton tone="ghost" @click="themeStore.setTone('fog')">GitHub Profile</BaseButton>
          </div>
        </div>

        <div class="hero-edge page-shell">
          <BaseTag tone="warning">Available</BaseTag>
          <span>github.com/ADaozz / public repository trace</span>
        </div>
      </section>

      <section id="profile" class="profile-band">
        <div class="page-shell profile-layout">
          <div class="personnel-heading">
            <p class="ui-kicker">FBC Personnel File</p>
            <h2 class="section-title">Subject ADaozz</h2>
            <span class="file-stamp">PUBLIC ACCESS NODE / ACTIVE OBSERVATION</span>
            <p class="threshold-note">Threshold contact: Cauldron Lake signal / Dark Place narrative residue</p>
          </div>

          <div class="personnel-file">
            <dl class="file-grid">
              <div>
                <dt>Clearance</dt>
                <dd>Public / External Review</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>Frontend systems / AI agent tooling</dd>
              </div>
              <div>
                <dt>Observed Specialization</dt>
                <dd>Tool authorization, narrative interfaces, evidence-board UI</dd>
              </div>
              <div>
                <dt>Known Tools</dt>
                <dd>Vue 3, TypeScript, Vite, Pinia, GitHub API</dd>
              </div>
            </dl>

            <p class="file-note">
              Subject maintains a public repository trace. Current page reframes those records as case evidence for controlled review and continued observation
            </p>
          </div>
        </div>
      </section>

      <section id="work" class="work-band page-shell">
        <div class="work-meta">
          <p class="ui-kicker">Case Board / Manuscript Trace</p>
          <h2 class="section-title">Repositories pinned to the board</h2>
          <p class="repo-status">
            <span v-if="isLoadingRepos">Syncing GitHub evidence</span>
            <span v-else-if="repoLoadError">GitHub feed unavailable / showing cached evidence</span>
            <span v-else>Live feed from github.com/ADaozz</span>
          </p>
        </div>

        <article class="manuscript-page" aria-label="Manuscript page">
          <div class="manuscript-light" aria-hidden="true" />
          <div class="manuscript-header">
            <span class="manuscript-tag">Return Draft</span>
            <span class="manuscript-stamp">Recovered</span>
          </div>
          <p class="manuscript-kicker">Manuscript Page / Recovered Draft</p>
          <div class="manuscript-body">
            <p v-for="line in manuscriptLines" :key="line">{{ line }}</p>
          </div>
          <div class="manuscript-redactions" aria-hidden="true">
            <span />
            <span />
          </div>
          <p class="manuscript-signature">A. Wake?</p>
        </article>

        <EvidenceBoard>
          <div class="case-lines" aria-hidden="true">
            <span class="case-line case-line--one" />
            <span class="case-line case-line--two" />
            <span class="case-line case-line--three" />
            <span class="case-line case-line--four" />
            <span class="case-line case-line--five" />
          </div>
          <CaseThread top="44%" left="16%" width="280px" />
          <CaseThread top="61%" left="40%" width="300px" />
          <div class="project-cluster">
            <a
              v-for="(project, index) in projects"
              :key="project.code"
              class="project-link"
              :class="`project-link--${getEvidenceVariant(index)}`"
              :style="getEvidenceStyle(index)"
              :href="project.href"
              target="_blank"
              rel="noreferrer"
            >
              <span class="push-pin" aria-hidden="true" />
              <EvidenceCard :code="project.code" :title="project.title" :note="project.note">
                <div class="photo-frame" aria-hidden="true">
                  <span>{{ project.title.slice(0, 2).toUpperCase() }}</span>
                </div>
                <dl class="evidence-status">
                  <div>
                    <dt>Status</dt>
                    <dd>{{ project.status }}</dd>
                  </div>
                  <div>
                    <dt>Signal</dt>
                    <dd>{{ project.signal }}</dd>
                  </div>
                  <div>
                    <dt>Risk</dt>
                    <dd>{{ project.risk }}</dd>
                  </div>
                </dl>
                <span class="project-meta">{{ project.meta }}</span>
              </EvidenceCard>
            </a>
          </div>
        </EvidenceBoard>
      </section>

      <section id="contact" class="contact-band">
        <div class="page-shell contact-inner">
          <div>
            <h2 class="section-title">Leave a trace</h2>
          </div>

          <div class="contact-panel">
            <a href="https://github.com/ADaozz" target="_blank" rel="noreferrer">github.com/ADaozz</a>
            <span>Repositories / Agent tooling / Interface experiments</span>
          </div>
        </div>
      </section>

      <section class="credits-band">
        <div class="page-shell credits-shell">
          <div class="credits-heading">
            <p class="ui-kicker">Acknowledgements</p>
            <h2 class="section-title">Authorized Support Records</h2>
          </div>

          <div class="credits-inner">
          <div class="credits-copy">
            <h2 class="credits-title">以下单位对本页的持续监测、收容与叙事稳定提供支持。</h2>
            <p class="credits-desc">
              本页在持续开放期间，曾出现轻度叙事偏移、边界噪声与局部现实不稳定现象。以下机构与相关团体已获准记录为支持来源，并参与页面监测、异常整理及视觉信号维持。
            </p>
          </div>

          <div class="reference-list" aria-label="Service and visual references">
            <article v-for="item in references" :key="item.name" class="reference-item">
              <img :src="item.image" :alt="item.name" />
              <div class="reference-body">
                <p class="reference-name">{{ item.name }}</p>
                <span class="reference-role">{{ item.role }}</span>
                <small class="reference-note">{{ item.note }}</small>
              </div>
            </article>

            <article class="reference-item is-redacted">
              <div class="ghost-mark">▣</div>
              <div class="reference-body">
                <p class="reference-name">[ 已编辑的支持来源 ]</p>
                <span class="reference-role">
                  相关记录因权限限制暂不公开。其影响仍可在页边噪声、背景照度波动与未标注文段中观测到。
                </span>
                <small class="reference-note">状态：REDACTED / SEE THRESHOLD FILE</small>
              </div>
            </article>
          </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.page-root {
  position: relative;
  isolation: isolate;
  min-height: 100svh;
  background: var(--bg-base);
}

.page-content {
  position: relative;
  z-index: 1;
}

.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 10;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-6);
  padding: var(--space-5) var(--space-7);
  color: var(--text-primary);
  background: linear-gradient(to bottom, rgba(4, 5, 5, 0.78), transparent);
  transition:
    opacity 320ms ease,
    transform 320ms ease;
  will-change: transform;
}

.site-header.is-hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(-100%);
}

.brand-mark {
  color: #97AC9F;
  font-family: var(--font-display);
  font-size: 34px;
  line-height: 1;
  text-transform: uppercase;
}

.site-nav {
  display: flex;
  justify-content: center;
  gap: var(--space-6);
  color: #66706b;
  font-size: 12px;
  text-transform: uppercase;
}

.site-nav a:hover,
.header-link:hover {
  color: var(--text-primary);
}

.header-link {
  color: var(--text-secondary);
  font-size: 12px;
  text-transform: uppercase;
}

.hero-screen {
  position: relative;
  display: grid;
  align-items: center;
  min-height: 100svh;
  height: 100svh;
  overflow: hidden;
  background: #050706;
}

.hero-media {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.58;
  filter: brightness(0.78) contrast(1.04) saturate(0.78);
}

.hero-shadow {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(to bottom, rgba(3, 4, 4, 0.52), rgba(3, 4, 4, 0.04) 42%, rgba(3, 4, 4, 0.78)),
    radial-gradient(circle at 50% 45%, transparent 0 28%, rgba(0, 0, 0, 0.5) 78%);
}

.hero-grain {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0.17;
  background-image:
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.08) 0 1px, transparent 1px 3px),
    repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.12) 0 1px, transparent 1px 5px);
  mix-blend-mode: overlay;
}

.hero-copy {
  position: relative;
  z-index: 3;
  display: grid;
  gap: var(--space-4);
  padding-top: var(--space-9);
}

.hero-title {
  margin: 0;
  color: #97AC9F;
  font-family: var(--font-display);
  font-size: 138px;
  line-height: 0.86;
  text-transform: uppercase;
  text-shadow: 0 8px 40px rgba(0, 0, 0, 0.62);
}

.hero-line {
  margin: 0;
  max-width: 520px;
  color: var(--text-secondary);
  font-size: 18px;
  line-height: 1.45;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.hero-edge {
  position: absolute;
  inset: auto 0 var(--space-7);
  z-index: 3;
  display: flex;
  align-items: center;
  gap: var(--space-4);
  color: var(--text-muted);
  font-size: 12px;
  text-transform: uppercase;
}

.profile-band,
.contact-band,
.credits-band {
  border-top: 1px solid var(--line-subtle);
  background: rgba(7, 10, 9, 0.9);
}

.profile-layout {
  display: grid;
  grid-template-columns: minmax(260px, 420px) minmax(0, 760px);
  gap: var(--space-9);
  padding: var(--space-9) 0;
}

.personnel-heading,
.personnel-file,
.work-meta {
  display: grid;
  gap: var(--space-5);
}

.file-stamp {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 24px;
  padding: 0 10px 0 26px;
  border: 1px solid rgba(151, 172, 159, 0.14);
  background:
    linear-gradient(90deg, rgba(128, 18, 18, 0.24), transparent 34%),
    rgba(151, 172, 159, 0.025);
  color: rgba(151, 172, 159, 0.76);
  font-family: var(--font-ui);
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;
}

.file-stamp::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 16px;
  background: rgba(128, 18, 18, 0.62);
}

.file-stamp::after {
  content: "FBC";
  position: absolute;
  top: 50%;
  left: 3px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 7px;
  transform: translateY(-50%) rotate(-90deg);
}

.threshold-note {
  margin: calc(var(--space-3) * -1) 0 0;
  color: rgba(151, 172, 159, 0.56);
  font-family: var(--font-evidence);
  font-size: 13px;
  line-height: 1.6;
}

.personnel-file {
  padding: var(--space-5) 0;
  border-top: 1px solid rgba(151, 172, 159, 0.16);
  border-bottom: 1px solid rgba(151, 172, 159, 0.1);
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5) var(--space-7);
  margin: 0;
}

.file-grid div {
  display: grid;
  gap: var(--space-2);
}

.file-grid dt {
  color: #66706b;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.file-grid dd {
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-evidence);
  font-size: 14px;
  line-height: 1.55;
}

.file-note {
  margin: var(--space-6) 0 0;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.8;
}

.repo-status {
  margin: calc(var(--space-3) * -1) 0 0;
  color: var(--text-muted);
  font-family: var(--font-evidence);
  font-size: 13px;
}

.work-band {
  display: grid;
  gap: var(--space-7);
  padding: var(--space-9) 0;
}

.manuscript-page {
  position: relative;
  width: min(680px, 100%);
  justify-self: center;
  min-height: 320px;
  padding: var(--space-6) var(--space-7);
  background:
    radial-gradient(circle at 42% 16%, rgba(236, 182, 104, 0.22), transparent 26%),
    linear-gradient(112deg, rgba(255, 244, 218, 0.08), transparent 36%),
    repeating-linear-gradient(0deg, rgba(44, 34, 24, 0.025) 0 1px, transparent 1px 5px),
    #bfb59f;
  color: #211d17;
  font-family: var(--font-evidence);
  transform: rotate(-1deg);
  box-shadow:
    0 16px 46px rgba(0, 0, 0, 0.36),
    inset 0 0 0 1px rgba(35, 31, 26, 0.13),
    inset 0 0 42px rgba(52, 38, 24, 0.14);
}

.manuscript-page::before {
  content: "";
  position: absolute;
  inset: var(--space-4);
  pointer-events: none;
  border: 1px solid rgba(35, 31, 26, 0.1);
  background:
    radial-gradient(circle at 12% 22%, rgba(72, 49, 32, 0.08), transparent 12%),
    radial-gradient(circle at 78% 72%, rgba(72, 49, 32, 0.06), transparent 10%);
  opacity: 0.76;
}

.manuscript-light {
  position: absolute;
  top: -20%;
  left: 30%;
  width: 220px;
  height: 220px;
  pointer-events: none;
  background: radial-gradient(circle, rgba(228, 164, 82, 0.28), transparent 66%);
  mix-blend-mode: multiply;
}

.manuscript-header {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.manuscript-tag,
.manuscript-stamp {
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.manuscript-tag {
  color: rgba(35, 31, 26, 0.58);
}

.manuscript-stamp {
  padding: 3px 7px;
  border: 1px solid rgba(100, 16, 14, 0.38);
  color: rgba(92, 15, 14, 0.68);
  transform: rotate(2deg);
}

.manuscript-kicker {
  position: relative;
  z-index: 1;
  margin: 0 0 var(--space-5);
  color: rgba(35, 31, 26, 0.48);
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.manuscript-body {
  position: relative;
  z-index: 1;
  display: grid;
  gap: var(--space-3);
  width: min(520px, 100%);
}

.manuscript-body p {
  margin: 0;
  font-size: 14px;
  line-height: 1.72;
}

.manuscript-redactions {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 6px;
  width: 190px;
  margin-top: var(--space-6);
}

.manuscript-redactions span {
  height: 7px;
  background: rgba(31, 27, 22, 0.78);
}

.manuscript-redactions span:last-child {
  width: 66%;
}

.manuscript-signature {
  position: absolute;
  right: var(--space-7);
  bottom: var(--space-5);
  margin: 0;
  color: rgba(60, 43, 31, 0.54);
  font-family: var(--font-note);
  font-size: 24px;
  transform: rotate(-4deg);
}

.project-cluster {
  position: absolute;
  inset: 0;
  z-index: 3;
}

.project-link {
  position: absolute;
  display: block;
  width: min(240px, 26vw);
  min-width: 190px;
  color: inherit;
  transform: rotate(var(--rotate));
  transform-origin: 50% 18px;
  transition:
    opacity var(--dur-fast) ease,
    transform var(--dur-fast) ease;
}

.project-link:hover {
  opacity: 0.9;
  transform: rotate(var(--rotate)) translateY(-3px);
  z-index: 4;
}

.project-link :deep(.evidence-card) {
  min-height: 170px;
  padding-top: 16px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.08), transparent 38%),
    #d8d1bf;
}

.project-link--sticky-note {
  width: min(228px, 24vw);
}

.project-link--sticky-note :deep(.evidence-card) {
  background:
    linear-gradient(155deg, rgba(255, 255, 255, 0.18), transparent 42%),
    #c9cfaa;
  box-shadow:
    0 8px 18px rgba(0, 0, 0, 0.2),
    inset 0 -18px 34px rgba(95, 80, 34, 0.08);
}

.project-link--polaroid {
  width: min(220px, 23vw);
}

.project-link--polaroid :deep(.evidence-card) {
  padding: 10px 10px 22px;
  background: #ded8ca;
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.28);
}

.project-link--type-page {
  width: min(258px, 28vw);
}

.project-link--type-page :deep(.evidence-card) {
  background:
    repeating-linear-gradient(0deg, rgba(35, 31, 26, 0.045) 0 1px, transparent 1px 22px),
    linear-gradient(145deg, rgba(255, 255, 255, 0.12), transparent 36%),
    #d8d1bf;
}

.project-link--title-strip {
  width: min(276px, 29vw);
}

.project-link--title-strip :deep(.evidence-card) {
  min-height: 138px;
  padding: 14px;
  background:
    linear-gradient(90deg, rgba(128, 18, 18, 0.12), transparent 34%),
    #c8c2b2;
}

.project-link--title-strip :deep(.evidence-card__title) {
  display: inline;
  padding: 2px 6px;
  background: rgba(35, 31, 26, 0.78);
  color: #d8d1bf;
}

.photo-frame {
  display: none;
}

.project-link--polaroid .photo-frame {
  display: grid;
  place-items: center;
  aspect-ratio: 1.18;
  margin-bottom: var(--space-3);
  background:
    radial-gradient(circle at 42% 38%, rgba(151, 172, 159, 0.45), transparent 28%),
    linear-gradient(135deg, rgba(20, 28, 25, 0.94), rgba(3, 5, 5, 0.98));
  border: 1px solid rgba(35, 31, 26, 0.18);
  color: rgba(216, 209, 191, 0.64);
  font-family: var(--font-display);
  font-size: 48px;
  line-height: 1;
}

.project-link--polaroid :deep(.evidence-card__note) {
  display: none;
}

.evidence-status {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin: var(--space-3) 0 0;
  padding-top: var(--space-3);
  border-top: 1px solid rgba(35, 31, 26, 0.18);
}

.evidence-status div {
  display: grid;
  gap: 2px;
}

.evidence-status dt {
  color: rgba(35, 31, 26, 0.5);
  font-family: var(--font-ui);
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
}

.evidence-status dd {
  margin: 0;
  color: #231f1a;
  font-family: var(--font-ui);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.push-pin {
  position: absolute;
  top: -9px;
  left: 50%;
  z-index: 5;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 36% 30%, rgba(255, 230, 230, 0.86), transparent 0 18%),
    radial-gradient(circle at 52% 52%, #a01822 0 46%, #4c080d 47% 100%);
  box-shadow:
    0 2px 0 rgba(40, 0, 0, 0.55),
    0 8px 18px rgba(0, 0, 0, 0.36);
  transform: translateX(-50%);
}

.push-pin::after {
  content: "";
  position: absolute;
  left: 8px;
  top: 14px;
  width: 2px;
  height: 18px;
  background: linear-gradient(to bottom, rgba(28, 24, 22, 0.7), transparent);
  transform: rotate(6deg);
}

.case-lines {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.case-line {
  position: absolute;
  height: 2px;
  background:
    linear-gradient(to right, rgba(82, 8, 10, 0), rgba(150, 20, 26, 0.82), rgba(82, 8, 10, 0));
  box-shadow: 0 0 7px rgba(160, 22, 28, 0.28);
  transform-origin: left center;
}

.case-line::before,
.case-line::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(120, 16, 20, 0.86);
  transform: translateY(-50%);
}

.case-line::before {
  left: 0;
}

.case-line::after {
  right: 0;
}

.case-line--one {
  top: 24%;
  left: 18%;
  width: 280px;
  transform: rotate(12deg);
}

.case-line--two {
  top: 37%;
  left: 46%;
  width: 280px;
  transform: rotate(20deg);
}

.case-line--three {
  top: 56%;
  left: 29%;
  width: 300px;
  transform: rotate(-17deg);
}

.case-line--four {
  top: 67%;
  left: 56%;
  width: 250px;
  transform: rotate(9deg);
}

.case-line--five {
  top: 72%;
  left: 15%;
  width: 310px;
  transform: rotate(-8deg);
}

.project-meta {
  display: block;
  margin-top: var(--space-3);
  color: rgba(35, 31, 26, 0.62);
  font-family: var(--font-ui);
  font-size: 11px;
  text-transform: uppercase;
}

.contact-inner,
.credits-inner {
  display: grid;
  grid-template-columns: minmax(280px, 460px) minmax(0, 760px);
  align-items: start;
  gap: var(--space-8);
  padding: var(--space-8) 0;
}

.credits-shell {
  display: grid;
  gap: var(--space-7);
  padding: var(--space-8) 0;
}

.credits-inner {
  padding: 0;
}

.credits-heading {
  display: grid;
  gap: var(--space-4);
}

.contact-panel {
  display: grid;
  gap: var(--space-2);
  color: var(--text-secondary);
  font-size: 14px;
  text-align: right;
}

.contact-panel a {
  color: var(--text-primary);
  font-family: var(--font-evidence);
}

.credits-copy {
  display: grid;
  align-content: center;
  gap: var(--space-3);
  min-height: 100%;
}

.credits-title {
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-evidence);
  font-size: 19px;
  font-weight: 400;
  line-height: 1.55;
}

.credits-desc {
  margin: 0;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.85;
}

.reference-list {
  display: grid;
  gap: var(--space-4);
}

.reference-item {
  position: relative;
  display: grid;
  grid-template-columns: 104px minmax(0, 1fr);
  align-items: center;
  gap: var(--space-5);
  min-height: 132px;
  padding: var(--space-5) 0;
  overflow: hidden;
  transition:
    background var(--dur-fast) ease,
    filter var(--dur-fast) ease;
}

.reference-item + .reference-item {
  border-top: 1px solid rgba(151, 172, 159, 0.18);
}

.reference-item:hover {
  background: rgba(151, 172, 159, 0.018);
  filter: contrast(1.05);
}

.reference-item::before {
  content: "FBC REF / 0" counter(reference);
  position: absolute;
  top: var(--space-3);
  right: 0;
  color: rgba(151, 172, 159, 0.3);
  font-family: var(--font-evidence);
  font-size: 11px;
}

.reference-item::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    105deg,
    transparent 0 35%,
    rgba(151, 172, 159, 0.08) 46%,
    rgba(128, 18, 18, 0.08) 51%,
    transparent 63% 100%
  );
  opacity: 0;
  transform: translateX(-32%);
}

.reference-item:hover::after {
  animation: reference-interference 1200ms ease-out 1;
}

.reference-list {
  counter-reset: reference;
}

.reference-item {
  counter-increment: reference;
}

.reference-item img {
  width: 104px;
  height: 104px;
  object-fit: contain;
  opacity: 0.78;
  filter: saturate(0.78) contrast(1.08);
}

.reference-name {
  display: inline-block;
  margin: 0;
  color: var(--text-secondary);
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: uppercase;
}

.reference-role {
  display: block;
  margin-top: 6px;
  color: var(--text-secondary);
  font-family: var(--font-evidence);
  font-size: 13px;
  line-height: 1.45;
}

.reference-note {
  display: block;
  margin-top: var(--space-3);
  color: rgba(151, 172, 159, 0.58);
  font-family: var(--font-ui);
  font-size: 11px;
  text-transform: uppercase;
}

.reference-item:hover .reference-name,
.reference-item:hover .reference-note {
  animation: text-signal-drift 620ms steps(2, end) 1;
}

.reference-item:hover .reference-role {
  animation: text-signal-drift-soft 780ms steps(2, end) 1;
}

.ghost-mark {
  width: 104px;
  color: rgba(151, 172, 159, 0.45);
  font-family: var(--font-display);
  font-size: 64px;
  line-height: 1;
  text-align: center;
}

.is-redacted {
  grid-template-columns: 104px minmax(0, 1fr);
}

.is-redacted .reference-name {
  display: inline;
  background: linear-gradient(to right, #97AC9F 0 18%, rgba(151, 172, 159, 0.08) 18% 100%);
  color: transparent;
}

.is-redacted .reference-role {
  position: relative;
}

.is-redacted .reference-role::after {
  content: "";
  display: block;
  width: min(260px, 70%);
  height: 8px;
  margin-top: var(--space-3);
  background: rgba(151, 172, 159, 0.18);
}

@keyframes reference-interference {
  0% {
    opacity: 0;
    transform: translateX(-42%);
  }
  30% {
    opacity: 0.7;
  }
  100% {
    opacity: 0;
    transform: translateX(42%);
  }
}

@keyframes text-signal-drift {
  0%,
  100% {
    transform: translate(0, 0);
  }
  28% {
    transform: translate(1px, 0);
  }
  54% {
    transform: translate(-1px, 0);
  }
  72% {
    transform: translate(0, 1px);
  }
}

@keyframes text-signal-drift-soft {
  0%,
  100% {
    transform: translate(0, 0);
  }
  38% {
    transform: translate(0.5px, 0);
  }
  64% {
    transform: translate(-0.5px, 0);
  }
}

@media (max-width: 900px) {
  .site-header {
    grid-template-columns: auto auto;
    padding: var(--space-4);
  }

  .site-nav {
    display: none;
  }

  .hero-title {
    font-size: 78px;
  }

  .hero-line {
    max-width: 320px;
    font-size: 15px;
  }

  .hero-edge {
    align-items: flex-start;
    flex-direction: column;
    gap: var(--space-2);
    bottom: var(--space-5);
  }

  .profile-layout {
    grid-template-columns: 1fr;
    gap: var(--space-6);
    padding: var(--space-8) 0;
  }

  .personnel-heading {
    gap: var(--space-4);
  }

  .file-stamp {
    max-width: 100%;
    font-size: 9px;
    white-space: normal;
  }

  .file-grid {
    grid-template-columns: 1fr;
  }

  .work-band {
    padding: var(--space-8) 0;
  }

  .manuscript-page {
    min-height: 0;
    padding: var(--space-6) var(--space-5);
    transform: none;
  }

  .manuscript-body p {
    font-size: 14px;
  }

  .manuscript-signature {
    position: static;
    margin-top: var(--space-5);
    text-align: right;
  }

  .project-cluster {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }

  .project-link {
    position: relative;
    top: auto !important;
    left: auto !important;
    width: 100%;
    min-width: 0;
    transform: none;
  }

  .project-link--sticky-note,
  .project-link--polaroid,
  .project-link--type-page,
  .project-link--title-strip {
    width: 100%;
  }

  .project-link :deep(.evidence-card) {
    min-height: auto;
  }

  .project-link--polaroid :deep(.evidence-card) {
    padding-bottom: 18px;
  }

  .project-link--polaroid .photo-frame {
    max-height: 180px;
  }

  .project-link:hover {
    transform: translateY(-2px);
  }

  .case-lines {
    display: none;
  }

  .contact-inner,
  .credits-inner {
    grid-template-columns: 1fr;
    align-items: flex-start;
    gap: var(--space-5);
  }

  .credits-shell {
    gap: var(--space-6);
    padding: var(--space-7) 0;
  }

  .credits-copy {
    min-height: 0;
  }

  .contact-panel {
    text-align: left;
  }

  .reference-list {
    justify-content: flex-start;
    width: 100%;
  }

  .reference-item {
    grid-template-columns: 72px minmax(0, 1fr);
    gap: var(--space-4);
    min-height: 104px;
    padding: var(--space-4) 0;
    width: 100%;
  }

  .reference-item img,
  .ghost-mark {
    width: 72px;
    height: 72px;
  }

  .ghost-mark {
    font-size: 46px;
  }
}
</style>
