export interface ContentOfDate {
	id: number;
	currentDay: boolean;
	beforeFirstIndex: boolean;
	afterLastIndex: boolean;
	isBooked: boolean;
	nrOfBookings: number;
	privateBooking: boolean;
}

export interface BookingDto {
	id: number;
	created_at: string;
	userid: string;
	from_date: string;
	to_date: string;
	type: number;
	comment: string;
}
