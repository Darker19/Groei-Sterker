# My Personal Site

Static website bootstrapped from a framework and customized with **your CSS/JS**.

## Edit content
- Text: edit the `.html` files (e.g., `index.html`).
- Styles: **`assets/css/custom.css`** (loaded after the framework).
- Scripts: **`assets/js/main.js`** (loaded before `</body>`).

## Local preview
- VS Code → install **Live Server** → right‑click `index.html` → *Open with Live Server*.

## Structure
```
assets/
  css/
    custom.css
  js/
    main.js
  (vendor/...)
*.html
```

## Git & GitHub
### GitHub Desktop (easiest)
1. Add local repository → select your site folder.
2. Commit → Publish to GitHub.

### Terminal
```bash
git init
git branch -M main
git add .
git commit -m "Initial commit: site with custom starter"
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

## GitHub Pages deploy
Settings → Pages → Source: *Deploy from a branch* → Branch: `main` • Folder: `/` → Save.
