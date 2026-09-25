import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
let fragment = readFileSync(join(here, 'sample-source.html'), 'utf8');

const icons = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M5 5l14 14M19 5 5 19"/>',
  'arrow-right': '<path d="M5 12h14m-7-7 7 7-7 7"/>',
  landmark: '<path d="m3 10 9-7 9 7M4 10h16M5 10v9m5-9v9m4-9v9m5-9v9M3 21h18"/>',
  heart: '<path d="M20.8 8.6c0 4.1-5.1 8.4-8.8 11.2C8.3 17 3.2 12.7 3.2 8.6a5 5 0 0 1 8.8-3.2 5 5 0 0 1 8.8 3.2Z"/>',
  signpost: '<path d="M12 3v18M4 7h14l3 3-3 3H4l-3-3 3-3Zm16 9H6l-3 3 3 3h14l3-3-3-3Z"/>',
  'book-open': '<path d="M12 6c-3.2-2-6.3-2.3-10-1v14c3.7-1.3 6.8-1 10 1 3.2-2 6.3-2.3 10-1V5c-3.7-1.3-6.8-1-10 1Zm0 0v14"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  'circle-check': '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  'circle-alert': '<circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 4h.01"/>',
};

fragment = fragment.replace(
  /<i data-lucide="([^"]+)"([^>]*)><\/i>/g,
  (_, name, attributes) => {
    const paths = icons[name];
    if (!paths) throw new Error(`Unknown specimen icon: ${name}`);
    const className = attributes.match(/class="([^"]+)"/)?.[1];
    return `<svg aria-hidden="true"${className ? ` class="${className}"` : ''} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  },
);

fragment = fragment.replace(
  /\s*const settings=\{spacing:20\};\s*if\(globalThis\.Tweak\)\{[^\n]+\}\s*/,
  '\n',
);

if (fragment.includes('data-lucide=') || fragment.includes('globalThis.Tweak')) {
  throw new Error('Specimen contains an unconverted host dependency');
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Spanish Editorial Learning | Interactive reference</title>
<meta name="description" content="Five interactive reference views for the Spanish Editorial Learning design system.">
<style>
html,body{margin:0;min-height:100%;background:#fff}
body{padding:20px 16px 48px}
button:focus-visible,input:focus-visible,summary:focus-visible{outline:3px solid #0F766E;outline-offset:3px}
@media(max-width:380px){body{padding:12px 8px 32px}}
</style>
${fragment}
</head>
</html>
`;

writeFileSync(join(here, 'reference.html'), html, 'utf8');
