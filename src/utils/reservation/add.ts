import { getReservations, Reservation } from './get';

export const addReservation = (newReservation: Reservation) => {
  const prevReservations = getReservations();

  localStorage.setItem(
    'data',
    JSON.stringify([...prevReservations, newReservation])
  );
};
