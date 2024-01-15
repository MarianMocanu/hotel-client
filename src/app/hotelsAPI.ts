export const fetchHotels = async () => {
  try {
    const response = await fetch('http://api:4200/hotels');
    return response;
  } catch (error) {
    throw error;
  }
};
