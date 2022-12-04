import { writable } from 'svelte/store';

interface Booking {
	startdate: Date;
	enddate: Date;
	type: number;
	user: number;
}

export const bookingStore = writable<Booking>({
	startdate: new Date(),
	enddate: new Date(),
	type: 0,
	user: 0
});
