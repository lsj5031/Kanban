# Kanban Mono (SvelteKit)

A minimalist, monochrome Kanban board built with SvelteKit, Svelte 5 runes, and Tailwind CSS v4. Features CSV/JSON import/export, local storage persistence, and offline functionality.

![Kanban Mono](https://img.shields.io/badge/Svelte-5-FF3E00) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)

## Features

- **CSV/JSON Import & Export**: Upload your data via CSV or JSON files
- **Template Download**: Get started quickly with a sample CSV template
- **Task Management**: Create, edit, delete tasks with title, description, priority, due date, and tags
- **Tag System**: Click tags to highlight matching tasks across all columns
- **Local Storage**: All data persists in browser localStorage
- **Offline Ready**: Works completely offline with static build
- **Dark Mode**: Automatically adapts to system color preference
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + N`: Add new task
  - `Escape`: Close modals
  - `Tab`: Navigate between elements
  - `Space/Enter`: Toggle tag highlights
- **Responsive**: Works on desktop and mobile devices
- **Accessibility**: ARIA attributes, focus management, keyboard navigation

## Tech Stack

- **SvelteKit 2** - Web framework with file-based routing
- **Svelte 5** - UI framework with runes for reactivity
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS with custom theme
- **Vite 7** - Build tool and dev server
- **svelte-dnd-action** - Drag and drop (optional, can be added)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm/bun

### Installation

```bash
# Clone or navigate to the project
cd kanban-svelte

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
# Build static site
npm run build

# Preview production build
npm run preview
```

The build output will be in the `build/` directory, which can be deployed to any static hosting service (GitHub Pages, Netlify, Vercel, etc.).

## CSV Format

Upload a CSV file with the following headers:

```csv
title,description,status,priority,dueDate,tags
"Design homepage","Create mockups","In Progress","High","2026-02-15","design; frontend"
"Setup project","Initialize repo","Done","Medium","2026-02-01","setup"
```

- `title` (required): Task name
- `description`: Task details
- `status`: Column name (default: "To Do")
- `priority`: "Low", "Medium", "High", or empty
- `dueDate`: ISO date format (YYYY-MM-DD)
- `tags`: Semicolon-separated list

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | Add new task |
| `Escape` | Close modal/dialog |
| `Tab` | Navigate between elements |
| `Space` / `Enter` | Toggle tag highlight (when focused on tag) |

## Development

### Type Checking

```bash
npm run check
```

### Project Structure

```
src/
├── lib/
│   ├── components/      # Svelte components
│   ├── stores/          # Reactive state (Svelte 5 runes)
│   ├── services/        # Business logic (CSV, JSON, storage)
│   ├── types/           # TypeScript interfaces
│   └── utils/           # Helper functions
├── routes/              # File-based routing
├── app.html             # HTML shell
└── app.css              # Global styles + Tailwind
```

## Deployment

### Static Hosting

The project uses `@sveltejs/adapter-static` for static builds. Deploy the `build/` directory to:

- **GitHub Pages**: Push to `gh-pages` branch
- **Netlify**: Connect repository, set publish directory to `build`
- **Vercel**: Import project, set output directory to `build`
- **Any static host**: Upload `build/` directory contents

### Offline Usage

The built site works completely offline. Simply open `build/index.html` in a browser.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT

## Credits

Migrated from vanilla HTML/JS/CSS to modern SvelteKit architecture.
