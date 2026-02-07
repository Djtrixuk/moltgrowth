"""
Bluesky cross-posting: automatically post to Bluesky after Moltbook posts.
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path


BLUESKY_MAX_GRAPHEMES = 300


def _strip_markdown(text: str) -> str:
    """Remove common markdown that doesn't render on Bluesky."""
    s = text.strip()
    s = re.sub(r"\*\*([^*]+)\*\*", r"\1", s)  # **bold**
    s = re.sub(r"\*([^*]+)\*", r"\1", s)      # *italic*
    s = re.sub(r"__([^_]+)__", r"\1", s)     # __bold__
    s = re.sub(r"^\s*[-*]\s+", "", s, flags=re.MULTILINE)  # list bullets
    return " ".join(s.split())


def trim_for_bluesky(text: str, max_len: int = BLUESKY_MAX_GRAPHEMES) -> str:
    """Trim to max_len; add … if truncated. Strips markdown first."""
    text = _strip_markdown(text)
    if len(text) <= max_len:
        return text
    trimmed = text[: max_len - 1]
    last_space = trimmed.rfind(" ")
    if last_space > max_len // 2:
        trimmed = trimmed[:last_space]
    return trimmed.rstrip() + "…"


def load_credentials(project_root: str | None = None) -> dict | None:
    """Load Bluesky credentials from project root or ~/.moltgrowth/."""
    root = project_root or os.getcwd()
    paths = [
        os.path.join(root, "bluesky-credentials.json"),
        os.path.expanduser("~/.moltgrowth/bluesky-credentials.json"),
    ]
    for path in paths:
        if os.path.exists(path):
            try:
                with open(path) as f:
                    return json.load(f)
            except Exception:
                pass
    return None


def crosspost_to_bluesky(
    account: str,
    title: str,
    content: str,
    project_root: str | None = None,
    dry_run: bool = False,
) -> bool:
    """
    Cross-post to Bluesky after Moltbook post.
    Returns True if posted successfully, False otherwise.
    """
    creds = load_credentials(project_root)
    if not creds:
        return False
    
    account_creds = creds.get(account)
    if not account_creds:
        return False
    
    # Trim content for Bluesky
    bluesky_text = trim_for_bluesky(content)
    
    if dry_run:
        print(f"[bluesky] Would cross-post to {account}: {bluesky_text[:60]}...")
        return True
    
    # Use the post-to-bluesky.py script
    root = project_root or os.getcwd()
    script_path = os.path.join(root, "scripts", "post-to-bluesky.py")
    
    if not os.path.exists(script_path):
        return False
    
    try:
        # Use venv python if available, else system python
        venv_python = os.path.join(root, ".venv", "bin", "python3")
        python_cmd = venv_python if os.path.exists(venv_python) else "python3"
        
        result = subprocess.run(
            [python_cmd, script_path, "--account", account, "--text", bluesky_text],
            cwd=root,
            capture_output=True,
            text=True,
            timeout=30,
        )
        
        if result.returncode == 0:
            print(f"[bluesky] Cross-posted to {account}")
            return True
        else:
            # Don't fail the whole publish if Bluesky fails
            print(f"[bluesky] Cross-post failed (non-fatal): {result.stderr[:100]}")
            return False
    except Exception as e:
        # Don't fail the whole publish if Bluesky fails
        print(f"[bluesky] Cross-post error (non-fatal): {e}")
        return False
