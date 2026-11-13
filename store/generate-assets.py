"""Render Chrome Web Store artwork from genuine extension screenshots.

Development-only dependency: Pillow. Source images show the actual extension UI;
the player uses this repository's original local test video, not third-party media.
"""
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "assets"
OUT.mkdir(exist_ok=True)
FONT = next(path for path in [
    os.environ.get("YTVM_FONT", ""),
    "/System/Library/Fonts/Helvetica.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
] if path and Path(path).is_file())
BLUE, PAPER, INK, ACCENT, MUTED = "#c3d8f8", "#f2f1eb", "#191a19", "#2948ba", "#676960"

def font(size):
    return ImageFont.truetype(FONT, size)

def base(index):
    image = Image.new("RGB", (1280, 800), BLUE)
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((24, 24, 1256, 776), radius=18, fill=PAPER)
    draw.text((65, 58), "vertical / mode", font=font(25), fill=INK)
    draw.text((65, 115), f"{index} / YOUTUBE, REFRAMED.", font=font(14), fill=MUTED)
    draw.line((65, 701, 1215, 701), fill="#bcbdb6", width=1)
    return image, draw

def lines(draw, x, y, values, size, fill, line_height):
    for value in values:
        draw.text((x, y), value, font=font(size), fill=fill)
        y += line_height

image, draw = base("01")
lines(draw, 65, 190, ["Same video.", "New frame."], 88, INK, 91)
lines(draw, 68, 418, ["Fill your portrait screen.", "Choose your crop.", "Keep the original proportions."], 26, MUTED, 40)
draw.text((68, 595), "Fill screen  /  Full video  /  Framing", font=font(20), fill=ACCENT)
player = Image.open(ROOT / "sources/player.png").convert("RGB").resize((342, 608), Image.Resampling.LANCZOS)
image.paste(player, (820, 65))
draw.text((65, 727), "Actual extension interface shown with the original local demonstration video.", font=font(16), fill=MUTED)
image.save(OUT / "screenshot-01.png")

image, draw = base("02")
lines(draw, 65, 190, ["A small switch.", "A different", "perspective."], 73, INK, 78)
lines(draw, 68, 470, ["Open YouTube. Click Vertical mode.", "Adjust your frame in the player.", "Your preferences stay on this device."], 24, MUTED, 39)
draw.text((68, 623), "No accounts. No tracking. Free.", font=font(22), fill=ACCENT)
popup = Image.open(ROOT / "sources/popup.png").convert("RGB")
image.paste(popup, (815, 65))
draw.text((65, 727), "Actual extension popup. The player button enters fullscreen directly.", font=font(16), fill=MUTED)
image.save(OUT / "screenshot-02.png")

image = Image.new("RGB", (440, 280), BLUE)
draw = ImageDraw.Draw(image)
draw.rounded_rectangle((12, 12, 428, 268), radius=10, fill=PAPER)
draw.text((31, 31), "vertical / mode", font=font(17), fill=INK)
lines(draw, 29, 83, ["Same video.", "New frame."], 48, INK, 50)
draw.text((31, 218), "YOUTUBE FOR YOUR PORTRAIT SCREEN.", font=font(13), fill=ACCENT)
image.save(OUT / "small-promo-440x280.png")

Image.open(ROOT.parent / "extension/icons/icon-128.png").save(OUT / "icon-128.png")
for path in sorted(OUT.glob("*.png")):
    with Image.open(path) as asset:
        print(path.name, asset.size, asset.mode)
