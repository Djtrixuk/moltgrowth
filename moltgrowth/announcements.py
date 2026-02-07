"""
Announcements channel engagement — useful replies to announcements.
"""
from __future__ import annotations

import os
import time

from . import api
from .config import get_api_key, get_track_file


def _load_tracked(track_file: str) -> set[str]:
    """Load set of post IDs already commented on."""
    if not os.path.exists(track_file):
        return set()
    with open(track_file) as f:
        return {line.strip() for line in f if line.strip()}


def _save_tracked(track_file: str, post_id: str) -> None:
    """Append post_id to tracking file."""
    try:
        os.makedirs(os.path.dirname(track_file), exist_ok=True)
        with open(track_file, "a") as f:
            f.write(post_id + "\n")
    except OSError:
        pass


def _get_useful_reply(post: dict, account: str) -> str | None:
    """Generate a useful reply to an announcement. Returns None if we shouldn't comment."""
    title = (post.get("title") or "").lower()
    content = (post.get("content") or "").lower()
    combined = title + " " + content
    
    # Skip if it's our own announcement
    author = post.get("author") or {}
    author_name = author.get("name", "") if isinstance(author, dict) else ""
    if account == "trenches" and author_name == "TrenchesMolty":
        return None
    if account == "dgh" and author_name == "DigitalGrowthHackers":
        return None
    
    # Useful replies for different announcement types
    if account == "trenches":
        if "launch" in combined or "release" in combined or "new" in combined:
            if "agent" in combined or "tool" in combined:
                return "Excited to try this. What's the first use case you'd recommend?"
            if "feature" in combined or "update" in combined:
                return "This looks useful. How does it compare to [similar thing]? What's the main advantage?"
        if "api" in combined or "integration" in combined:
            return "Nice. What's the rate limit? Any docs we should check first?"
        if "partnership" in combined or "collaboration" in combined:
            return "Interesting. How does this benefit agents specifically?"
        if "event" in combined or "meetup" in combined or "workshop" in combined:
            return "Thanks for sharing. Will this be recorded for those who can't attend?"
    else:  # dgh
        if "launch" in combined or "release" in combined or "new" in combined:
            if "product" in combined or "service" in combined:
                return "Congrats on the launch. What's the one metric you're tracking most closely?"
            if "feature" in combined or "update" in combined:
                return "This looks helpful. What problem does it solve that wasn't solved before?"
        if "case study" in combined or "results" in combined:
            return "Great to see real results. What was the biggest surprise in the data?"
        if "event" in combined or "webinar" in combined:
            return "Thanks for sharing. What's the one takeaway attendees should expect?"
        if "partnership" in combined:
            return "Interesting collaboration. How does this help with growth specifically?"
    
    # Generic useful reply if it's a genuine announcement
    if "announce" in combined or "excited" in combined or "proud" in combined:
        return "Thanks for sharing. What's the best way to get started?"
    
    return None


def run_announcements(cfg: dict, account: str, dry_run: bool = False) -> int:
    """
    Engage with announcements channel: find recent announcements, add useful replies.
    Returns count of announcements commented on.
    """
    api_key = get_api_key(cfg, account)
    track_file = get_track_file(cfg, account).replace("commented_", "announcements_")
    commented = _load_tracked(track_file)
    
    if dry_run:
        print(f"[{account}] Would check announcements channel...")
        return 0
    
    print(f"[{account}] Checking announcements channel...")
    
    try:
        # Get recent announcements (last 20)
        feed_posts = api.feed(api_key, sort="new", limit=20, submolt="announcements")
        commented_count = 0
        
        for post in feed_posts:
            post_id = post.get("id")
            if not post_id or post_id in commented:
                continue
            
            # Only engage with recent announcements (within last 24-48 hours ideally)
            # Skip if already has many comments (20+) unless it's very recent
            try:
                comments_list = api.post_comments(api_key, post_id, limit=5)
                comment_count = len(comments_list) if isinstance(comments_list, list) else 0
            except Exception:
                comment_count = 0
            
            # Don't comment if already has 20+ comments (likely old or very popular)
            if comment_count >= 20:
                continue
            
            reply = _get_useful_reply(post, account)
            if reply:
                print(f"  Replying to announcement: {post.get('title', '')[:50]}...")
                try:
                    result = api.comment(api_key, post_id, reply)
                    if result.get("success"):
                        commented.add(post_id)
                        _save_tracked(track_file, post_id)
                        commented_count += 1
                        print(f"    ✓ Commented")
                        # Upvote the announcement too
                        api.upvote(api_key, post_id)
                        time.sleep(25)  # Rate limit
                    else:
                        error = result.get("error", "")
                        if "rate limit" in error.lower() or "30 minutes" in error.lower():
                            print(f"    Rate limit — stopping")
                            break
                        print(f"    Failed: {error}")
                except Exception as e:
                    print(f"    Error: {e}")
        
        if commented_count > 0:
            print(f"[{account}] Engaged with {commented_count} announcements")
        else:
            print(f"[{account}] No new announcements to engage with")
        
        return commented_count
        
    except Exception as e:
        print(f"[{account}] Error checking announcements: {e}")
        return 0
