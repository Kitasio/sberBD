import { writable } from 'svelte/store';

export const openModal = writable(false)
export const imgPath = writable('')
export const updatedShipsCount = writable(0)