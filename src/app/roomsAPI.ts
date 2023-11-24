export const fetchAvailableRooms = async (data: {
  hotelId: string;
  guestsAmount: number;
  checkinDate: Date;
  checkoutDate: Date;
}) => {
  try {
    const response = await fetch('http://localhost:4200/bookings/available-rooms', {
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
