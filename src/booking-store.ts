import { writable } from 'svelte/store';

interface Booking {
	startdate: string;
	enddate: string;
	type: number;
	user: number;
	comment: string;
}

export const bookingStore = writable<Booking>({
	startdate: new Date().toISOString().split('T')[0],
	enddate: new Date().toISOString().split('T')[0],
	type: 0,
	user: 0,
	comment: ''
});
