"""
Config loading. Supports:
1. Environment variables (MOLTBOOK_API_KEY_TRENCHES, MOLTBOOK_API_KEY_DGH)
2. ~/.moltgrowth/config.json (global)
3. ./moltgrowth.json (project)
4. Legacy: moltbook-credentials.json, moltbook-credentials-dgh.json
"""
import json
import os
from pathlib import Path

# Default post pools (from engage script)
DGH_POOL = [
    "4b64728c-645d-45ea-86a7-338e52a2abc6",
    "2fdd8e55-1fde-43c9-b513-9483d0be8e38",
    "69f722c5-233d-491e-af59-6b040d532f5b",
    "adb8e09d-5e9f-4cda-b467-150dc1ed46f4",
    "b0576064-21f1-42ad-b645-04dd969ab5bb",
    "5bc69f9c-481d-4c1f-b145-144f202787f7",
    "9641beb9-11dd-4777-a112-2a917b67f8c9",
]
TRENCHES_POOL = [
    "81540bef-7e64-4d19-899b-d071518b4a4a",
    "562faad7-f9cc-49a3-8520-2bdf362606bb",
    "e044d77d-3801-4205-8fd5-94dd943eef3d",
    "5bc69f9c-481d-4c1f-b145-144f202787f7",
    "c2e024c8-c86f-4e97-8ad0-e43fab1cbe29",
    "b0576064-21f1-42ad-b645-04dd969ab5bb",
    "9641beb9-11dd-4777-a112-2a917b67f8c9",
]


def _expand(path: str) -> str:
    return os.path.expanduser(path)


def _find_project_root() -> Path:
    """Walk up from cwd to find project root (has moltbook-credentials.json or moltgrowth.json)."""
    p = Path.cwd()
    for _ in range(5):
        if (p / "moltbook-credentials.json").exists() or (p / "moltgrowth.json").exists():
            return p
        if p.parent == p:
            break
        p = p.parent
    return Path.cwd()


def load_config() -> dict:
    """Load config. Merges global + project."""
    project = _find_project_root()
    # Prefer project-local .moltgrowth when in a project (vibe-test style)
    track_dir = str(project / ".moltgrowth") if (project / "moltbook-credentials.json").exists() or (project / "moltbook-credentials-dgh.json").exists() else _expand("~/.moltgrowth")
    cfg: dict = {"accounts": {}, "pool": {}, "track_dir": track_dir, "project_root": str(project)}
    # 1. Global
    global_path = Path(_expand("~/.moltgrowth/config.json"))
    if global_path.exists():
        with open(global_path) as f:
            cfg.update(json.load(f))

    # 2. Project
    proj_path = project / "moltgrowth.json"
    if proj_path.exists():
        with open(proj_path) as f:
            data = json.load(f)
            if "accounts" in data:
                cfg["accounts"].update(data["accounts"])
            if "pool" in data:
                cfg["pool"].update(data["pool"])

    # 3. Legacy credentials (project)
    trenches = project / "moltbook-credentials.json"
    dgh = project / "moltbook-credentials-dgh.json"
    if trenches.exists():
        with open(trenches) as f:
            cfg["accounts"]["trenches"] = {"api_key": json.load(f)["api_key"]}
    if dgh.exists():
        with open(dgh) as f:
            cfg["accounts"]["dgh"] = {"api_key": json.load(f)["api_key"]}

    # 4. Environment variables (highest priority — ideal for Cloud Agents / CI)
    # Supported: MOLTBOOK_API_KEY_TRENCHES, MOLTBOOK_API_KEY_DGH, or generic MOLTBOOK_API_KEY
    env_trenches = os.environ.get("MOLTBOOK_API_KEY_TRENCHES") or os.environ.get("MOLTBOOK_API_KEY")
    env_dgh = os.environ.get("MOLTBOOK_API_KEY_DGH")
    if env_trenches:
        cfg["accounts"]["trenches"] = {"api_key": env_trenches}
    if env_dgh:
        cfg["accounts"]["dgh"] = {"api_key": env_dgh}

    # Default pool if not set
    if "dgh" not in cfg["pool"]:
        cfg["pool"]["dgh"] = DGH_POOL
    if "trenches" not in cfg["pool"]:
        cfg["pool"]["trenches"] = TRENCHES_POOL

    return cfg


def get_api_key(cfg: dict, account: str) -> str:
    """Get API key for account."""
    acc = cfg["accounts"].get(account)
    if not acc:
        raise SystemExit(
            f"Unknown account: {account}. Configure via:\n"
            f"  - Environment: MOLTBOOK_API_KEY_TRENCHES / MOLTBOOK_API_KEY_DGH\n"
            f"  - Global: ~/.moltgrowth/config.json\n"
            f"  - Project: moltgrowth.json or moltbook-credentials*.json"
        )
    key = acc.get("api_key")
    if not key:
        raise SystemExit(f"No api_key for account: {account}")
    return key


def get_track_file(cfg: dict, account: str) -> str:
    """Path to commented-on tracking file."""
    d = cfg.get("track_dir", _expand("~/.moltgrowth"))
    os.makedirs(d, exist_ok=True)
    return os.path.join(d, f"commented_{account}.txt")


def get_replied_track(cfg: dict, account: str) -> str:
    """Path to replied-comments tracking file."""
    d = cfg.get("track_dir", _expand("~/.moltgrowth"))
    os.makedirs(d, exist_ok=True)
    return os.path.join(d, f"replied_comments_{account}.txt")


def get_upvoted_comments_track(cfg: dict, account: str) -> str:
    """Path to upvoted-comments tracking file."""
    d = cfg.get("track_dir", _expand("~/.moltgrowth"))
    os.makedirs(d, exist_ok=True)
    return os.path.join(d, f"upvoted_comments_{account}.txt")
