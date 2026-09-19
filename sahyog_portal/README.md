# SahyogPortal component

Drop-in React version of the original static page. Visual output is unchanged;
what changed is how it's built.

## Files
- `SahyogPortal.jsx` — the component, split into small subcomponents
  (`TopHeader`, `BrandHeader`, `VisionMissionColumn`, `LoginCard`, `AboutColumn`).
- `SahyogPortal.module.css` — CSS Module. Class names are hashed by your
  bundler at build time, so they can never collide with other components'
  classes elsewhere in your app.

## Why these changes (non-conflicting / non-breaking)
- **No global `*` reset, no bare `body` selector.** The original stylesheet
  reset every element on the page and styled `<body>` directly — safe as a
  standalone HTML file, but it would silently override your app's own resets
  and body styles once mounted inside a larger React tree. All rules are now
  scoped under a single `.wrapper` class.
- **CSS Modules instead of plain class names.** `.login-form`, `.submit-btn`,
  etc. are common names likely to already exist elsewhere in a larger app.
  CSS Modules rewrites them to unique hashes automatically, so nothing here
  can be shadowed by (or shadow) unrelated styles.
- **Colors/spacing pulled into CSS custom properties** (`--spr-navy`, etc.)
  scoped to `.wrapper`, so they're easy to tweak or theme without hunting
  through the file, and can't leak into the rest of the app.

## Why these changes (maintainable / scalable)
- **Content extracted into a `CONTENT` object and an `assets` prop** instead
  of hardcoded strings/paths in JSX — copy changes, localization, or a future
  CMS integration touch data, not markup.
- **Broken into subcomponents** so each region (header, login form, about
  column) can be edited, tested, or reused independently.
- **Login form uses real React state** (`useState`) instead of relying on
  the DOM/`querySelector`, and exposes `onLogin` / `onRefreshCaptcha` /
  `captchaText` props so you can wire it up to a real auth/captcha service
  without touching the component internals.

## Usage

```jsx
import SahyogPortal from "./SahyogPortal";
// import logo3 from "./assets/3.png"; // etc., if you bundle images

function App() {
  return (
    <SahyogPortal
      // Optional: override any default image path (defaults to "1.png", "2.png", ... in the public root, matching the original)
      // assets={{ logo3, logo4, logo6, logo2, loginBanner, shield }}
      captchaText="p56CZG"
      onRefreshCaptcha={() => {/* fetch a new captcha */}}
      onLogin={({ userId, password, captchaInput }) => {/* call your auth API */}}
    />
  );
}
```

## One setup step
The original page loaded Google Fonts via `<link>` tags in `<head>`. Since a
component can't inject into `<head>`, the fonts are now pulled in via
`@import` at the top of `SahyogPortal.module.css`. If your project already
manages fonts centrally (e.g. in `index.html` or a global stylesheet), feel
free to remove that `@import` line and load the fonts your usual way instead.

## Image paths
`1.png`–`6.png` are referenced exactly as in the original (relative paths),
now via the `assets` prop with those same filenames as defaults. Place them
in your `public` folder to match the original behavior, or pass imported
module paths through `assets` if you'd rather bundle them.
