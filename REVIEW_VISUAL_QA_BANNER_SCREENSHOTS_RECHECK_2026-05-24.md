# Recheck: visual QA screenshots for homepage banner

Date: 2026-05-24  
Scope: developer-provided visual screenshots in `delivery/visual-checks/`.

## Verdict

Partially accepted.

The screenshots exist, are not empty, and confirm that the homepage banner is rendered on desktop and mobile. The carousel height and responsive structure look generally correct. However, the screenshots also reveal several visual QA issues that should be fixed or clarified before final visual acceptance.

## Screenshot Files Found

```text
delivery/visual-checks/desktop_banner.png
delivery/visual-checks/mobile_banner.png
delivery/visual-checks/desktop_header_crop.png
delivery/visual-checks/mobile_header_crop.png
```

## Confirmed Good

- Desktop page renders the header, catalog navigation, left category column, and homepage banner.
- Mobile page renders the compact header and the banner without the desktop right-side composition.
- Banner content is visible and not collapsed.
- CTA button is visible on desktop and mobile.
- Visual height is close to the expected 450/480px behavior.

## Findings To Fix / Clarify

### P1: Next.js dev overlay is visible in screenshots

Both full-page screenshots show the red Next.js development indicator in the bottom-left corner:

```text
4 Issues
```

This means the captured page had runtime/dev issues at the moment of screenshot. The developer must open the issue overlay or browser console, identify the warnings/errors, and either fix them or document why they are harmless.

Acceptance screenshot should be captured with no visible Next.js error/issue overlay.

### P2: Product image shows checkerboard transparency background

The relay product image in the banner displays a checkerboard background. This looks like an editing/export artifact, not a clean transparent product PNG.

Expected:

- product cutout should be on transparent background or a clean light technical background;
- checkerboard transparency pattern must not be visible to users;
- export asset should be fixed, or the component should render it over an intended solid background.

### P2: Desktop logo appears too small

The desktop header screenshot shows the new Electronom logo mark + text, but it is visually very small relative to the header height and search bar.

Developer should verify final intended logo dimensions against the logo replacement task. If the current size is intentional, document the target dimensions. If not, adjust header logo sizing.

Suggested check:

```text
Desktop header logo should be visually readable at 1440px without zoom.
Mobile header may use mark-only E icon.
```

### P3: Mobile top utility row is horizontally clipped

The mobile screenshot shows the top utility row text cut on the right side (`Вход / Ре...`). If this row is intended to remain visible on mobile, it needs responsive handling. If it is planned to be hidden on mobile, hide it consistently.

## Required Developer Follow-Up

1. Open the red Next.js `4 Issues` overlay and fix or document all listed issues.
2. Re-export/fix the relay product image so the checkerboard transparency background is not visible.
3. Re-check desktop logo size after hard refresh (`Ctrl+Shift+R`) and align it with the logo replacement task.
4. Decide whether the mobile top utility row should be visible or hidden. Avoid clipped text.
5. Re-capture screenshots after fixes:

```text
delivery/visual-checks/desktop_banner_final.png
delivery/visual-checks/mobile_banner_final.png
delivery/visual-checks/desktop_header_final.png
delivery/visual-checks/mobile_header_final.png
```

## Acceptance Status

The banner implementation is technically working, but visual QA is not fully clean until the visible dev overlay and image artifact are resolved.
