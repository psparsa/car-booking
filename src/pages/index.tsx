import React from 'react';
import Head from 'next/head';
import { Roboto } from '@next/font/google';
import dayjs, { Dayjs } from 'dayjs';
import { cc } from '@/utils/combineClassNames';
import { DatePicker } from '@/components/DatePicker/DatePicker';
import isBetween from 'dayjs/plugin/isBetween';
import { NameForm } from '@/components/NameForm/NameForm';
import { addReservation } from '@/utils/reservation/add';
import { getReservations, Reservation } from '@/utils/reservation/get';
import { errorToast, successToast } from '@/utils/toast';
import { formatDuration } from '@/utils/formatDuration';
import { initialStates, reducer } from '@/utils/reducer';
import { useSfx } from '@/utils/useSfx';
import { isNil } from '@/utils/isNil';
dayjs.extend(isBetween);

const robotoFont = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export default function Home() {
  const { playSuccessSfx, playErrprSfx } = useSfx();
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
  const findCollision: IsThereACollision = () => {
    const start = startDate?.set('hour', startHour as number) as Dayjs;
    const end = endDate?.set('hour', endHour as number) as Dayjs;

    const changeHour = (d: Dayjs, action: 'increase' | 'decrease') => {
      const hour = d.get('hour');
      return d.set('hour', action === 'increase' ? hour + 1 : hour - 1);
    };

    const reservationWithCollasion = reservations.find((r) => {
      const doesStartHaveCollision =
        changeHour(start, 'increase').isBetween(dayjs(r.from), dayjs(r.to)) ||
        dayjs(r.from).isBetween(start, changeHour(end, 'decrease'));

      const doesEndHaveCollision =
        changeHour(end, 'decrease').isBetween(dayjs(r.from), dayjs(r.to)) ||
        dayjs(r.to).isBetween(changeHour(start, 'increase'), end);

      return doesStartHaveCollision || doesEndHaveCollision;
    });

    return isNil(reservationWithCollasion)
      ? {
          status: 'fine',
        }
      : {
          status: 'collision',
          withWho: reservationWithCollasion?.name,
        };
  };

  const handleSubmit = () => {
    const collision = findCollision();

    if (collision.status === 'collision') {
      errorToast({
        text: `There is a time collision with ${collision.withWho}`,
      });

      playErrprSfx();

      return;
    }

    const isADuplicateReservation =
      reservations.findIndex((r) => {
        const day = dayjs(r.from);
        return r.name === name && day.isSame(startDate, 'day');
      }) > -1;

    if (isADuplicateReservation) {
      setError(`You can't submit two reservation for a single day...`);
      playErrprSfx();
      return;
    }

    if (areDatesValid) {
      addReservation({
        name,
        from: startDate.set('hour', startHour).valueOf(),
        to: endDate.set('hour', endHour).valueOf(),
      });

      setReservations(getReservations());
      const { parsedFrom, parsedTo } = formatDuration(
        startDate.set('hour', startHour),
        endDate.set('hour', endHour)
      );

      playSuccessSfx();

      successToast({
        text: 'The car reserved for you!',
        hint: `From ${parsedFrom} until ${parsedTo}`,
      });

      resetStates();

      return;
    }
    alert('index:handleSubmit');
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
