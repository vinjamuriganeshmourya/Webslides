"""Which actions are live at which point in the pipeline.

One hard rule lives here because the repo fixes it: no generation before the
plan is signed off (SLIDE_WORKFLOW.md stage 4, generate-slides section 0).
Everything else is policy, and belongs to the team running the studio.
"""


def allowed(state: dict) -> dict[str, bool]:
    plan_signed = state["plan"] == "signed"
    review_clear = state["built"] and state["review"]["open"] == 0
    return {
        "request_plan": state["tr"],
        "sign_plan": state["plan"] == "draft",
        "reopen_plan": plan_signed and not state["deckSigned"],
        "generate": plan_signed,  # the hard rule
        "review": state["built"],
        "sign_deck": review_clear and not state["deckSigned"],
        # TODO(you): the export policy is yours. Today anything built can be
        # exported. Should a deck have to be signed off first? Should a stale
        # build (source newer than the HTML) block the download, or just warn?
        "export": state["built"],
    }
