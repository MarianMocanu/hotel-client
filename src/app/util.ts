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
export const getGuestsString = (guests: Guests | undefined): string => {
  let result = '';
  if (guests && guests.adults > 0) {
    if (guests.adults === 1) {
      result += guests.adults + ' Adult';
    } else {
      result += guests.adults + ' Adults';
    }
  }
  if (guests && guests.kids > 0) {
    if (guests.kids === 1) {
      result += ', ' + guests.kids + ' Kid';
    } else {
      result += ', ' + guests.kids + ' Kids';
    }
  }
  if (guests && guests.infants > 0) {
    if (guests.infants === 1) {
      result += ', ' + guests.infants + ' Infant';
    } else {
      result += ', ' + guests.infants + ' Infants';
    }
  }
  if (result === '') {
    return 'Add guests';
  }
  return result;
};
