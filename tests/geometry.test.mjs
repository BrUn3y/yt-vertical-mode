import test from "node:test";
import assert from "node:assert/strict";
import "../extension/geometry.js";

const { calculateFrame, clamp } = globalThis.YTVerticalGeometry;
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.001, `${actual} ≠ ${expected}`);

test("landscape video covers a portrait monitor without distortion", () => {
  const frame = calculateFrame(1080, 1920, 1920, 1080, 100, 50);
  close(frame.height, 1920);
  close(frame.width / frame.height, 16 / 9);
  close(frame.left, (1080 - frame.width) / 2);
  close(frame.top, 0);
  assert.equal(frame.canPan, true);
});

test("full video contains the complete picture with centered letterboxing", () => {
  const frame = calculateFrame(1080, 1920, 1920, 1080, 0, 80);
  close(frame.width, 1080);
  close(frame.height, 607.5);
  close(frame.left, 0);
  close(frame.top, 656.25);
  assert.equal(frame.canPan, false);
});

test("panning reaches both edges without exposing empty space", () => {
  const left = calculateFrame(1080, 1920, 3840, 2160, 100, 0);
  const right = calculateFrame(1080, 1920, 3840, 2160, 100, 100);
  close(left.left, 0);
  close(right.left + right.width, 1080);
});

test("intermediate crop values preserve the aspect ratio", () => {
  for (const crop of [1, 25, 50, 75, 99]) {
    const frame = calculateFrame(1080, 1920, 1920, 1080, crop, 50);
    close(frame.width / frame.height, 16 / 9);
    assert.ok(frame.width > 1080 && frame.height < 1920);
  }
});

test("handles portrait, square, and ultrawide videos", () => {
  for (const [vw, vh] of [[1080, 1920], [1080, 1080], [2560, 1080]]) {
    for (const [width, height] of [[1080, 1920], [1920, 1080], [720, 1280]]) {
      const cover = calculateFrame(width, height, vw, vh, 100, 50);
      const contain = calculateFrame(width, height, vw, vh, 0, 50);
      assert.ok(cover.width >= width - 0.001 && cover.height >= height - 0.001);
      assert.ok(contain.width <= width + 0.001 && contain.height <= height + 0.001);
      close(cover.width / cover.height, vw / vh);
    }
  }
});

test("waits for valid metadata and sanitizes stored settings", () => {
  for (const value of [0, -1, NaN, Infinity, undefined]) {
    assert.equal(calculateFrame(1080, 1920, value, 1080, 100, 50), null);
  }
  assert.equal(clamp(-10), 0);
  assert.equal(clamp(110), 100);
  assert.equal(clamp("90", 100), 100);
  assert.equal(clamp(NaN), 50);
  close(calculateFrame(1080, 1920, 1920, 1080, Infinity, null).height, 1920);
});
