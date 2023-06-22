import { format } from 'date-fns';

export const formatDateUK = (dateString) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return format(new Date(dateString), 'P', options);
};
