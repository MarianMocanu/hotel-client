type RoomsQuery = {
  hotelId: string;
  numberOfRooms: number;
  numberOfGuests: number;
  checkinDate: Date;
  checkoutDate: Date;
};

export const fetchAvailableRooms = async (data: RoomsQuery) => {
  try {
    const response = await fetch('http://api:4200/bookings/available-rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    throw error;
  }
};
