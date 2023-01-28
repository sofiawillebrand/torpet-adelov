import { writable } from 'svelte/store';

interface Booking {
	startdate: string;
	enddate: string;
	type: number;
	user: number;
}

export const bookingStore = writable<Booking>({
	startdate: new Date().toISOString().split('T')[0],
	enddate: new Date().toISOString().split('T')[0],
	type: 1,
	user: 0
});
