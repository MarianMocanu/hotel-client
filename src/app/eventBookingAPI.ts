export type EventBookingObject = {
  venue_id: string;
  date: Date;
  type: string;
  host_name: string;
  email: string;
  phone: string;
  guest_amount: number;
  start_time: string;
  end_time: string;
  corporation?: string;
  comments?: string;
};

export const createEventBooking = async (booking: EventBookingObject) => {
  try {
    const response = await fetch('http://localhost:4200/event-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    });
    return response;
  } catch (error) {
    throw error;
  }
};
