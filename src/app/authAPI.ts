export const login = async (email: string, password: string) => {
  try {
    const response = await fetch('http://localhost:4200/auth/login', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchProfile = async () => {
  if (localStorage.getItem('@token')) {
    try {
      const response = await fetch('http://localhost:4200/auth/profile', {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('@token')}`,
        },
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

type User = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  confirmPassword: string;
  dob?: string;
};

export const signup = async (user: User) => {
  try {
    const response = await fetch('http://localhost:4200/auth/signup', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(user),
    });
    return response;
  } catch (error) {
    throw error;
  }
};
