"""Package a versioned and stable extension ZIP, with SHA-256 checksums."""
import hashlib
import json
import shutil
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent.parent
version = json.loads((root / "extension/manifest.json").read_text())["version"]
output = root / "dist" / f"youtube-vertical-mode-{version}.zip"
stable = root / "dist" / "youtube-vertical-mode.zip"
output.parent.mkdir(exist_ok=True)
with ZipFile(output, "w", ZIP_DEFLATED) as archive:
    for file in sorted((root / "extension").rglob("*")):
        if file.is_file() and not file.name.startswith("."):
            archive.write(file, file.relative_to(root / "extension"))
    archive.write(root / "INSTALL.txt", "INSTALL.txt")
shutil.copyfile(output, stable)
checksums = "".join(f"{hashlib.sha256(file.read_bytes()).hexdigest()}  {file.name}\n" for file in [output, stable])
(root / "dist" / "SHA256SUMS").write_text(checksums)
print(output)
print(stable)
