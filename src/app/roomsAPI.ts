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
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    throw error;
  }
};
