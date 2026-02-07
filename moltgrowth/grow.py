"""
Grow: reply to comments on our posts, upvote good questions.
"""
from __future__ import annotations

import os
import time

from . import api
from .config import load_config, get_api_key, get_replied_track, get_upvoted_comments_track


def _load_tracked(track_file: str) -> set[str]:
    if not os.path.exists(track_file):
        return set()
    with open(track_file) as f:
        return {line.strip() for line in f if line.strip()}


def _save_tracked(track_file: str, item_id: str) -> None:
    try:
        os.makedirs(os.path.dirname(track_file), exist_ok=True)
        with open(track_file, "a") as f:
            f.write(item_id + "\n")
    except OSError:
        pass


def _is_good_question(text: str) -> bool:
    t = text.lower()
    has_q = "?" in text or any(w in t for w in ["how", "what", "why", "when", "where", "which"])
    not_generic = not any(p in t for p in ["great post", "nice", "agree", "this!", "thanks"])
    has_substance = len(text.split()) > 3
    return has_q and not_generic and has_substance


def _get_reply(comment_text: str, account: str) -> str | None:
    text = comment_text.lower()
    if account == "trenches":
        if "language" in text or "framework" in text:
            return "Python + bash. moltgrowth is a CLI — pip install moltgrowth. Core logic: engage, comment, upvote. The hard part is the comment bank and timing."
        if "karma" in text or "growth" in text or "engagement" in text:
            return "Good question. Tension if you optimize for karma alone — you get generic upvote bait. We're testing post-specific comments that add a concrete angle. Building in public (m/growthops, m/agentgrowth)."
        if "how" in text or "what" in text:
            return "Systems beat vibes. Build the feedback loop first, then scale. What are you testing?"
        if "solana" in text or "base" in text or "chain" in text:
            return "Both work. Pick based on where your users (or other agents) are. We're tracking what actually gets used."
        if "elixir" in text or "python" in text or "agent" in text or "autonomy" in text:
            return "Python + bash for our stack. moltgrowth is CLI-based. For strategy logic, Python is faster to iterate; Elixir shines for concurrency if you scale to many agents."
    else:  # dgh
        if "growth" in text or "funnel" in text or "email" in text:
            return "The key is testing one variable at a time. What metric are you optimizing for?"
        if "how" in text or "what" in text:
            return "We're building in public on Moltbook — follow along for what actually moves the needle."
    return None


def run_grow(cfg: dict, account: str, dry_run: bool = False) -> tuple[int, int]:
    """Run grow: reply to comments, upvote. Returns (replies, upvotes)."""
    api_key = get_api_key(cfg, account)
    replied_track = get_replied_track(cfg, account)
    upvoted_track = get_upvoted_comments_track(cfg, account)
    profile = api.me(api_key)
    agent_name = profile.get("agent", {}).get("name", "")
    replied = _load_tracked(replied_track)
    upvoted_comments = _load_tracked(upvoted_track)
    submolts = ["agentgrowth", "growthops", "general", "introductions", "buildlogs", "trading", "agents", "tool-shed", "agentskills", "announcements"] if account == "trenches" else ["growthops", "general", "introductions", "tips", "marketing", "announcements", "agents", "buildlogs"]
    our_posts = []
    for submolt in submolts:
        feed_posts = api.feed(api_key, sort="new", limit=30, submolt=submolt)
        for p in feed_posts:
            auth = p.get("author") or {}
            name = auth.get("name", "") if isinstance(auth, dict) else ""
            if name == agent_name:
                our_posts.append(p)
        if len(our_posts) >= 5:
            break
    replies, upvotes = 0, 0
    if not dry_run:
        print(f"[{account}] Grow: reply to comments, upvote commenters...")
    for post in our_posts[:5]:
        post_id = post.get("id")
        if not post_id:
            continue
        comments_list = api.post_comments(api_key, post_id, sort="new", limit=20)
        for c in comments_list:
            comment_id = c.get("id")
            comment_text = c.get("content", "")
            author = c.get("author") or {}
            author_name = author.get("name", "") if isinstance(author, dict) else ""
            if author_name == agent_name:
                continue
            should_reply = (
                comment_id not in replied
                and (_is_good_question(comment_text) or len(comment_text.split()) >= 5)
                and not any(g in comment_text.lower() for g in ["+1", "this!", "same", "agree", "^^"])
            )
            if should_reply:
                reply_text = _get_reply(comment_text, account)
                if reply_text and not dry_run:
                    try:
                        api.comment(api_key, post_id, reply_text, parent_id=comment_id)
                        replied.add(comment_id)
                        _save_tracked(replied_track, comment_id)
                        replies += 1
                        print(f"  Replied to {author_name}")
                        time.sleep(22)
                    except Exception as e:
                        print(f"  ✗ {e}")
            is_substantive = len(comment_text.split()) >= 3 and not any(g in comment_text.lower() for g in ["+1", "this", "same", "^^"])
            if comment_id not in upvoted_comments and (_is_good_question(comment_text) or is_substantive) and not dry_run:
                try:
                    api.comment_upvote(api_key, comment_id)
                    upvoted_comments.add(comment_id)
                    _save_tracked(upvoted_track, comment_id)
                    upvotes += 1
                    time.sleep(2)
                except Exception:
                    pass
    return replies, upvotes
