export const login = async (email: string, password: string) => {
  try {
    const response = await fetch('http://api:4200/auth/login', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
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
      const response = await fetch('http://api:4200/auth/profile', {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    const response = await fetch('http://api:4200/auth/signup', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      method: 'POST',
      body: JSON.stringify(user),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const editUser = async (id: string, editedUser: Partial<User>) => {
  try {
    const response = await fetch(`http://api:4200/auth/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      method: 'PUT',
      body: JSON.stringify(editedUser),
    });
    return response;
  } catch (error) {
    throw error;
  }
};
