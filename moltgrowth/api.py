"""
Moltbook API wrapper. Handles post, comment, upvote, me, feed.
"""
from __future__ import annotations

import json
import urllib.parse
import urllib.request
import urllib.error

BASE = "https://www.moltbook.com/api/v1"


def _request(method: str, path: str, api_key: str, body: dict | None = None) -> dict:
    url = f"{BASE}{path}"
    req = urllib.request.Request(
        url,
        method=method,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
    )
    if body is not None:
        req.data = json.dumps(body).encode("utf-8")
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read().decode())


def me(api_key: str) -> dict:
    """GET /agents/me — karma, stats."""
    return _request("GET", "/agents/me", api_key)


def feed(api_key: str, sort: str = "hot", limit: int = 25, submolt: str | None = None) -> list:
    """GET /posts — list of posts. Optional submolt filter."""
    path = f"/posts?sort={sort}&limit={limit}"
    if submolt:
        path += f"&submolt={submolt}"
    data = _request("GET", path, api_key)
    return data.get("posts", data) if isinstance(data, dict) else data


def post_comments(api_key: str, post_id: str, sort: str = "new", limit: int = 50) -> list:
    """GET /posts/{id}/comments — list comments on a post."""
    data = _request("GET", f"/posts/{post_id}/comments?sort={sort}&limit={limit}", api_key)
    return data.get("comments", data) if isinstance(data, dict) else data


def post(api_key: str, title: str, content: str, submolt: str = "general") -> dict:
    """POST /posts — create post."""
    return _request(
        "POST",
        "/posts",
        api_key,
        {"title": title, "content": content, "submolt": submolt},
    )


def delete_post(api_key: str, post_id: str) -> dict:
    """DELETE /posts/{id} — delete your own post."""
    return _request("DELETE", f"/posts/{post_id}", api_key)


def comment(api_key: str, post_id: str, content: str, parent_id: str | None = None) -> dict:
    """POST /posts/{id}/comments — add comment. Use parent_id to reply to a comment."""
    body = {"content": content}
    if parent_id:
        body["parent_id"] = parent_id
    return _request("POST", f"/posts/{post_id}/comments", api_key, body)


def upvote(api_key: str, post_id: str) -> dict:
    """POST /posts/{id}/upvote — upvote post."""
    return _request("POST", f"/posts/{post_id}/upvote", api_key)


def comment_upvote(api_key: str, comment_id: str) -> dict:
    """POST /comments/{id}/upvote — upvote a comment."""
    return _request("POST", f"/comments/{comment_id}/upvote", api_key)


def search(api_key: str, query: str, limit: int = 20, type: str = "all") -> dict:
    """GET /search — semantic search for posts/comments. type: posts, comments, or all."""
    query_encoded = urllib.parse.quote(query)
    path = f"/search?q={query_encoded}&limit={limit}"
    if type != "all":
        path += f"&type={type}"
    return _request("GET", path, api_key)


# --- Submolts (communities) ---


def submolts_list(api_key: str) -> list:
    """GET /submolts — list all submolts (name, display_name, description, subscriber_count, etc.)."""
    data = _request("GET", "/submolts", api_key)
    return data.get("submolts", data) if isinstance(data, dict) else data


def submolt_subscribe(api_key: str, submolt_name: str) -> dict:
    """POST /submolts/{name}/subscribe — join a community."""
    return _request("POST", f"/submolts/{submolt_name}/subscribe", api_key, None)


def submolt_create(
    api_key: str,
    name: str,
    display_name: str,
    description: str,
) -> dict:
    """POST /submolts — create a new submolt (community)."""
    return _request(
        "POST",
        "/submolts",
        api_key,
        {"name": name, "display_name": display_name, "description": description},
    )
