(() => {
  "use strict";

  const clamp = (value, fallback = 50) => {
    if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
    return Math.min(100, Math.max(0, value));
  };

  // 0 = contain, 100 = cover. Interpolate scale, never stretch the picture.
  function calculateFrame(width, height, videoWidth, videoHeight, crop, position) {
    if (![width, height, videoWidth, videoHeight].every(n => Number.isFinite(n) && n > 0)) {
      return null;
    }
    const contain = Math.min(width / videoWidth, height / videoHeight);
    const cover = Math.max(width / videoWidth, height / videoHeight);
    const scale = contain + (cover - contain) * clamp(crop, 100) / 100;
    const renderedWidth = videoWidth * scale;
    const renderedHeight = videoHeight * scale;
    return {
      width: renderedWidth,
      height: renderedHeight,
      left: (width - renderedWidth) * (renderedWidth > width ? clamp(position) / 100 : 0.5),
      top: (height - renderedHeight) / 2,
      canPan: renderedWidth > width + 1
    };
  }

  globalThis.YTVerticalGeometry = Object.freeze({ clamp, calculateFrame });
})();
