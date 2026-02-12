# Kanban Mono (SvelteKit)

A minimalist, monochrome Kanban board built with SvelteKit, Svelte 5 runes, and Tailwind CSS v4. Features JSON import/export, local storage persistence, drag-and-drop, and offline functionality.

![Svelte 5](https://img.shields.io/badge/Svelte-5-FF3E00) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)

## Features

- **JSON Import & Export**: Upload and download your data as JSON files
- **Task Management**: Create, edit, delete tasks with title, description, priority, due date, and tags
- **Drag & Drop**: Reorder tasks within columns or move between columns
- **Archive Completed**: Archive all Done tasks with one click (downloads as JSON)
- **Tag System**: Click tags to highlight matching tasks across all columns
- **Modal Dialogs**: All confirmations use accessible modal dialogs
- **Local Storage**: All data persists in browser localStorage
- **Offline Ready**: Works completely offline with static build
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
- **svelte-dnd-action** - Drag and drop functionality
- **Playwright** - End-to-end testing (37 tests)

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

## JSON Format

Upload a JSON file with the following structure:

```json
{
  "cards": [
    {
      "id": "unique-id",
      "title": "Design homepage",
      "description": "Create mockups",
      "status": "In Progress",
      "priority": "High",
      "dueDate": "2026-02-15",
      "tags": ["design", "frontend"]
    }
  ]
}
```

- `title` (required): Task name
- `description`: Task details
- `status`: Column name (default: "To Do")
- `priority`: "Low", "Medium", "High", or empty
- `dueDate`: ISO date format (YYYY-MM-DD)
- `tags`: Array of tag strings

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

### Running Tests

```bash
# Run all E2E tests
npx playwright test

# Run tests with UI
npx playwright test --ui
```

### Project Structure

```
src/
├── lib/
│   ├── components/      # Svelte components
│   │   ├── ArchiveDialog.svelte
│   │   ├── Board.svelte
│   │   ├── Column.svelte
│   │   ├── DeleteDialog.svelte
│   │   ├── Footer.svelte
│   │   ├── Header.svelte
│   │   ├── ResetDialog.svelte
│   │   ├── TagChip.svelte
│   │   ├── TaskCard.svelte
│   │   └── TaskModal.svelte
│   ├── stores/          # Reactive state (Svelte 5 runes)
│   │   ├── board.svelte.ts
│   │   └── ui.svelte.ts
│   ├── services/        # Business logic (JSON, storage)
│   ├── types/           # TypeScript interfaces
│   └── utils/           # Helper functions
├── routes/              # File-based routing
├── app.html             # HTML shell
└── app.css              # Global styles + Tailwind

e2e/                     # Playwright E2E tests
├── archive.spec.ts
├── board.spec.ts
├── import-export.spec.ts
├── keyboard.spec.ts
├── tag-filtering.spec.ts
└── task-crud.spec.ts
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
