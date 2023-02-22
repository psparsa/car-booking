export type Reservation = {
  name: string;
  from: number;
  to: number;
};

export const getReservations = () =>
  JSON.parse(localStorage.getItem('data') ?? '[]') as Reservation[];
