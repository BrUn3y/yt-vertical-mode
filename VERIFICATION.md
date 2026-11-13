# Verification / version 1.1.0

Reviewed on November 13, 2026.

## Automated checks

`npm run check` validates JavaScript syntax, package/manifest version consistency, local HTML asset references, English language declarations, and exact agreement between the extension and website copies of the shared geometry and settings UI.

`npm test` passes eight tests covering cover/contain geometry, aspect ratio preservation, panning endpoints, intermediate crop values, portrait/square/ultrawide inputs, incomplete metadata, saved-setting validation, and manifest file references and permissions.

`npm run package` produces stable and versioned installable ZIPs plus SHA-256 checksums. The extension has no runtime dependencies.

## Browser review

### Website and popup

- Website reviewed visually at 1440 × 1000 and 390 × 844 CSS pixels.
- Mobile page checked for horizontal overflow and missing images.
- Interactive demo checked in Fill screen and Full video modes. Full video preserves the complete illustration and disables horizontal panning.
- Popup checked at 380 × 600 pixels, including its footer, with no vertical overflow.
- Browser console checked for page errors.

### Extension on real YouTube

The unpacked extension was loaded into a temporary Chrome for Testing profile and tested with Blender's public **Big Buck Bunny 60fps 4K** video (`aqz-KE-bpKQ`) in a 720 × 1280 CSS-pixel viewport.

- A single Vertical mode button appears beside the native fullscreen control, including YouTube's nested controls structure.
- The button enters actual fullscreen. A source of 854 × 480 pixels renders at approximately 2277 × 1280 pixels in Fill screen mode, preserving its proportions.
- The redesigned English settings panel opens and its presets respond.
- Full video contains the picture and disables horizontal framing.
- Fill screen and the rightmost framing endpoint were checked while playback continued.
- Reset framing restores the centered view.
- Escape exits fullscreen and restores the normal player styles.

The preceding local prototype review also checked native pause, the keyboard shortcut, Chrome popup messaging, local setting persistence, button reinsertion after controls replacement, and cleanup on navigation. The extension was installed and its player button was confirmed in Dia before this redesign.

### Local player

The local fixture generates a 1920 × 1080 video stream and reproduces nested player controls. The new settings UI was checked for cover/contain geometry, right-edge panning, proportion preservation, and continuous playback. No external media is needed for this test.

## Scope

The review does not establish compatibility with every YouTube experiment, restricted video, advertisement, live stream, or third-party embed. Captions were unavailable on the selected test video. Other source proportions are covered by geometry tests. Portrait viewports were emulated; the operating system's monitor orientation was not changed.

Local review screenshots are kept in the ignored `artifacts/` directory. They are not included in the repository or installable release ZIP.
