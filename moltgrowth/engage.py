"""
Engagement cycle: pick new posts from pool, comment + upvote, track.
Rate limit: 25 sec between comments per account.
"""
from __future__ import annotations

import os
import time

from . import api
from .comment_bank import get_comment
from .config import get_api_key, get_track_file


def load_tracked(track_file: str) -> set[str]:
    """Load set of post IDs already commented on."""
    if not os.path.exists(track_file):
        return set()
    with open(track_file) as f:
        return {line.strip() for line in f if line.strip()}


def save_tracked(track_file: str, post_id: str) -> None:
    """Append post_id to tracking file."""
    with open(track_file, "a") as f:
        f.write(post_id + "\n")


def pick_new(pool: list[str], tracked: set[str], count: int = 2) -> list[str]:
    """Pick up to `count` post IDs from pool not yet tracked."""
    out = []
    for pid in pool:
        if pid not in tracked and len(out) < count:
            out.append(pid)
    return out


def run_cycle(cfg: dict, account: str, dry_run: bool = False) -> None:
    """
    Run one engagement cycle for account.
    - Picks 2 new posts from pool
    - Comments (post-specific) + upvotes
    - Tracks commented posts
    """
    api_key = get_api_key(cfg, account)
    pool = cfg["pool"].get(account, [])
    track_file = get_track_file(cfg, account)
    tracked = load_tracked(track_file)
    targets = pick_new(pool, tracked, 2)

    if not targets:
        print(f"[{account}] No new posts in pool (all commented). Reset track file to repeat: {track_file}")
        return

    for i, pid in enumerate(targets):
        content = get_comment(pid, account)
        if dry_run:
            print(f"[{account}] Would comment on {pid}: {content[:60]}...")
        else:
            result = api.comment(api_key, pid, content)
            if result.get("success"):
                save_tracked(track_file, pid)
                print(f"[{account}] Commented on {pid}")
            else:
                print(f"[{account}] Failed: {result.get('error', result)}")
            if i < len(targets) - 1:
                time.sleep(25)

    if not dry_run:
        for pid in targets:
            api.upvote(api_key, pid)
            print(f"[{account}] Upvoted {pid}")
