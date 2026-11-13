# Vertical Mode 1.1.0 — a different perspective.

Your YouTube videos, reframed for a portrait monitor. This release adds an English interface and a new visual identity across the extension and its website.

## What's included

- A **Vertical mode** button beside YouTube's fullscreen control.
- **Fill screen**, **Full video**, adjustable crop, and horizontal framing without stretching the picture.
- A redesigned popup and settings panel in powder blue, warm paper, and black typography.
- A responsive website with a live framing demo and full installation and usage instructions.
- Local settings storage, native YouTube controls, Escape to exit, and Alt + Shift + V to toggle.

## Install in Chrome or Dia

1. Download **youtube-vertical-mode.zip** below and unzip it into a folder you will keep.
2. Open `chrome://extensions` in Chrome or `dia://extensions` in Dia.
3. Enable **Developer mode**, click **Load unpacked**, and select the folder containing `manifest.json`.
4. Refresh YouTube and click **Vertical mode** beside the fullscreen control.

Already installed? Replace your extracted files, click **Reload** in the extensions manager, and refresh YouTube. On Mac, use Option in place of Alt for the shortcut.

[Website, demo & guide](https://brun3y.github.io/yt-vertical-mode/) · [Source](https://github.com/BrUn3y/yt-vertical-mode)

## Validation

Eight automated tests pass, along with syntax, version, shared UI, and local asset checks. The new UI was reviewed on desktop and mobile and tested with an unpacked extension in YouTube. See `VERIFICATION.md` for scope and limitations.

Both ZIP files contain the same extension. The versioned filename is provided for archival use; the stable filename keeps the website's download link working. **SHA256SUMS** contains checksums for both.

The extension only saves framing settings on your device. It has no analytics, account requirement, or remote service. This is an unpacked GitHub release, not a Chrome Web Store listing. Filling a portrait monitor crops the sides of landscape footage; choose Full video to keep the entire image.
