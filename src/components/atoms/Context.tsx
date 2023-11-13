import React, { createContext, useState, PropsWithChildren, Dispatch, SetStateAction } from 'react';

export type User = {
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
};

type State = {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
};

export const Context = createContext({} as State);

export const ContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState({} as User);

  return <Context.Provider value={{ user, setUser }}>{children}</Context.Provider>;
};
