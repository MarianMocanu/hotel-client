import { format } from 'date-fns';

export const formatDate = (date: Date | undefined): string => {
  if (date) {
    return format(date, 'dd MMM');
  }
  return 'Date';
};

type Guests = {
  adults: number;
  kids: number;
  infants: number;
};
export const getGuestsString = (guests: Guests[] | undefined): string => {
  let result = '';
  if (guests && guests.length > 0) {
    const totalRooms = guests.length;
    if (totalRooms === 1) {
      result += totalRooms + ' Room, ';
    } else if (totalRooms > 1) {
      result += totalRooms + ' Rooms, ';
    }
    const totalGuests = guests.reduce((total, room) => total + room.adults, 0);
    if (totalGuests === 1) {
      result += totalGuests + ' Adult';
    } else if (totalGuests > 1) {
      result += totalGuests + ' Adults';
    }
  }
  if (result === '') {
    return 'Add guests';
  }
  return result;
};
