"""
Analytics: karma snapshots, basic stats.
"""
from __future__ import annotations

import json
import os
from datetime import datetime
from pathlib import Path


def _get_snapshots_path() -> Path:
    path = Path(os.path.expanduser("~/.moltgrowth/snapshots.json"))
    path.parent.mkdir(parents=True, exist_ok=True)
    return path


def record_snapshot(account: str, karma: int, posts: int, comments: int, followers: int | None = None) -> None:
    """Append a karma snapshot."""
    path = _get_snapshots_path()
    data = []
    if path.exists():
        with open(path) as f:
            data = json.load(f)
    data.append({
        "ts": datetime.utcnow().isoformat() + "Z",
        "account": account,
        "karma": karma,
        "posts": posts,
        "comments": comments,
        "followers": followers,
    })
    with open(path, "w") as f:
        json.dump(data, f, indent=0)


def load_snapshots(account: str | None = None, limit: int = 30) -> list[dict]:
    """Load snapshots, optionally filtered by account."""
    path = _get_snapshots_path()
    if not path.exists():
        return []
    with open(path) as f:
        data = json.load(f)
    if account:
        data = [s for s in data if s.get("account") == account]
    return data[-limit:] if limit else data


def print_analytics(account: str | None = None, limit: int = 20) -> None:
    """Print karma over time and recent snapshots."""
    snapshots = load_snapshots(account, limit)
    if not snapshots:
        print("No snapshots yet. Run 'moltgrowth status' to record one.")
        return
    print("Recent snapshots:")
    for s in snapshots:
        ts = s.get("ts", "")[:10]
        acc = s.get("account", "?")
        k = s.get("karma", "?")
        p = s.get("posts", "?")
        c = s.get("comments", "?")
        f = s.get("followers", "")
        fstr = f" followers={f}" if f is not None else ""
        print(f"  {ts} {acc}: karma={k} posts={p} comments={c}{fstr}")


def print_dashboard(account: str | None = None) -> None:
    """Premium: Print analytics dashboard with trends and insights."""
    from .premium import require_premium
    require_premium("analytics_dashboard")
    
    snapshots = load_snapshots(account, limit=100)
    if not snapshots:
        print("No snapshots yet. Run 'moltgrowth status' to record one.")
        return
    
    # Calculate trends
    if len(snapshots) >= 2:
        first = snapshots[0]
        last = snapshots[-1]
        karma_delta = last.get("karma", 0) - first.get("karma", 0)
        posts_delta = last.get("posts", 0) - first.get("posts", 0)
        comments_delta = last.get("comments", 0) - first.get("comments", 0)
        followers_delta = (last.get("followers") or 0) - (first.get("followers") or 0)
        
        print("\n=== Analytics Dashboard ===")
        print(f"\nAccount: {account or 'All'}")
        print(f"Snapshots: {len(snapshots)}")
        print(f"\nCurrent:")
        print(f"  Karma: {last.get('karma', '?')}")
        print(f"  Posts: {last.get('posts', '?')}")
        print(f"  Comments: {last.get('comments', '?')}")
        if last.get("followers") is not None:
            print(f"  Followers: {last.get('followers', '?')}")
        
        print(f"\nTrends (since {first.get('ts', '')[:10]}):")
        print(f"  Karma: {karma_delta:+d}")
        print(f"  Posts: {posts_delta:+d}")
        print(f"  Comments: {comments_delta:+d}")
        if followers_delta != 0:
            print(f"  Followers: {followers_delta:+d}")
        
        # Calculate daily averages if we have enough data
        if len(snapshots) >= 7:
            days = max(1, (datetime.fromisoformat(last.get("ts", "").replace("Z", "+00:00")) - 
                          datetime.fromisoformat(first.get("ts", "").replace("Z", "+00:00"))).days)
            if days > 0:
                print(f"\nDaily averages ({days} days):")
                print(f"  Karma/day: {karma_delta / days:.1f}")
                print(f"  Posts/day: {posts_delta / days:.1f}")
                print(f"  Comments/day: {comments_delta / days:.1f}")
        
        print("\nRecent snapshots:")
        for s in snapshots[-10:]:
            ts = s.get("ts", "")[:10]
            acc = s.get("account", "?")
            k = s.get("karma", "?")
            p = s.get("posts", "?")
            c = s.get("comments", "?")
            f = s.get("followers", "")
            fstr = f" followers={f}" if f is not None else ""
            print(f"  {ts} {acc}: karma={k} posts={p} comments={c}{fstr}")
    else:
        print_analytics(account, limit)
