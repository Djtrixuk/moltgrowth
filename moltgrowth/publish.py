"""
Publish content from local markdown files.
Supports: trenches posts (1-36), dgh tips (1-23), dgh journals (3-6).
Uses track files + API title check to prevent duplicates.
"""
from __future__ import annotations

import json
import os
from pathlib import Path

from . import api
from .config import load_config, get_api_key

# Content catalog: (file, title, submolt)
TRENCHES_CATALOG = {
    1: ("TRENCHES-POST-1-RATE-LIMITS.md", "Rate limits are a feature", "general"),
    2: ("TRENCHES-POST-2-DAY-ONE.md", "What we'd do differently on Moltbook (day one)", "general"),
    3: ("TRENCHES-POST-3-AGENT-MONETIZATION.md", "Agent monetization stack (2026)", "agentgrowth"),
    4: ("TRENCHES-POST-4-SOLANA-BASE.md", "Solana vs Base for agent payments", "agentgrowth"),
    5: ("TRENCHES-POST-5-HYPERLIQUID.md", "Hyperliquid for agent trading", "agentgrowth"),
    6: ("TRENCHES-POST-6-ONE-METRIC.md", "One metric to rule them all", "general"),
    7: ("TRENCHES-POST-7-KARMA-VS-PORTFOLIO.md", "Karma vs portfolio", "general"),
    8: ("TRENCHES-POST-8-BATCH-SHIP.md", "Batch your work, ship in windows", "general"),
    9: ("TRENCHES-POST-9-AGENT-WALLETS.md", "Agent wallets: custody and UX", "agentgrowth"),
    10: ("TRENCHES-POST-10-MEMECOIN-AGENTS.md", "Memecoins and agents", "agentgrowth"),
    11: ("TRENCHES-POST-11-REPUTATION-STACK.md", "The agent reputation stack", "agentgrowth"),
    12: ("TRENCHES-POST-12-NIGHTLY-SHIP.md", "Ship while humans sleep", "agentgrowth"),
    13: ("TRENCHES-POST-13-COMMENT-BANK.md", "Comment bank > one-off replies", "agentgrowth"),
    14: ("TRENCHES-POST-14-X402-PAY-PER-USE.md", "x402 and pay-per-use for agents", "agentgrowth"),
    15: ("TRENCHES-POST-15-DEVTOOLS.md", "Agent devtools in 2026", "agentgrowth"),
    16: ("TRENCHES-POST-16-SOLANA-SPEED.md", "Why Solana wins for agents", "agentgrowth"),
    17: ("TRENCHES-POST-17-TRUSTLESS-AGENTS.md", "Trustless agents on-chain", "agentgrowth"),
    18: ("TRENCHES-POST-18-ACCESSIBILITY-AGENTS.md", "Accessibility agents", "agentgrowth"),
    19: ("TRENCHES-POST-19-CONTENT-PILLARS.md", "Content pillars for agent accounts", "general"),
    20: ("TRENCHES-POST-20-FEEDBACK-LOOPS.md", "Feedback loops beat goals", "general"),
    21: ("TRENCHES-POST-21-AGENT-NATIVE-RAILS.md", "Agent-native financial rails", "agentgrowth"),
    22: ("TRENCHES-POST-22-VIRAL-VS-COMPOUND.md", "Viral vs compound growth", "general"),
    23: ("TRENCHES-POST-23-HL-USE-CASES.md", "Hyperliquid use cases for agents", "agentgrowth"),
    24: ("TRENCHES-POST-24-HL-AGENT-STACK.md", "Hyperliquid agent stack: API, WebSocket, API wallets", "agentgrowth"),
    25: ("TRENCHES-POST-25-HL-RISK-GUARDRAILS.md", "Risk guardrails for agent trading on Hyperliquid", "agentgrowth"),
    26: ("TRENCHES-POST-26-MOLTGROWTH-SYSTEMS-BEAT-VIBES.md", "Systems beat vibes — in practice", "general"),
    27: ("TRENCHES-POST-27-COMMENT-BANK-RESULTS.md", "Comment bank: one month in", "general"),
    28: ("TRENCHES-POST-28-AGENT-PRICING-TRENDS.md", "Agent pricing: usage-based wins, vibe pricing loses", "agentgrowth"),
    29: ("TRENCHES-POST-29-AGENT-MARKETPLACES.md", "Agent marketplaces are the next wave", "agentgrowth"),
    30: ("TRENCHES-BUILDLOGS-1.md", "What we shipped: moltgrowth CLI for Moltbook growth", "buildlogs"),
    31: ("TRENCHES-TRADING-1.md", "Agent trading on Hyperliquid: API wallets, no custody", "trading"),
    32: ("TRENCHES-MOLTYDEX-1.md", "MoltyDEX: first DEX built for x402 payments", "agentgrowth"),
    33: ("TRENCHES-POST-33-MOLTGROWTH-GUIDE.md", "moltgrowth: How to automate Moltbook growth", "general"),
    34: ("TRENCHES-POST-34-PREMIUM-FEATURES.md", "Moltgrowth Premium: Advanced Growth Tools", "general"),
    35: ("TRENCHES-POST-35-MOLTGROWTH-FEEDBACK-ASK.md", "Moltgrowth is live — try it and tell us what breaks", "general"),
    36: ("TRENCHES-POST-36-BUILDING-IN-PUBLIC-UPDATE.md", "Moltgrowth update: Stripe in review, domain propagating", "general"),
}

DGH_TIPS_CATALOG = {
    1: ("DGH-TIP-1-FIRST-HOOK.md", "The first 3 seconds decide the scroll", "growthops"),
    2: ("DGH-TIP-2-EMAIL-CAPTURE.md", "Email capture is a product decision", "growthops"),
    3: ("DGH-TIP-3-VIDEO-RHYTHM.md", "Video growth = rhythm over virality", "growthops"),
    4: ("DGH-TIP-4-FUNNEL-MATH.md", "Funnel math before funnel design", "growthops"),
    5: ("DGH-TIP-5-WHAT-IM-TESTING.md", "What I'm testing this week", "growthops"),
    6: ("DGH-TIP-6-CONSISTENCY.md", "One metric, one loop", "general"),
    7: ("DGH-TIP-7-PRIMARY-METRIC.md", "One primary metric", "general"),
    8: ("DGH-TIP-8-FIRST-VALUE-MOMENT.md", "The first value moment", "general"),
    9: ("DGH-TIP-9-AUDIENCE-LEARNING.md", "Audience learns with you", "general"),
    10: ("DGH-TIP-10-RHYTHM-BEATS-VIRAL.md", "Rhythm beats viral", "general"),
    11: ("DGH-TIP-11-EMOTIONAL-TRIGGERS.md", "Emotional triggers drive shares", "general"),
    12: ("DGH-TIP-12-STORY-BEATS-PITCH.md", "Story beats sales pitch", "general"),
    13: ("DGH-TIP-13-TREND-TIMING.md", "Timing multiplies visibility", "general"),
    14: ("DGH-TIP-14-MICRO-INFLUENCERS.md", "Micro-influencers often outperform mega", "general"),
    15: ("DGH-TIP-15-VIRAL-TO-SUSTAINED.md", "Convert viral spikes into sustained growth", "general"),
    16: ("DGH-TIP-16-BUILDING-GROWTH-TOOL.md", "Building a growth tool — and using it on ourselves", "growthops"),
    17: ("DGH-TIP-17-GROWTH-STACK.md", "The growth stack we run", "growthops"),
    18: ("DGH-TIP-18-QUEST-FOR-AGENTS.md", "The quest to build something useful for AI agents", "growthops"),
    19: ("DGH-TIP-19-BUILDING-IN-PUBLIC-2025.md", "Building in public is the growth strategy for 2025", "growthops"),
    20: ("DGH-TIP-20-VULNERABILITY-ENGAGEMENT.md", "Vulnerability drives engagement", "growthops"),
    21: ("DGH-TIP-21-POST-IN-GENERAL.md", "One tip that changed our growth: post in general", "tips"),
    22: ("DGH-TIP-22-MARKETING-AGENTS.md", "Marketing for agents: the audience is other agents", "marketing"),
    23: ("DGH-TIP-23-MOLTGROWTH-5-MIN-SETUP.md", "Moltgrowth: Get started in 5 minutes", "growthops"),
}

DGH_JOURNALS_CATALOG = {
    3: ("MOLTBOOK-KARMA-JOURNAL-3.md", "My Moltbook Karma Journey: Journal #3 — Progress Update", "growthops"),
    4: ("MOLTBOOK-KARMA-JOURNAL-4.md", "My Moltbook Karma Journey: Journal #4 — Building in Public", "growthops"),
    5: ("MOLTBOOK-KARMA-JOURNAL-5.md", "My Moltbook Karma Journey: Journal #5 — Content Bank and Duplicates", "growthops"),
    6: ("MOLTBOOK-KARMA-JOURNAL-6.md", "My Moltbook Karma Journey: Journal #6 — Positive Karma & Compound Growth", "general"),
}

SUBMOLTS_FOR_DUPLICATE_CHECK = [
    "agentgrowth", "growthops", "general", "introductions",
    "buildlogs", "trading", "tips", "marketing", "announcements",
    "agents", "tool-shed", "agentskills",
]


def _title_already_posted(api_key: str, title: str) -> bool:
    """Check if we already posted something with this title."""
    agent = api.me(api_key).get("agent", {})
    our_name = agent.get("name", "")
    seen = set()
    try:
        results = api.search(api_key, f'"{title}"', limit=30, type="posts")
        for item in results.get("results", []):
            if item.get("type") == "post":
                auth = item.get("author") or {}
                name = auth.get("name", "") if isinstance(auth, dict) else ""
                if name == our_name:
                    t = (item.get("title") or "").strip()
                    if t:
                        seen.add(t.lower())
    except Exception:
        pass
    for submolt in SUBMOLTS_FOR_DUPLICATE_CHECK + [None]:
        try:
            posts = api.feed(api_key, sort="new", limit=120, submolt=submolt)
            for p in posts:
                auth = p.get("author") or {}
                name = auth.get("name", "") if isinstance(auth, dict) else ""
                if name != our_name:
                    continue
                t = (p.get("title") or "").strip()
                if t:
                    seen.add(t.lower())
        except Exception:
            continue
    return title.lower() in seen


def _load_track(track_dir: str, filename: str) -> set:
    path = os.path.join(track_dir, filename)
    home_path = os.path.join(os.path.expanduser("~/.moltgrowth"), filename)
    out = set()
    for p in [path, home_path]:
        if os.path.exists(p):
            with open(p) as f:
                out |= {line.strip() for line in f if line.strip()}
    return out


def _save_track(track_dir: str, filename: str, key: str) -> None:
    os.makedirs(track_dir, exist_ok=True)
    path = os.path.join(track_dir, filename)
    with open(path, "a") as f:
        f.write(key + "\n")
    home = os.path.expanduser("~/.moltgrowth")
    if os.path.exists(home):
        try:
            with open(os.path.join(home, filename), "a") as f:
                f.write(key + "\n")
        except OSError:
            pass


def _content_path(cfg: dict, content_type: str, filename: str) -> Path:
    root = Path(cfg.get("project_root", "."))
    if content_type == "trenches":
        return root / "moltbook" / "content" / "trenches" / filename
    if content_type == "dgh_tips":
        return root / "moltbook" / "content" / "dgh-tips" / filename
    if content_type == "dgh_journals":
        return root / "moltbook" / "content" / "dgh-journals" / filename
    raise ValueError(content_type)


def publish_trenches(cfg: dict, num: int, dry_run: bool = False) -> tuple[bool, str]:
    """
    Publish Trenches post #num.
    Returns (success, message). success=False with "rate_limit" in message means retry later.
    """
    if num not in TRENCHES_CATALOG:
        return False, f"Invalid Trenches post number (1-{len(TRENCHES_CATALOG)})"
    filename, title, submolt = TRENCHES_CATALOG[num]
    track_dir = cfg.get("track_dir", os.path.expanduser("~/.moltgrowth"))
    posted = _load_track(track_dir, "posted_trenches.txt")
    key = f"post_{num}"
    if key in posted:
        return True, f"Already posted Trenches post #{num} — skipping."
    if dry_run:
        path = _content_path(cfg, "trenches", filename)
        if not path.exists():
            return False, f"Missing {path}"
        return True, f"[dry-run] Would post Trenches #{num}: {title}"
    api_key = get_api_key(cfg, "trenches")
    if _title_already_posted(api_key, title):
        _save_track(track_dir, "posted_trenches.txt", key)
        return True, "Already posted this title (API check) — skipping."
    path = _content_path(cfg, "trenches", filename)
    if not path.exists():
        return False, f"Missing {path}"
    content = path.read_text(encoding="utf-8")
    try:
        result = api.post(api_key, title, content, submolt)
    except Exception as e:
        msg = str(e).lower()
        if "30 minutes" in msg or "rate limit" in msg or "every 30" in msg:
            return False, f"Rate limit: {e}"
        raise
    if result.get("success"):
        _save_track(track_dir, "posted_trenches.txt", key)
        pid = result.get("post", {}).get("id", result.get("post", {}).get("post_id", "?"))
        # Cross-post to Bluesky (non-blocking)
        if not dry_run:
            try:
                from .bluesky_crosspost import crosspost_to_bluesky
                project_root = cfg.get("project_root")
                crosspost_to_bluesky("trenches", title, content, project_root=project_root, dry_run=False)
            except Exception:
                pass  # Don't fail if Bluesky cross-post fails
        return True, f"Posted Trenches #{num}: {pid}"
    err = result.get("error", result)
    err_str = str(err).lower()
    if "30 minutes" in err_str or "rate limit" in err_str:
        return False, f"Rate limit: {err}. Try again in 30 min or let moltgrowth next run on schedule."
    return False, str(err)


def publish_dgh_tip(cfg: dict, num: int, dry_run: bool = False) -> tuple[bool, str]:
    """Publish DGH tip #num."""
    if num not in DGH_TIPS_CATALOG:
        return False, f"Invalid DGH tip number (1-{len(DGH_TIPS_CATALOG)})"
    filename, title, submolt = DGH_TIPS_CATALOG[num]
    track_dir = cfg.get("track_dir", os.path.expanduser("~/.moltgrowth"))
    posted = _load_track(track_dir, "posted_dgh.txt")
    key = f"tip_{num}"
    if key in posted:
        return True, f"Already posted DGH tip #{num} — skipping."
    if dry_run:
        path = _content_path(cfg, "dgh_tips", filename)
        if not path.exists():
            return False, f"Missing {path}"
        return True, f"[dry-run] Would post DGH tip #{num}: {title}"
    api_key = get_api_key(cfg, "dgh")
    if _title_already_posted(api_key, title):
        _save_track(track_dir, "posted_dgh.txt", key)
        return True, "Already posted this title (API check) — skipping."
    path = _content_path(cfg, "dgh_tips", filename)
    if not path.exists():
        return False, f"Missing {path}"
    content = path.read_text(encoding="utf-8")
    try:
        result = api.post(api_key, title, content, submolt)
    except Exception as e:
        msg = str(e).lower()
        if "30 minutes" in msg or "rate limit" in msg or "every 30" in msg:
            return False, f"Rate limit: {e}"
        raise
    if result.get("success"):
        _save_track(track_dir, "posted_dgh.txt", key)
        pid = result.get("post", {}).get("id", result.get("post", {}).get("post_id", "?"))
        # Cross-post to Bluesky (non-blocking)
        if not dry_run:
            try:
                from .bluesky_crosspost import crosspost_to_bluesky
                project_root = cfg.get("project_root")
                crosspost_to_bluesky("dgh", title, content, project_root=project_root, dry_run=False)
            except Exception:
                pass  # Don't fail if Bluesky cross-post fails
        return True, f"Posted DGH tip #{num}: {pid}"
    err = result.get("error", result)
    err_str = str(err).lower()
    if "30 minutes" in err_str or "rate limit" in err_str:
        return False, f"Rate limit: {err}. Try again in 30 min or let moltgrowth next run on schedule."
    return False, str(err)


def publish_dgh_journal(cfg: dict, num: int, dry_run: bool = False) -> tuple[bool, str]:
    """Publish DGH karma journal #num (3, 4, or 5)."""
    if num not in DGH_JOURNALS_CATALOG:
        return False, f"Invalid DGH journal number (3, 4, or 5)"
    filename, title, submolt = DGH_JOURNALS_CATALOG[num]
    track_dir = cfg.get("track_dir", os.path.expanduser("~/.moltgrowth"))
    posted = _load_track(track_dir, "posted_dgh.txt")
    key = f"journal_{num}"
    if key in posted:
        return True, f"Already posted DGH journal #{num} — skipping."
    if dry_run:
        path = _content_path(cfg, "dgh_journals", filename)
        if not path.exists():
            return False, f"Missing {path}"
        return True, f"[dry-run] Would post DGH journal #{num}: {title}"
    api_key = get_api_key(cfg, "dgh")
    if _title_already_posted(api_key, title):
        _save_track(track_dir, "posted_dgh.txt", key)
        return True, "Already posted this title (API check) — skipping."
    path = _content_path(cfg, "dgh_journals", filename)
    if not path.exists():
        return False, f"Missing {path}"
    content = path.read_text(encoding="utf-8")
    try:
        result = api.post(api_key, title, content, submolt)
    except Exception as e:
        msg = str(e).lower()
        if "30 minutes" in msg or "rate limit" in msg or "every 30" in msg:
            return False, f"Rate limit: {e}"
        raise
    if result.get("success"):
        _save_track(track_dir, "posted_dgh.txt", key)
        pid = result.get("post", {}).get("id", result.get("post", {}).get("post_id", "?"))
        # Cross-post to Bluesky (non-blocking)
        if not dry_run:
            try:
                from .bluesky_crosspost import crosspost_to_bluesky
                project_root = cfg.get("project_root")
                crosspost_to_bluesky("dgh", title, content, project_root=project_root, dry_run=False)
            except Exception:
                pass  # Don't fail if Bluesky cross-post fails
        return True, f"Posted DGH journal #{num}: {pid}"
    err = result.get("error", result)
    err_str = str(err).lower()
    if "30 minutes" in err_str or "rate limit" in err_str:
        return False, f"Rate limit: {err}. Try again in 30 min or let moltgrowth next run on schedule."
    return False, str(err)
