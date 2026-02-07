"""
Schedule: generate cron/launchd for growth (engage, semantic, grow, followers) and posting (next).
Run once: moltgrowth schedule --install  (writes plists and loads them so posts + growth run automatically).
"""
from __future__ import annotations

import os
import platform
import subprocess
import sys
from pathlib import Path


def _get_run_script(project_root: str | None = None) -> str:
    """Return command to run full growth cycle. If project_root has run-moltgrowth.sh, use it."""
    root = os.path.abspath(project_root or os.getcwd())
    run_sh = os.path.join(root, "run-moltgrowth.sh")
    if os.path.isfile(run_sh):
        return f"cd {root} && {run_sh} run 2>&1 | tee -a ~/.moltgrowth/growth.log"
    mg = "moltgrowth"
    if os.environ.get("VIRTUAL_ENV"):
        mg = os.path.join(os.environ["VIRTUAL_ENV"], "bin", "moltgrowth")
    return f"{mg} run 2>&1 | tee -a ~/.moltgrowth/growth.log"


def _get_next_script(project_root: str | None = None) -> str:
    """Return command to run next post (must run from project root)."""
    root = os.path.abspath(project_root or os.getcwd())
    # Prefer run-moltgrowth.sh if present (sets PYTHONPATH)
    run_sh = os.path.join(root, "run-moltgrowth.sh")
    if os.path.isfile(run_sh):
        return f"cd {root} && {run_sh} next >> ~/.moltgrowth/post.log 2>&1"
    return f"cd {root} && PYTHONPATH={os.path.join(root, 'moltgrowth')} python3 -m moltgrowth next >> ~/.moltgrowth/post.log 2>&1"


# --- Growth (engage, semantic, grow, followers) ---

def get_cron_entries(project_root: str | None = None) -> str:
    """Return cron entries for 2-3x daily growth."""
    cmd = _get_run_script(project_root)
    return f"""# Moltgrowth — run 2–3x daily (adjust times as needed)
# engage + semantic + grow + followers for both accounts
0 8 * * * {cmd}
0 14 * * * {cmd}
0 20 * * * {cmd}
"""


def get_launchd_plist(interval_hours: float = 3.5, project_root: str | None = None) -> str:
    """Return launchd plist XML for periodic growth (macOS)."""
    interval_seconds = int(interval_hours * 3600)
    cmd = _get_run_script(project_root)
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.moltgrowth.run</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>-c</string>
        <string>{cmd}</string>
    </array>
    <key>StartInterval</key>
    <integer>{interval_seconds}</integer>
    <key>StandardOutPath</key>
    <string>{os.path.expanduser('~')}/.moltgrowth/growth.log</string>
    <key>StandardErrorPath</key>
    <string>{os.path.expanduser('~')}/.moltgrowth/growth.log</string>
</dict>
</plist>
"""


# --- Posting (moltgrowth next every ~35 min) ---

POST_INTERVAL_SECONDS = 2100  # 35 min — under 1 post/30min per account when alternating


def get_post_cron_entries(project_root: str | None = None) -> str:
    """Cron: run next post every 35 min during active hours."""
    cmd = _get_next_script(project_root or os.getcwd())
    return f"""# Moltgrowth — automatic posts (Trenches + DGH alternating)
# Every 35 min so both accounts get regular posts (rate limit 1/30min per account)
*/35 6-23 * * * {cmd}
"""


def get_post_launchd_plist(project_root: str | None = None) -> str:
    """Launchd plist: run moltgrowth next every 35 min."""
    cmd = _get_next_script(project_root or os.getcwd())
    log_path = os.path.expanduser("~/.moltgrowth/post.log")
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.moltgrowth.post</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>-c</string>
        <string>{cmd}</string>
    </array>
    <key>StartInterval</key>
    <integer>{POST_INTERVAL_SECONDS}</integer>
    <key>RunAtLoad</key>
    <true/>
    <key>StandardOutPath</key>
    <string>{log_path}</string>
    <key>StandardErrorPath</key>
    <string>{log_path}</string>
</dict>
</plist>
"""


def print_install_instructions(project_root: str | None = None) -> None:
    """Print install instructions for growth + posting."""
    root = project_root or os.getcwd()
    os.makedirs(os.path.expanduser("~/.moltgrowth"), exist_ok=True)
    print("=== Growth (engage + semantic + grow + followers) 6–7x/day ===")
    if platform.system() == "Darwin":
        plist = get_launchd_plist(project_root=root)
        plist_path = os.path.expanduser("~/Library/LaunchAgents/com.moltgrowth.run.plist")
        print(f"  Plist: {plist_path}")
        print(f"  Load:  launchctl load {plist_path}")
        print()
        print("=== Posts (Trenches + DGH alternating) every 35 min ===")
        post_plist = get_post_launchd_plist(root)
        post_plist_path = os.path.expanduser("~/Library/LaunchAgents/com.moltgrowth.post.plist")
        print(f"  Plist: {post_plist_path}")
        print(f"  Load:  launchctl load {post_plist_path}")
        print()
        print("To install both automatically, run:  moltgrowth schedule --install")
        print()
        print("--- Growth plist ---")
        print(plist)
        print("--- Post plist ---")
        print(post_plist)
    else:
        print(get_cron_entries(root))
        print("=== Posts ===")
        print(get_post_cron_entries(root))


def install_plists(project_root: str) -> bool:
    """Write growth and post plists to ~/Library/LaunchAgents and load them. Returns True if loaded."""
    if platform.system() != "Darwin":
        print("--install is for macOS (launchd). On Linux use the cron lines from 'moltgrowth schedule'.", file=sys.stderr)
        return False
    launch_agents = Path(os.path.expanduser("~/Library/LaunchAgents"))
    launch_agents.mkdir(parents=True, exist_ok=True)
    root = project_root or os.getcwd()

    # Growth
    run_plist = launch_agents / "com.moltgrowth.run.plist"
    run_plist.write_text(get_launchd_plist(project_root=root), encoding="utf-8")
    print(f"Wrote {run_plist}")

    # Post
    post_plist = launch_agents / "com.moltgrowth.post.plist"
    post_plist.write_text(get_post_launchd_plist(root), encoding="utf-8")
    print(f"Wrote {post_plist}")

    # Load (bootstrap preferred on newer macOS)
    for label, path in [
        ("com.moltgrowth.run", run_plist),
        ("com.moltgrowth.post", post_plist),
    ]:
        try:
            subprocess.run(["launchctl", "bootout", f"gui/{os.getuid()}/{label}"], capture_output=True, timeout=2)
        except Exception:
            pass
        try:
            subprocess.run(
                ["launchctl", "bootstrap", f"gui/{os.getuid()}", str(path)],
                check=True,
                capture_output=True,
                timeout=5,
            )
            print(f"Loaded {label}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            try:
                subprocess.run(["launchctl", "load", str(path)], check=True, capture_output=True)
                print(f"Loaded {label} (load)")
            except subprocess.CalledProcessError as e:
                print(f"Could not load {label}: {e}", file=sys.stderr)
                return False
    print("Done. Posts and growth will run automatically.")
    print("Verify: moltgrowth automation-status   Logs: moltgrowth logs [post|growth]")
    return True


# --- Automation status (check if jobs are loaded and logs exist) ---

def get_automation_status() -> str:
    """Return a short status report: loaded jobs, log paths, last activity."""
    lines = []
    log_dir = os.path.expanduser("~/.moltgrowth")
    post_log = os.path.join(log_dir, "post.log")
    growth_log = os.path.join(log_dir, "growth.log")

    if platform.system() == "Darwin":
        lines.append("LaunchAgents (macOS):")
        for label in ("com.moltgrowth.post", "com.moltgrowth.run"):
            try:
                r = subprocess.run(
                    ["launchctl", "print", f"gui/{os.getuid()}/{label}"],
                    capture_output=True,
                    text=True,
                    timeout=2,
                )
                if r.returncode == 0:
                    lines.append(f"  ✓ {label} loaded")
                else:
                    lines.append(f"  ✗ {label} not loaded (run: moltgrowth schedule --install)")
            except (FileNotFoundError, subprocess.TimeoutExpired):
                lines.append(f"  ? {label} (launchctl unavailable)")
    else:
        lines.append("Automation: use cron (see moltgrowth schedule). launchd is macOS only.")

    lines.append("")
    lines.append("Logs:")
    for name, path in [("post", post_log), ("growth", growth_log)]:
        if os.path.isfile(path):
            try:
                size = os.path.getsize(path)
                with open(path) as f:
                    last_line = ""
                    for line in f:
                        if line.strip():
                            last_line = line.strip()
                    if last_line:
                        # Show last 80 chars of last line
                        lines.append(f"  {path}")
                        lines.append(f"    last: {last_line[-80:]}")
                    else:
                        lines.append(f"  {path} ({size} bytes)")
            except OSError:
                lines.append(f"  {path} (exists, unreadable)")
        else:
            lines.append(f"  {path} (not yet created — run once or install schedule)")

    return "\n".join(lines)
