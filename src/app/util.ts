import { format } from 'date-fns';

export const formatDate = (date: Date | undefined): string => {
  if (date) {
    return format(date, 'dd MMM');
  }
  return 'Date';
};
