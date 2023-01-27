import React from 'react';
import Head from 'next/head';
import { Roboto } from '@next/font/google';
import { cc } from '@/utils/combineClassNames';
import { DatePicker } from '@/components/DatePicker/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { NameForm } from '@/components/NameForm/NameForm';
import { addReservation } from '@/reservation/add';
import { getReservations, Reservation } from '@/reservation/get';
import { errorToast, successToast } from '@/utils/toast';
import { parseFromToDates } from '@/utils/parseFromToDates';
dayjs.extend(isBetween);

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

  type IsThereACollision = () => {
    status: 'fine' | 'collision';
    withWho?: string;
  };

  const isThereACollision: IsThereACollision = () => {
    const tmp = reservations.findIndex((r) => {
      const isStartBetween = dayjs(
        startDate?.set('hour', startHour as number)
      ).isBetween(dayjs(r.from), dayjs(r.to), null, '[]');

      const isEndBetween = dayjs(endDate)
        ?.set('hour', endHour as number)
        .isBetween(dayjs(r.from), dayjs(r.to), null, '[]');

      return isStartBetween || isEndBetween;
    });

    if (tmp === -1)
      return {
        status: 'fine',
      };

    return {
      status: 'collision',
      withWho: reservations[tmp].name,
    };
  };

  const handleSubmit = () => {
    const collision = isThereACollision();

    const isADuplicateReservation =
      reservations.findIndex((r) => {
        const day = dayjs(r.from);
        return r.name === name && day.isSame(startDate, 'day');
      }) > -1;

    if (collision.status === 'collision') {
      errorToast({
        text: `There is a time collision with ${collision.withWho}`,
      });
    } else if (isADuplicateReservation) {
      setError(`You can't submit two reservation for a single day...`);
    } else if (areDatesValid) {
      addReservation({
        name,
        from: startDate.set('hour', startHour).valueOf(),
        to: endDate.set('hour', endHour).valueOf(),
      });
      setReservations(getReservations());
      const { parsedFrom, parsedTo } = parseFromToDates(
        startDate.set('hour', startHour),
        endDate.set('hour', endHour)
      );
      successToast({
        text: 'The car reserved for you!',
        hint: `From ${parsedFrom} until ${parsedTo}`,
      });
      resetDateStates();
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
          `w-screen min-h-screen flex flex-col items-center justify-center bg-neutral-200`,
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
