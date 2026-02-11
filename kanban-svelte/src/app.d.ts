// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type DndItem = import('svelte-dnd-action').Item;
	type DndEvent<ItemType = DndItem> = import('svelte-dnd-action').DndEvent<ItemType>;

	namespace svelteHTML {
		interface HTMLAttributes<T> {
			'on:consider'?: (event: CustomEvent<DndEvent> & { target: EventTarget & T }) => void;
			'on:finalize'?: (event: CustomEvent<DndEvent> & { target: EventTarget & T }) => void;
		}
	}
}

export {};
