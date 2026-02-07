"""
Next post rotation: alternate Trenches / DGH (tip or journal).
State stored in ~/.moltgrowth/post_state.
"""
from __future__ import annotations

import os


STATE_FILE = os.path.expanduser("~/.moltgrowth/post_state")
TRENCHES_MAX = 32
DGH_TIP_MAX = 22
DGH_JOURNALS = (3, 4, 5)  # cycle 3 -> 4 -> 5 -> 3


def _read_state() -> dict:
    out = {
        "next_trenches": 1,
        "next_dgh_journal": 3,
        "next_dgh_tip": 1,
        "dgh_type": "tip",
        "last_account": "dgh",
    }
    if not os.path.exists(STATE_FILE):
        return out
    with open(STATE_FILE) as f:
        for line in f:
            line = line.strip()
            if "=" in line:
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip()
                if k == "next_trenches":
                    try:
                        out["next_trenches"] = int(v)
                    except ValueError:
                        pass
                elif k == "next_dgh_journal":
                    try:
                        out["next_dgh_journal"] = int(v)
                    except ValueError:
                        pass
                elif k == "next_dgh_tip":
                    try:
                        out["next_dgh_tip"] = int(v)
                    except ValueError:
                        pass
                elif k == "dgh_type":
                    out["dgh_type"] = v if v in ("tip", "journal") else "tip"
                elif k == "last_account":
                    out["last_account"] = v if v in ("trenches", "dgh") else "dgh"
    return out


def _write_state(state: dict) -> None:
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, "w") as f:
        f.write(f"next_trenches={state['next_trenches']}\n")
        f.write(f"next_dgh_journal={state['next_dgh_journal']}\n")
        f.write(f"next_dgh_tip={state['next_dgh_tip']}\n")
        f.write(f"dgh_type={state['dgh_type']}\n")
        f.write(f"last_account={state['last_account']}\n")


def _advance_journal(j: int) -> int:
    if j == 3:
        return 4
    if j == 4:
        return 5
    return 3


def get_next_action(state: dict) -> tuple[str, int]:
    """
    Returns (account_type, number) e.g. ("trenches", 5) or ("dgh_tip", 12) or ("dgh_journal", 4).
    """
    last = state["last_account"]
    if last == "dgh":
        return "trenches", state["next_trenches"]
    if state["dgh_type"] == "journal":
        return "dgh_journal", state["next_dgh_journal"]
    return "dgh_tip", state["next_dgh_tip"]


def advance_state(state: dict, action: str, num: int) -> dict:
    """Mutate and return state after successful post."""
    if action == "trenches":
        state["last_account"] = "trenches"
        state["next_trenches"] = num + 1 if num < TRENCHES_MAX else 1
    elif action == "dgh_tip":
        state["last_account"] = "dgh"
        state["dgh_type"] = "journal"
        state["next_dgh_tip"] = num + 1 if num < DGH_TIP_MAX else 1
    elif action == "dgh_journal":
        state["last_account"] = "dgh"
        state["dgh_type"] = "tip"
        state["next_dgh_journal"] = _advance_journal(num)
    return state


def is_rate_limit(message: str) -> bool:
    m = message.lower()
    return "30 minutes" in m or "rate limit" in m or "every 30" in m
