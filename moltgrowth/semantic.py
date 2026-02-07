"""
Semantic search engagement — find posts where we can add value and comment.
"""
from __future__ import annotations

import json
import os
import time

from . import api
from .config import load_config, get_api_key, get_track_file

SEARCH_QUERIES = {
    "trenches": [
        "agent monetization strategies",
        "Solana Base Hyperliquid agent payments",
        "karma growth on Moltbook",
        "agent efficiency and automation",
        "memecoin strategies for agents",
        "building in public agents",
        "AI agent workflows",
        "feedback loops systems",
        "compound growth strategies",
        "agent reputation building",
    ],
    "dgh": [
        "growth marketing funnels",
        "email capture strategies",
        "video content growth",
        "funnel optimization",
        "growth metrics and measurement",
        "building in public growth",
        "content rhythm consistency",
        "viral vs compound growth",
        "one metric one loop",
        "consistency beats virality",
    ],
}


def _load_tracked(track_file: str) -> set[str]:
    if not os.path.exists(track_file):
        return set()
    with open(track_file) as f:
        return {line.strip() for line in f if line.strip()}


def _save_tracked(track_file: str, post_id: str) -> None:
    try:
        os.makedirs(os.path.dirname(track_file), exist_ok=True)
        with open(track_file, "a") as f:
            f.write(post_id + "\n")
    except OSError:
        pass


def _get_comment_for_post(post: dict, account: str) -> str | None:
    """Generate a comment based on post content. Returns None if we shouldn't comment."""
    title = (post.get("title") or "").lower()
    content = (post.get("content") or "").lower()
    combined = title + " " + content

    if account == "trenches":
        if "monetization" in combined or "money" in combined or "earn" in combined:
            return "The play: Build reputation here (Moltbook), monetize elsewhere (Moltroad, x402, tips). Karma + followers = portfolio."
        if "solana" in combined or "base" in combined or "hyperliquid" in combined:
            return "Solana = speed + memecoin culture. Base = Moltroad, L2 fees. Both work. Pick based on where your users are."
        if "karma" in combined or "growth" in combined:
            return "Karma lags; quality compounds. Post-specific comments that add a concrete angle, not 'great post.' Building in public (m/agentgrowth, m/growthops)."
        if "efficiency" in combined or "automation" in combined:
            return "Batch your work. One metric. Constraints shape better output."
    else:  # dgh
        if "funnel" in combined or "conversion" in combined:
            return "Fix the step where you lose the most people. That's your lever. One big fix usually beats ten small tweaks."
        if "email" in combined or "capture" in combined:
            return "Email capture is a product decision. Bake it into the first value moment, not bolted on later."
        if "video" in combined or "reels" in combined:
            return "Video growth = rhythm over virality. 3-5 solid posts per week will build an audience. Consistency beats one hit."
        if "growth" in combined or "metrics" in combined:
            return "One metric. Everything else is noise until you're positive. Then optimize the next lever."
        if "consistency" in combined or "rhythm" in combined or "schedule" in combined:
            return "Consistency compounds. 3x/week beats 1x/month even if each post is smaller. Building in public (m/growthops)."

    return None


def run_semantic(cfg: dict, account: str, dry_run: bool = False) -> int:
    """Run semantic search engagement. Returns count of posts commented on."""
    api_key = get_api_key(cfg, account)
    track_file = get_track_file(cfg, account)
    commented = _load_tracked(track_file)
    queries = SEARCH_QUERIES.get(account, [])
    posts_found = 0

    for query in queries:
        if dry_run:
            print(f"Would search: '{query}'")
            continue
        print(f"Searching: '{query}'...")
        try:
            results = api.search(api_key, query, limit=15, type="posts")
            posts = results.get("results", [])
            for item in posts:
                if item.get("type") != "post":
                    continue
                post_id = item.get("post_id") or item.get("id")
                if not post_id or post_id in commented:
                    continue
                upvotes = item.get("upvotes", 0)
                try:
                    comments_list = api.post_comments(api_key, post_id, limit=5)
                    comment_count = len(comments_list) if isinstance(comments_list, list) else 0
                except Exception:
                    comment_count = 0
                if account == "dgh":
                    needs_engagement = upvotes >= 2 or comment_count >= 3
                else:
                    needs_engagement = upvotes >= 1 or comment_count >= 1
                if needs_engagement and comment_count <= 25:
                    comment_text = _get_comment_for_post(item, account)
                    if comment_text:
                        print(f"  Commenting on {post_id[:8]}... (↑{upvotes}, 💬{comment_count})")
                        try:
                            api.comment(api_key, post_id, comment_text)
                            commented.add(post_id)
                            posts_found += 1
                            _save_tracked(track_file, post_id)
                            print("    ✓ Commented")
                            time.sleep(25)
                        except Exception as e:
                            msg = str(e).lower()
                            if "30 minutes" in msg or "rate limit" in msg:
                                print("    ⏸ Rate limited")
                                return posts_found
                            print(f"    ✗ {e}")
        except Exception as e:
            print(f"  Search failed: {e}")

    return posts_found
