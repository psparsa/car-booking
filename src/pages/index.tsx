import React from 'react';
import Head from 'next/head';
import { Roboto } from '@next/font/google';
import { cc } from '@/utils/combineClassNames';
import { DatePicker } from '@/components/DatePicker/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { NameForm } from '@/components/NameForm/NameForm';
import { addReservation } from '@/reservation/add';
import { getReservations, Reservation } from '@/reservation/get';

const robotoFont = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export default function Home() {
  const [reservations, setReservations] = React.useState<Reservation[]>([]);

  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [startHour, setStartHour] = React.useState<number | null>(null);
  const [endHour, setEndHour] = React.useState<number | null>(null);

  const [error, setError] = React.useState<string | undefined>(undefined);

  const areDatesValid = !!startDate && !!endDate && !!startHour && !!endHour;

  const [name, setName] = React.useState('');

  const resetDateStates = () => {
    setStartDate(null);
    setEndDate(null);
    setStartHour(null);
    setEndHour(null);
    setError(undefined);
    setName('');
  };

  const handleSubmit = () => {
    const isADuplicateReserv =
      reservations.findIndex((r) => {
        const day = dayjs(r.from);
        return r.name === name && day.isSame(startDate, 'day');
      }) > -1;

    if (isADuplicateReserv) {
      setError(`You can't submit two reservation for a single day...`);
    } else if (areDatesValid) {
      addReservation({
        name,
        from: startDate.set('hour', startHour).valueOf(),
        to: endDate.set('hour', endHour).valueOf(),
      });
      resetDateStates();
      setReservations(getReservations());
    }
  };

  React.useEffect(() => setReservations(getReservations()), []);

  return (
    <>
      <Head>
        <title>Booking Car | Company X</title>
        <meta
          name="description"
          content="Reserve the company car with just a few clicks!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={cc([
          robotoFont.className,
          `w-screen min-h-screen flex flex-col items-center justify-center`,
        ])}
      >
        <DatePicker
          values={{
            startDate,
            endDate,
            startHour,
            endHour,
          }}
          onChange={{
            startDate: setStartDate,
            endDate: setEndDate,
            startHour: setStartHour,
            endHour: setEndHour,
          }}
          reservations={reservations}
          error={error}
        />

        <NameForm
          name={name}
          onChange={setName}
          onSubmit={handleSubmit}
          disable={!areDatesValid}
          className="mt-4"
        />
      </main>
    </>
  );
}
