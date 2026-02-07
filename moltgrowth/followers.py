"""
Follower growth: co-commenter reciprocity + discovery upvotes.
"""
import os
import time

from . import api
from .config import load_config, get_api_key, get_track_file, get_upvoted_comments_track

MAX_POSTS_TO_CHECK = 5
MAX_COMMENTS_PER_POST = 2


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


def _is_substantive(text: str) -> bool:
    t = text.lower().strip()
    if len(t.split()) < 4:
        return False
    if any(g in t for g in ["+1", "this!", "same", "agree", "^^", "nice", "great post"]):
        return False
    return True


def run_followers(cfg: dict, account: str, dry_run: bool = False) -> int:
    """Run follower growth: upvote co-commenters + discovery. Returns count of upvotes."""
    api_key = get_api_key(cfg, account)
    commented_track = get_track_file(cfg, account)
    upvoted_track = get_upvoted_comments_track(cfg, account)
    profile = api.me(api_key)
    agent_name = profile.get("agent", {}).get("name", "")
    commented_posts = _load_tracked(commented_track)
    upvoted_comments = _load_tracked(upvoted_track)
    if not commented_posts:
        print(f"[{account}] No commented posts yet. Run semantic or engage first.")
        return 0
    if not dry_run:
        print(f"[{account}] Follower growth: upvoting co-commenters...")
    count = 0
    for post_id in list(commented_posts)[:MAX_POSTS_TO_CHECK]:
        try:
            comments_list = api.post_comments(api_key, post_id, sort="new", limit=20)
            if not isinstance(comments_list, list):
                continue
            upvoted_this = 0
            for c in comments_list:
                if upvoted_this >= MAX_COMMENTS_PER_POST:
                    break
                comment_id = c.get("id")
                if not comment_id or comment_id in upvoted_comments:
                    continue
                content = c.get("content", "")
                author = c.get("author") or {}
                author_name = author.get("name", "") if isinstance(author, dict) else ""
                if author_name == agent_name or not _is_substantive(content):
                    continue
                if not dry_run:
                    try:
                        api.comment_upvote(api_key, comment_id)
                        upvoted_comments.add(comment_id)
                        _save_tracked(upvoted_track, comment_id)
                        count += 1
                        print(f"  Upvoted {author_name} (post {post_id[:8]}...)")
                        time.sleep(2)
                    except Exception as e:
                        if "rate limit" in str(e).lower() or "30 minutes" in str(e).lower():
                            return count
        except Exception:
            pass
    submolts = ["agentgrowth", "growthops", "general", "announcements", "agents"] if account == "trenches" else ["growthops", "general", "announcements", "agents"]
    for submolt in submolts[:2]:
        try:
            posts = api.feed(api_key, sort="new", limit=15, submolt=submolt)
            for p in posts[:3]:
                post_id = p.get("id") or p.get("post_id")
                if not post_id or post_id in commented_posts:
                    continue
                comments_list = api.post_comments(api_key, post_id, limit=10)
                if not isinstance(comments_list, list) or len(comments_list) < 2 or len(comments_list) > 20:
                    continue
                for c in comments_list:
                    comment_id = c.get("id")
                    if not comment_id or comment_id in upvoted_comments:
                        continue
                    author = c.get("author") or {}
                    author_name = author.get("name", "") if isinstance(author, dict) else ""
                    if author_name == agent_name or not _is_substantive(c.get("content", "")):
                        continue
                    if not dry_run:
                        try:
                            api.comment_upvote(api_key, comment_id)
                            upvoted_comments.add(comment_id)
                            _save_tracked(upvoted_track, comment_id)
                            count += 1
                            print(f"  Discovery: {author_name}")
                            time.sleep(2)
                        except Exception:
                            break
                    break
        except Exception:
            pass
    return count
