export const fetchVenues = async (data: {
    hotel_id: string;
    guests_amount: number;
    date: Date;
    type: string;
    start_time?: string;
    end_time?: string;
  }) => {
    try {
      const response = await fetch('http://localhost:4200/event-booking/inquiry', {
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
  