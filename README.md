# STILL YOURS

Premium fashion-tech e-commerce prototype for:

> **Some things deserve a second story.**

STILL YOURS combines fashion, sustainability, AI personalization and memory technology.

## Deploy to GitHub + Vercel

### Option 1 — GitHub website upload

1. Create a new GitHub repository, e.g. `still-yours`.
2. Upload **all files and folders inside this project**.
3. Make sure `index.html` is in the repository root.
4. Go to Vercel and choose **Add New → Project**.
5. Import the GitHub repository.
6. Framework Preset: **Other** / static site.
7. Build Command: leave empty.
8. Output Directory: leave empty / `.`
9. Click **Deploy**.

No Node build process is required. Vercel serves the project as a static website.

### Option 2 — Git command line

```bash
git init
git add .
git commit -m "Launch STILL YOURS website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/still-yours.git
git push -u origin main
```

Then import that repository into Vercel.

## Project structure

```text
still-yours/
├── index.html
├── styles.css
├── app.js
├── vercel.json
├── package.json
├── README.md
├── .gitignore
├── api-contract.json
└── assets/
    ├── deck-image-1.png
    ├── deck-image-2.png
    ├── ...
    └── deck-image-6.png
```

## Important

The AI Style Match currently uses a **working mock-analysis flow**:
image upload → preview → analysis states → personalized recommendations.

It does not pretend that a real vision API is connected.

For production, connect `runAI()` / `showAIResult()` in `app.js` to a secure backend endpoint. Never put an AI provider secret key directly in browser JavaScript.

The QR Memory section is also a functional demonstration of the planned private-memory experience, not a claim that production QR infrastructure already exists.

## Vercel

This is intentionally a static frontend, so no special Vercel adapter is needed.

The included `vercel.json` provides basic security headers and clean URLs.
