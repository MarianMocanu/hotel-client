export type BookingObject = {
  hotel_id: string;
  room_id: string;
  checkinDate: Date;
  checkoutDate: Date;
  guestInfo: {
    name: string;
    email: string;
    phone: string;
    user_id?: string;
    address?: string;
  };
  guestsAmount: number;
  totalAmount?: number;
};

export const createBooking = async (booking: any) => {
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
