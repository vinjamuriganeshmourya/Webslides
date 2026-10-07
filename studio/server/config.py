"""Paths and constants. Everything else imports from here."""
import os
import shutil
from pathlib import Path

STUDIO_DIR = Path(__file__).resolve().parents[1]
REPO_ROOT = STUDIO_DIR.parent
# Courses live under `Outputs/` in this checkout; fall back to the root if not.
COURSES_ROOT = REPO_ROOT / "Outputs" if (REPO_ROOT / "Outputs").is_dir() else REPO_ROOT
UI_DIST = STUDIO_DIR / "ui" / "dist"

HOST = "127.0.0.1"  # a browser terminal is a shell: never expose it beyond this machine
PORT = int(os.environ.get("STUDIO_PORT", "8600"))

CLAUDE_BIN = shutil.which("claude") or "claude"
CHROME_PATH = os.environ.get("CHROME_PATH", "/opt/google/chrome/chrome")

# Top-level directories that are never a course, whatever they contain.
SKIP_DIRS = {
    "node_modules", ".git", "dist", "dist-single", "versions", "testing",
    "WebSlides_", "pptx_template", "sample_ppts", "slide-kit", "review-app", "studio",
}
