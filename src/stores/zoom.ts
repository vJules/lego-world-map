import { writable } from 'svelte/store';

function createZoom() {
    const { subscribe, set, update } = writable(10);

    return {
        subscribe,
        increment: () => update(n => n < 20 ? n + 1 : n),
        decrement: () => update(n => n > 5 ? n - 1 : n),
        reset: () => set(10)
    };
}

export const zoom = createZoom();