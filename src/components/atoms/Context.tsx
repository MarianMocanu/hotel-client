import React, { createContext, useState, PropsWithChildren, Dispatch, SetStateAction } from 'react';

export type User = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dob?: string;
};

type State = {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  error: Error | null;
  setError: Dispatch<SetStateAction<Error | null>>;
};

type Error = {
  message: string;
  shouldRefresh: boolean;
};

export const Context = createContext({} as State);

export const ContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState({} as User);
  const [error, setError] = useState<Error | null>(null);

  return <Context.Provider value={{ user, setUser, error, setError }}>{children}</Context.Provider>;
};
