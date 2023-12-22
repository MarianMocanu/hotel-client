export type BookingObject = {
  hotel_id: string;
  rooms: BookedRoom[];
  checkinDate: Date;
  checkoutDate: Date;
  guestsAmount: number;
  totalAmount?: number;
  services: string[];
  guest: Guest;
};

type BookedRoom = {
  room_id: string;
  guest: Partial<Guest>;
};

type Guest = {
  name: string;
  email: string;
  phone: string;
  user_id?: string;
  address?: string;
};

export const createBooking = async (booking: BookingObject) => {
  try {
    const response = await fetch('http://localhost:4200/bookings', {
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
