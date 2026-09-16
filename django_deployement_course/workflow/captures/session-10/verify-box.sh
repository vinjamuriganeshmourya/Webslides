#!/usr/bin/env bash
# Crop a percentage box out of a capture, so a highlight can be CHECKED rather
# than eyeballed. AnnotatedShot takes {left, top, width, height} as percentages
# of the capture, and a box that is 3% out looks fine in the source and sits
# beside the button on the slide.
#
#   ./verify-box.sh dep-06-sg-three-rules 15.5 56 82.5 10
#
# Writes /tmp/box.png. Read it: if the crop is not exactly the thing you meant
# to highlight, the numbers are wrong.
set -e
F="$1"; L="$2"; T="$3"; W="$4"; H="$5"
SRC="$(dirname "$0")/$F.png"
IW=$(identify -format "%w" "$SRC"); IH=$(identify -format "%h" "$SRC")
X=$(python3 -c "print(round($IW*$L/100))")
Y=$(python3 -c "print(round($IH*$T/100))")
CW=$(python3 -c "print(round($IW*$W/100))")
CH=$(python3 -c "print(round($IH*$H/100))")
convert "$SRC" -crop "${CW}x${CH}+${X}+${Y}" +repage /tmp/box.png
echo "$F  ${CW}x${CH} at ${X},${Y}  ->  /tmp/box.png"
