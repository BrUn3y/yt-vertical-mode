# Vertical Mode

**Same video. New frame.**

A Chrome and Dia extension that reframes regular YouTube videos for a portrait monitor. Fill your screen, choose the crop, and move the frame without stretching the picture.

[Website & interactive demo](https://brun3y.github.io/yt-vertical-mode/) · [Download the latest ZIP](https://github.com/BrUn3y/yt-vertical-mode/releases/latest/download/youtube-vertical-mode.zip) · [Release notes](https://github.com/BrUn3y/yt-vertical-mode/releases)

## Install

1. Download the latest release ZIP and extract it into a folder you will keep.
2. Open `chrome://extensions` in Chrome or `dia://extensions` in Dia.
3. Turn on **Developer mode** and click **Load unpacked**.
4. Select the extracted folder containing `manifest.json`. If you cloned this repository, select the [`extension`](extension) folder.
5. Open or refresh a regular YouTube video.
6. Move your browser to your portrait monitor and click **Vertical mode** beside the fullscreen button.

On narrow players, look for the portrait-screen icon. Its tooltip and accessible name remain **Vertical mode**. No build, dependency installation, or API setup is required to run the extension. This release is distributed through GitHub; it is not listed in the Chrome Web Store.

## Find your frame

| Control | What it does |
| --- | --- |
| Vertical mode | Enters fullscreen and fills the screen with the cropped video. |
| Adjust framing | Opens the settings panel at the top right. |
| Fill screen | Fills the display while preserving the video's proportions. |
| Full video | Shows the entire picture, with letterboxing when needed. |
| Crop | Blends between the complete picture and a filled screen. |
| Horizontal framing | Moves the frame left or right. Disabled when the picture has no horizontal overflow. |
| Reset framing | Restores a centered frame and 100% crop. |
| Escape or the X button | Exits Vertical mode. |
| Alt + Shift + V | Toggles the mode inside YouTube. Use Option on Mac. |

YouTube's native playback, volume, seeking, captions, and settings controls stay in the player. Crop and horizontal position are saved locally between sessions. The mode turns off when navigating to another video.

The extension popup detects the current tab and can enable the mode inside the window. Use the player button to enter fullscreen directly. If the browser blocks fullscreen, window mode remains available and YouTube's native fullscreen button can be used.

## Update an unpacked installation

Replace the extracted files with the new release, click **Reload** in the extensions manager, and refresh YouTube. Keep the extracted folder: the browser loads the extension from that location. For a source checkout, pull the changes and reload the extension.

## Scope and limitations

Chrome 109+ and compatible Chromium browsers, including Dia. The extension targets the desktop YouTube player on `/watch`, `/live/`, and `/embed/`, including the standard `youtube-nocookie.com` embed structure. The popup controls videos opened directly in a tab; embedded videos use the button inside their player. Shorts and the miniplayer are outside this release's scope.

Set the physical monitor to portrait orientation in your operating system. Vertical Mode uses the display containing your browser window; it does not rotate the monitor or the video. Filling a 9:16 display with a 16:9 source crops approximately 68% of the original width. Move the frame or reduce the crop to see more. It does not reconstruct cropped content, automatically track people, or remove black bars recorded into a source video.

YouTube changes its interface regularly. The extension observes player changes, reinserts the button, and recalculates the frame when dimensions or video metadata change. Future YouTube changes may require compatibility updates.

## Privacy

Manifest V3. The only requested permission is `storage`, used to save two numbers: crop and horizontal position. Content scripts run only on the YouTube domains listed in the manifest. The extension makes no network requests and includes no analytics, accounts, tracking, or remote services. The website also has no analytics or third-party dependencies. Download and source links go to GitHub.

## Development

Node.js 18+ is required for checks and the preview server; Python 3 is required for packaging. The installed extension has no runtime dependencies.

```sh
npm run build:site
npm run check
npm test
npm run preview
npm run package
```

- Website: <http://127.0.0.1:4173/docs/>.
- Popup: <http://127.0.0.1:4173/extension/popup.html>.
- Local test player: <http://127.0.0.1:4173/watch?v=demo>.
- Installable ZIPs and SHA-256 checksums: `dist/`.

The website's interactive preview uses copies of the extension's actual framing geometry and settings UI. `npm run build:site` synchronizes those assets; `npm run check` fails if they drift. The local test player generates a video without downloading media and reproduces nested YouTube controls. See [VERIFICATION.md](VERIFICATION.md) for the review scope.

GitHub Pages serves the `docs` directory from `main`. The CI workflow checks JavaScript, asset references, shared UI consistency, tests, and packaging on pushes and pull requests.

## Design

An original interpretation of the [provided visual reference](https://mx.pinterest.com/pin/1060949624721092125/): powder blue, warm paper, large typography, thin rules, and generous space. The reference image is not redistributed. The website landscape illustration is an original SVG asset. The site, popup, player settings, installation guide, and release notes are in English.

Independent project. Not affiliated with YouTube, Google, or The Browser Company.
