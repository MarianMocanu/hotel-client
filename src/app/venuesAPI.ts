type VenuesQuery = {
  hotel_id: string;
  guest_amount: number;
  date: Date;
  type: string;
  start_time?: string;
  end_time?: string;
};

export const fetchVenues = async (data: VenuesQuery) => {
  try {
    const response = await fetch('http://locahost:4200/event-booking/inquiry', {
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
