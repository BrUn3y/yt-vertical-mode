# Chrome Web Store listing

All listing content is in English. Upload the packaged extension from `dist/youtube-vertical-mode-1.1.0.zip`; `manifest.json` is at the ZIP root.

## Basic information

- Name: YouTube Vertical Mode
- Summary: Your YouTube videos, reframed for a portrait monitor. Fill your screen and adjust the crop without stretching the picture.
- Language: English (United States)
- Category: Entertainment
- Price: Free
- Website: https://brun3y.github.io/yt-vertical-mode/
- Support: https://github.com/BrUn3y/yt-vertical-mode/issues
- Privacy policy: https://brun3y.github.io/yt-vertical-mode/privacy.html

## Detailed description

Same video. New frame.

YouTube Vertical Mode reframes regular landscape YouTube videos for a portrait monitor. Fill your screen, choose the crop, and move the frame without stretching or rotating the picture.

HOW IT WORKS

1. Open a regular YouTube video and move your browser to your portrait monitor.
2. Click Vertical mode next to the player's fullscreen control. On smaller players, look for the portrait-screen icon.
3. Open Adjust framing at the top right. Choose Fill screen or Full video, adjust Crop, and move Horizontal framing to keep the part you want in view.
4. Press Escape to exit. Alt + Shift + V also toggles the mode; use Option on Mac.

YOUR FRAME, YOUR RULES

• Fill screen uses the available display while keeping the original video proportions.
• Full video shows the entire picture, with letterboxing where necessary.
• Crop lets you choose a balance between those two views.
• Horizontal framing moves the picture left or right when it overflows the screen.
• Reset framing restores a centered, fully cropped view.
• Your crop and framing preferences save automatically on your device.
• YouTube's playback, volume, seeking, captions, and settings controls stay in the player.

PRIVACY

No accounts, analytics, tracking, subscriptions, or remote services. The extension stores only two framing preferences locally. Its only requested API permission is storage, and its content scripts run only on the YouTube domains declared in the manifest. The source code is available on GitHub.

GOOD TO KNOW

Set your physical monitor to portrait orientation in your operating system. Vertical Mode changes the way the video fits your screen; it does not change your monitor's orientation. Filling a tall display with a wide video crops the sides. Lower Crop or choose Full video to see the complete picture.

Designed for regular desktop YouTube videos, with support for the standard live and embedded player structure. Shorts and the miniplayer are outside this release's scope. It does not automatically follow people or remove black bars recorded into a video. YouTube interface changes may require extension updates.

Guide and interactive demo: https://brun3y.github.io/yt-vertical-mode/
Support and source: https://github.com/BrUn3y/yt-vertical-mode

Independent project. Not affiliated with YouTube, Google, or The Browser Company.

## Privacy practices

Single purpose:

Reframe desktop YouTube videos for portrait monitors by adding a player control and local crop and horizontal-position adjustments.

Storage permission justification:

Stores the user's crop amount and horizontal framing position locally so the chosen framing persists between viewing sessions. The extension does not transmit these settings.

Site access justification:

Content scripts run only on youtube.com, www.youtube.com, and www.youtube-nocookie.com to locate the video player, add the Vertical mode control, and adjust the video's display geometry. The extension does not access unrelated websites or transmit page content.

Remote code:

No. All executable code is packaged with the extension. No remote JavaScript, WebAssembly, eval, or remote service is used.

Data collection:

No user data is collected or transmitted by the extension. Framing settings and player information are processed locally. The extension does not sell user data, use data for unrelated purposes, or use data for creditworthiness or lending decisions.

## Reviewer instructions

No login or paid account is required by the extension. Open a publicly available regular YouTube video. For a portrait display, use a portrait monitor or a 720 × 1280 browser viewport. Click Vertical mode beside fullscreen, open Adjust framing, try Fill screen and Full video, and move Crop and Horizontal framing. Escape exits the mode. If the browser blocks fullscreen, YouTube's native fullscreen button or window mode can be used. Shorts and the miniplayer are excluded.

## Publication status

This file contains prepared listing copy. Its existence does not indicate that Google has accepted, reviewed, or published the extension. Check the developer dashboard for the actual status.
