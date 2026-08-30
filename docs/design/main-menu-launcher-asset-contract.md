# Main Menu Launcher Asset Contract

## Purpose

This file defines expected launcher art paths and dimensions so future image assets can be added without changing save-slot, account, navigation, or progression behavior.

## Sidebar button art

Sidebar art uses paired transparent PNG or SVG files. Each button should use a **7:2** aspect ratio and should not include baked readable labels, logos, or UI text.

| Section | Inactive path | Active path | Status |
| --- | --- | --- | --- |
| Characters | `/launcher/character-inactive-soft.png` | `/launcher/character-active-soft.png` | Existing |
| Legacy | `/launcher/legacy-inactive-soft.png` | `/launcher/legacy-active-soft.png` | Existing |
| Chronicles | `/launcher/chronicles-inactive-soft.png` | `/launcher/chronicles-active-soft.png` | Existing |
| Bloodlines | `/launcher/bloodlines-inactive-soft.svg` | `/launcher/bloodlines-active-soft.svg` | Existing |
| Settings | `/launcher/settings-inactive-soft.png` | `/launcher/settings-active-soft.png` | Existing |

Recommended export sizes:

- `1400 x 400` transparent PNG or SVG viewBox
- `2100 x 600` transparent PNG or SVG viewBox

Only add a section to the image-backed sidebar map after both inactive and active files exist.

## Main menu background art

Recommended future paths:

| Theme | Path | Status |
| --- | --- | --- |
| Dark | `/launcher/main-menu-hall-dark.png` | Needed |
| Light | `/launcher/main-menu-hall-light.png` | Needed |

Recommended export size: `3840 x 2160`.

The composition should crop cleanly to ultrawide displays and keep the center/right side low-detail for readable live UI.

## Optional overlay assets

| Asset | Path |
| --- | --- |
| Save row normal | `/launcher/save-slot-row-normal.png` |
| Save row active | `/launcher/save-slot-row-active.png` |
| Save row empty | `/launcher/save-slot-row-empty.png` |
| Continue banner | `/launcher/continue-legacy-banner.png` |
| Ledger frame | `/launcher/main-menu-ledger-frame.png` |

## QA checklist

- Every referenced path exists in the launcher asset directory.
- Active and inactive sidebar states swap correctly.
- Live labels remain accessible.
- Dark and light themes remain readable.
- Save-slot click, delete, continue, account, and navigation behavior is unchanged.
