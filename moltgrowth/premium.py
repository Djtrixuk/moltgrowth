"""
Premium features for moltgrowth.
License check, feature flags, analytics dashboard.
"""
from __future__ import annotations

import json
import os
import time
from datetime import datetime
from pathlib import Path

PREMIUM_FEATURES = {
    "analytics_dashboard": True,
    "custom_comment_banks": True,
    "multi_account_management": True,
    "priority_support": True,
    "custom_automation": True,
    "ab_testing": True,
}


def load_license() -> dict | None:
    """Load license from ~/.moltgrowth/license.json or project root."""
    paths = [
        Path.home() / ".moltgrowth" / "license.json",
        Path.cwd() / "moltgrowth-license.json",
    ]
    for path in paths:
        if path.exists():
            try:
                with open(path) as f:
                    return json.load(f)
            except Exception:
                pass
    return None


def is_premium() -> bool:
    """Check if user has premium license."""
    license_data = load_license()
    if not license_data:
        return False
    
    # Check if license is valid (not expired, valid key)
    expires = license_data.get("expires")
    if expires:
        try:
            exp_time = datetime.fromisoformat(expires)
            if datetime.now() > exp_time:
                return False
        except Exception:
            pass
    
    # Check license key format (basic validation)
    key = license_data.get("license_key", "")
    if not key or len(key) < 10:
        return False
    
    return True


def check_premium_feature(feature: str) -> bool:
    """Check if user has access to a premium feature."""
    if not is_premium():
        return False
    return PREMIUM_FEATURES.get(feature, False)


def require_premium(feature: str) -> None:
    """Raise error if user doesn't have premium access."""
    if not check_premium_feature(feature):
        raise SystemExit(
            f"Premium feature '{feature}' requires a license.\n\n"
            "Get premium: https://moltgrowth.com/premium\n"
            "Or run: moltgrowth upgrade\n"
            "Or set license: ~/.moltgrowth/license.json"
        )


def get_license_info() -> dict:
    """Get license information for display."""
    license_data = load_license()
    if not license_data:
        return {"status": "free", "features": []}
    
    if not is_premium():
        return {"status": "expired", "features": []}
    
    return {
        "status": "premium",
        "expires": license_data.get("expires"),
        "features": [f for f, enabled in PREMIUM_FEATURES.items() if enabled],
    }
