interface ReservationProps {
  name: string;
  from: number;
  to: number;
}

export const addReservation = (newReservation: ReservationProps) => {
  const prevReservations = JSON.parse(localStorage.getItem('data') ?? '[]');

  localStorage.setItem(
    'data',
    JSON.stringify([...prevReservations, newReservation])
  );
};
