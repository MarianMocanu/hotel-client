export const login = async (email: string, password: string) => {
  try {
    const response = await fetch('http://localhost:4200/auth/login', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response;
  } catch (error) {
    console.error('Error fetching login', error);
  }
};
