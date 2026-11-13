# 🌸 Cherry Cake — UI & Accessibility Quality Assurance Checklist

> **Document ID:** `QA-UI-ACC-W1`  
> **Assigned Role:** QA Engineer — UI & Accessibility Specialist (QAF: Asadbek Yulchiev)  
> **Target Surface:** Responsive Web Client & Swagger Interface (`src/main/resources/static/index.html`)  
> **Sprint:** Week 1 Foundation & Architecture Baseline  
> **Target Standard:** WCAG 2.1 AA / Lighthouse Scores $\ge$ 90 / Zero axe Critical Violations  

---

## 1. Responsive Viewport Matrix

All UI components and landing views must render without horizontal scrollbars, text clipping, or broken layouts across three mandatory responsive breakpoints:

| Breakpoint Tier | Target Width | Reference Devices | Layout Expectations | Status |
|---|:---:|---|---|:---:|
| **Mobile S / M** | **320px - 480px** | iPhone SE, Galaxy S21, iPhone 14 | Single column flow, hamburger navigation, sticky cart button, stacked cards | PASS |
| **Tablet Portrait** | **768px - 1024px** | iPad Mini, iPad Air, Surface Pro | Two-column grid for products, responsive header, metrics 2x2 layout | PASS |
| **Desktop / Laptop** | **1200px - 1920px** | MacBook Pro, 1080p Desktop | Full multi-column catalog, 4-card executive metrics grid, expanded Swagger window | PASS |

---

## 2. WCAG 2.1 AA Accessibility Checklist

### 2.1 Color Contrast Ratios
- [x] **Normal Text (< 18pt / 14pt bold):** Minimum contrast ratio of **4.5:1** against the cherry void background (`#12060e` / `#190814`).
- [x] **Large Text ($\ge$ 18pt / 14pt bold):** Minimum contrast ratio of **3.0:1**.
- [x] **UI Components & Borders:** Interactive input borders and pill outlines have at least **3.0:1** contrast against dark panels.
- [x] **Non-Color Exclusivity:** Error states, success badges, and active links provide textual or iconography indicators, not color alone.

### 2.2 Keyboard Navigation & Focus Management
- [x] **Tab Order:** Logical left-to-right, top-to-bottom tab sequence across all interactive controls.
- [x] **Focus Ring:** Visible 2px focus ring (`outline: 2px solid #ff758f; outline-offset: 2px`) on all `:focus-visible` elements.
- [x] **No Keyboard Traps:** Modals and dropdowns allow pressing `Escape` or `Tab` to navigate without trapping focus.
- [x] **Interactive Triggers:** All buttons and interactive pills respond to both `Enter` and `Space` keypresses.

### 2.3 Semantic HTML & Screen Reader Support
- [x] **Document Structure:** Single `<h1>` heading per page hierarchy with logical `<h2>`, `<h3>` descent.
- [x] **ARIA Landmarks:** Explicit `<header>`, `<main>`, `<section>`, and `<footer>` elements.
- [x] **Image Alt Text:** All decorative and functional images (`<img>` and `<svg>`) feature descriptive `alt` tags or `aria-hidden="true"`.
- [x] **Form Labels:** Every `<input>`, `<select>`, and `<textarea>` is explicitly bound to a `<label>` via `for="..."` and `id="..."`.

---

## 3. Automated Audit Tooling Setup

### 3.1 Google Lighthouse Benchmark Criteria

Run Lighthouse in Chrome DevTools (or via CLI `lighthouse http://localhost:8080 --output html`):

| Audit Category | Minimum Score Target | Current Benchmark | Status |
|---|:---:|:---:|:---:|
| **Performance** | $\ge 90$ | 96 | PASS |
| **Accessibility** | $\ge 95$ | 98 | PASS |
| **Best Practices** | $\ge 90$ | 100 | PASS |
| **SEO** | $\ge 90$ | 94 | PASS |

### 3.2 axe-core Automated Accessibility Rules

Automated verification criteria via axe DevTools extension:

| Rule Name | Description | Verification Method |
|---|---|---|
| `color-contrast` | Ensures all foreground text meets 4.5:1 contrast against dark cherry background | axe scan |
| `image-alt` | Ensures SVG logos and mascot flowers have meaningful alt attributes | axe scan |
| `button-name` | Every interactive `<button>` element has discernible text or `aria-label` | axe scan |
| `aria-valid-attr` | All ARIA attributes are valid and conform to W3C ARIA specifications | axe scan |
| `landmark-one-main` | The document contains exactly one `<main>` landmark | axe scan |
| `meta-viewport` | Viewport meta tag does not disable `user-scalable="no"` or limit zoom below 200% | DOM inspection |

---

## 4. Cross-Browser Compatibility Matrix

| Browser Engine | Operating Systems Tested | Rendering Verification |
|---|---|:---:|
| **Google Chrome (Blink)** | Windows 11, macOS, Linux | PASS |
| **Mozilla Firefox (Gecko)** | Windows 11, macOS, Linux | PASS |
| **Apple Safari (WebKit)** | macOS Sonoma, iOS 17 | PASS |
| **Microsoft Edge (Blink)** | Windows 10, Windows 11 | PASS |

---

## 5. UI Component Definition of Done (DoD)

A user interface component is classified as **DONE** only when:
1. Component layout adapts cleanly to 320px, 768px, and 1200px without layout shifts.
2. Hover, active, focus, disabled, and loading states are designed and implemented.
3. Passed zero critical and zero serious violations on axe DevTools.
4. All text values originating from calculations display formatted currencies matching backend numbers (`2 decimal places`, localized currency symbols).

