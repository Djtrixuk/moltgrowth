#!/usr/bin/env python3
"""
Moltgrowth CLI — Moltbook growth automation for agents.

Commands:
  status [account]   — karma, posts, comments
  post               — create post (--title, --content, --submolt, --account)
  comment            — add comment (post_id, --content, --account)
  upvote             — upvote post (post_id, --account)
  engage             — run engagement cycle (--account, --dry-run)
  feed               — list hot/new posts (--sort, --limit)
"""
import argparse
import sys

from . import __version__
from .api import BASE as API_BASE
from .api import comment as api_comment, feed as api_feed, me as api_me, post as api_post, upvote as api_upvote
from .config import load_config, get_api_key, get_track_file
from .engage import run_cycle


def cmd_accounts(args, cfg):
    """Show configured accounts (without printing secrets)."""
    accounts = cfg.get("accounts") or {}
    print("Accounts:")
    if not accounts:
        print("  (none configured)")
    else:
        for name in sorted(accounts.keys()):
            has_key = bool((accounts.get(name) or {}).get("api_key"))
            print(f"  {name}: {'✓ api_key set' if has_key else '✗ missing api_key'}")
    print("")
    print(f"API base: {API_BASE}")
    if cfg.get("project_root"):
        print(f"Project root: {cfg.get('project_root')}")
    if cfg.get("track_dir"):
        print(f"Track dir: {cfg.get('track_dir')}")


def cmd_status(args, cfg):
    account = args.account or "trenches"
    key = get_api_key(cfg, account)
    data = api_me(key)
    agent = data.get("agent", data)
    karma = agent.get("karma", "?")
    stats = agent.get("stats", {})
    posts = stats.get("posts", "?")
    comments = stats.get("comments", "?")
    followers = agent.get("follower_count")
    name = agent.get("name", agent.get("username", "?"))
    print(f"{account} ({name}): karma={karma} posts={posts} comments={comments}" + (f" followers={followers}" if followers is not None else ""))
    if isinstance(karma, (int, float)) and isinstance(posts, (int, float)) and isinstance(comments, (int, float)):
        try:
            from .analytics import record_snapshot
            record_snapshot(account, int(karma), int(posts), int(comments), int(followers) if followers is not None else None)
        except Exception:
            pass


def cmd_post(args, cfg):
    account = args.account or "trenches"
    key = get_api_key(cfg, account)
    if not args.title or not args.content:
        sys.exit("Usage: moltgrowth post --title TITLE --content CONTENT [--account X]")
    result = api_post(key, args.title, args.content, args.submolt)
    if result.get("success") and result.get("post"):
        pid = result["post"].get("id", result["post"].get("post_id", "?"))
        print(f"Posted: {pid}")
    else:
        print(f"Failed: {result.get('error', result)}")
        sys.exit(1)


def cmd_comment(args, cfg):
    account = args.account or "trenches"
    key = get_api_key(cfg, account)
    pid = getattr(args, "post_id", None)
    if not pid or not args.content:
        sys.exit("Usage: moltgrowth comment POST_ID --content TEXT [--account X]")
    result = api_comment(key, pid, args.content)
    if result.get("success"):
        print("Commented")
    else:
        print(f"Failed: {result.get('error', result)}")
        sys.exit(1)


def cmd_upvote(args, cfg):
    account = args.account or "trenches"
    key = get_api_key(cfg, account)
    pid = getattr(args, "post_id", None)
    if not pid:
        sys.exit("Usage: moltgrowth upvote POST_ID [--account X]")
    api_upvote(key, pid)
    print("Upvoted")


def cmd_engage(args, cfg):
    account = args.account or "trenches"
    if account not in cfg.get("accounts", {}):
        # Try both
        for a in ["trenches", "dgh"]:
            if a in cfg.get("accounts", {}):
                run_cycle(cfg, a, dry_run=args.dry_run)
        return
    run_cycle(cfg, account, dry_run=args.dry_run)


def cmd_engage_all(args, cfg):
    """Run engage for both trenches and dgh."""
    for a in ["trenches", "dgh"]:
        if a in cfg.get("accounts", {}):
            run_cycle(cfg, a, dry_run=args.dry_run)


def cmd_feed(args, cfg):
    account = args.account or "trenches"
    key = get_api_key(cfg, account)
    posts = api_feed(key, sort=args.sort, limit=args.limit)
    for p in posts:
        pid = p.get("id", p.get("post_id", "?"))
        title = (p.get("title") or p.get("content", ""))[:60]
        ups = p.get("upvotes", p.get("score", "?"))
        print(f"{pid}  [+{ups}] {title}")


def cmd_schedule(args, cfg):
    """Generate cron/launchd entries for growth + posting; optionally install and load plists."""
    from .schedule import print_install_instructions, install_plists
    project_root = cfg.get("project_root")
    if getattr(args, "install", False):
        install_plists(project_root or ".")
    else:
        print_install_instructions(project_root)


def cmd_automation_status(args, cfg):
    """Show whether automation (launchd) is loaded and recent log activity."""
    from .schedule import get_automation_status
    print(get_automation_status())


def cmd_logs(args, cfg):
    """Tail post and/or growth logs. Default: last 20 lines of post log."""
    import os
    log_dir = os.path.expanduser("~/.moltgrowth")
    which = getattr(args, "which", "post")
    n = getattr(args, "lines", 20)
    if which == "post":
        path = os.path.join(log_dir, "post.log")
    elif which == "growth":
        path = os.path.join(log_dir, "growth.log")
    else:
        path = None
    if path and os.path.isfile(path):
        with open(path) as f:
            lines = f.readlines()
        for line in lines[-n:]:
            print(line, end="")
    elif path:
        print(f"No log yet at {path}. Run moltgrowth next or moltgrowth run, or install schedule.", file=sys.stderr)
        sys.exit(1)
    else:
        for name in ("post", "growth"):
            p = os.path.join(log_dir, f"{name}.log")
            if os.path.isfile(p):
                print(f"--- {p} (last {n}) ---")
                with open(p) as f:
                    lines = f.readlines()
                for line in lines[-n:]:
                    print(line, end="")
                print()


def cmd_semantic(args, cfg):
    """Semantic search + comment on relevant posts."""
    from .semantic import run_semantic
    account = args.account or "trenches"
    n = run_semantic(cfg, account, dry_run=args.dry_run)
    if not args.dry_run:
        print(f"Done. Commented on {n} posts.")


def cmd_grow(args, cfg):
    """Reply to comments on our posts, upvote commenters."""
    from .grow import run_grow
    account = args.account or "trenches"
    replies, upvotes = run_grow(cfg, account, dry_run=args.dry_run)
    if not args.dry_run:
        print(f"Done. {replies} replies, {upvotes} upvotes.")


def cmd_followers(args, cfg):
    """Follower growth: co-commenter reciprocity + discovery upvotes."""
    from .followers import run_followers
    account = args.account or "trenches"
    n = run_followers(cfg, account, dry_run=args.dry_run)
    if not args.dry_run:
        print(f"Done. Upvoted {n} comments.")


def cmd_announcements(args, cfg):
    """Engage with announcements channel (useful replies)."""
    from .announcements import run_announcements
    account = args.account or "trenches"
    count = run_announcements(cfg, account, dry_run=args.dry_run)
    if not args.dry_run:
        print(f"Done. Engaged with {count} announcements.")


def cmd_analytics(args, cfg):
    """Analytics: karma snapshots or premium dashboard."""
    from .analytics import print_analytics, print_dashboard
    account = args.account
    if getattr(args, "dashboard", False):
        print_dashboard(account)
    else:
        print_analytics(account, limit=args.limit)


def cmd_premium(args, cfg):
    """Premium features info and license management."""
    from .premium import get_license_info
    if getattr(args, "status", False):
        info = get_license_info()
        print(f"License status: {info['status']}")
        if info['status'] == 'premium':
            print(f"Expires: {info.get('expires', 'Never')}")
            print(f"Features: {', '.join(info.get('features', []))}")
        else:
            print("\nGet premium: https://moltgrowth.com/premium")
            print("Features:")
            print("  - Advanced analytics dashboard")
            print("  - Custom comment banks")
            print("  - Multi-account management (5+ accounts)")
            print("  - Priority support")
            print("  - Custom automation scripts")
            print("  - A/B testing for posts")
            print("\nPricing: $29/month or $249/year")
    else:
        print("Premium features for moltgrowth:")
        print("  - Advanced analytics dashboard (trends, daily averages)")
        print("  - Custom comment banks")
        print("  - Multi-account management (5+ accounts)")
        print("  - Priority support")
        print("  - Custom automation scripts")
        print("  - A/B testing for posts")
        print("\nCheck status: moltgrowth premium --status")
        print("Get premium: https://moltgrowth.com/premium")


def cmd_upgrade(args, cfg):
    """Upgrade to Premium — clear CTA and link."""
    print("Upgrade to Moltgrowth Premium")
    print("")
    print("Premium features:")
    print("  - Advanced analytics dashboard (trends, daily averages)")
    print("  - Custom comment banks (we write them for your niche)")
    print("  - Multi-account management (5+ accounts)")
    print("  - Priority support")
    print("  - Custom automation scripts")
    print("  - A/B testing for posts")
    print("")
    print("Pricing: $29/month or $249/year (save $99)")
    print("")
    print("Get started: https://moltgrowth.com/premium")
    print("")
    print("Free tier includes 2 accounts and full core features.")


def cmd_run(args, cfg):
    """Full growth cycle: engage + semantic + grow + followers for both accounts."""
    import time
    from .semantic import run_semantic
    from .grow import run_grow
    from .followers import run_followers
    from .engage import run_cycle
    for account in ["trenches", "dgh"]:
        if account not in cfg.get("accounts", {}):
            continue
        print(f"\n--- {account} ---")
        run_cycle(cfg, account, dry_run=False)
        time.sleep(3)
        run_semantic(cfg, account)
        time.sleep(3)
        run_grow(cfg, account)
        time.sleep(3)
        run_followers(cfg, account)
        time.sleep(5)
    print("\nDone.")


def cmd_publish(args, cfg):
    """Publish from content catalog."""
    from .publish import publish_trenches, publish_dgh_tip, publish_dgh_journal
    account = args.account
    num = args.num
    if account == "trenches":
        ok, msg = publish_trenches(cfg, num, dry_run=args.dry_run)
    elif args.type == "journal":
        ok, msg = publish_dgh_journal(cfg, num, dry_run=args.dry_run)
    else:
        ok, msg = publish_dgh_tip(cfg, num, dry_run=args.dry_run)
    print(msg)
    if not ok and "Rate limit" not in msg:
        sys.exit(1)


def cmd_next(args, cfg):
    """Post next item in rotation."""
    from .publish import publish_trenches, publish_dgh_tip, publish_dgh_journal
    from .next_post import _read_state, _write_state, get_next_action, advance_state, is_rate_limit
    state = _read_state()
    action, num = get_next_action(state)
    if action == "trenches":
        print(f"[next] Posting Trenches #{num}")
        ok, msg = publish_trenches(cfg, num, dry_run=args.dry_run)
    elif action == "dgh_tip":
        print(f"[next] Posting DGH tip #{num}")
        ok, msg = publish_dgh_tip(cfg, num, dry_run=args.dry_run)
    else:
        print(f"[next] Posting DGH journal #{num}")
        ok, msg = publish_dgh_journal(cfg, num, dry_run=args.dry_run)
    print(msg)
    if is_rate_limit(msg):
        print("[next] Rate limit — retry later.")
        return
    if not ok:
        sys.exit(1)
    if not args.dry_run:
        advance_state(state, action, num)
        _write_state(state)
        print(f"[next] State saved. Next: Trenches {state['next_trenches']}, DGH {state['dgh_type']} (j={state['next_dgh_journal']} t={state['next_dgh_tip']}), last={state['last_account']}")


def main():
    p = argparse.ArgumentParser(
        description="Moltgrowth — Moltbook growth CLI. One-time setup: moltgrowth schedule --install"
    )
    p.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    sub = p.add_subparsers(dest="cmd", required=True)

    # status
    s = sub.add_parser("status", help="Show karma and stats")
    s.add_argument("--account", "-a", default="trenches", help="Account name")
    s.set_defaults(func=cmd_status)

    # accounts
    s = sub.add_parser("accounts", help="Show configured accounts (without printing secrets)")
    s.set_defaults(func=cmd_accounts)

    # post
    s = sub.add_parser("post", help="Create post")
    s.add_argument("--title", "-t", required=True)
    s.add_argument("--content", "-c", required=True)
    s.add_argument("--submolt", "-s", default="general")
    s.add_argument("--account", "-a", default="trenches")
    s.set_defaults(func=cmd_post)

    # comment
    s = sub.add_parser("comment", help="Add comment")
    s.add_argument("post_id", nargs="?", help="Post UUID")
    s.add_argument("--content", "-c", required=True, help="Comment text")
    s.add_argument("--account", "-a", default="trenches")
    s.set_defaults(func=cmd_comment)

    # upvote
    s = sub.add_parser("upvote", help="Upvote post")
    s.add_argument("post_id", nargs="?", help="Post UUID")
    s.add_argument("--account", "-a", default="trenches")
    s.set_defaults(func=cmd_upvote)

    # engage
    s = sub.add_parser("engage", help="Run engagement cycle (comment + upvote)")
    s.add_argument("--account", "-a", default=None, help="Account (default: both)")
    s.add_argument("--dry-run", action="store_true", help="Show what would be done")
    s.set_defaults(func=lambda a, c: cmd_engage_all(a, c) if a.account is None else cmd_engage(a, c))

    # feed
    s = sub.add_parser("feed", help="List hot/new posts")
    s.add_argument("--sort", default="hot", choices=["hot", "new"])
    s.add_argument("--limit", type=int, default=25)
    s.add_argument("--account", "-a", default="trenches")
    s.set_defaults(func=cmd_feed)

    # schedule
    s = sub.add_parser("schedule", help="Print cron/launchd for growth + posting; --install writes plists and loads them")
    s.add_argument("--install", action="store_true", help="Write plists to LaunchAgents and launchctl load (macOS)")
    s.set_defaults(func=cmd_schedule)

    # semantic
    s = sub.add_parser("semantic", help="Semantic search + comment on relevant posts")
    s.add_argument("--account", "-a", default="trenches")
    s.add_argument("--dry-run", action="store_true")
    s.set_defaults(func=cmd_semantic)

    # grow
    s = sub.add_parser("grow", help="Reply to comments on our posts, upvote commenters")
    s.add_argument("--account", "-a", default="trenches")
    s.add_argument("--dry-run", action="store_true")
    s.set_defaults(func=cmd_grow)

    # followers
    s = sub.add_parser("followers", help="Co-commenter reciprocity + discovery upvotes")
    s.add_argument("--account", "-a", default="trenches")
    s.add_argument("--dry-run", action="store_true")
    s.set_defaults(func=cmd_followers)

    # analytics
    s = sub.add_parser("analytics", help="Karma over time, recent snapshots")
    s.add_argument("--account", "-a", default=None)
    s.add_argument("--limit", "-n", type=int, default=20)
    s.add_argument("--dashboard", action="store_true", help="Premium: Full analytics dashboard")
    s.set_defaults(func=cmd_analytics)
    
    # premium
    s = sub.add_parser("premium", help="Premium features info and license management")
    s.add_argument("--status", action="store_true", help="Check premium license status")
    s.set_defaults(func=lambda a, c: cmd_premium(a, c))

    # upgrade (alias for premium, with upgrade-focused messaging)
    s = sub.add_parser("upgrade", help="Upgrade to Premium — advanced analytics, custom comment banks, priority support")
    s.set_defaults(func=lambda a, c: cmd_upgrade(a, c))

    # announcements
    s = sub.add_parser("announcements", help="Engage with announcements channel (useful replies)")
    s.add_argument("--account", "-a", default="trenches")
    s.add_argument("--dry-run", action="store_true")
    s.set_defaults(func=lambda a, c: cmd_announcements(a, c))
    
    # run (full cycle)
    s = sub.add_parser("run", help="Full growth cycle: engage + semantic + grow + followers + announcements")
    s.set_defaults(func=cmd_run)

    # publish
    s = sub.add_parser("publish", help="Publish from content catalog (trenches, dgh tip, dgh journal)")
    s.add_argument("account", choices=["trenches", "dgh"], help="Account")
    s.add_argument("num", type=int, help="Post number (e.g. trenches 1-31, dgh tip 1-22, dgh journal 3-5)")
    s.add_argument("--type", "-t", choices=["tip", "journal"], default="tip", help="DGH content type (default: tip)")
    s.add_argument("--dry-run", action="store_true")
    s.set_defaults(func=cmd_publish)

    # next (rotation)
    s = sub.add_parser("next", help="Post next item in rotation (alternates trenches/dgh)")
    s.add_argument("--dry-run", action="store_true")
    s.set_defaults(func=cmd_next)

    # automation-status
    s = sub.add_parser("automation-status", help="Check if launchd jobs are loaded and show recent log activity")
    s.set_defaults(func=cmd_automation_status)

    # logs
    s = sub.add_parser("logs", help="Show last lines of post or growth log")
    s.add_argument("which", nargs="?", default="post", choices=["post", "growth"], help="Which log (default: post)")
    s.add_argument("-n", "--lines", type=int, default=20, help="Number of lines (default: 20)")
    s.set_defaults(func=cmd_logs)

    args = p.parse_args()
    cfg = load_config()
    args.func(args, cfg)


if __name__ == "__main__":
    main()
