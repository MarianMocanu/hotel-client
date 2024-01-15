export const fetchHotels = async () => {
  try {
    const response = await fetch('http://locahost:4200/hotels', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
