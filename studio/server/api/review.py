"""Deck review: the built deck for the iframe, and comments in the review file."""
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

from .. import repo, reviews
from .deps import get_session

router = APIRouter()

Order = list[dict]  # [{id, n, label}] as the running deck reports it via window.__DECK__


class NewComment(BaseModel):
    slide: str
    n: int | None = None
    component: str = "slide"
    note: str
    order: Order = []


class CommentStatus(BaseModel):
    status: str
    order: Order = []


class Verdict(BaseModel):
    slide: str
    n: int | None = None
    verdict: str
    order: Order = []


def _save(s: repo.Session, model: dict, order: Order) -> dict:
    cfg = s.deck_config() or {}
    reviews.save(s.review_file, model, {
        "title": cfg.get("title") or s.name,
        "session": s.name,
        "deck": cfg.get("name") or s.name,
        "total": cfg.get("slideCount") or len(order),
        "order": order,
    })
    return model


@router.get("/sessions/{course}/{name}/deck.html")
def deck_html(course: str, name: str) -> FileResponse:
    html = get_session(course, name).html_file()
    if html is None or not html.is_file():
        raise HTTPException(404, "the deck has not been built; run the build job first")
    return FileResponse(html, media_type="text/html", headers={"Cache-Control": "no-store"})


@router.get("/sessions/{course}/{name}/export")
def export_html(course: str, name: str) -> FileResponse:
    html = get_session(course, name).html_file()
    if html is None or not html.is_file():
        raise HTTPException(404, "nothing built to export")
    return FileResponse(html, media_type="text/html", filename=html.name)


@router.get("/sessions/{course}/{name}/review")
def read_review(course: str, name: str) -> dict:
    return reviews.load(get_session(course, name).review_file)


@router.post("/sessions/{course}/{name}/review/comments")
def add_comment(course: str, name: str, body: NewComment) -> dict:
    s = get_session(course, name)
    model = reviews.load(s.review_file)
    reviews.add_comment(model, body.slide, body.n, body.component, body.note)
    return _save(s, model, body.order)


@router.patch("/sessions/{course}/{name}/review/comments/{cid}")
def set_comment_status(course: str, name: str, cid: str, body: CommentStatus) -> dict:
    s = get_session(course, name)
    model = reviews.load(s.review_file)
    found = reviews.find_comment(model, cid)
    if not found:
        raise HTTPException(404, "no such comment")
    if body.status == "deleted":
        slide, comment = found
        slide["comments"].remove(comment)
    elif body.status in reviews.MARK_OF_STATUS:
        found[1]["status"] = body.status
    else:
        raise HTTPException(400, f"status must be one of {list(reviews.MARK_OF_STATUS)} or deleted")
    return _save(s, model, body.order)


@router.put("/sessions/{course}/{name}/review/verdict")
def set_verdict(course: str, name: str, body: Verdict) -> dict:
    s = get_session(course, name)
    model = reviews.load(s.review_file)
    try:
        reviews.set_verdict(model, body.slide, body.n, body.verdict)
    except ValueError as e:
        raise HTTPException(400, str(e))
    return _save(s, model, body.order)
