import React, { createContext, useState, PropsWithChildren, Dispatch, SetStateAction } from 'react';

export type User = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dob?: string;
};

export type Hotel = {
  _id: string;
  name: string;
  town: string;
};

type RoomType =
  | 'single'
  | 'double'
  | 'twin'
  | 'double double'
  | 'double superior'
  | 'junior suite'
  | 'executive suite';

export type Room = {
  _id: string;
  name: string;
  description: string;
  type: RoomType;
  facilities: string[];
  price: number;
  maxGuests: number;
  booked_dates: string[];
};

export type Guest = {
  name: string;
  email: string;
  phone: string;
  numberOfGuests: number;
  guestsString: string;
};

export type Booking = {
  hotel: Hotel;
  room: Room;
  guest: Guest;
  checkin: Date;
  checkout: Date;
  price: number;
};

type State = {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  error: Error | null;
  setError: Dispatch<SetStateAction<Error | null>>;
  booking: Booking;
  setBooking: Dispatch<SetStateAction<Booking>>;
};

type Error = {
  message: string;
  shouldRefresh: boolean;
};

export const Context = createContext({} as State);

export const ContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState({} as User);
  const [error, setError] = useState<Error | null>(null);
  const [booking, setBooking] = useState({} as Booking);

  const contextValue = {
    user,
    setUser,
    error,
    setError,
    booking,
    setBooking,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
