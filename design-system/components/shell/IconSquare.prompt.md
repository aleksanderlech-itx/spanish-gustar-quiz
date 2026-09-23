Use `IconSquare` for icon-only header actions.

```jsx
<IconSquare icon="menu" label="Open menu" onClick={openDrawer} />
<IconSquare icon={dark ? "sun" : "moon"} label="Switch theme" onClick={toggle} />
<IconSquare icon="back" size={40} label="Back to topic" />
```

Sun and moon are the repo's own SVGs (`app/theme-icons.tsx`); menu is the three-bar hamburger.
