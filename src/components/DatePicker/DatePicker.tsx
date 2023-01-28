import React from 'react';
import { DatePicker as AntDatePicker, Select, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { range } from '@/utils/range';
import { isNil } from '@/utils/isNil';
import { Reservation } from '@/reservation/get';
import { formatDuration } from '@/utils/formatDuration';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

type SetDate = (date: Dayjs | null) => void;
type SetHour = (hour: number) => void;
interface DatePickerProps {
  values: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    startHour: number | null;
    endHour: number | null;
  };
  onChange: {
    startDate: SetDate;
    endDate: SetDate;
    startHour: SetHour;
    endHour: SetHour;
  };
  reservations: Reservation[];
  error?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  values,
  onChange,
  reservations,
  error,
}) => {
  const { startDate, endDate, startHour, endHour } = values;
  const [reservationsOfSelectedDay, setReservationsOfSelectedDay] =
    React.useState<string[]>([]);

  const handleDateRender = (current: Dayjs) => {
    const countOfReservations = reservations.filter((val) => {
      const from = dayjs(val.from);
      const isSame = current.isSame(from, 'day');
      return isSame;
    }).length;

    const style: React.CSSProperties = {
      boxShadow: `0 0 0.5rem rgba(0, 128, 0, ${countOfReservations / 10})`,
      background: `rgba(0, 128, 0, ${countOfReservations / 10})`,
    };

    const dayNode = (
      <div className="ant-picker-cell-inner" style={style}>
        {current.date()}
      </div>
    );

    return countOfReservations > 0 ? (
      <Tooltip placement="top" title={`Reservations: ${countOfReservations}`}>
        {dayNode}
      </Tooltip>
    ) : (
      dayNode
    );
  };

  const handleDisabledDays = (current: Dayjs, end = false) => {
    const isPast = current && current < dayjs().startOf('day');
    const isSaturday = current.day() === 6;
    const isSunday = current.day() === 0;

    const isUnvalidEndDate = () => {
      if (!end || current === null || startDate === null) return false;

      const isMonday = current.day() === 1;
      const isStartDayFriday = startDate.day() === 5;

      const isBeforeStartPoint = current.isBefore(startDate);
      const isTheNextDayOfStartPoint =
        current.diff(startDate, 'days') >
        (isMonday && isStartDayFriday ? 3 : 1);
      return isTheNextDayOfStartPoint || isBeforeStartPoint;
    };

    return isPast || isSaturday || isSunday || isUnvalidEndDate();
  };

  const getHoursOptions = (end = false) => {
    if (end && startDate && startHour)
      return startDate.isSame(endDate, 'day')
        ? range(startHour + 1, 17)
        : range(9, 11);

    return range(9, 17);
  };

  const removeUnvailableHours = (l: number[], filterStartHours = true) => {
    if (startDate && filterStartHours) {
      const x = l.filter((hour) => {
        const currentDate = startDate.set('hour', hour);
        const lastHour = dayjs(
          currentDate.set('hour', currentDate.get('hour') - 1)
        );
        const nextHour = dayjs(
          currentDate.set('hour', currentDate.get('hour') + 1)
        );

        const findCollisionWithCurrentDate = reservations.find((x) => {
          if (dayjs(currentDate).isBetween(x.from, x.to)) {
            if (!nextHour.isBetween(x.from, x.to)) false;
            return true;
          }
          if (
            lastHour.isBetween(x.from, x.to) ||
            nextHour.isBetween(x.from, x.to)
          )
            return true;

          return false;
        });

        return isNil(findCollisionWithCurrentDate);
      });

      return x;
    }

    return l;
  };

  const formatHoursOptions = (list: number[]) =>
    list.map((x) => ({ value: x, label: x }));

  const getListOfReservations = (date: Dayjs | null) => {
    if (isNil(date)) return [];

    const formattedReservations = reservations
      .filter((x) => {
        return date?.isSame(dayjs(x.from), 'day');
      })
      .map((x) => {
        const { parsedFrom, parsedTo } = formatDuration(
          dayjs(x.from),
          dayjs(x.to)
        );

        return `${x.name} - ${parsedFrom} → ${parsedTo}`;
      });
    return formattedReservations;
  };

  const startHoursOption = formatHoursOptions(
    removeUnvailableHours(getHoursOptions())
  );
  const endHoursOption = formatHoursOptions(
    removeUnvailableHours(getHoursOptions(true), false)
  );

  const noAvilableTimeHint = (
    <p className="mb-1 mt-3 text-center  text-red-600">
      There is no available time! Choose another day
    </p>
  );

  const TITLES_CLASSNAMES = 'mb-2 mt-4';
  const FIELDS_CLASSNAMES = 'w-3/4';
  return (
    <div className="flex flex-col items-center w-80 bg-gray-100 p-4 rounded-lg shadow-lg">
      {startHoursOption.length === 0 ? (
        noAvilableTimeHint
      ) : (
        <p className={TITLES_CLASSNAMES}>When you wanna take out the car?</p>
      )}
      <AntDatePicker
        value={startDate}
        disabledDate={(current) => handleDisabledDays(current)}
        onChange={(x) => {
          setReservationsOfSelectedDay(getListOfReservations(x));
          onChange.startDate(x);
        }}
        className={FIELDS_CLASSNAMES}
        dateRender={handleDateRender}
      />
      {!isNil(startDate) && reservationsOfSelectedDay.length > 0 && (
        <ul className="mt-2">
          {reservationsOfSelectedDay.map((item) => (
            <li className="text-xs my-1" key={item}>
              {item}
            </li>
          ))}
        </ul>
      )}

      <p className={TITLES_CLASSNAMES}>At what time?</p>
      <Select
        value={startHour}
        disabled={isNil(startDate) || startHoursOption.length === 0}
        onChange={(v) => onChange.startHour(v)}
        options={startHoursOption}
        className={FIELDS_CLASSNAMES}
      />

      {endHoursOption.length === 0 ? (
        noAvilableTimeHint
      ) : (
        <p className={TITLES_CLASSNAMES}>When will you return the car?</p>
      )}
      <AntDatePicker
        disabled={isNil(startDate) || isNil(startHour)}
        value={endDate}
        disabledDate={(current) => handleDisabledDays(current, true)}
        onChange={(x) => onChange.endDate(x)}
        className={FIELDS_CLASSNAMES}
      />

      <p className={TITLES_CLASSNAMES}>At what time?</p>
      <Select
        value={endHour}
        disabled={
          isNil(startDate) ||
          isNil(startHour) ||
          isNil(endDate) ||
          endHoursOption.length === 0
        }
        onChange={(v) => onChange.endHour(v)}
        options={endHoursOption}
        className={FIELDS_CLASSNAMES}
      />

      {!isNil(error) && (
        <p className="mt-2 text-center text-red-700">{error}</p>
      )}
    </div>
  );
};
