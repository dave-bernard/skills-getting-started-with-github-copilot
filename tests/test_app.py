from fastapi.testclient import TestClient
import pytest

from src.app import app, activities as server_activities

client = TestClient(app)


def test_get_activities_returns_200_and_structure():
    resp = client.get("/activities")
    assert resp.status_code == 200
    data = resp.json()
    # server returns a dict mapping activity title -> details
    assert isinstance(data, dict)
    # pick one known activity from app.py to assert fields
    assert "Chess Club" in data
    chess = data["Chess Club"]
    assert "description" in chess
    assert "participants" in chess


def test_signup_success_and_duplicate():
    # create a unique email to avoid interference
    email = "test_student_123@example.com"
    activity = "Chess Club"

    # ensure not already signed up
    if email in server_activities[activity]["participants"]:
        server_activities[activity]["participants"].remove(email)

    resp = client.post(f"/activities/{activity}/signup?email={email}")
    assert resp.status_code == 200
    body = resp.json()
    assert "Signed up" in body.get("message", "")

    # second signup with same email should return 400
    resp2 = client.post(f"/activities/{activity}/signup?email={email}")
    assert resp2.status_code == 400
    err = resp2.json()
    assert "already" in err.get("detail", "").lower()


def test_signup_activity_not_found():
    resp = client.post("/activities/NoSuchActivity/signup?email=a@b.com")
    assert resp.status_code == 404
    err = resp.json()
    assert err.get("detail") == "Activity not found"
