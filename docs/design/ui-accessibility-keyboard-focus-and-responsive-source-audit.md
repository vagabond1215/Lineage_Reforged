# UI Accessibility, Keyboard, Focus, Live-Region, And Responsive Source Audit

Source route: ChatGPT via GitHub Connector

Date: 2026-08-03

Inspected master: `8a0065b7a72a6fc8193b502251e9020a1e4ca360`

Status: `CANDIDATE_INTEGRATION`; connector-only source audit; no browser execution, assistive-technology testing, screenshots, automated accessibility scan, build, or conformance certification

## Purpose

Compare current launcher, creator, gameplay-shell, panel, notice, map, and component source against the accepted accessibility baseline before another material UI or milestone-readiness package.

This document records source evidence only. It does not certify WCAG conformance or authorize React, CSS, asset, or interaction changes.

## Accepted Baseline

The permanent UI information-architecture boundary requires:

- keyboard access for navigation, search, commands, filters, and combat controls;
- visible focus and predictable focus return;
- scalable text and reflow without loss of actions or status;
- semantic landmarks, headings, lists, tables, meters, and button labels;
- high-contrast and reduced-motion support;
- non-color status communication;
- restrained live regions for notices and combat events;
- exact timing and action-state text without animation;
- usable target sizes and no hover-only required information.

## Current Source Classification

`PARTIAL_SEMANTIC_AND_FOCUS_SUPPORT_EXISTS; END_TO_END_ACCESSIBILITY_CONTRACT_NOT_PROVEN`

Current source contains meaningful positive evidence:

- native buttons and form controls are used broadly;
- several icon-only and compact controls provide `aria-label` text;
- reusable progress, favorite, notification, layout, launcher, and status components include accessibility-oriented labels;
- focus-visible styling exists in the global and launcher style surfaces;
- responsive utility classes and wrapping/grid breakpoints are used throughout shell panels;
- disabled command buttons remain visible in many gameplay surfaces while adjacent text explains blockers;
- body-state outcomes and travel/rest previews provide text facts rather than animation-only state.

However, connector inspection did not find a repository-wide implementation of `aria-live`, and source evidence alone cannot prove focus order, focus restoration, keyboard reachability, screen-reader output, zoom/reflow, contrast, target size, or reduced-motion behavior.

## Surface Findings

### Launcher And Creator

The launcher and character-creation components use native controls and several accessible labels. Focus-visible styling exists. A local browser pass is still required to prove:

- logical tab order across multi-step screens;
- focus placement after screen transitions and validation failures;
- error association with the relevant field;
- keyboard-only completion;
- zoom and narrow-width reflow;
- decorative asset alt/hidden behavior.

### Gameplay Shell And Navigation

The shell uses buttons for domain navigation and settings. Current source does not establish a documented focus-return contract when settings, panels, notices, or future overlays close. Clearing the active domain can produce an empty main pane rather than a Home destination, which is also an orientation and focus-target concern.

### Panels, Lists, And Map

Panel controls are largely native buttons, but the interactive map uses absolutely positioned map-pin buttons without source-level proof of spatially sensible keyboard order, current-location announcement, selected-state semantics, zoom status announcement, or equivalent non-map destination navigation.

Selection lists and sidebars need a future focused review for:

- current selection semantics;
- list versus tab/menu roles;
- arrow-key expectations;
- focus persistence when filters remove the selected record;
- empty-state announcement.

### Notices And Dynamic Updates

Panel notices, shell notices, notifications, and body-state toasts are visually rendered, but no general live-region source was found. Adding a live region later must remain restrained: repeated body-state, combat, or notification updates must not create continuous announcement pressure.

Dismissal and replacement behavior should define:

- whether focus moves;
- whether the update is announced;
- whether the notice is durable or transient;
- whether exact text is available in a reviewable log.

### Color, Motion, And Exact Text

Source includes text labels and tone names alongside many colors, but browser evidence is required for contrast and non-color distinction. Focus-visible CSS exists, while a complete reduced-motion policy was not established by this audit.

Future combat presentation must preserve exact text equivalents for timing and queue state; current combat UI is not implemented, so this remains an acceptance requirement rather than a current defect.

## Required Future Validation

A material UI package should include a bounded local/browser gate covering:

1. keyboard-only launcher, creator, shell navigation, panels, commands, save controls, and overlays;
2. visible focus and focus restoration;
3. labels and state for icon-only controls;
4. 200% zoom and narrow-width reflow;
5. disabled-state reason availability;
6. notice/live-region behavior and announcement rate;
7. non-color state communication;
8. reduced-motion behavior;
9. map and complex-control alternatives;
10. exact accessible text for meters, timing, queues, and outcomes.

Automated scanning may supplement but cannot replace manual keyboard, focus, screen-reader, zoom, and motion checks.

## Named Consumers

Future work must inspect this audit when it covers:

- Home or gameplay-shell changes;
- launcher or character creation;
- overlays, settings, notices, notifications, or live regions;
- map, linked-record, search, or history navigation;
- combat presentation;
- `0.8.0` or later accessibility and UI readiness gates.

## Review Trigger

Re-review during the next material UI implementation or milestone-readiness audit, and replace source-only assumptions with recorded browser/assistive-technology evidence.

## Exclusions

No React, CSS, asset, content, source, tests, active prompt, roadmap, backlog, or branch register changed in this pass.
