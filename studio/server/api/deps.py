"""Shared route helpers."""
from fastapi import HTTPException

from .. import repo


def get_session(course: str, name: str) -> repo.Session:
    s = repo.find(course, name)
    if s is None:
        raise HTTPException(404, f"no session {course}/{name}")
    return s
