"""Sessions and the files that make one up: the TR doc, the plan, the sign-offs."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from .. import agent, plans, repo
from .deps import get_session

router = APIRouter()


class NewSession(BaseModel):
    course: str
    name: str


class Text(BaseModel):
    text: str


class Notes(BaseModel):
    notes: str | None


@router.get("/sessions")
def list_sessions() -> list[dict]:
    return [repo.state(s) for s in repo.list_sessions()]


@router.post("/sessions")
def create_session(body: NewSession) -> dict:
    try:
        return repo.state(repo.create(body.course.strip(), body.name.strip()))
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.get("/sessions/{course}/{name}")
def session_state(course: str, name: str) -> dict:
    return repo.state(get_session(course, name))


@router.get("/sessions/{course}/{name}/tr")
def read_tr(course: str, name: str) -> dict:
    return {"text": plans.read(get_session(course, name).tr_file)}


@router.put("/sessions/{course}/{name}/tr")
def write_tr(course: str, name: str, body: Text) -> dict:
    s = get_session(course, name)
    plans.write(s.tr_file, body.text)
    return repo.state(s)


@router.get("/sessions/{course}/{name}/plan")
def read_plan(course: str, name: str) -> dict:
    return {"text": plans.read(get_session(course, name).plan_file)}


@router.put("/sessions/{course}/{name}/plan")
def write_plan(course: str, name: str, body: Text) -> dict:
    s = get_session(course, name)
    plans.write(s.plan_file, body.text)
    return repo.state(s)


@router.put("/sessions/{course}/{name}/notes")
def write_notes(course: str, name: str, body: Notes) -> dict:
    """Revision notes for the next `/studio plan` run; the skill reads and clears them."""
    s = get_session(course, name)
    s.save_meta(notes=body.notes)
    return repo.state(s)


@router.post("/sessions/{course}/{name}/plan/sign-off")
def sign_off_plan(course: str, name: str) -> dict:
    s = get_session(course, name)
    if not s.plan_file.is_file():
        raise HTTPException(409, "there is no plan to sign off")
    plans.sign_off(s.plan_file)
    return repo.state(s)


@router.post("/sessions/{course}/{name}/plan/reopen")
def reopen_plan(course: str, name: str) -> dict:
    s = get_session(course, name)
    plans.reopen(s.plan_file)
    return repo.state(s)


@router.post("/sessions/{course}/{name}/deck/sign-off")
def sign_off_deck(course: str, name: str) -> dict:
    s = get_session(course, name)
    if not repo.state(s)["allowed"]["sign_deck"]:
        raise HTTPException(409, "the deck is not built, or still has open review comments")
    plans.sign_off_deck(s.plan_file)
    return repo.state(s)


@router.post("/sessions/{course}/{name}/claude/new")
async def new_claude_session(course: str, name: str) -> dict:
    """Close the running conversation and start the next one fresh; the old id is kept in the file."""
    s = get_session(course, name)
    await agent.reset(f"{course}/{name}")
    s.rotate_claude_session()
    return repo.state(s)
