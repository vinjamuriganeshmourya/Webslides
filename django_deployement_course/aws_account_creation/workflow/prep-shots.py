"""Crop and redact the AWS sign-up captures for the account-creation module.

Redaction is a BLUR, never a retouch (hard rule 11): a blurred field still
shows the room that a field is there. Nothing is painted over with fake text.
"""
from pathlib import Path
from PIL import Image, ImageFilter

SRC = Path.home() / "Pictures" / "Screenshots"
OUT = Path("/home/nxtwave/Web Slides/django_deployement_course/aws_account_creation/public/shots")

# name -> (source file, crop box, [boxes to blur, in SOURCE coordinates])
JOBS = {
    "signup-01-plan-chooser": (
        "Screenshot from 2026-09-16 11-17-47.png", (480, 80, 1420, 975), []),
    "signup-02-contact-empty": (
        "Screenshot from 2026-09-16 11-18-56.png", (650, 60, 1245, 900), []),
    "signup-03-contact-error": (
        "Screenshot from 2026-09-16 11-18-47.png", (650, 40, 1245, 960),
        [(971, 283, 1210, 312), (1066, 399, 1210, 427)]),
    "signup-04-billing-upi": (
        "Screenshot from 2026-09-16 11-20-14.png", (660, 10, 1245, 1010),
        [(985, 788, 1140, 832)]),
    # Cropped to the India-specific block: document type, date of birth, the PAN
    # field and its upload. The whole form scaled to fit the well was unreadable.
    "signup-05-identity-pan": (
        "Screenshot from 2026-09-16 11-24-13.png", (958, 285, 1218, 815),
        [(976, 441, 1205, 470), (990, 538, 1100, 562), (976, 588, 1205, 618)]),
    "signup-06-verify-code": (
        "Screenshot from 2026-09-16 11-24-49.png", (930, 165, 1245, 485), []),
    "signup-07-setting-up": (
        "Screenshot from 2026-09-16 11-25-02.png", (770, 175, 1145, 435), []),
    "signup-08-phone-sms": (
        "Screenshot from 2026-09-15 15-09-52.png", (1050, 215, 1425, 665),
        [(1088, 558, 1390, 590)]),
    "console-01-mfa-skip": (
        "Screenshot from 2026-09-16 11-30-41.png", (640, 155, 1265, 1015), []),
    "console-02-signin-entry": (
        "Screenshot from 2026-09-16 11-10-58.png", (575, 305, 940, 825), []),
    # TWO crops of the phone, because the screen has 500px of dead space between
    # the headline and the sentence, and closing that gap would be a composite
    # rather than a capture. So each half is its own crop and the slide places
    # them one above the other. Neither is retouched.
    "upi-01-mandate": (
        "Image from Gboard Clipboard.jpeg", (84, 1020, 1176, 1400), []),
    "upi-02-mandate-terms": (
        "Image from Gboard Clipboard.jpeg", (84, 1660, 1176, 1975), []),
}


def run() -> None:
    for name, (src, box, blurs) in JOBS.items():
        im = Image.open(SRC / src).convert("RGB")
        for b in blurs:
            im.paste(im.crop(b).filter(ImageFilter.GaussianBlur(14)), b)
        im.crop(box).save(OUT / f"{name}.png")
        print(f"{name}.png  {box[2]-box[0]}x{box[3]-box[1]}  {len(blurs)} blurred")


if __name__ == "__main__":
    run()
