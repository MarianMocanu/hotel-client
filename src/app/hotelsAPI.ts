export const fetchHotels = async () => {
  try {
    const response = await fetch('http://localhost:4200/hotels');
    return response;
  } catch (error) {
    throw error;
  }
};
