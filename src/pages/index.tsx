import React from 'react';
import Head from 'next/head';
import { Roboto } from '@next/font/google';
import dayjs from 'dayjs';
import { cc } from '@/utils/combineClassNames';
import { DatePicker } from '@/components/DatePicker/DatePicker';
import isBetween from 'dayjs/plugin/isBetween';
import { NameForm } from '@/components/NameForm/NameForm';
import { addReservation } from '@/reservation/add';
import { getReservations, Reservation } from '@/reservation/get';
import { errorToast, successToast } from '@/utils/toast';
import { parseFromToDates } from '@/utils/parseFromToDates';
import { initialStates, reducer } from '@/utils/reducer';
dayjs.extend(isBetween);

const robotoFont = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export default function Home() {
  const [state, dispatch] = React.useReducer(reducer, initialStates);
  const { startDate, startHour, endDate, endHour, name } = state;

  const [reservations, setReservations] = React.useState<Reservation[]>([]);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const areDatesValid = !!startDate && !!endDate && !!startHour && !!endHour;

  const resetStates = () => {
    dispatch({ type: 'reset-states' });
    setError(undefined);
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

    return tmp === -1
      ? {
          status: 'fine',
        }
      : {
          status: 'collision',
          withWho: reservations[tmp].name,
        };
  };

  const handleSubmit = () => {
    const collision = isThereACollision();

    if (collision.status === 'collision') {
      errorToast({
        text: `There is a time collision with ${collision.withWho}`,
      });

      return;
    }

    const isADuplicateReservation =
      reservations.findIndex((r) => {
        const day = dayjs(r.from);
        return r.name === name && day.isSame(startDate, 'day');
      }) > -1;

    if (isADuplicateReservation) {
      setError(`You can't submit two reservation for a single day...`);
      return;
    }

    if (areDatesValid) {
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

      resetStates();

      return;
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
            startDate: (d) => dispatch({ type: 'set-startDate', payload: d }),
            endDate: (d) => dispatch({ type: 'set-endDate', payload: d }),
            startHour: (h) => dispatch({ type: 'set-startHour', payload: h }),
            endHour: (h) => dispatch({ type: 'set-endHour', payload: h }),
          }}
          reservations={reservations}
          error={error}
        />

        <NameForm
          name={name}
          onChange={(name) => dispatch({ type: 'set-name', payload: name })}
          onSubmit={handleSubmit}
          disable={!areDatesValid}
          className="mt-4"
        />
      </main>
    </>
  );
}
