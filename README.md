# Umami Exclude Myself

A Chrome extension that allows you to toggle Umami analytics tracking for yourself by managing the `umami.disabled` localStorage value.

## Development

1. Install dependencies:
```bash
pnpm install
```

2. Start development server:
```bash
pnpm run dev
```

3. Build the extension:
```bash
pnpm run build
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` directory

## Usage

Click the extension icon in your Chrome toolbar to toggle Umami analytics tracking for yourself. The button will show the current state (enabled/disabled) and allow you to toggle it.
