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

export type Service = {
  _id: string;
  title: string;
  price: number;
  type: string;
};

export type Booking = {
  hotel: Hotel;
  room: Room;
  guest: Guest;
  checkin: Date;
  checkout: Date;
  price: number;
  package: Service | null;
  addons: Service[];
};

export type EventVenue = {
  _id: string;
  hotel_id: string;
  name: string;
  meetingPerks: string[];
  partyPerks: string[];
  meetingDesc: string;
  partyDesc: string;
}

export type EventBooking = {
  hotel_name: string;
  hotel_id: string;
  venue_id: string;
  date: Date;
  start_time: string;
  end_time: string;
  type: string;
  host_name: string;
  email: string;
  phone: string;
  guest_amount: number;
  corporation: string;
  comments: string;
  venue_data: EventVenue;
}

type State = {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  error: Error | null;
  setError: Dispatch<SetStateAction<Error | null>>;
  booking: Booking;
  setBooking: Dispatch<SetStateAction<Booking>>;
  eventBooking: EventBooking;
  setEventBooking: Dispatch<SetStateAction<EventBooking>>;
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
  const [eventBooking, setEventBooking] = useState({} as EventBooking);

  const contextValue = {
    user,
    setUser,
    error,
    setError,
    booking,
    setBooking,
    eventBooking,
    setEventBooking
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
