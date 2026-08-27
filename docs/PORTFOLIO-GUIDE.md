# Portfolio Learning Guide

This portfolio is a **static website**. It uses HTML for structure and CSS for appearance, layout, responsiveness, and animation. There is no build tool, framework, or JavaScript required to view it.

## 1. Project Structure

```text
portfolio/
├── index.html              # GitHub Pages redirect to the homepage
├── css/
│   └── style.css           # Shared styles for every page
├── html/
│   ├── aboutme.html        # About page
│   ├── pulse-health.html   # Pulse Health case study
│   ├── void-fm.html        # Void FM case study
│   ├── orbit-finance.html  # Orbit Finance case study
│   └── signal-studio.html  # Signal Studio case study
├── images/
│   └── images.png          # Favicon
└── docs/
    └── PORTFOLIO-GUIDE.md  # This guide
```

The homepage is `html/portfolio.html`. The root `index.html` entry file redirects visitors there so GitHub Pages can load the site automatically.

## 2. How the Pages Connect

The homepage loads CSS and the favicon with root-relative paths:

```html
<link rel="icon" href="./images/images.png" type="image/png">
<link rel="stylesheet" href="./css/style.css">
```

Pages inside `html/` must go up one folder to find shared files:

```html
<link rel="stylesheet" href="../css/style.css">
```

The homepage links down into the `html/` folder:

```html
<a href="./html/aboutme.html">More about me</a>
```

A case-study page links back up to the homepage:

```html
<a href="./portfolio.html#work">Back to selected work</a>
```

`./` means the current folder. `../` means the parent folder. Relative paths are one of the most important concepts in this project.

## 3. Homepage HTML

Open [portfolio.html](../html/portfolio.html) and identify these sections:

- `header`: the brand, navigation, and availability status.
- `.hero`: the main introduction and terminal-style visual.
- `.marquee`: the moving skills strip.
- `#work`: the project grid.
- `#about`: the short introduction and statistics.
- `#contact`: the email and social links.
- `footer`: copyright and navigation back to the top.

The `id` attributes create jump links. For example, `href="#work"` scrolls to the element with `id="work"`.

Classes such as `.project`, `.button`, `.eyebrow`, and `.wrapper` are reusable styling hooks. The same classes appear across multiple pages so the design stays consistent.

## 4. Case Study Pages

Every case-study page uses the same basic pattern:

```html
<body class="case-page">
    <header class="site-header">...</header>
    <main class="wrapper case-main">
        <p class="eyebrow">case study</p>
        <h1>Project title</h1>
        <p class="case-intro">Short description</p>
        <div class="case-hero">Visual content</div>
        <div class="case-details">Role, year, and tools</div>
        <div class="case-copy">Project explanation</div>
    </main>
</body>
```

The shared `.case-page` and `.case-*` styles in `css/style.css` control all case studies. Each page adds a visual class such as `.visual-pulse`, `.visual-void`, `.visual-orbit`, or `.visual-signal` to create a different visual identity without needing separate stylesheets.

## 5. How the CSS Works

Open [style.css](../css/style.css) and study it in this order.

### Design variables

The `:root` block stores the main colors:

```css
:root {
  --ink: #0a0c0c;
  --paper: #e7e9de;
  --muted: #929891;
  --green: #b7ff4a;
}
```

A variable can be reused with `var(--green)`. Change one variable to update many parts of the site.

### Global rules

The `*` rule applies `box-sizing: border-box` to every element. The `body` rule sets the page background, text color, font, and horizontal overflow behavior.

### Layout

The site mainly uses:

- `flex`: headers, buttons, contact links, and statistics.
- `grid`: the project cards and two-column content areas.
- `position: absolute`: decorative elements placed inside visual panels.
- `max-width` and `width: min(...)`: readable content widths.

For example, the project grid uses two columns on larger screens:

```css
.work-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
}
```

### Responsive design

The `@media (max-width: 700px)` rules change the layout for phones. They hide desktop navigation, stack columns, reduce spacing, and make the project cards full width.

To practice responsive design, resize the browser and watch how `.work-grid`, `.about-content`, `.case-details`, and `.site-header` change.

### Animation

Animations are defined with `@keyframes` and activated with the `animation` property.

Example:

```css
@keyframes blink {
  50% {
    opacity: 0;
  }
}

.cursor {
  animation: blink 1s step-end infinite;
}
```

The portfolio uses animations for the cursor, moving marquee, project entrance, terminal card, orbit, pulse ring, signal bars, and page transitions. Temporarily remove an `animation` declaration to see exactly what it controls.

## 6. A Good Way to Learn This Project

1. Change the text in the hero section and refresh the page.
2. Change `--green` in `:root` and observe every affected element.
3. Change `.work-grid` from two columns to `grid-template-columns: 1fr`.
4. Change one project visual's background color.
5. Add a new paragraph to `aboutme.html` and style it with an existing class.
6. Create a new case-study page by copying an existing page and changing its content and visual class.
7. Add a new media query rule and test it with a narrow browser window.

Use browser developer tools to inspect an element, see which CSS rule controls it, and temporarily edit the rule.

## 7. Run It Locally

Because this is a static site, you can open `portfolio.html` directly in a browser. A local server is better because it behaves more like GitHub Pages.

If Python is installed, run this from the project folder:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Stop the server with `Ctrl+C`.

## 8. GitHub Pages

This repository is published from the `main` branch. GitHub Pages starts at the root `index.html`, which redirects to `html/portfolio.html`.

```text
https://deex3deex.github.io/portfolio/
```

When you make changes:

```powershell
git status
git add .
git commit -m "Describe the change"
git push origin main
```

After pushing, GitHub Pages may take a short time to rebuild. If the homepage shows a 404, check that the root `index.html` entry file exists and that you are using the `/portfolio/` URL.

## 9. Important HTML Concepts Used

- `<!DOCTYPE html>` tells the browser to use modern HTML behavior.
- `lang="en"` helps accessibility tools identify the page language.
- `meta viewport` makes the layout scale correctly on mobile devices.
- Semantic elements such as `header`, `main`, `section`, and `footer` describe the page structure.
- `aria-label` gives additional context to screen readers.
- `target="_blank"` opens an external link in a new tab.
- `rel="noopener noreferrer"` improves security for links opened in a new tab.

## 10. What to Improve Next

Good next learning projects would be:

- Add a mobile menu for the hidden navigation.
- Add a contact form with a backend service.
- Add `prefers-reduced-motion` rules for users who disable animation.
- Add real project images with descriptive `alt` text.
- Clean up repeated CSS rules as a practice refactor.
- Add JavaScript for interactive filters or a working audio player.
