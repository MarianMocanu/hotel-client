export const fetchHotels = async () => {
  try {
    const response = await fetch('http://api:4200/hotels', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
