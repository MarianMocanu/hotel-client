export type APIBooking = {
  hotelId: string;
  rooms: APIBookedRoom[];
  checkinDate: Date;
  checkoutDate: Date;
  guestsAmount: number;
  guest: Guest;
};

export type APIBookedRoom = {
  roomId: string;
  packageId: string;
  addonsIds: string[] | undefined;
  guest: Partial<Guest>;
};

type Guest = {
  name: string;
  email: string;
  phone: string;
  userId?: string;
  address?: string;
};

export const createBooking = async (booking: APIBooking) => {
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
