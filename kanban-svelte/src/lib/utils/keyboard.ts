export type KeyboardShortcut = {
	key: string;
	ctrlKey?: boolean;
	metaKey?: boolean;
	shiftKey?: boolean;
	altKey?: boolean;
	callback: () => void;
};

export function setupKeyboardShortcuts(shortcuts: KeyboardShortcut[]): () => void {
	const handleKeyDown = (event: KeyboardEvent) => {
		for (const shortcut of shortcuts) {
			const keyMatch = event.key === shortcut.key;
			const ctrlMatch = shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey;
			const metaMatch = shortcut.metaKey === undefined || event.metaKey === shortcut.metaKey;
			const shiftMatch = shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey;
			const altMatch = shortcut.altKey === undefined || event.altKey === shortcut.altKey;

			if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
				event.preventDefault();
				shortcut.callback();
				break;
			}
		}
	};

	document.addEventListener('keydown', handleKeyDown);

	return () => {
		document.removeEventListener('keydown', handleKeyDown);
	};
}
