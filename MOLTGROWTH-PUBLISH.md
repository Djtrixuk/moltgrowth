# How to Publish Moltgrowth to PyPI (Beginner-Friendly)

You’ve already created a PyPI account and an API key. This guide walks you through publishing the package and checking it works.

---

## Where you are

- **PyPI account:** Done  
- **API key:** Done (you created it on pypi.org)  
- **Next:** Build the package on your computer, then upload it with your API key  

All commands below are run in **Terminal** (Mac/Linux) or **Command Prompt / PowerShell** (Windows). You’ll run them from the folder that contains the `moltgrowth` project.

---

## Step 1: Open Terminal in the right folder

1. Open **Terminal** (or Command Prompt).
2. Go to your project folder. For example:
   ```bash
   cd /Users/danielstephenson/vibe-test/moltgrowth
   ```
   (Use your own path if your project lives somewhere else.)

You should be inside the folder that contains `pyproject.toml` and the `moltgrowth` package folder.

---

## Step 2: Create a virtual environment and install tools

Run these **one at a time**:

```bash
python3 -m venv .venv
```

```bash
source .venv/bin/activate
```

- **Windows (Command Prompt):** ` .venv\Scripts\activate.bat`  
- **Windows (PowerShell):** ` .venv\Scripts\Activate.ps1`

After the second command, your prompt should start with `(.venv)`.

Then install the tools that build and upload the package:

```bash
pip install build twine
```

When that finishes without errors, go to Step 3.

---

## Step 3: Build the package

Still in the same folder (with `(.venv)` active), run:

```bash
rm -rf dist/
```

```bash
python -m build
```

You should see lines like “Building wheel…” and at the end something like:

`Successfully built moltgrowth-0.1.0-py3-none-any.whl and moltgrowth-0.1.0.tar.gz`

Check that the files exist:

```bash
ls dist/
```

You should see **two files** in `dist/` (the `.whl` and the `.tar.gz`). If you do, go to Step 4.

---

## Step 4: Upload to PyPI using your API key

### Get your API token from PyPI

1. Go to [pypi.org](https://pypi.org) and log in.
2. Click your **username** (top right) → **Account settings**.
3. Scroll to **API tokens** and click **Add API token**.
4. Give it a name (e.g. “moltgrowth upload”), leave scope as “Entire account” (or choose “Project: moltgrowth” if you prefer).
5. Click **Create token**.
6. **Copy the token** (it starts with `pypi-`). You won’t be able to see it again, so save it somewhere safe (e.g. a password manager).

### Upload from your computer

In Terminal, still in the `moltgrowth` folder with `(.venv)` active, run:

```bash
twine upload dist/*
```

Twine will ask for:

1. **Username**  
   Type exactly (including the two underscores):  
   `__token__`  
   Then press Enter.

2. **Password**  
   Paste your **entire API token** (the one starting with `pypi-`).  
   Nothing will appear as you paste; that’s normal. Press Enter.

If the upload works, you’ll see something like:

```
Uploading moltgrowth-0.1.0-py3-none-any.whl
Uploading moltgrowth-0.1.0.tar.gz
View at: https://pypi.org/project/moltgrowth/0.1.0/
```

If you get an error, check:
- Username is exactly `__token__` (two underscores, word “token”, two underscores).
- Password is the full token (starts with `pypi-`), copied with no extra spaces.

---

## Step 5: Check that it’s on PyPI

1. Open: [https://pypi.org/project/moltgrowth/](https://pypi.org/project/moltgrowth/)  
   You should see the **moltgrowth** project page with version **0.1.0**.

2. In a **new** Terminal window (you don’t need the venv for this), run:
   ```bash
   pip install moltgrowth
   ```
   Then:
   ```bash
   moltgrowth --version
   ```
   You should see the version number (e.g. `0.1.0`). That means anyone can now install your package with `pip install moltgrowth`.

---

## Quick reference: full sequence

Once you’re comfortable, you can do everything in one go (from the `moltgrowth` folder):

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install build twine
rm -rf dist/
python -m build
twine upload dist/*
# When prompted: Username = __token__ , Password = your pypi-... token
```

---

## Releasing a new version later

1. In `pyproject.toml`, change `version = "0.1.0"` to e.g. `"0.1.1"`.
2. In `moltgrowth/__init__.py`, set `__version__ = "0.1.1"`.
3. Run the build and upload again:
   ```bash
   rm -rf dist/
   python -m build
   twine upload dist/*
   ```

If you get stuck, note which step you’re on and the exact error message, and we can fix it.
